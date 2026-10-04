const Challenge = require('../models/Challenge');
const ChallengeAttempt = require('../models/ChallengeAttempt');
const PersonalBest = require('../models/PersonalBest');
const TrainingAssignment = require('../models/TrainingAssignment');
const TrainingModule = require('../models/TrainingModule');
const WarehouseLocation = require('../models/WarehouseLocation');
const Panorama = require('../models/Panorama');
const { managerProgrammes, managerProgramme, traineeProgramme, requireId } = require('../services/safetySimulationAccess');
const { maybeUpdatePersonalBest, leaderboardEntries } = require('../services/challengeScoreService');
const { writeAuditLog } = require('../utils/auditLogger');
const { simulationTemplates, simulationSamples, simulationProgrammeLevel } = require('../../../shared/simulationTemplates.mjs');
const { addSafetySimulationSamples } = require('../services/safetySimulationSamples');
const { inheritedTemplateModule, misplacedWarehouseMission } = require('../services/repairModuleSimulationContent');
const { MissionError, validateSimulation, createMissionState, applyInteraction, moveMission, finishMission, missionProgress, publicMission } = require('../../../shared/simulationEngine.mjs');
const safe = handler => async (req, res) => {
  try { res.set('Cache-Control', 'no-store'); await handler(req, res); }
  catch (error) {
    if (error.name === 'VersionError' || error.code === 11000) return res.status(409).json({ code: 'RECORD_CHANGED', message: 'The record changed. Reload and try again.' });
    const status = error.status || (['ValidationError', 'CastError'].includes(error.name) ? 400 : 500);
    if (status === 500) console.error('Safety simulation:', error.message);
    res.status(status).json({ code: error.code || 'SIMULATION_ERROR', message: status === 500 ? 'Unable to process the safety mission.' : error.message });
  }
};
const text = (value, label, max, required = false) => { if (typeof value !== 'string' || value.trim().length > max || (required && value.trim().length < 3)) throw new MissionError(`${label} is required or too long.`); return value.trim(); };
const numeric = (value, fallback, min, max, label) => { const n = value ?? fallback; if (typeof n !== 'number' || !Number.isInteger(n) || n < min || n > max) throw new MissionError(`${label} must be an integer from ${min} to ${max}.`); return n; };
async function payload(user, input, existing = null) {
  const programmeId = input.programmeId || String(existing?.programme || '');
  const programme = await managerProgramme(user, programmeId, { creating: true });
  const body = { ...(existing?.toObject?.() || {}), ...input };
  if (body.moduleKey && body.moduleKey !== programme.programmeType) throw new MissionError('The training module and programme must match.', 'MODULE_PROGRAMME_MISMATCH');
  const templateModule = inheritedTemplateModule(body);
  if (misplacedWarehouseMission(body, programme.programmeType) || (templateModule && templateModule !== programme.programmeType)) throw new MissionError('Load the sample for the selected training module before saving this mission.', 'MISSION_CONTENT_MISMATCH');
  if (!['draft', 'active', 'inactive'].includes(body.status || 'draft')) throw new MissionError('Invalid mission status.');
  const difficulty = body.difficulty || simulationProgrammeLevel(programme.level);
  if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) throw new MissionError('Invalid difficulty.');
  const thumbnail = text(body.thumbnail || '', 'Thumbnail', 1000);
  if (thumbnail && !/^\/(?!\/)[^\s\\]*$/.test(thumbnail) && !/^https:\/\/[^\s]+$/i.test(thumbnail)) throw new MissionError('Thumbnail must use a local path or HTTPS URL.');
  return {
    type: 'safety_simulation', programme: programme._id, moduleKey: programme.programmeType,
    title: text(body.title, 'Title', 150, true), description: text(body.description || '', 'Description', 3000), instructions: text(body.instructions || '', 'Instructions', 3000),
    difficulty, category: text(body.category || 'Safety Simulation Mission', 'Category', 100), thumbnail,
    estimatedDurationSeconds: numeric(body.estimatedDurationSeconds, 300, 15, 3600, 'Estimated duration'),
    timeLimitSeconds: numeric(body.timeLimitSeconds, 300, 15, 3600, 'Time limit'), basePoints: 1,
    incorrectPenalty: numeric(body.incorrectPenalty, 40, 0, 1000, 'Unsafe action penalty'), hintPenalty: 0,
    completionBonus: numeric(body.completionBonus, 150, 0, 5000, 'Completion bonus'), maxTimeBonus: numeric(body.maxTimeBonus, 100, 0, 5000, 'Time bonus'),
    maxScore: numeric(body.maxScore, 1200, 1, 20000, 'Maximum score'), tieRule: 'faster-time',
    simulation: validateSimulation(body.simulation), status: body.status || 'draft', updatedBy: user.id,
  };
}
async function gameFor(req, { manager = false } = {}) {
  requireId(req.params.id);
  const game = await Challenge.findOne({ _id: req.params.id, type: 'safety_simulation' });
  if (!game) throw new MissionError('Safety mission not found.', 'NOT_FOUND', 404);
  if (manager) await managerProgramme(req.user, game.programme);
  else {
    if (game.status !== 'active' || game.archivedAt) throw new MissionError('Active safety mission not found.', 'NOT_FOUND', 404);
    const access = await traineeProgramme(req.user, game.programme);
    if (misplacedWarehouseMission(game, access.programme.programmeType)) throw new MissionError('Active safety mission not found.', 'NOT_FOUND', 404);
  }
  return game;
}
const rulesFor = game => ({ timeLimitSeconds: game.timeLimitSeconds, incorrectPenalty: game.incorrectPenalty, completionBonus: game.completionBonus, maxTimeBonus: game.maxTimeBonus, maxScore: game.maxScore });
async function resolvedGame(game) {
  const row = game.toObject ? game.toObject() : JSON.parse(JSON.stringify(game));
  const [warehouse, panorama] = await Promise.all([
    WarehouseLocation.find({ active: true, locationId: { $in: row.simulation.environment.locations.map(room => room.warehouseLocationId).filter(Boolean) } }).lean(),
    Panorama.findOne({ programme: row.programme, type: 'training_module', status: 'active' }).lean(),
  ]);
  for (const room of row.simulation.environment.locations) {
    const source = warehouse.find(location => location.locationId === room.warehouseLocationId);
    if (source) room.panorama = source.panorama;
    else if (room.id === row.simulation.environment.startingLocationId && panorama?.imageUrl && !room.warehouseLocationId) room.panorama = panorama.imageUrl;
  }
  return row;
}
function publicAttempt(attempt) {
  const row = attempt.toObject ? attempt.toObject() : { ...attempt };
  delete row.simulationSnapshot; delete row.answers; return row;
}
function lifecycle(game, next, at = new Date()) {
  if (next !== game.status && next === 'active') game.activatedAt = at;
  if (next !== game.status && next === 'inactive') game.deactivatedAt = at;
  game.status = next;
}
const audit = (req, action, game) => writeAuditLog({ req, user: req.user, action, status: 'success', details: { challengeId: String(game._id), programmeId: String(game.programme), moduleKey: game.moduleKey, status: game.status, changedBy: req.user.id } });
exports.options = safe(async (req, res) => {
  const programmes = await managerProgrammes(req.user);
  const keys = [...new Set(programmes.map(row => row.programmeType))];
  const modules = await TrainingModule.find(req.user.role === 'admin' ? {} : { key: { $in: keys } }).lean();
  const locations = await WarehouseLocation.find({ active: true }).select('locationId name panorama connectedLocations').sort({ order: 1 }).lean();
  res.json({ programmes, modules, locations, templates: Object.fromEntries(Object.entries(simulationTemplates).filter(([key]) => req.user.role === 'admin' || keys.includes(key))), samples: simulationSamples.filter(sample => req.user.role === 'admin' || keys.includes(sample.moduleKey)) });
});
exports.addSamples = safe(async (req, res) => {
  const result = await addSafetySimulationSamples(req.user);
  if (result.created.length) await writeAuditLog({ req, user: req.user, action: 'SAFETY_SIMULATION_SAMPLES_ADDED', status: 'success', details: { challengeIds: result.created.map(row => row.id), count: result.created.length } });
  res.status(result.created.length ? 201 : 200).json(result);
});
exports.list = safe(async (req, res) => {
  const query = { type: 'safety_simulation', archivedAt: null };
  if (req.query.programmeId) requireId(req.query.programmeId);
  if (req.user.role === 'trainee') {
    const assigned = await TrainingAssignment.find({ trainee: req.user.id, status: 'active' }).select('programme').lean();
    query.programme = { $in: assigned.map(row => row.programme) }; query.status = 'active';
  } else query.programme = { $in: (await managerProgrammes(req.user)).map(row => row._id) };
  if (req.query.programmeId) {
    if (req.user.role === 'trainee') await traineeProgramme(req.user, req.query.programmeId);
    else await managerProgramme(req.user, req.query.programmeId);
    query.programme = req.query.programmeId;
  }
  const games = await Challenge.find(query).sort({ updatedAt: -1 }).lean();
  if (req.user.role !== 'trainee') return res.json({ games });
  const visible = [];
  for (const game of games) {
    try {
      const access = await traineeProgramme(req.user, game.programme);
      if (misplacedWarehouseMission(game, access.programme.programmeType)) continue;
      const best = await PersonalBest.findOne({ trainee: req.user.id, challenge: game._id }).lean();
      visible.push({ ...publicMission(game), locked: access.locked, personalBest: best ? { score: best.score, durationSeconds: best.durationSeconds, achievedAt: best.achievedAt } : null });
    } catch (error) { if (![403, 404].includes(error.status)) throw error; }
  }
  res.json({ games: visible });
});
exports.get = safe(async (req, res) => {
  const manager = req.user.role !== 'trainee'; const game = await gameFor(req, { manager });
  const resolved = await resolvedGame(game);
  const access = manager ? null : await traineeProgramme(req.user, game.programme);
  res.json({ game: manager ? resolved : { ...publicMission(resolved), locked: access.locked } });
});
exports.create = safe(async (req, res) => {
  const data = await payload(req.user, req.body);
  const game = await Challenge.create({ ...data, createdBy: req.user.id, ...(data.status === 'active' ? { activatedAt: new Date() } : {}) });
  await audit(req, 'SAFETY_SIMULATION_CREATED', game); res.status(201).json({ game });
});
exports.update = safe(async (req, res) => {
  const game = await gameFor(req, { manager: true });
  if (game.archivedAt) throw new MissionError('Archived missions cannot be edited.', 'MISSION_ARCHIVED', 409);
  const data = await payload(req.user, req.body, game);
  if (String(data.programme) !== String(game.programme) && await ChallengeAttempt.exists({ challenge: game._id })) throw new MissionError('A mission with attempts cannot move to another programme. Duplicate it instead.', 'HAS_ATTEMPTS', 409);
  const next = data.status; delete data.status; Object.assign(game, data); lifecycle(game, next);
  await game.save(); await audit(req, 'SAFETY_SIMULATION_UPDATED', game); res.json({ game });
});
exports.status = safe(async (req, res) => {
  const game = await gameFor(req, { manager: true });
  if (!['draft', 'active', 'inactive'].includes(req.body.status) || game.archivedAt) throw new MissionError('Invalid status or archived mission.');
  if (req.body.status === 'active') {
    const programme = await managerProgramme(req.user, game.programme, { creating: true });
    if (misplacedWarehouseMission(game, programme.programmeType)) throw new MissionError('Load the sample for this training module before activating the mission.', 'MISSION_CONTENT_MISMATCH');
    validateSimulation(game.simulation);
  }
  lifecycle(game, req.body.status); game.updatedBy = req.user.id; await game.save(); await audit(req, 'SAFETY_SIMULATION_STATUS_CHANGED', game); res.json({ game });
});
exports.duplicate = safe(async (req, res) => {
  const source = await gameFor(req, { manager: true });
  const data = await payload(req.user, { ...source.toObject(), programmeId: req.body.programmeId || String(source.programme), title: `${source.title.slice(0,135)} (copy)`, status: 'draft' });
  const game = await Challenge.create({ ...data, createdBy: req.user.id });
  await audit(req, 'SAFETY_SIMULATION_DUPLICATED', game); res.status(201).json({ game });
});
exports.archive = safe(async (req, res) => {
  const game = await gameFor(req, { manager: true }); lifecycle(game, 'inactive'); game.archivedAt = new Date(); game.updatedBy = req.user.id;
  await game.save(); await audit(req, 'SAFETY_SIMULATION_ARCHIVED', game); res.json({ message: 'Mission archived. Historical attempts remain available.', game });
});
exports.preview = safe(async (req, res) => {
  const data = await payload(req.user, { ...req.body, status: 'draft' });
  res.json({ game: await resolvedGame(data), preview: true });
});
async function persistState(attempt, game, state, at) {
  const finished = state.result !== 'in-progress';
  const update = { simulationState: state, score: state.score, errors: state.mistakes, feedback: state.feedback, accuracy: state.result === 'completed' ? 1 : missionProgress(game.simulation, state), hazardEvents: state.hazards, solvedHazards: state.hazards.filter(row => row.resolvedAt).map(row => row.id),
    ...(finished ? { result: state.result, validityStatus: 'valid', finishedAt: new Date(at), durationSeconds: Math.max(0, Math.floor((new Date(at) - attempt.startedAt) / 1000)) } : {}) };
  const saved = await ChallengeAttempt.findOneAndUpdate({ _id: attempt._id, __v: attempt.__v, result: 'in-progress' }, { $set: update, $inc: { __v: 1 } }, { returnDocument: 'after' });
  if (!saved) throw new MissionError('The attempt changed. Reload the mission.', 'ATTEMPT_CHANGED', 409);
  const best = state.result === 'completed' ? await maybeUpdatePersonalBest(saved, game) : { updated: false };
  return { attempt: publicAttempt(saved), game: publicMission(game, state), personalBestUpdated: best.updated, serverNow: at };
}
async function activeAttempt(req, { allowFinished = false } = {}) {
  const game = await gameFor(req); requireId(req.params.attemptId);
  await traineeProgramme(req.user, game.programme, { requirePass: true });
  const attempt = await ChallengeAttempt.findOne({ _id: req.params.attemptId, trainee: req.user.id, challenge: game._id, type: 'safety_simulation' });
  if (!attempt) throw new MissionError('This attempt does not belong to you.', 'ATTEMPT_NOT_FOUND', 404);
  const snapshot = { ...attempt.simulationSnapshot, _id: game._id, programme: game.programme };
  const at = new Date().toISOString();
  if (attempt.result !== 'in-progress') {
    if (!allowFinished) throw new MissionError('This attempt has ended.', 'ATTEMPT_FINISHED', 409);
    return { game: snapshot, attempt, at, ended: true };
  }
  const elapsed = Math.max(0, Math.floor((new Date(at) - attempt.startedAt) / 1000));
  if (elapsed >= snapshot.timeLimitSeconds) {
    const timed = finishMission(snapshot.simulation, attempt.simulationState, rulesFor(snapshot), at, elapsed, 'timeout');
    return { game: snapshot, attempt, at, ended: true, response: await persistState(attempt, snapshot, timed, at) };
  }
  return { game: snapshot, attempt, at, elapsed };
}
exports.start = safe(async (req, res) => {
  const live = await gameFor(req); await traineeProgramme(req.user, live.programme, { requirePass: true });
  const current = await ChallengeAttempt.findOne({ trainee: req.user.id, challenge: live._id, type: 'safety_simulation', result: 'in-progress' }).sort({ startedAt: -1 });
  if (current) {
    const snapshot = { ...current.simulationSnapshot, _id: live._id, programme: live.programme }; const at = new Date().toISOString();
    const elapsed = Math.max(0, Math.floor((new Date(at) - current.startedAt) / 1000));
    if (elapsed < snapshot.timeLimitSeconds && req.body.restart !== true) return res.json({ attempt: publicAttempt(current), game: publicMission(snapshot, current.simulationState), serverNow: at, resumed: true });
    await persistState(current, snapshot, finishMission(snapshot.simulation, current.simulationState, rulesFor(snapshot), at, elapsed, elapsed >= snapshot.timeLimitSeconds ? 'timeout' : 'abandoned'), at);
  }
  const snapshot = await resolvedGame(live); const at = new Date().toISOString();
  const attempt = await ChallengeAttempt.create({ trainee: req.user.id, programme: live.programme, challenge: live._id, type: 'safety_simulation', startedAt: new Date(at), simulationSnapshot: snapshot, simulationState: createMissionState(snapshot.simulation, at), attemptNumber: 1 + await ChallengeAttempt.countDocuments({ trainee: req.user.id, challenge: live._id }) });
  res.status(201).json({ attempt: publicAttempt(attempt), game: publicMission(snapshot, attempt.simulationState), serverNow: at, resumed: false });
});
exports.attempt = safe(async (req, res) => {
  const ctx = await activeAttempt(req, { allowFinished: true });
  if (ctx.ended && !ctx.response && ctx.attempt.result === 'completed') await maybeUpdatePersonalBest(ctx.attempt, ctx.game);
  res.json(ctx.response || { attempt: publicAttempt(ctx.attempt), game: publicMission(ctx.game, ctx.attempt.simulationState), serverNow: ctx.at });
});
exports.action = safe(async (req, res) => {
  const ctx = await activeAttempt(req);
  if (ctx.ended) return res.json(ctx.response);
  const state = req.body.kind === 'move' ? moveMission(ctx.game.simulation, ctx.attempt.simulationState, req.body.locationId, ctx.at) : applyInteraction(ctx.game.simulation, ctx.attempt.simulationState, req.body.actionId, rulesFor(ctx.game), ctx.at);
  res.json(await persistState(ctx.attempt, ctx.game, state, ctx.at));
});
exports.complete = safe(async (req, res) => {
  const ctx = await activeAttempt(req); if (ctx.ended) return res.json(ctx.response);
  res.json(await persistState(ctx.attempt, ctx.game, finishMission(ctx.game.simulation, ctx.attempt.simulationState, rulesFor(ctx.game), ctx.at, ctx.elapsed), ctx.at));
});
exports.leaderboard = safe(async (req, res) => {
  const manager = req.user.role !== 'trainee'; const game = await gameFor(req, { manager });
  res.json({ entries: await leaderboardEntries(game._id, game.programme) });
});
exports.results = safe(async (req, res) => {
  const programmes = await managerProgrammes(req.user);
  const query = { type: 'safety_simulation', programme: { $in: programmes.map(row => row._id) } };
  if (req.query.gameId) { requireId(req.query.gameId); const game = await Challenge.findOne({ _id: req.query.gameId, type: 'safety_simulation' }); if (!game) throw new MissionError('Mission not found.', 'NOT_FOUND', 404); await managerProgramme(req.user, game.programme); query.challenge = game._id; }
  const [attempts, bests] = await Promise.all([
    ChallengeAttempt.find(query).select('-simulationSnapshot').populate('trainee', 'firstName lastName username').populate('programme', 'title programmeType level').populate('challenge', 'title difficulty moduleKey status createdAt updatedAt activatedAt deactivatedAt archivedAt').sort({ startedAt: -1 }).limit(500).lean(),
    PersonalBest.find(query).select('challenge trainee score durationSeconds achievedAt').populate('trainee', 'firstName lastName').lean(),
  ]);
  const finished = attempts.filter(row => row.result !== 'in-progress'); const successes = finished.filter(row => row.result === 'completed'); const mistakes = {};
  for (const attempt of finished) for (const action of attempt.simulationState?.actions || []) if (!action.safe) mistakes[action.label || action.actionId] = (mistakes[action.label || action.actionId] || 0) + 1;
  const average = (rows, field) => rows.length ? Math.round(rows.reduce((sum, row) => sum + Number(row[field] || 0), 0) / rows.length) : 0;
  res.json({ attempts, personalBests: bests, summary: { attempts: attempts.length, completed: successes.length, completionRate: finished.length ? Math.round(successes.length / finished.length * 100) : 0, failureRate: finished.length ? Math.round((finished.length - successes.length) / finished.length * 100) : 0, averageScore: average(finished, 'score'), bestScore: Math.max(0, ...finished.map(row => row.score)), averageCompletionSeconds: average(successes, 'durationSeconds'), commonMistakes: mistakes, recordLimit: 500 } });
});

const AssessmentAttempt = require('../src/models/AssessmentAttempt');
const request = require('supertest');
const app = require('../app');
const User = require('../src/models/User');
const TrainingModule = require('../src/models/TrainingModule');
const TrainingProgramme = require('../src/models/TrainingProgramme');
const TrainingAssignment = require('../src/models/TrainingAssignment');
const TrainingProgress = require('../src/models/TrainingProgress');
const Challenge = require('../src/models/Challenge');
const ChallengeAttempt = require('../src/models/ChallengeAttempt');
const PersonalBest = require('../src/models/PersonalBest');
const AuditLog = require('../src/models/AuditLog');
const { generateAccessToken } = require('../src/utils/generateTokens');
const { simulationTemplate, simulationSamples } = require('../../shared/simulationTemplates.mjs');
const { validateSimulation } = require('../../shared/simulationEngine.mjs');
const header = user => ({ Authorization: `Bearer ${generateAccessToken(user)}` });
const keys = ['manual-handling', 'working-at-height', 'cyber-awareness'];
async function user(name, role, assignedTrainingSections = []) {
  return User.create({ username: name, firstName: name, lastName: 'Test', email: `${name}@example.invalid`, passwordHash: 'not-a-login-fixture', role, status: 'active', accountStatus: 'created', mustChangePassword: false, assignedTrainingSections, ...(role === 'admin' ? {} : { age: 25, phoneNumber: '9800000000', address: 'Kathmandu', gender: 'female' }) });
}
async function fixture() {
  const admin = await user('simadmin', 'admin'), trainer = await user('simtrainer', 'trainer', keys.slice(0, 2)), cyberTrainer = await user('simcyber', 'trainer', [keys[2]]), otherTrainer = await user('simother', 'trainer', keys);
  const trainee = await user('simtrainee', 'trainee', keys), other = await user('simtrainee2', 'trainee', keys), outsider = await user('simoutsider', 'trainee');
  const programmes = {};
  for (const key of keys) {
    await TrainingModule.create({ name: key.replace(/-/g, ' '), key, code: key.slice(0, 5), description: 'Simulation testing module description.', createdBy: admin._id });
    const programme = await TrainingProgramme.create({ programmeType: key, title: `${key} Beginner`, shortDescription: 'Simulation training programme.', description: 'Simulation training programme for access and scoring verification.', learningObjectives: 'Complete the appropriate mission safely.', owner: key === keys[2] ? cyberTrainer._id : trainer._id, level: 'beginner', passMark: 70, createdBy: admin._id });
    programmes[key] = programme;
    for (const player of [trainee, other]) {
      const assignment = await TrainingAssignment.create({ trainee: player._id, programme: programme._id, assignedBy: admin._id });
      await TrainingProgress.create({ trainee: player._id, programme: programme._id, assignment: assignment._id, learningCompleted: true, scenarioCompleted: true, basicPassed: true, currentStage: 'intermediate', progress: 65 });
      await AssessmentAttempt.create({ trainee: player._id, programme: programme._id, assignment: assignment._id, level: 'basic', status: 'submitted', score: 1, totalPoints: 1, percentage: 100, passed: true, attemptNumber: 1, submittedAt: new Date() });
    }
  }
  return { admin, trainer, cyberTrainer, otherTrainer, trainee, other, outsider, programmes };
}
const bodyFor = (f, key = keys[0], status = 'active') => ({ ...simulationTemplate(key), programmeId: String(f.programmes[key]._id), status });
async function create(f, key = keys[0], creator = f.admin, status = 'active') {
  const response = await request(app).post('/api/safety-simulations').set(header(creator)).send(bodyFor(f, key, status));
  expect(response.status).toBe(201); return response.body.game;
}
async function start(f, game, player = f.trainee, body = {}) {
  return request(app).post(`/api/safety-simulations/${game._id}/attempts/start`).set(header(player)).send(body);
}
async function interact(f, game, attemptId, body, player = f.trainee) {
  return request(app).post(`/api/safety-simulations/${game._id}/attempts/${attemptId}/action`).set(header(player)).send(body);
}
const sequences = {
  'manual-handling': ['assess-load', 'inspect-route', 'clear-obstacle', 'dry-floor', 'inspect-trolley', 'load-trolley', '@route', 'check-traffic', '@destination', 'place-load'],
  'working-at-height': ['inspect-route', 'clear-route', 'inspect-ladder', 'isolate-ladder', 'inspect-platform', 'barrier', 'secure-tools', '@platform', 'maintenance', '@access', 'check-out'],
  'cyber-awareness': ['inspect-email', 'quarantine-email', 'inspect-attachment', 'isolate-usb', 'lock-workstation', '@response', 'verify-request', 'report-incident'],
};
async function play(f, game, started = null) {
  const begun = started || await start(f, game); expect([200, 201]).toContain(begun.status);
  const id = begun.body.attempt._id;
  for (const step of sequences[game.moduleKey]) {
    const response = await interact(f, game, id, step.startsWith('@') ? { kind: 'move', locationId: step.slice(1) } : { actionId: step });
    expect(response.status).toBe(200);
  }
  return request(app).post(`/api/safety-simulations/${game._id}/attempts/${id}/complete`).set(header(f.trainee)).send({ score: 999999, startedAt: '1990-01-01', completedAt: '1990-01-01', durationSeconds: 0 });
}

describe('Configurable Safety Simulation Missions', () => {
  test('authentication and role checks apply to all management operations', async () => {
    const f = await fixture();
    expect((await request(app).post('/api/safety-simulations').send(bodyFor(f))).status).toBe(401);
    expect((await request(app).post('/api/safety-simulations').set(header(f.trainee)).send(bodyFor(f))).status).toBe(403);
    expect((await request(app).get('/api/safety-simulations/options').set(header(f.trainee))).status).toBe(403);
  });
  test.each(keys)('Admin creates and edits %s without requiring a Puzzle record', async key => {
    const f = await fixture(), game = await create(f, key);
    expect(game.type).toBe('safety_simulation'); expect(game.puzzle).toBeUndefined(); expect(game.createdAt).toBeTruthy(); expect(game.updatedAt).toBeTruthy(); expect(game.activatedAt).toBeTruthy();
    const edited = await request(app).put(`/api/safety-simulations/${game._id}`).set(header(f.admin)).send({ title: 'Updated mission' });
    expect(edited.status).toBe(200); expect(edited.body.game.title).toBe('Updated mission'); expect(new Date(edited.body.game.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(game.updatedAt).getTime());
    expect(await AuditLog.countDocuments({ action: 'SAFETY_SIMULATION_UPDATED' })).toBe(1);
  });
  test('multiple simulation challenges coexist and legacy puzzle uniqueness is retained', async () => {
    const f = await fixture(); await create(f); await create(f, keys[1]); await create(f, keys[2]);
    expect(await Challenge.countDocuments({ type: 'safety_simulation' })).toBe(3);
    const indexes = await Challenge.collection.indexes(); expect(indexes.find(index => index.name === 'puzzle_1').partialFilterExpression).toEqual({ puzzle: { $type: 'objectId' } });
  });
  test('Trainer only sees assigned AND owned/explicitly authorised programme options', async () => {
    const f = await fixture(); await create(f); await create(f, keys[2]);
    const result = await request(app).get('/api/safety-simulations/options').set(header(f.trainer));
    expect(result.body.modules.map(m => m.key).sort()).toEqual(keys.slice(0, 2).sort());
    expect(result.body.templates['cyber-awareness']).toBeUndefined();
    expect((await request(app).get('/api/safety-simulations').set(header(f.trainer))).body.games).toHaveLength(1);
    expect((await request(app).get('/api/safety-simulations').set(header(f.otherTrainer))).body.games).toHaveLength(0);
  });
  test('Trainer creation uses live assignments, cannot spoof module or creator, and respects ownership', async () => {
    const f = await fixture(), game = await create(f, keys[0], f.trainer);
    expect(String(game.createdBy)).toBe(String(f.trainer._id));
    expect((await request(app).post('/api/safety-simulations').set(header(f.trainer)).send({ ...bodyFor(f, keys[2]), moduleKey: keys[0], createdBy: String(f.admin._id) })).status).toBe(403);
    expect((await request(app).put(`/api/safety-simulations/${game._id}`).set(header(f.otherTrainer)).send({ title: 'Restricted' })).status).toBe(403);
    await User.findByIdAndUpdate(f.trainer._id, { assignedTrainingSections: [] });
    expect((await request(app).put(`/api/safety-simulations/${game._id}`).set(header(f.trainer)).send({ title: 'Revoked access' })).status).toBe(403);
  });
  test('programme-authorised Trainer can edit content, but global archive stays Admin-only', async () => {
    const f = await fixture(), game = await create(f);
    await TrainingProgramme.findByIdAndUpdate(f.programmes[keys[0]]._id, { $addToSet: { authorizedTrainers: f.otherTrainer._id } });
    expect((await request(app).put(`/api/safety-simulations/${game._id}`).set(header(f.otherTrainer)).send({ title: 'Shared mission' })).status).toBe(200);
    expect((await request(app).delete(`/api/safety-simulations/${game._id}`).set(header(f.trainer))).status).toBe(403);
  });
  test('draft preview validates current unsaved configuration without saving any records', async () => {
    const f = await fixture(); const body = { ...bodyFor(f), title: 'Unsaved draft preview' };
    const result = await request(app).post('/api/safety-simulations/preview').set(header(f.trainer)).send(body);
    expect(result.status).toBe(200); expect(result.body.preview).toBe(true); expect(result.body.game.title).toBe(body.title);
    expect(await Challenge.countDocuments()).toBe(0); expect(await ChallengeAttempt.countDocuments()).toBe(0); expect(await PersonalBest.countDocuments()).toBe(0);
  });
  test('draft/inactive missions are inaccessible and only assigned trainees see active missions', async () => {
    const f = await fixture(), game = await create(f, keys[0], f.admin, 'draft');
    expect((await start(f, game)).status).toBe(404);
    expect((await request(app).get('/api/safety-simulations').set(header(f.trainee))).body.games).toHaveLength(0);
    await request(app).patch(`/api/safety-simulations/${game._id}/status`).set(header(f.admin)).send({ status: 'active', activatedAt: '1990-01-01' });
    expect((await start(f, game, f.outsider)).status).toBe(403);
    const listed = await request(app).get('/api/safety-simulations').set(header(f.trainee)); expect(listed.body.games).toHaveLength(1);
    expect(listed.body.games[0].simulation).toBeUndefined(); expect(listed.body.games[0].actions[0].points).toBeUndefined(); expect(listed.body.games[0].actions[0].requiredActionIds).toBeUndefined();
    const inactive = await request(app).patch(`/api/safety-simulations/${game._id}/status`).set(header(f.admin)).send({ status: 'inactive' });
    expect(inactive.body.game.activatedAt).toBeTruthy(); expect(inactive.body.game.deactivatedAt).toBeTruthy(); expect((await start(f, game)).status).toBe(404);
  });
  test('existing assessment gate applies before starting a mission', async () => {
    const f = await fixture(), game = await create(f);
    await AssessmentAttempt.deleteMany({ trainee: f.trainee._id, programme: game.programme });
    await TrainingProgress.updateOne({ trainee: f.trainee._id, programme: game.programme }, { basicPassed: false });
    const response = await start(f, game); expect(response.status).toBe(403); expect(response.body.code).toBe('ASSESSMENT_NOT_PASSED');
  });
  test('starting and resuming use server timestamps and hide the frozen solution configuration', async () => {
    const f = await fixture(), game = await create(f); const begun = await start(f, game, f.trainee, { startedAt: '1990-01-01', score: 99999 });
    expect(begun.status).toBe(201); expect(new Date(begun.body.attempt.startedAt).getFullYear()).toBeGreaterThan(2020); expect(begun.body.attempt.score).toBe(0); expect(begun.body.attempt.simulationSnapshot).toBeUndefined();
    const resumed = await start(f, game); expect(resumed.status).toBe(200); expect(resumed.body.attempt._id).toBe(begun.body.attempt._id); expect(resumed.body.resumed).toBe(true);
  });
  test('attempt ownership, location, prerequisites, objective completion and replay checks are enforced', async () => {
    const f = await fixture(), game = await create(f), begun = await start(f, game), id = begun.body.attempt._id;
    expect((await interact(f, game, id, { actionId: 'assess-load' }, f.other)).status).toBe(404);
    expect((await interact(f, game, id, { actionId: 'place-load' })).status).toBe(409);
    expect((await interact(f, game, id, { actionId: 'load-trolley' })).status).toBe(409);
    expect((await interact(f, game, id, { kind: 'move', locationId: 'route' })).status).toBe(409);
    expect((await request(app).post(`/api/safety-simulations/${game._id}/attempts/${id}/complete`).set(header(f.trainee)).send({ score: 999999 })).status).toBe(409);
    const action = await interact(f, game, id, { actionId: 'assess-load', score: 999999, at: '1990-01-01' });
    expect(action.body.attempt.score).toBe(70); expect(action.body.attempt.simulationState.actions[0].at).not.toBe('1990-01-01');
    expect((await interact(f, game, id, { actionId: 'assess-load' })).status).toBe(409);
  });
  test('unsafe interactions apply configured action and hazard penalties; critical failures stop play', async () => {
    const f = await fixture(), game = await create(f), begun = await start(f, game), id = begun.body.attempt._id;
    await interact(f, game, id, { actionId: 'assess-load' }); await interact(f, game, id, { actionId: 'inspect-route' });
    const unsafe = await interact(f, game, id, { actionId: 'lift-alone' });
    expect(unsafe.body.attempt.score).toBe(60); expect(unsafe.body.attempt.errors).toBe(1); expect(unsafe.body.attempt.simulationState.hazards[0].triggeredAt).toBeTruthy();
    const height = await create(f, keys[1]), h = await start(f, height), failed = await interact(f, height, h.body.attempt._id, { actionId: 'use-ladder' });
    expect(failed.body.attempt.result).toBe('failed'); expect(failed.body.attempt.finishedAt).toBeTruthy(); expect(await PersonalBest.countDocuments()).toBe(0);
    expect((await interact(f, height, h.body.attempt._id, { actionId: 'inspect-ladder' })).status).toBe(409);
  });
  test('a penalty at zero still reduces later earnings and the final mission score', async () => {
    const f = await fixture(), game = await create(f), begun = await start(f, game);
    const unsafe = await interact(f, game, begun.body.attempt._id, { actionId: 'lift-alone' });
    expect(unsafe.body.attempt.score).toBe(0);
    const result = await play(f, game, begun);
    expect(result.status).toBe(200); expect(result.body.attempt.result).toBe('completed');
    // A perfect run can earn 810 here. The configured 80-point unsafe/hazard
    // penalty must remain even though the trainee initially had zero points.
    expect(result.body.attempt.score).toBeGreaterThan(0);
    expect(result.body.attempt.score).toBeLessThanOrEqual(730);
  });
  test.each(keys)('%s is playable using the same engine and stores objectives, actions, timestamps and personal best', async key => {
    const f = await fixture(), game = await create(f, key), result = await play(f, game);
    expect(result.status).toBe(200); expect(result.body.attempt.result).toBe('completed'); expect(result.body.attempt.score).toBeGreaterThan(0); expect(result.body.attempt.score).toBeLessThanOrEqual(game.maxScore); expect(result.body.attempt.score).not.toBe(999999);
    const attempt = await ChallengeAttempt.findById(result.body.attempt._id).lean();
    expect(attempt.finishedAt).toBeTruthy(); expect(attempt.durationSeconds).toBe(Math.floor((attempt.finishedAt - attempt.startedAt) / 1000)); expect(attempt.simulationState.completedObjectives).toHaveLength(5); expect(attempt.simulationState.objectiveEvents.every(event => event.startedAt && event.completedAt)).toBe(true);
    const best = await PersonalBest.findOne({ challenge: game._id }); expect(best.achievedAt.toISOString()).toBe(attempt.finishedAt.toISOString()); expect(best.type).toBe('safety_simulation');
    const board = await request(app).get(`/api/safety-simulations/${game._id}/leaderboard`).set(header(f.other)); expect(board.body.entries).toEqual([{ rank: 1, score: attempt.score }]);
    expect((await request(app).post(`/api/safety-simulations/${game._id}/attempts/${attempt._id}/complete`).set(header(f.trainee)).send({})).status).toBe(409);
  });
  test('expired attempts persist server duration and cannot accept further actions', async () => {
    const f = await fixture(), game = await create(f), begun = await start(f, game);
    await ChallengeAttempt.findByIdAndUpdate(begun.body.attempt._id, { startedAt: new Date(Date.now() - (game.timeLimitSeconds + 5) * 1000) });
    const response = await interact(f, game, begun.body.attempt._id, { actionId: 'assess-load', durationSeconds: 1 });
    expect(response.body.attempt.result).toBe('timeout'); expect(response.body.attempt.durationSeconds).toBeGreaterThanOrEqual(game.timeLimitSeconds); expect(response.body.attempt.finishedAt).toBeTruthy(); expect(await PersonalBest.countDocuments()).toBe(0);
  });
  test('S4-S04 a fully answered timeout with earned points cannot become a personal best', async () => {
    const f = await fixture(), game = await create(f), begun = await start(f, game), id = begun.body.attempt._id;
    for (const step of sequences[game.moduleKey]) {
      const response = await interact(f, game, id, step.startsWith('@') ? { kind: 'move', locationId: step.slice(1) } : { actionId: step });
      expect(response.status).toBe(200);
    }
    await ChallengeAttempt.findByIdAndUpdate(id, { startedAt: new Date(Date.now() - (game.timeLimitSeconds + 5) * 1000) });
    const response = await request(app).post(`/api/safety-simulations/${game._id}/attempts/${id}/complete`).set(header(f.trainee)).send({});
    expect(response.body.attempt.result).toBe('timeout'); expect(response.body.attempt.accuracy).toBe(1); expect(response.body.attempt.score).toBeGreaterThan(0);
    const { maybeUpdatePersonalBest } = require('../src/services/challengeScoreService');
    const update = await maybeUpdatePersonalBest(await ChallengeAttempt.findById(id), game);
    expect(update.updated).toBe(false); expect(await PersonalBest.countDocuments()).toBe(0);
    expect((await request(app).get(`/api/safety-simulations/${game._id}/leaderboard`).set(header(f.trainee))).body.entries).toHaveLength(0);
  });
  test('attempt configuration is frozen and restart preserves the previous attempt', async () => {
    const f = await fixture(), game = await create(f), begun = await start(f, game);
    await Challenge.updateOne({ _id: game._id }, { 'simulation.actions.0.points': 9999, timeLimitSeconds: 15 });
    const response = await interact(f, game, begun.body.attempt._id, { actionId: 'assess-load' }); expect(response.body.attempt.score).toBe(70); expect(response.body.game.timeLimitSeconds).toBe(420);
    const restarted = await start(f, game, f.trainee, { restart: true }); expect(restarted.body.attempt._id).not.toBe(begun.body.attempt._id); expect(restarted.body.attempt.attemptNumber).toBe(2);
    const previous = await ChallengeAttempt.findById(begun.body.attempt._id); expect(previous.result).toBe('abandoned'); expect(previous.finishedAt).toBeTruthy();
  });
  test('concurrent duplicate interactions cannot award duplicate points', async () => {
    const f = await fixture(), game = await create(f), begun = await start(f, game);
    const results = await Promise.all([interact(f, game, begun.body.attempt._id, { actionId: 'assess-load' }), interact(f, game, begun.body.attempt._id, { actionId: 'assess-load' })]);
    expect(results.map(r => r.status).sort()).toEqual([200, 409]);
    const attempt = await ChallengeAttempt.findById(begun.body.attempt._id); expect(attempt.score).toBe(70); expect(attempt.simulationState.actions).toHaveLength(1);
  });
  test('reports and archived history retain dates and stay inside trainer scope', async () => {
    const f = await fixture(), game = await create(f), result = await play(f, game);
    const archived = await request(app).delete(`/api/safety-simulations/${game._id}`).set(header(f.admin)); expect(archived.status).toBe(200); expect(archived.body.game.archivedAt).toBeTruthy();
    const history = await request(app).get('/api/safety-simulations/results').set(header(f.trainer)); expect(history.body.attempts).toHaveLength(1); expect(history.body.attempts[0].finishedAt).toBe(result.body.attempt.finishedAt); expect(history.body.personalBests[0].achievedAt).toBeTruthy(); expect(history.body.summary.completionRate).toBe(100);
    expect((await request(app).get('/api/safety-simulations/results').set(header(f.cyberTrainer))).body.attempts).toHaveLength(0);
    expect((await request(app).get(`/api/safety-simulations/results?gameId=${game._id}`).set(header(f.cyberTrainer))).status).toBe(403);
    expect(await ChallengeAttempt.countDocuments()).toBe(1); expect(await PersonalBest.countDocuments()).toBe(1);
  });
  test('bad configuration references, cycles, unsafe rewards and untrusted lifecycle metadata are rejected', async () => {
    const f = await fixture(); const body = bodyFor(f);
    body.simulation.actions[0].objectId = 'missing-object'; expect((await request(app).post('/api/safety-simulations').set(header(f.admin)).send(body)).status).toBe(400);
    const cyclic = simulationTemplate(keys[0]).simulation; cyclic.actions[0].requiredActionIds = ['inspect-trolley']; expect(() => validateSimulation(cyclic)).toThrow(/cycle/);
    const reward = simulationTemplate(keys[0]).simulation; reward.actions.find(action => action.unsafe).points = 99; expect(() => validateSimulation(reward)).toThrow(/cannot award/);
    const valid = await request(app).post('/api/safety-simulations').set(header(f.admin)).send({ ...bodyFor(f), createdAt: '1990-01-01', activatedAt: '1990-01-01', createdBy: String(f.trainer._id) }); expect(valid.status).toBe(201); expect(valid.body.game.createdBy).toBe(String(f.admin._id)); expect(new Date(valid.body.game.createdAt).getFullYear()).toBeGreaterThan(2020);
  });
});

describe('Ready-made safety mission data', () => {
  const importSamples = actor => request(app).post('/api/safety-simulations/samples').set(header(actor)).send({ status: 'active', createdBy: 'spoofed' });
  test('adds six drafts, records the actor and audit, and preserves edited missions on repeat imports', async () => {
    const f = await fixture();
    const added = await importSamples(f.admin);
    expect(added.status).toBe(201); expect(added.body.created).toHaveLength(6); expect(added.body.skipped).toHaveLength(0);
    const first = await Challenge.findById(added.body.created[0].id);
    expect(first.status).toBe('draft'); expect(String(first.createdBy)).toBe(String(f.admin._id)); expect(first.activatedAt).toBeNull();
    first.title = 'My edited sample'; first.status = 'inactive'; await first.save();
    const again = await importSamples(f.admin);
    expect(again.status).toBe(200); expect(again.body.created).toHaveLength(0); expect(again.body.existing).toHaveLength(6);
    const retained = await Challenge.findById(first._id); expect(retained.title).toBe('My edited sample'); expect(retained.status).toBe('inactive');
    expect(await Challenge.countDocuments()).toBe(6); expect(await AuditLog.countDocuments({ action: 'SAFETY_SIMULATION_SAMPLES_ADDED' })).toBe(1);
  });
  test('recognises previously seeded examples without overwriting or duplicating them', async () => {
    const f = await fixture(), previous = await create(f);
    const added = await importSamples(f.admin);
    expect(added.body.created).toHaveLength(5); expect(added.body.existing.map(row => row.id)).toContain(previous._id);
    expect((await Challenge.findById(previous._id)).status).toBe('active'); expect(await Challenge.countDocuments()).toBe(6);
  });
  test('simultaneous imports cannot create duplicate samples', async () => {
    const f = await fixture();
    const results = await Promise.all([importSamples(f.admin), importSamples(f.admin)]);
    results.forEach(row => expect([200, 201]).toContain(row.status));
    expect(results.reduce((n, row) => n + row.body.created.length, 0)).toBe(6);
    expect(await Challenge.countDocuments()).toBe(6);
  });
  test('Trainer samples stay inside live assignments and owned or authorised programmes', async () => {
    const f = await fixture();
    const added = await importSamples(f.trainer); expect(added.body.created).toHaveLength(4);
    expect(await Challenge.countDocuments({ moduleKey: keys[2] })).toBe(0);
    const options = await request(app).get('/api/safety-simulations/options').set(header(f.trainer));
    expect(options.body.samples).toHaveLength(4); expect(options.body.samples.some(row => row.moduleKey === keys[2])).toBe(false);
    expect((await importSamples(f.otherTrainer)).body.created).toHaveLength(0);
    await User.findByIdAndUpdate(f.trainer._id, { assignedTrainingSections: [] });
    expect((await importSamples(f.trainer)).body.created).toHaveLength(0);
    expect((await importSamples(f.trainee)).status).toBe(403);
    expect((await request(app).post('/api/safety-simulations/samples')).status).toBe(401);
  });
  test('inactive modules and programmes are skipped without creating replacement modules', async () => {
    const f = await fixture();
    await TrainingModule.updateOne({ key: keys[2] }, { status: 'inactive' });
    await TrainingProgramme.updateOne({ _id: f.programmes[keys[1]]._id }, { status: 'inactive' });
    const added = await importSamples(f.admin); expect(added.body.created).toHaveLength(2); expect(added.body.skipped).toHaveLength(4);
    expect(await TrainingModule.countDocuments()).toBe(3); expect(await TrainingProgramme.countDocuments()).toBe(3);
  });
  test('supports an existing active programme when no beginner programme exists', async () => {
    const f = await fixture(); await TrainingProgramme.updateOne({ _id: f.programmes[keys[0]]._id }, { level: 'intermediate' });
    const added = await importSamples(f.admin); expect(added.body.created).toHaveLength(6);
    expect(await Challenge.countDocuments({ programme: f.programmes[keys[0]]._id })).toBe(2);
  });
  const newPlans = {
    'platform-inspection-v1': ['check-permit', 'inspect-guardrail', 'inspect-floor', 'tag-platform', 'protect-area', '@control', 'select-alternative', 'record-inspection'],
    'clean-desk-v1': ['inspect-documents', 'lock-screen', 'secure-documents', 'verify-visitor', 'deny-access', '@reporting', 'report-exposure'],
    'dispatch-route-v1': ['inspect-pallet', 'secure-pallet', 'inspect-jack', 'clear-exit', '@crossing', 'check-crossing', '@bay', 'lower-pallet', 'finish-checklist'],
  };
  test.each(Object.entries(newPlans))('new sample %s can be activated and completed with a saved score', async (sampleKey, plan) => {
    const f = await fixture(); await importSamples(f.admin);
    const game = await Challenge.findOne({ sampleKey });
    expect(simulationSamples.some(row => row.key === sampleKey)).toBe(true);
    const active = await request(app).patch(`/api/safety-simulations/${game._id}/status`).set(header(f.admin)).send({ status: 'active' }); expect(active.status).toBe(200);
    const begun = await start(f, game); expect(begun.status).toBe(201);
    for (const step of plan) {
      const response = await interact(f, game, begun.body.attempt._id, step.startsWith('@') ? { kind: 'move', locationId: step.slice(1) } : { actionId: step });
      expect(response.status).toBe(200);
    }
    const completed = await request(app).post(`/api/safety-simulations/${game._id}/attempts/${begun.body.attempt._id}/complete`).set(header(f.trainee));
    expect(completed.status).toBe(200); expect(completed.body.attempt.result).toBe('completed'); expect(completed.body.attempt.score).toBeGreaterThan(0);
    expect(await PersonalBest.countDocuments({ challenge: game._id })).toBe(1);
  });
});

const mongoose = require('mongoose');
const Puzzle = require('../models/Puzzle');
const Challenge = require('../models/Challenge');
const ChallengeAttempt = require('../models/ChallengeAttempt');
const PersonalBest = require('../models/PersonalBest');
const { maybeUpdatePersonalBest, leaderboardEntries } = require('../services/challengeScoreService');
const TrainingProgramme = require('../models/TrainingProgramme');
const TrainingAssignment = require('../models/TrainingAssignment');
const TrainingProgress = require('../models/TrainingProgress');
const { writeAuditLog } = require('../utils/auditLogger');
const { syncUnlockedProgressionAssignments, normalizeProgrammeLevel } = require('../services/traineeLevelProgressService');
const { ensureSprint3StarterForProgramme } = require('../services/starterSprint3Content');

const oid = value => mongoose.Types.ObjectId.isValid(value);
const str = value => String(value ?? '').trim();

async function managerProgramme(req, programmeId) {
  if (!oid(programmeId)) return { status: 400, message: 'Invalid programme id.' };
  const programme = await TrainingProgramme.findById(programmeId);
  if (!programme) return { status: 404, message: 'Programme not found.' };
  if (req.user.role === 'admin') return { programme };
  const uid = String(req.user.id);
  const allowed = req.user.role === 'trainer' && (
    String(programme.owner) === uid || (programme.authorizedTrainers || []).some(id => String(id) === uid)
  );
  return allowed ? { programme } : { status: 403, message: 'You are not authorised for this programme.' };
}

async function traineeProgramme(req, programmeId, { requireAssessmentPass = false } = {}) {
  if (!oid(programmeId)) return { status: 400, message: 'Invalid programme id.' };
  const programme = await TrainingProgramme.findOne({ _id: programmeId, status: 'active' });
  if (!programme) return { status: 404, message: 'Active programme not found.' };
  await syncUnlockedProgressionAssignments(req.user.id, programme.programmeType);
  const assignment = await TrainingAssignment.findOne({ trainee: req.user.id, programme: programmeId, status: 'active' });
  if (!assignment) return { status: 403, code: 'TRAINING_NOT_ASSIGNED', message: 'This programme is not assigned to you.' };
  const progress = await TrainingProgress.findOne({ trainee: req.user.id, programme: programmeId }).lean();
  const level = normalizeProgrammeLevel(programme.level);
  const passField = level === 'intermediate' ? 'intermediatePassed' : level === 'advanced' ? 'highPassed' : 'basicPassed';
  const assessmentPassed = !!progress?.[passField];
  if (requireAssessmentPass && !assessmentPassed) {
    return { status: 403, code: 'ASSESSMENT_NOT_PASSED', message: 'Pass this programme assessment before starting the optional puzzle challenge.' };
  }
  return { programme, assignment, progress, assessmentPassed };
}

function cleanProps(value) {
  const rows = Array.isArray(value) ? value : [];
  return rows.map((item, index) => ({
    id: str(item?.id) || `item-${index + 1}`,
    label: str(item?.label),
    description: str(item?.description),
    imageUrl: str(item?.imageUrl),
    imageAlt: str(item?.imageAlt),
  })).filter(item => item.label);
}

function puzzlePayload(body, programme, current = null) {
  const digitalProps = body.digitalProps !== undefined ? cleanProps(body.digitalProps) : (current?.digitalProps || []);
  const expectedSolution = body.expectedSolution !== undefined ? body.expectedSolution : current?.expectedSolution;
  return {
    programme: programme._id,
    moduleKey: String(programme.programmeType || '').toLowerCase(),
    title: str(body.title ?? current?.title),
    instructions: str(body.instructions ?? current?.instructions),
    type: str(body.type ?? current?.type).toLowerCase(),
    digitalProps,
    targets: body.targets !== undefined ? cleanProps(body.targets) : (current?.targets || []),
    expectedSolution: str(body.type ?? current?.type) === 'environmental-hazard' ? (expectedSolution || []) : expectedSolution,
    hazards: body.hazards !== undefined ? body.hazards : (current?.hazards || []),
    hint: str(body.hint ?? current?.hint),
    correctFeedback: str(body.correctFeedback ?? current?.correctFeedback),
    incorrectFeedback: str(body.incorrectFeedback ?? current?.incorrectFeedback),
    status: ['active', 'inactive'].includes(str(body.status ?? current?.status).toLowerCase()) ? str(body.status ?? current?.status).toLowerCase() : 'active',
  };
}

function validatePuzzle(payload) {
  if (payload.title.length < 3) return 'Puzzle title must be at least 3 characters.';
  if (!payload.correctFeedback || !payload.incorrectFeedback) return 'Correct and incorrect feedback are required.';
  if (payload.instructions.length < 10) return 'Puzzle instructions must be at least 10 characters.';
  if (!['sequence', 'sorting', 'matching', 'environmental-hazard'].includes(payload.type)) return 'Unsupported puzzle type.';
  if (payload.type === 'environmental-hazard') {
    const hs = payload.hazards;
    if (!Array.isArray(hs) || !hs.length || hs.length > 20) return 'Add between 1 and 20 hazards.';
    if (new Set(hs.map(h => str(h.id))).size !== hs.length) return 'Hazard IDs must be unique.';
    for (const h of hs) {
      if (!str(h.id) || !str(h.locationId) || !str(h.label) || !str(h.description) || !str(h.hazardType)) return 'Each hazard needs an ID, location, title, description and type.';
      if (!Number.isFinite(Number(h.yaw)) || Number(h.yaw) < -180 || Number(h.yaw) > 180 || !Number.isFinite(Number(h.pitch)) || Number(h.pitch) < -75 || Number(h.pitch) > 75) return 'Hazard coordinates must be valid yaw and pitch.';
      if (!Array.isArray(h.availableActions) || h.availableActions.length < 2 || h.availableActions.length > 8 || new Set(h.availableActions.map(str)).size !== h.availableActions.length || h.availableActions.includes('hint') || !h.availableActions.includes(h.correctAction)) return 'Each hazard needs distinct actions and a matching correct action.';
      if (!Number.isInteger(Number(h.points)) || Number(h.points) < 1 || Number(h.points) > 10000 || !Number.isInteger(Number(h.penalty)) || Number(h.penalty) < 0 || Number(h.penalty) > 1000) return 'Hazard points and penalty must be valid whole numbers.';
    }
    return null;
  }
  if (payload.digitalProps.some(p => p.imageUrl && !/^(https?:\/\/|\/(?!\/))[^\s]+$/i.test(p.imageUrl))) return 'Image URLs must be HTTP(S) or a local /path.';
  if (payload.digitalProps.length < 2) return 'At least two answer or step items are required.';
  if (payload.expectedSolution === undefined || payload.expectedSolution === null) return 'Expected solution is required.';
  if (!payload.correctFeedback || !payload.incorrectFeedback) return 'Correct and incorrect feedback are required.';

  const propIds = payload.digitalProps.map(item => String(item.id));
  const propIdSet = new Set(propIds);
  const labelSet = new Set(payload.digitalProps.map(item => String(item.label).toLowerCase()));
  if (propIdSet.size !== propIds.length) return 'Answer item IDs must be unique.';
  if (labelSet.size !== payload.digitalProps.length) return 'Answer item labels must be unique.';

  if (payload.type === 'matching') {
    const targets = payload.targets || [];
    const solution = payload.expectedSolution;
    if (targets.length < 2 || targets.length > 12 || targets.length !== propIds.length || new Set(targets.map(t => t.id)).size !== targets.length) return 'Use 2–12 distinct targets and one prop per target.';
    if (!solution || Array.isArray(solution) || typeof solution !== 'object' || Object.keys(solution).length !== targets.length) return 'Each target needs one correct prop.';
    if (!targets.every(t => Object.prototype.hasOwnProperty.call(solution, t.id) && propIdSet.has(String(solution[t.id]))) || new Set(Object.values(solution).map(String)).size !== propIds.length) return 'Match each target to a different valid prop.';
  }
  if (['sequence', 'sorting'].includes(payload.type)) {
    const order = Array.isArray(payload.expectedSolution) ? payload.expectedSolution.map(String) : [];
    if (order.length !== propIds.length || new Set(order).size !== propIds.length) {
      return 'The correct order must contain every answer step exactly once.';
    }
    if (order.some(id => !propIdSet.has(id))) return 'The correct order contains an unknown answer step.';
  }

  return null;
}

function challengePayload(body, current = null) {
  const num = (key, fallback) => {
    const raw = body[key] ?? current?.[key] ?? fallback;
    return Number(raw);
  };
  return {
    timeLimitSeconds: num('timeLimitSeconds', 180),
    basePoints: num('basePoints', 800),
    incorrectPenalty: num('incorrectPenalty', 50),
    hintPenalty: num('hintPenalty', 50),
    maxTimeBonus: num('maxTimeBonus', 200),
    completionBonus: num('completionBonus', 200),
    maxScore: num('maxScore', 1000),
    tieRule: ['faster-time', 'earlier-attempt'].includes(str(body.tieRule ?? current?.tieRule)) ? str(body.tieRule ?? current?.tieRule) : 'faster-time',
    status: ['active', 'inactive'].includes(str(body.challengeStatus ?? body.status ?? current?.status).toLowerCase()) ? str(body.challengeStatus ?? body.status ?? current?.status).toLowerCase() : 'active',
  };
}

function shuffledOrder(items = [], avoidOrder = []) {
  const original = items.map(item => String(item?.id ?? item));
  const avoid = Array.isArray(avoidOrder) ? avoidOrder.map(String) : [];
  let shuffled = [...original];
  const sameAs = (a, b) => a.length === b.length && a.every((id, index) => id === b[index]);

  // Try several Fisher-Yates shuffles so a fresh attempt differs from both the
  // hidden solution and the trainee's immediately previous presentation order.
  for (let attempt = 0; attempt < 8; attempt += 1) {
    shuffled = [...original];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    if (!sameAs(shuffled, original) && !sameAs(shuffled, avoid)) return shuffled;
  }

  // Deterministic fallback for the extremely unlikely case that randomisation
  // repeats the same order. Rotate until it differs while keeping every ID once.
  if (shuffled.length > 1) {
    shuffled = [...original.slice(1), original[0]];
    if (sameAs(shuffled, avoid) && shuffled.length > 2) shuffled = [...original.slice(2), ...original.slice(0, 2)];
  }
  return shuffled;
}

function publicPuzzle(puzzle, presentationOrder = null) {
  if (!puzzle) return null;
  const row = puzzle.toObject ? puzzle.toObject() : { ...puzzle };
  delete row.expectedSolution;
  if (row.type === 'environmental-hazard') row.hazards = (row.hazards || []).map(({ correctAction, ...hazard }) => hazard);

  if (['sequence', 'sorting', 'matching'].includes(row.type) && Array.isArray(row.digitalProps)) {
    const byId = new Map(row.digitalProps.map(item => [String(item.id), { ...item }]));
    const order = Array.isArray(presentationOrder) && presentationOrder.length
      ? presentationOrder.map(String)
      : shuffledOrder(row.digitalProps);
    row.digitalProps = order.map(id => byId.get(id)).filter(Boolean);
  }
  return row;
}

function publicChallenge(challenge) {
  if (!challenge) return null;
  const row = challenge.toObject ? challenge.toObject() : { ...challenge };
  if (row.puzzle && typeof row.puzzle === 'object') row.puzzle = row.puzzle._id;
  return row;
}

function solutionMetrics(type, expected, submitted) {
  if (type === 'selection') {
    const exp = new Set((Array.isArray(expected) ? expected : [expected]).map(String));
    const got = new Set((Array.isArray(submitted) ? submitted : [submitted]).map(String));
    let correct = 0;
    for (const id of got) if (exp.has(id)) correct += 1;
    const extras = [...got].filter(id => !exp.has(id)).length;
    const misses = [...exp].filter(id => !got.has(id)).length;
    const total = Math.max(1, exp.size);
    return { accuracy: Math.max(0, Math.min(1, (correct - extras) / total)), errors: extras + misses, exact: extras === 0 && misses === 0 };
  }
  if (type === 'scenario-decision') {
    const exp = Array.isArray(expected) ? String(expected[0] ?? '') : String(expected ?? '');
    const got = Array.isArray(submitted) ? String(submitted[0] ?? '') : String(submitted ?? '');
    const exact = exp === got;
    return { accuracy: exact ? 1 : 0, errors: exact ? 0 : 1, exact };
  }
  if (type === 'matching') {
    const exp = expected && typeof expected === 'object' ? expected : {};
    const got = submitted && typeof submitted === 'object' ? submitted : {};
    const keys = Object.keys(exp);
    const correct = keys.filter(key => String(got[key] ?? '') === String(exp[key] ?? '')).length;
    const errors = keys.length - correct;
    return { accuracy: keys.length ? correct / keys.length : 0, errors, exact: errors === 0 };
  }
  const exp = (Array.isArray(expected) ? expected : []).map(String);
  const got = (Array.isArray(submitted) ? submitted : []).map(String);
  const total = Math.max(1, exp.length);
  let correct = 0;
  for (let i = 0; i < exp.length; i += 1) if (got[i] === exp[i]) correct += 1;
  const errors = Math.max(exp.length, got.length) - correct;
  return { accuracy: Math.max(0, Math.min(1, correct / total)), errors, exact: exp.length === got.length && correct === exp.length };
}


exports.listPuzzles = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'trainer') {
      const programmes = await TrainingProgramme.find({ $or: [{ owner: req.user.id }, { authorizedTrainers: req.user.id }] }).select('_id').lean();
      query.programme = { $in: programmes.map(p => p._id) };
    }
    if (req.query.programmeId) {
      const access = await managerProgramme(req, req.query.programmeId);
      if (access.status) return res.status(access.status).json({ message: access.message });
      query.programme = access.programme._id;
    }
    const puzzles = await Puzzle.find(query).populate('programme', 'title programmeType level status').sort({ createdAt: -1 }).lean();
    const challengeRows = await Challenge.find({ puzzle: { $in: puzzles.map(p => p._id) } }).lean();
    const byPuzzle = new Map(challengeRows.map(c => [String(c.puzzle), c]));
    res.json({ puzzles: puzzles.map(p => ({ ...p, challenge: byPuzzle.get(String(p._id)) || null })) });
  } catch (error) {
    console.error('listPuzzles failed:', error);
    res.status(500).json({ message: 'Unable to load puzzle activities.' });
  }
};

exports.createPuzzle = async (req, res) => {
  try {
    const programmeId = req.body.programmeId || req.body.programme;
    const access = await managerProgramme(req, programmeId);
    if (access.status) return res.status(access.status).json({ message: access.message });
    const payload = puzzlePayload(req.body, access.programme);
    const problem = validatePuzzle(payload);
    if (problem) return res.status(400).json({ message: problem });
    const puzzle = await Puzzle.create({ ...payload, createdBy: req.user.id });
    const challenge = await Challenge.create({ puzzle: puzzle._id, ...challengePayload(req.body.challenge || req.body), createdBy: req.user.id });
    await writeAuditLog({ req, user: req.user, action: 'SPRINT3_PUZZLE_CREATED', status: 'success', details: { puzzleId: puzzle._id, programmeId } }).catch(() => {});
    res.status(201).json({ message: 'Puzzle activity created.', puzzle, challenge });
  } catch (error) {
    console.error('createPuzzle failed:', error);
    res.status(500).json({ message: 'Unable to create puzzle activity.' });
  }
};

exports.updatePuzzle = async (req, res) => {
  try {
    if (!oid(req.params.id)) return res.status(400).json({ message: 'Invalid puzzle id.' });
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) return res.status(404).json({ message: 'Puzzle not found.' });
    const access = await managerProgramme(req, puzzle.programme);
    if (access.status) return res.status(access.status).json({ message: access.message });
    const payload = puzzlePayload(req.body, access.programme, puzzle);
    const problem = validatePuzzle(payload);
    if (problem) return res.status(400).json({ message: problem });
    Object.assign(puzzle, payload, { updatedBy: req.user.id });
    await puzzle.save();
    let challenge = await Challenge.findOne({ puzzle: puzzle._id });
    if (!challenge) challenge = new Challenge({ puzzle: puzzle._id, createdBy: req.user.id });
    Object.assign(challenge, challengePayload(req.body.challenge || req.body, challenge), { updatedBy: req.user.id });
    await challenge.save();
    await writeAuditLog({ req, user: req.user, action: 'SPRINT3_PUZZLE_UPDATED', status: 'success', details: { puzzleId: puzzle._id } }).catch(() => {});
    res.json({ message: 'Puzzle activity updated.', puzzle, challenge });
  } catch (error) {
    console.error('updatePuzzle failed:', error);
    res.status(500).json({ message: 'Unable to update puzzle activity.' });
  }
};

exports.createChallenge = async (req, res) => {
  try {
    if (!oid(req.body.puzzleId || req.body.puzzle)) return res.status(400).json({ message: 'Valid puzzle id is required.' });
    const puzzle = await Puzzle.findById(req.body.puzzleId || req.body.puzzle);
    if (!puzzle) return res.status(404).json({ message: 'Puzzle not found.' });
    const access = await managerProgramme(req, puzzle.programme);
    if (access.status) return res.status(access.status).json({ message: access.message });
    if (await Challenge.exists({ puzzle: puzzle._id })) return res.status(409).json({ message: 'This puzzle already has a challenge rule.' });
    const challenge = await Challenge.create({ puzzle: puzzle._id, ...challengePayload(req.body), createdBy: req.user.id });
    res.status(201).json({ message: 'Challenge scoring rule created.', challenge });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create challenge rule.' });
  }
};

exports.programmeActivities = async (req, res) => {
  try {
    const access = req.user.role === 'trainee'
      ? await traineeProgramme(req, req.params.id)
      : await managerProgramme(req, req.params.id);
    if (access.status) return res.status(access.status).json({ code: access.code, message: access.message });
    await ensureSprint3StarterForProgramme(access.programme);
    const puzzles = await Puzzle.find({ programme: req.params.id, status: 'active', type: { $in: ['sequence', 'sorting', 'matching', 'environmental-hazard'] } }).sort({ createdAt: 1 }).lean();
    const challenges = await Challenge.find({ puzzle: { $in: puzzles.map(p => p._id) }, status: 'active' }).lean();
    const challengeMap = new Map(challenges.map(c => [String(c.puzzle), c]));
    const bests = req.user.role === 'trainee'
      ? await PersonalBest.find({ trainee: req.user.id, challenge: { $in: challenges.map(c => c._id) } }).lean()
      : [];
    const bestMap = new Map(bests.map(b => [String(b.challenge), b]));
    res.json({
      programme: access.programme,
      assessmentPassed: req.user.role === 'trainee' ? access.assessmentPassed : undefined,
      activities: puzzles.map(p => {
        const challenge = challengeMap.get(String(p._id));
        return {
          puzzle: req.user.role === 'trainee' ? publicPuzzle(p) : p,
          challenge,
          personalBest: challenge ? bestMap.get(String(challenge._id)) || null : null,
          locked: req.user.role === 'trainee' ? !access.assessmentPassed : false,
        };
      }).filter(row => row.challenge),
    });
  } catch (error) {
    console.error('programmeActivities failed:', error);
    res.status(500).json({ message: 'Unable to load programme activities.' });
  }
};

exports.startChallenge = async (req, res) => {
  try {
    if (!oid(req.params.id)) return res.status(400).json({ message: 'Invalid challenge id.' });
    const challenge = await Challenge.findOne({ _id: req.params.id, status: 'active' }).populate('puzzle');
    if (!challenge || !challenge.puzzle || challenge.puzzle.status !== 'active') return res.status(404).json({ message: 'Active challenge not found.' });
    if (!['sequence', 'sorting', 'matching', 'environmental-hazard'].includes(challenge.puzzle.type)) return res.status(409).json({ code: 'LEGACY_PUZZLE_FORMAT', message: 'This older activity must be converted to the drag-and-drop ordering puzzle format by an Admin or Trainer.' });
    const access = await traineeProgramme(req, challenge.puzzle.programme, { requireAssessmentPass: true });
    if (access.status) return res.status(access.status).json({ code: access.code, message: access.message });
    const existing = await ChallengeAttempt.findOne({ trainee: req.user.id, challenge: challenge._id, result: 'in-progress' }).sort({ startedAt: -1 });
    if (existing) {
      const ageSeconds = Math.floor((Date.now() - existing.startedAt.getTime()) / 1000);
      if (ageSeconds < challenge.timeLimitSeconds) {
        if (!Array.isArray(existing.presentationOrder) || !existing.presentationOrder.length) {
          existing.presentationOrder = shuffledOrder(challenge.puzzle.digitalProps || []);
          await existing.save();
        }
        return res.json({ attempt: existing, challenge: publicChallenge(challenge), puzzle: publicPuzzle(challenge.puzzle, existing.presentationOrder), resumed: true });
      }
      existing.finishedAt = new Date(); existing.durationSeconds = ageSeconds; existing.result = 'timeout'; existing.score = 0; existing.validityStatus = 'valid'; existing.validityReason = 'Time limit expired.'; existing.feedback = challenge.puzzle.incorrectFeedback;
      await existing.save();
    }
    const previousAttempt = await ChallengeAttempt.findOne({
      trainee: req.user.id,
      challenge: challenge._id,
      result: { $ne: 'in-progress' },
    }).sort({ startedAt: -1 }).select('presentationOrder').lean();
    const presentationOrder = shuffledOrder(challenge.puzzle.digitalProps || [], previousAttempt?.presentationOrder || []);
    const attempt = await ChallengeAttempt.create({ trainee: req.user.id, programme: challenge.puzzle.programme, puzzle: challenge.puzzle._id, challenge: challenge._id, startedAt: new Date(), presentationOrder });
    res.status(201).json({ attempt, challenge: publicChallenge(challenge), puzzle: publicPuzzle(challenge.puzzle, presentationOrder), resumed: false });
  } catch (error) {
    console.error('startChallenge failed:', error);
    res.status(500).json({ message: 'Unable to start challenge.' });
  }
};

exports.useHint = async (req, res) => {
  try {
    if (!oid(req.params.attemptId)) return res.status(400).json({ message: 'Invalid attempt id.' });
    const attempt = await ChallengeAttempt.findOne({ _id: req.params.attemptId, trainee: req.user.id, result: 'in-progress' }).populate('puzzle', 'hint type');
    if (!attempt) return res.status(409).json({ message: 'This challenge attempt is no longer active.' });
    if (Date.now() - attempt.startedAt.getTime() >= (await Challenge.findById(attempt.challenge)).timeLimitSeconds * 1000) return res.status(409).json({ message: 'Time limit expired.' });
    if (attempt.puzzle?.type === 'environmental-hazard') return res.status(400).json({ message: 'Select a hazard for a hint.' });
    attempt.hintsUsed += 1;
    await attempt.save();
    res.json({ hint: attempt.puzzle?.hint || 'Review the instructions and focus on the safest response.', hintsUsed: attempt.hintsUsed });
  } catch (error) {
    res.status(500).json({ message: 'Unable to provide hint.' });
  }
};

exports.submitChallenge = async (req, res) => {
  try {
    if (!oid(req.params.id)) return res.status(400).json({ message: 'Invalid challenge id.' });
    const challenge = await Challenge.findOne({ _id: req.params.id, status: 'active' }).populate('puzzle');
    if (!challenge || !challenge.puzzle) return res.status(404).json({ message: 'Challenge not found.' });
    const attemptId = req.body.attemptId;
    if (!oid(attemptId)) return res.status(400).json({ message: 'Valid attemptId is required.' });
    const attempt = await ChallengeAttempt.findOne({ _id: attemptId, trainee: req.user.id, challenge: challenge._id });
    if (!attempt) return res.status(404).json({ message: 'Challenge attempt not found.' });
    if (attempt.result !== 'in-progress' || attempt.validityStatus !== 'pending') return res.status(409).json({ code: 'DUPLICATE_SUBMISSION', message: 'This attempt has already been submitted.' });
    const access = await traineeProgramme(req, challenge.puzzle.programme, { requireAssessmentPass: true });
    if (access.status) return res.status(access.status).json({ code: access.code, message: access.message });

    // Never trust a browser-supplied timer. If a client sends an impossible
    // timing value, reject and preserve the attempt as invalid evidence.
    const clientDuration = req.body.durationSeconds ?? req.body.completionTime;
    if (clientDuration !== undefined && (!Number.isFinite(Number(clientDuration)) || Number(clientDuration) < 0)) {
      attempt.finishedAt = new Date();
      attempt.result = 'invalid';
      attempt.validityStatus = 'invalid';
      attempt.validityReason = 'Browser supplied an impossible timing value.';
      await attempt.save();
      return res.status(400).json({ code: 'INVALID_TIMING', message: 'Impossible timing value rejected.' });
    }

    const finishedAt = new Date();
    const durationSeconds = Math.max(0, Math.floor((finishedAt.getTime() - attempt.startedAt.getTime()) / 1000));
    if (!Number.isFinite(durationSeconds) || durationSeconds < 0) {
      attempt.finishedAt = finishedAt; attempt.result = 'invalid'; attempt.validityStatus = 'invalid'; attempt.validityReason = 'Impossible timing value.';
      await attempt.save();
      return res.status(400).json({ code: 'INVALID_TIMING', message: 'Attempt timing is invalid.' });
    }

    const timedOut = durationSeconds >= challenge.timeLimitSeconds;

    if (challenge.puzzle.type === 'environmental-hazard') return res.status(400).json({ message: 'Use hazard actions to complete this investigation.' });
    if (!timedOut && ['sequence', 'sorting'].includes(challenge.puzzle.type)) {
      const submittedOrder = Array.isArray(req.body.answers) ? req.body.answers.map(String) : [];
      const validIds = (challenge.puzzle.digitalProps || []).map(item => String(item.id));
      const validSet = new Set(validIds);
      const submittedSet = new Set(submittedOrder);
      const malformed = submittedOrder.length !== validIds.length
        || submittedSet.size !== validIds.length
        || submittedOrder.some(id => !validSet.has(id));
      if (malformed) {
        return res.status(400).json({ code: 'INCOMPLETE_ORDER', message: 'Every puzzle card must appear exactly once in the submitted order.' });
      }
    }

    if (!timedOut && challenge.puzzle.type === 'matching') {
      const answers = req.body.answers;
      const targets = challenge.puzzle.targets || [];
      const ids = new Set(challenge.puzzle.digitalProps.map(p => String(p.id)));
      if (!answers || typeof answers !== 'object' || Array.isArray(answers) || Object.keys(answers).length !== targets.length ||
          !targets.every(t => Object.prototype.hasOwnProperty.call(answers, t.id) && ids.has(String(answers[t.id]))) ||
          new Set(Object.values(answers).map(String)).size !== targets.length) {
        return res.status(400).json({ code: 'INCOMPLETE_MATCH', message: 'Place each prop once and fill every target.' });
      }
    }
    const metrics = solutionMetrics(challenge.puzzle.type, challenge.puzzle.expectedSolution, req.body.answers);
    const correctnessPoints = Math.round(challenge.basePoints * metrics.accuracy);
    const timeRemaining = Math.max(0, challenge.timeLimitSeconds - durationSeconds);
    const timeBonus = timedOut ? 0 : Math.round(challenge.maxTimeBonus * (timeRemaining / challenge.timeLimitSeconds) * metrics.accuracy);
    const penalties = metrics.errors * challenge.incorrectPenalty + Math.min(timeBonus, attempt.hintsUsed * challenge.hintPenalty);
    // Do not award partial/random points. A trainee receives a score only
    // when every card is in the exact correct position and the attempt is in time.
    const score = (!timedOut && metrics.exact)
      ? Math.max(0, Math.min(challenge.maxScore, correctnessPoints + timeBonus - penalties))
      : 0;

    Object.assign(attempt, {
      finishedAt,
      durationSeconds,
      answers: req.body.answers,
      errors: metrics.errors,
      accuracy: metrics.accuracy,
      score,
      result: timedOut ? 'timeout' : 'completed',
      validityStatus: 'valid',
      validityReason: timedOut ? 'Time limit exceeded.' : '',
      feedback: timedOut ? 'Time limit reached. No points awarded.' : metrics.exact ? challenge.puzzle.correctFeedback : challenge.puzzle.incorrectFeedback,
    });
    await attempt.save();
    const best = await maybeUpdatePersonalBest(attempt, challenge);
    res.json({
      message: timedOut ? 'Time limit reached. Attempt recorded.' : 'Challenge attempt recorded.',
      attempt,
      exact: metrics.exact && !timedOut,
      matchingAnswer: challenge.puzzle.type === 'matching' ? (challenge.puzzle.targets || []).map(t => ({ target: t.label, prop: challenge.puzzle.digitalProps.find(p => p.id === challenge.puzzle.expectedSolution[t.id])?.label })) : undefined,
      answer: (Array.isArray(challenge.puzzle.expectedSolution) ? challenge.puzzle.expectedSolution : []).map(id =>
        (challenge.puzzle.digitalProps || []).find(item => String(item.id) === String(id))?.label || String(id)
      ),
      feedback: attempt.feedback,
      personalBestUpdated: best.updated,
      personalBest: best.personalBest,
      scoring: metrics.exact && !timedOut
        ? { correctnessPoints, timeBonus, penalties, maxScore: challenge.maxScore }
        : { correctnessPoints: 0, timeBonus: 0, penalties: 0, maxScore: challenge.maxScore },
    });
  } catch (error) {
    if (error.name === 'VersionError') return res.status(409).json({ code: 'ATTEMPT_CHANGED', message: 'This attempt changed or was already submitted. Reload the activity.' });
    console.error('submitChallenge failed:', error);
    res.status(500).json({ message: 'Unable to submit challenge.' });
  }
};

exports.myAttempts = async (req, res) => {
  try {
    const query = { trainee: req.user.id, validityStatus: { $ne: 'pending' } };
    if (req.query.programmeId) query.programme = req.query.programmeId;
    const attempts = await ChallengeAttempt.find(query).select('-simulationSnapshot')
      .populate('programme', 'title programmeType level')
      .populate('puzzle', 'title type')
      .populate('challenge', 'title type timeLimitSeconds maxScore tieRule')
      .sort({ createdAt: -1 }).lean();
    res.json({ attempts });
  } catch (error) { res.status(500).json({ message: 'Unable to load challenge attempts.' }); }
};

exports.myPersonalBests = async (req, res) => {
  try {
    const query = { trainee: req.user.id };
    if (req.query.programmeId) query.programme = req.query.programmeId;
    const personalBests = await PersonalBest.find(query)
      .populate('programme', 'title programmeType level')
      .populate('puzzle', 'title type')
      .populate('challenge', 'title type timeLimitSeconds maxScore tieRule')
      .sort({ updatedAt: -1 }).lean();
    res.json({ personalBests });
  } catch (error) { res.status(500).json({ message: 'Unable to load personal bests.' }); }
};

exports.challengeResults = async (req, res) => {
  try {
    const access = await managerProgramme(req, req.params.id);
    if (access.status) return res.status(access.status).json({ message: access.message });
    const attempts = await ChallengeAttempt.find({ programme: access.programme._id, validityStatus: { $ne: 'pending' } }).select('-simulationSnapshot')
      .populate('trainee', 'firstName lastName username email')
      .populate('puzzle', 'title type')
      .populate('challenge', 'title type maxScore timeLimitSeconds tieRule')
      .sort({ createdAt: -1 }).lean();
    const personalBests = await PersonalBest.find({ programme: access.programme._id })
      .populate('trainee', 'firstName lastName username email')
      .populate('puzzle', 'title type')
      .sort({ score: -1, durationSeconds: 1 }).lean();
    res.json({ programme: access.programme, attempts, personalBests });
  } catch (error) {
    console.error('challengeResults failed:', error);
    res.status(500).json({ message: 'Unable to load challenge results.' });
  }
};

// Each interaction is checked and persisted by the server. __v acts as a compare-and-swap
// guard so two rapid requests cannot resolve the same hazard twice.
exports.hazardAction = async (req, res) => {
  try {
    const { attemptId, hazardId, action } = req.body;
    if (!oid(req.params.id) || !oid(attemptId)) return res.status(400).json({ message: 'Invalid challenge or attempt.' });
    const challenge = await Challenge.findOne({ _id: req.params.id, status: 'active' }).populate('puzzle');
    if (!challenge || challenge.puzzle?.type !== 'environmental-hazard' || challenge.puzzle.status !== 'active') return res.status(404).json({ message: 'Investigation not found.' });
    const attempt = await ChallengeAttempt.findOne({ _id: attemptId, trainee: req.user.id, challenge: challenge._id, puzzle: challenge.puzzle._id, programme: challenge.puzzle.programme });
    if (!attempt || attempt.result !== 'in-progress') return res.status(409).json({ message: 'No active attempt belongs to you.' });
    const access = await traineeProgramme(req, challenge.puzzle.programme, { requireAssessmentPass: true });
    if (access.status) return res.status(access.status).json({ message: access.message });
    const durationSeconds = Math.max(0, Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000));
    if (durationSeconds >= challenge.timeLimitSeconds) {
      await ChallengeAttempt.updateOne({ _id: attempt._id, result: 'in-progress' }, { $set: { result: 'timeout', score: 0, validityStatus: 'valid', finishedAt: new Date(), durationSeconds, feedback: 'Time limit expired.' } });
      return res.status(409).json({ code: 'TIMEOUT', message: 'Time limit expired.' });
    }
    const hazard = (challenge.puzzle.hazards || []).find(h => h.id === hazardId);
    if (!hazard) return res.status(400).json({ message: 'Unknown hazard.' });
    if (attempt.solvedHazards.includes(hazardId)) return res.status(409).json({ message: 'Hazard already resolved.' });
    const hint = action === 'hint';
    if (!hint && !hazard.availableActions.includes(action)) return res.status(400).json({ message: 'Invalid corrective action.' });
    if (hint && (attempt.hazardEvents || []).some(e => e.hazardId === hazardId && e.hint)) return res.status(409).json({ message: 'Hint already used for this hazard.' });
    const correct = !hint && action === hazard.correctAction;
    const event = { hazardId, action: hint ? 'hint' : action, hint, correct, at: new Date().toISOString() };
    const solvedHazards = correct ? [...attempt.solvedHazards, hazardId] : attempt.solvedHazards;
    const events = [...(attempt.hazardEvents || []), event];
    const complete = solvedHazards.length === challenge.puzzle.hazards.length;
    const errors = events.filter(e => !e.hint && !e.correct).length;
    const hintsUsed = events.filter(e => e.hint).length;
    const raw = solvedHazards.reduce((sum, id) => sum + Number(challenge.puzzle.hazards.find(h => h.id === id)?.points || 0) + Math.round(challenge.basePoints / challenge.puzzle.hazards.length), 0)
      - events.filter(e => !e.hint && !e.correct).reduce((sum, e) => sum + Number(challenge.puzzle.hazards.find(h => h.id === e.hazardId)?.penalty || challenge.incorrectPenalty), 0)
      - hintsUsed * challenge.hintPenalty;
    const timeBonus = complete ? Math.round(challenge.maxTimeBonus * Math.max(0, challenge.timeLimitSeconds - durationSeconds) / challenge.timeLimitSeconds) : 0;
    const score = Math.max(0, Math.min(challenge.maxScore, raw + timeBonus + (complete ? challenge.completionBonus : 0))); 
    const updated = await ChallengeAttempt.findOneAndUpdate({ _id: attempt._id, __v: attempt.__v, result: 'in-progress' }, {
      $set: { hazardEvents: events, solvedHazards, answers: events.filter(e => !e.hint).map(e => ({ hazardId: e.hazardId, action: e.action })), errors, hintsUsed, score, accuracy: solvedHazards.length / challenge.puzzle.hazards.length,
        ...(complete ? { result: 'completed', validityStatus: 'valid', finishedAt: new Date(), durationSeconds, feedback: challenge.puzzle.correctFeedback } : {}) }, $inc: { __v: 1 }
    }, { new: true });
    if (!updated) return res.status(409).json({ message: 'Attempt changed. Refresh to continue.' });
    const best = complete ? await maybeUpdatePersonalBest(updated, challenge) : { updated: false };
    res.json({ attempt: updated, correct, complete, feedback: correct ? hazard.correctFeedback || challenge.puzzle.correctFeedback : hint ? hazard.hint || challenge.puzzle.hint : hazard.incorrectFeedback || challenge.puzzle.incorrectFeedback, personalBestUpdated: best.updated });
  } catch (error) { console.error('hazardAction failed:', error); res.status(500).json({ message: 'Unable to record hazard action.' }); }
};

// Only rank and score cross the trainee API boundary. One best result per
// trainee for the selected puzzle; replaying never adds duplicate entries.
exports.leaderboard = async (req, res) => {
  try {
    if (!oid(req.params.id)) return res.status(400).json({ message: 'Invalid challenge id.' });
    const challenge = await Challenge.findOne({ _id: req.params.id, status: 'active' }).populate('puzzle');
    if (!challenge?.puzzle || challenge.puzzle.status !== 'active') return res.status(404).json({ message: 'Active puzzle not found.' });
    const access = await traineeProgramme(req, challenge.puzzle.programme);
    if (access.status) return res.status(access.status).json({ message: access.message });
    const entries = await leaderboardEntries(challenge._id, challenge.puzzle.programme);
    res.set('Cache-Control', 'no-store');
    res.json({ entries });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load scores.' });
  }
};

// Global puzzle totals are computed from MongoDB personal-best records, never
// from browser values or the sum of attempts. One maximum per distinct puzzle
// makes replays and legacy duplicate challenge records unable to inflate totals.
exports.totalScores = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    if (!Number.isInteger(page) || page < 1 || page > 10000) return res.status(400).json({ message: 'Invalid score page.' });
    const pageSize = 20;
    const [data] = await PersonalBest.aggregate([
      { $match: { score: { $gt: 0 }, puzzle: { $type: 'objectId' } } },
      { $group: { _id: { trainee: '$trainee', puzzle: '$puzzle' }, score: { $max: '$score' } } },
      { $group: { _id: '$_id.trainee', highScore: { $sum: '$score' }, puzzlesCompleted: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'profile', pipeline: [
        { $match: { role: 'trainee', status: 'active' } },
        { $project: { firstName: 1, lastName: 1, profileImage: 1 } },
      ] } },
      { $unwind: '$profile' },
      { $sort: { highScore: -1, _id: 1 } },
      { $facet: {
        entries: [
          { $skip: (page - 1) * pageSize }, { $limit: pageSize },
          { $project: { _id: 0, highScore: 1, name: { $trim: { input: { $concat: [{ $ifNull: ['$profile.firstName', ''] }, ' ', { $ifNull: ['$profile.lastName', ''] }] } } }, profileImage: { $ifNull: ['$profile.profileImage', ''] } } },
        ],
        count: [{ $count: 'total' }],
        mine: [{ $match: { _id: new mongoose.Types.ObjectId(req.user.id) } }, { $project: { _id: 0, highScore: 1, puzzlesCompleted: 1 } }],
      } },
    ]);
    // Explicit allowlist also protects the response if the database projection
    // is changed later. Other trainees' IDs and contact details never leave it.
    const entries = (data?.entries || []).map(row => ({ name: str(row.name) || 'Trainee', profileImage: str(row.profileImage), highScore: Number(row.highScore) || 0 }));
    const mine = data?.mine?.[0];
    res.set('Cache-Control', 'no-store');
    res.json({ entries, myScore: { highScore: Number(mine?.highScore) || 0, puzzlesCompleted: Number(mine?.puzzlesCompleted) || 0 }, page, pageSize, total: Number(data?.count?.[0]?.total) || 0 });
  } catch (error) {
    console.error('totalScores failed:', error.message);
    res.status(500).json({ message: 'Unable to load total puzzle scores.' });
  }
};

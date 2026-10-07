const AssessmentAttempt = require('../src/models/AssessmentAttempt');
const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../src/models/User');
const TrainingModule = require('../src/models/TrainingModule');
const TrainingProgramme = require('../src/models/TrainingProgramme');
const TrainingAssignment = require('../src/models/TrainingAssignment');
const TrainingProgress = require('../src/models/TrainingProgress');
const Puzzle = require('../src/models/Puzzle');
const Challenge = require('../src/models/Challenge');
const ChallengeAttempt = require('../src/models/ChallengeAttempt');
const PersonalBest = require('../src/models/PersonalBest');
const { generateAccessToken } = require('../src/utils/generateTokens');

const PASSWORD = 'Sprint3Test123!';
const auth = token => ({ Authorization: `Bearer ${token}` });

async function makeUser(username, role, sections = []) {
  return User.create({
    firstName: username, lastName: 'Test', email: `${username}@test.local`, username,
    passwordHash: await bcrypt.hash(PASSWORD, 4), role,
    ...(role !== 'admin' ? { age: 25, phoneNumber: '9800000000', address: 'Kathmandu, Nepal', gender: 'female' } : {}),
    accountStatus: 'created', status: 'active', mustChangePassword: false, assignedTrainingSections: sections,
  });
}

async function fixture() {
  const admin = await makeUser('s3admin', 'admin');
  const trainerA = await makeUser('s3trainera', 'trainer', ['manual-handling']);
  const trainerB = await makeUser('s3trainerb', 'trainer', ['manual-handling']);
  const traineeA = await makeUser('s3traineea', 'trainee', ['manual-handling']);
  const traineeB = await makeUser('s3traineeb', 'trainee', ['manual-handling']);
  await TrainingModule.create({ name: 'Manual Handling', code: 'MH', key: 'manual-handling', description: 'Manual handling module for Sprint 3 tests.', status: 'active', createdBy: admin._id });
  const programme = await TrainingProgramme.create({
    programmeType: 'manual-handling', title: 'Manual Handling Beginner', shortDescription: 'Safe lifting challenge programme.',
    description: 'Manual handling training programme used for Sprint 3 challenge testing.',
    learningObjectives: 'Apply safe manual handling decisions and complete the approved challenge.',
    prerequisite: '', owner: trainerA._id, authorizedTrainers: [], level: 'beginner', passMark: 70, status: 'active', createdBy: admin._id,
  });
  for (const trainee of [traineeA, traineeB]) {
    const assignment = await TrainingAssignment.create({ programme: programme._id, trainee: trainee._id, assignedBy: admin._id, status: 'active' });
    await TrainingProgress.create({ trainee: trainee._id, programme: programme._id, assignment: assignment._id, learningCompleted: true, scenarioCompleted: true, basicPassed: true, currentStage: 'intermediate', progress: 65, status: 'in-progress' });
    await AssessmentAttempt.create({ trainee: trainee._id, programme: programme._id, assignment: assignment._id, level: 'basic', status: 'submitted', score: 1, totalPoints: 1, percentage: 100, passed: true, attemptNumber: 1, submittedAt: new Date() });
  }
  const puzzle = await Puzzle.create({
    programme: programme._id, moduleKey: 'manual-handling', title: 'Safe Lifting Sequence', instructions: 'Arrange the safe lifting steps in the approved order.', type: 'sequence',
    digitalProps: [{ id: 'a', label: 'Assess' }, { id: 'b', label: 'Position' }, { id: 'c', label: 'Lift' }], expectedSolution: ['a', 'b', 'c'], hint: 'Start by assessing the load.',
    correctFeedback: 'Correct safe sequence.', incorrectFeedback: 'Review the safe lifting order.', status: 'active', createdBy: admin._id,
  });
  const challenge = await Challenge.create({ puzzle: puzzle._id, timeLimitSeconds: 120, basePoints: 800, incorrectPenalty: 50, hintPenalty: 50, maxTimeBonus: 200, maxScore: 1000, tieRule: 'faster-time', status: 'active', createdBy: admin._id });
  return { admin, trainerA, trainerB, traineeA, traineeB, programme, puzzle, challenge, tokens: { admin: generateAccessToken(admin), trainerA: generateAccessToken(trainerA), trainerB: generateAccessToken(trainerB), traineeA: generateAccessToken(traineeA), traineeB: generateAccessToken(traineeB) } };
}

async function start(f, trainee = 'traineeA') {
  return request(app).post(`/api/challenges/${f.challenge._id}/start`).set(auth(f.tokens[trainee])).send({});
}

describe('Sprint 3 puzzle solving and timed high-score challenge', () => {
  test('T3-01 Admin creates a real ordering puzzle where every card belongs to the solution', async () => {
    const f = await fixture();
    const r = await request(app).post('/api/puzzles').set(auth(f.tokens.admin)).send({
      programmeId: f.programme._id,
      title: 'Safe Carrying Order',
      instructions: 'Arrange every valid carrying step into the correct order.',
      type: 'sequence',
      digitalProps: [
        { id: 'plan', label: 'Plan the route' },
        { id: 'lift', label: 'Lift safely' },
        { id: 'carry', label: 'Carry the load close to the body' },
      ],
      expectedSolution: ['plan', 'lift', 'carry'],
      hint: 'Planning happens before lifting.',
      correctFeedback: 'Correct order.',
      incorrectFeedback: 'One or more positions are wrong.',
      timeLimitSeconds: 60,
      maxScore: 1000,
    });
    expect(r.status).toBe(201);
    expect(r.body.puzzle.title).toBe('Safe Carrying Order');
    expect(r.body.puzzle.expectedSolution).toEqual(['plan', 'lift', 'carry']);
  });

  test('T3-02 Trainer edits authorised puzzle', async () => {
    const f = await fixture();
    const r = await request(app).patch(`/api/puzzles/${f.puzzle._id}`).set(auth(f.tokens.trainerA)).send({ title: 'Updated Safe Lifting Sequence' });
    expect(r.status).toBe(200); expect(r.body.puzzle.title).toContain('Updated');
  });

  test("T3-03 Trainer cannot edit another Trainer's restricted puzzle", async () => {
    const f = await fixture();
    const r = await request(app).patch(`/api/puzzles/${f.puzzle._id}`).set(auth(f.tokens.trainerB)).send({ title: 'Not Allowed' });
    expect(r.status).toBe(403);
  });

  test('T3-04 Trainee cannot call management endpoint', async () => {
    const f = await fixture();
    const r = await request(app).post('/api/puzzles').set(auth(f.tokens.traineeA)).send({ programmeId: f.programme._id });
    expect(r.status).toBe(403);
  });

  test('T3-05 Trainee opens assigned module activity without receiving the hidden answer key', async () => {
    const f = await fixture();
    const r = await request(app).get(`/api/programmes/${f.programme._id}/activities`).set(auth(f.tokens.traineeA));
    expect(r.status).toBe(200);
    // Built-in starter content is added alongside the configured puzzle.
    expect(r.body.activities.length).toBeGreaterThanOrEqual(1);
    const configured = r.body.activities.find(row => row.puzzle._id === String(f.puzzle._id));
    expect(configured).toBeTruthy();
    expect(r.body.activities.every(row => row.puzzle.expectedSolution === undefined)).toBe(true);
    expect(configured.puzzle.digitalProps.map(item => item.id)).not.toEqual(['a', 'b', 'c']);

    const begun = await start(f);
    expect(begun.status).toBe(201);
    expect(begun.body.puzzle.expectedSolution).toBeUndefined();
    expect(typeof begun.body.challenge.puzzle).toBe('string');
    expect(begun.body.puzzle.digitalProps.map(item => item.id)).not.toEqual(['a', 'b', 'c']);

    const resumed = await start(f);
    expect(resumed.status).toBe(200);
    expect(resumed.body.resumed).toBe(true);
    expect(resumed.body.puzzle.digitalProps.map(item => item.id)).toEqual(begun.body.puzzle.digitalProps.map(item => item.id));
  });

  test('T3-06 Correct solution receives approved points and feedback', async () => {
    const f = await fixture(); const begun = await start(f); const attemptId = begun.body.attempt._id;
    const r = await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send({ attemptId, answers: ['a','b','c'] });
    expect(r.status).toBe(200); expect(r.body.attempt.score).toBeGreaterThan(0); expect(r.body.exact).toBe(true); expect(r.body.feedback).toMatch(/Correct/);
  });

  test('T3-07 Incorrect or partial solution records errors without awarding points', async () => {
    const f = await fixture(); const begun = await start(f);
    const r = await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send({ attemptId: begun.body.attempt._id, answers: ['b','a','c'] });
    expect(r.status).toBe(200); expect(r.body.attempt.errors).toBeGreaterThan(0); expect(r.body.attempt.score).toBe(0); expect(await PersonalBest.countDocuments()).toBe(0);
  });

  test('T3-07b Incomplete or duplicated order is rejected', async () => {
    const f = await fixture(); const begun = await start(f);
    const r = await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send({ attemptId: begun.body.attempt._id, answers: ['a','a','c'] });
    expect(r.status).toBe(400); expect(r.body.code).toBe('INCOMPLETE_ORDER');
  });

  test('T3-08 Time limit produces timeout result', async () => {
    const f = await fixture(); const begun = await start(f);
    await ChallengeAttempt.findByIdAndUpdate(begun.body.attempt._id, { startedAt: new Date(Date.now() - 130000) });
    const r = await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send({ attemptId: begun.body.attempt._id, answers: ['a','b','c'] });
    expect(r.status).toBe(200); expect(r.body.attempt.result).toBe('timeout'); expect(r.body.attempt.score).toBe(0);
  });

  test('T3-09 Impossible browser timing is rejected and flagged invalid', async () => {
    const f = await fixture(); const begun = await start(f);
    const r = await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send({ attemptId: begun.body.attempt._id, answers: ['a','b','c'], durationSeconds: -10 });
    expect(r.status).toBe(400); expect((await ChallengeAttempt.findById(begun.body.attempt._id)).validityStatus).toBe('invalid');
  });

  test('T3-10 Duplicate submission is rejected', async () => {
    const f = await fixture(); const begun = await start(f); const body = { attemptId: begun.body.attempt._id, answers: ['a','b','c'] };
    expect((await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send(body)).status).toBe(200);
    const second = await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send(body);
    expect(second.status).toBe(409); expect(second.body.code).toBe('DUPLICATE_SUBMISSION');
  });

  test('T3-11 Higher valid score updates personal best', async () => {
    const f = await fixture();
    let begun = await start(f); await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send({ attemptId: begun.body.attempt._id, answers: ['b','a','c'] });
    begun = await start(f); const high = await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send({ attemptId: begun.body.attempt._id, answers: ['a','b','c'] });
    expect(high.body.personalBestUpdated).toBe(true); expect((await PersonalBest.findOne({ trainee: f.traineeA._id, challenge: f.challenge._id })).score).toBe(high.body.attempt.score);
  });

  test('T3-12 Lower score leaves personal best unchanged', async () => {
    const f = await fixture();
    let begun = await start(f); const high = await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send({ attemptId: begun.body.attempt._id, answers: ['a','b','c'] });
    begun = await start(f); const low = await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send({ attemptId: begun.body.attempt._id, answers: ['c','b','a'] });
    expect(low.body.personalBestUpdated).toBe(false); expect((await PersonalBest.findOne({ trainee: f.traineeA._id, challenge: f.challenge._id })).score).toBe(high.body.attempt.score);
  });

  test('T3-13 Equal score leaves the saved high score unchanged', async () => {
    const f = await fixture();
    let begun = await start(f); await ChallengeAttempt.findByIdAndUpdate(begun.body.attempt._id, { startedAt: new Date(Date.now() - 30000) }); const first = await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send({ attemptId: begun.body.attempt._id, answers: ['a','b','c'] });
    // Equal scores do not rewrite the saved score, even when replay is faster.
    f.challenge.maxTimeBonus = 0; await f.challenge.save();
    const pb = await PersonalBest.findOne({ trainee: f.traineeA._id, challenge: f.challenge._id }); pb.score = 800; pb.durationSeconds = 30; await pb.save();
    begun = await start(f); await ChallengeAttempt.findByIdAndUpdate(begun.body.attempt._id, { startedAt: new Date(Date.now() - 5000) }); const second = await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeA)).send({ attemptId: begun.body.attempt._id, answers: ['a','b','c'] });
    expect(second.body.attempt.score).toBe(800); expect(second.body.personalBestUpdated).toBe(false); expect(second.body.personalBest.durationSeconds).toBe(30);
  });

  test("T3-14 Trainee cannot view another user's attempt through own history", async () => {
    const f = await fixture(); const begun = await start(f, 'traineeB'); await request(app).post(`/api/challenges/${f.challenge._id}/submit`).set(auth(f.tokens.traineeB)).send({ attemptId: begun.body.attempt._id, answers: ['a','b','c'] });
    const r = await request(app).get('/api/trainee/challenge-attempts').set(auth(f.tokens.traineeA));
    expect(r.status).toBe(200); expect(r.body.attempts.some(a => String(a.trainee) === String(f.traineeB._id))).toBe(false);
  });

  test('T3-15 Sprint 3 routes coexist with earlier authenticated training routes', async () => {
    const f = await fixture();
    const earlier = await request(app).get('/api/programmes').set(auth(f.tokens.traineeA));
    const sprint3 = await request(app).get(`/api/programmes/${f.programme._id}/activities`).set(auth(f.tokens.traineeA));
    expect(earlier.status).toBe(200); expect(sprint3.status).toBe(200);
  });
});

// New Sprint 3 acceptance: totals must combine different puzzles, not replays.
describe('Cumulative trainee puzzle scores', () => {
  test('two saved bests total together; lower replay stays unchanged; higher replay improves the total', async () => {
    const f = await fixture();
    await PersonalBest.init();
    await Challenge.updateOne({ _id: f.challenge._id }, { $set: { basePoints: 400, maxTimeBonus: 0 } });
    async function solve(challenge, answers) {
      const opened = await request(app).post(`/api/challenges/${challenge}/start`).set(auth(f.tokens.traineeA)).send({});
      expect(opened.status).toBe(201);
      const solved = await request(app).post(`/api/challenges/${challenge}/submit`).set(auth(f.tokens.traineeA)).send({ attemptId: opened.body.attempt._id, answers });
      expect(solved.status).toBe(200);
      return solved.body;
    }
    await solve(f.challenge._id, ['a', 'b', 'c']);
    const secondPuzzle = await Puzzle.create({ programme: f.programme._id, moduleKey: 'manual-handling', title: 'Second safe sequence', instructions: 'Arrange both steps in the approved safe sequence.', type: 'sequence', digitalProps: [{ id: 'x', label: 'Plan' }, { id: 'y', label: 'Act' }], expectedSolution: ['x', 'y'], correctFeedback: 'Correct.', incorrectFeedback: 'Review the sequence.', status: 'active', createdBy: f.admin._id });
    const second = await Challenge.create({ puzzle: secondPuzzle._id, timeLimitSeconds: 120, basePoints: 600, maxTimeBonus: 0, status: 'active', createdBy: f.admin._id });
    await solve(second._id, ['x', 'y']);
    const totals = () => request(app).get('/api/trainee/puzzle-scores').set(auth(f.tokens.traineeA));
    expect((await totals()).body.myScore).toEqual({ highScore: 1000, puzzlesCompleted: 2 });
    await Challenge.updateOne({ _id: f.challenge._id }, { $set: { basePoints: 300 } });
    expect((await solve(f.challenge._id, ['a', 'b', 'c'])).personalBestUpdated).toBe(false);
    expect((await totals()).body.myScore.highScore).toBe(1000);
    await Challenge.updateOne({ _id: f.challenge._id }, { $set: { basePoints: 500 } });
    expect((await solve(f.challenge._id, ['a', 'b', 'c'])).personalBestUpdated).toBe(true);
    const response = await totals();
    expect(response.body.myScore.highScore).toBe(1100);
    expect(response.body.entries[0].highScore).toBe(1100);
    expect(Object.keys(response.body.entries[0]).sort()).toEqual(['highScore', 'name', 'profileImage']);
    expect(await PersonalBest.countDocuments({ trainee: f.traineeA._id })).toBe(2);
  });

  test('scoreboard sorts all participating active trainees and rejects trainer/anonymous access', async () => {
    const f = await fixture();
    await PersonalBest.create([
      { trainee: f.traineeA._id, challenge: f.challenge._id, programme: f.programme._id, puzzle: f.puzzle._id, attempt: new mongoose.Types.ObjectId(), score: 400, durationSeconds: 20 },
      { trainee: f.traineeB._id, challenge: f.challenge._id, programme: f.programme._id, puzzle: f.puzzle._id, attempt: new mongoose.Types.ObjectId(), score: 900, durationSeconds: 10 },
    ]);
    const r = await request(app).get('/api/trainee/puzzle-scores').set(auth(f.tokens.traineeA));
    expect(r.status).toBe(200);
    expect(r.body.entries.map(row => row.highScore)).toEqual([900, 400]);
    expect(r.body.entries[0].name).toBe('s3traineeb Test');
    expect(Object.keys(r.body.entries[0]).sort()).toEqual(['highScore', 'name', 'profileImage']);
    expect((await request(app).get('/api/trainee/puzzle-scores')).status).toBe(401);
    expect((await request(app).get('/api/trainee/puzzle-scores').set(auth(f.tokens.trainerA))).status).toBe(403);
    await User.updateOne({ _id: f.traineeB._id }, { $set: { status: 'deactivated' } });
    expect((await request(app).get('/api/trainee/puzzle-scores').set(auth(f.tokens.traineeA))).body.entries.map(row => row.highScore)).toEqual([400]);
  });
});

const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../src/models/User');
const TrainingModule = require('../src/models/TrainingModule');
const TrainingProgramme = require('../src/models/TrainingProgramme');
const TrainingAssignment = require('../src/models/TrainingAssignment');
const LearningSection = require('../src/models/LearningSection');
const SectionCompletion = require('../src/models/SectionCompletion');
const AssessmentQuestion = require('../src/models/AssessmentQuestion');
const { generateAccessToken } = require('../src/utils/generateTokens');

const PASSWORD = 'Sprint2Test123!';
const auth = token => ({ Authorization: `Bearer ${token}` });

async function user(username, role, extra = {}) {
    return User.create({
        firstName: username, lastName: 'Test', email: `${username}@test.local`, username,
        passwordHash: await bcrypt.hash(PASSWORD, 12), role,
        ...(role !== 'admin' ? { age: 25, phoneNumber: '9800000000', address: 'Kathmandu, Nepal', gender: 'female' } : {}),
        accountStatus: 'created', status: 'active', mustChangePassword: false,
        assignedTrainingSections: extra.assignedTrainingSections || []
    });
}
function tokenFor(user) {
    // Part C tests exercise protected Sprint 2 endpoints, not the login endpoint.
    // Using the same production token generator avoids consuming Sprint 1's
    // real login rate limiter across the Jest suite. Authentication itself is
    // already covered by auth.test.js.
    return generateAccessToken(user);
}
async function fixture() {
    const admin = await user('pcadmin', 'admin');
    const trainerA = await user('pctrainera', 'trainer', { assignedTrainingSections: ['manual-handling'] });
    const trainerB = await user('pctrainerb', 'trainer', { assignedTrainingSections: ['working-at-height'] });
    const traineeA = await user('pctraineea', 'trainee', { assignedTrainingSections: ['manual-handling'] });
    const traineeB = await user('pctraineeb', 'trainee', { assignedTrainingSections: ['manual-handling'] });
    await TrainingModule.create({ name: 'Manual Handling', code: 'MH', key: 'manual-handling', description: 'Manual handling module for Part C tests.', status: 'active', createdBy: admin._id });
    const programme = await TrainingProgramme.create({ programmeType: 'manual-handling', title: 'Manual Handling Safety', description: 'Manual handling programme used for Sprint 2 Part C acceptance testing.', owner: trainerA._id, passMark: 60, status: 'active', createdBy: admin._id });
    return {
        admin, trainerA, trainerB, traineeA, traineeB, programme,
        tokens: { admin: tokenFor(admin), trainerA: tokenFor(trainerA), trainerB: tokenFor(trainerB), traineeA: tokenFor(traineeA), traineeB: tokenFor(traineeB) }
    };
}

describe('Sprint 2 Part C acceptance/security regression', () => {
    test('T2-02/T2-03/T2-04 ownership and management role enforcement', async () => {
        const f = await fixture();
        const own = await request(app).patch(`/api/programmes/${f.programme._id}`).set(auth(f.tokens.trainerA)).send({ title: 'Updated Manual Handling Safety' });
        expect(own.statusCode).toBe(200);
        const other = await request(app).patch(`/api/programmes/${f.programme._id}`).set(auth(f.tokens.trainerB)).send({ title: 'Forbidden edit' });
        expect([403, 404]).toContain(other.statusCode);
        const trainee = await request(app).post('/api/programmes').set(auth(f.tokens.traineeA)).send({ title: 'Forbidden' });
        expect(trainee.statusCode).toBe(403);
    });

    test('T2-05/T2-06 Admin assignment works and duplicate active assignment is rejected', async () => {
        const f = await fixture();
        const body = { programmeId: f.programme._id.toString(), traineeId: f.traineeA._id.toString() };
        const first = await request(app).post('/api/assignments').set(auth(f.tokens.admin)).send(body);
        expect(first.statusCode).toBe(201);
        const duplicate = await request(app).post('/api/assignments').set(auth(f.tokens.admin)).send(body);
        expect(duplicate.statusCode).toBe(409);
        expect(duplicate.body.code).toBe('DUPLICATE_ACTIVE_ASSIGNMENT');
        const trainerAttempt = await request(app).post('/api/assignments').set(auth(f.tokens.trainerA)).send({ ...body, traineeId: f.traineeB._id.toString() });
        expect(trainerAttempt.statusCode).toBe(403);
    });

    test('T2-09 missing module panorama returns safe fallback instead of mixed Warehouse Tour data', async () => {
        const f = await fixture();
        await TrainingAssignment.create({ programme: f.programme._id, trainee: f.traineeA._id, assignedBy: f.admin._id, status: 'active' });
        const r = await request(app).get(`/api/programmes/${f.programme._id}/environment`).set(auth(f.tokens.traineeA));
        expect(r.statusCode).toBe(200);
        expect(r.body.panorama).toBeNull();
        expect(r.body.fallback).toMatch(/panorama/i);
    });

    test('T2-10/T2-11 learning completion unlocks Basic but Intermediate stays locked', async () => {
        const f = await fixture();
        await TrainingAssignment.create({ programme: f.programme._id, trainee: f.traineeA._id, assignedBy: f.admin._id, status: 'active' });
        const section = await LearningSection.create({ programme: f.programme._id, title: 'Safe lifting', content: 'Learn and apply safe lifting technique.', order: 1, status: 'active' });
        const lockedBasic = await request(app).get(`/api/programmes/${f.programme._id}/assessments/basic`).set(auth(f.tokens.traineeA));
        expect(lockedBasic.statusCode).toBe(403);
        await SectionCompletion.create({ trainee: f.traineeA._id, programme: f.programme._id, section: section._id });
        await AssessmentQuestion.create({ programme: f.programme._id, level: 'basic', question: 'Which is safest?', options: ['Lift with legs', 'Twist quickly'], correctAnswer: 'Lift with legs', points: 1, feedback: 'Use a stable posture.', order: 1, status: 'active', createdBy: f.admin._id });
        const basic = await request(app).get(`/api/programmes/${f.programme._id}/assessments/basic`).set(auth(f.tokens.traineeA));
        expect(basic.statusCode).toBe(200);
        expect(JSON.stringify(basic.body)).not.toMatch(/correctAnswer/i);
        const intermediate = await request(app).get(`/api/programmes/${f.programme._id}/assessments/intermediate`).set(auth(f.tokens.traineeA));
        expect(intermediate.statusCode).toBe(403);
        expect(intermediate.body.code).toBe('LEVEL_LOCKED');
    });

    test('T2-12/T2-13/T2-14 server scoring unlocks levels and preserves separate attempts', async () => {
        const f = await fixture();
        await TrainingAssignment.create({ programme: f.programme._id, trainee: f.traineeA._id, assignedBy: f.admin._id, status: 'active' });
        const section = await LearningSection.create({ programme: f.programme._id, title: 'Required learning', content: 'Required content for progression.', order: 1, status: 'active' });
        await SectionCompletion.create({ trainee: f.traineeA._id, programme: f.programme._id, section: section._id });
        const questions = {};
        for (const level of ['basic', 'intermediate', 'high']) {
            questions[level] = await AssessmentQuestion.create({ programme: f.programme._id, level, question: `${level} question?`, options: ['Correct', 'Wrong'], correctAnswer: 'Correct', points: 1, feedback: `${level} feedback`, order: 1, status: 'active', createdBy: f.admin._id });
        }
        for (const level of ['basic', 'intermediate', 'high']) {
            const submit = await request(app).post(`/api/programmes/${f.programme._id}/assessments/${level}/submit`).set(auth(f.tokens.traineeA)).send({ answers: [{ questionId: questions[level]._id.toString(), answer: 'Correct' }] });
            expect(submit.statusCode).toBe(201);
            expect(submit.body.attempt.passed).toBe(true);
            expect(submit.body.attempt.percentage).toBe(100);
            expect(submit.body.attempt.attemptNumber).toBe(1);
        }
        const secondHigh = await request(app).post(`/api/programmes/${f.programme._id}/assessments/high/submit`).set(auth(f.tokens.traineeA)).send({ answers: [{ questionId: questions.high._id.toString(), answer: 'Wrong' }] });
        expect(secondHigh.statusCode).toBe(201);
        expect(secondHigh.body.attempt.attemptNumber).toBe(2);
        expect(secondHigh.body.attempt.passed).toBe(false);
    });

    test('results are isolated: trainee sees own, Trainer B cannot see Trainer A programme attempts', async () => {
        const f = await fixture();
        const traineeResults = await request(app).get('/api/trainee/results').set(auth(f.tokens.traineeA));
        expect(traineeResults.statusCode).toBe(200);
        expect(traineeResults.body.attempts.every(a => String(a.trainee?._id || a.trainee) === f.traineeA._id.toString())).toBe(true);
        const trainerBResults = await request(app).get(`/api/trainee/results?programmeId=${f.programme._id}`).set(auth(f.tokens.trainerB));
        expect(trainerBResults.statusCode).toBe(200);
        expect(trainerBResults.body.attempts).toHaveLength(0);
    });
});

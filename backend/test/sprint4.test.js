const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../src/models/User');
const Module = require('../src/models/TrainingModule');
const Programme = require('../src/models/TrainingProgramme');
const Assignment = require('../src/models/TrainingAssignment');
const Section = require('../src/models/LearningSection');
const Completion = require('../src/models/SectionCompletion');
const Scenario = require('../src/models/Scenario');
const ScenarioAttempt = require('../src/models/ScenarioAttempt');
const Question = require('../src/models/AssessmentQuestion');
const Assessment = require('../src/models/AssessmentAttempt');
const Progress = require('../src/models/TrainingProgress');
const Notification = require('../src/models/Notification');
const BadgeAward = require('../src/models/BadgeAward');
const AuditLog = require('../src/models/AuditLog');
const { notify } = require('../src/services/notificationService');
const { calculateAssignments } = require('../src/services/trainingProgressService');
const { generateAccessToken, generateRefreshToken } = require('../src/utils/generateTokens');
const header = u => ({ Authorization: `Bearer ${generateAccessToken(u)}` });
const own = f => `/api/users/me/training-progress/programmes/${f.programme._id}`;
const legacy = f => `/api/training-content/trainee/${f.programme._id}`;
async function user(name, role, keys = []) {
    return User.create({ username: name, firstName: name, lastName: 'Test', email: `${name}@example.invalid`, role, passwordHash: 'fixture-only', accountStatus: 'created', status: 'active', mustChangePassword: false, assignedTrainingSections: keys, ...(role !== 'admin' ? { age: 25, phoneNumber: '9800000000', address: 'Kathmandu', gender: 'female' } : {}) });
}
async function fixture() {
    const admin = await user('s4admin', 'admin');
    const trainer = await user('s4trainer', 'trainer', ['manual-handling']);
    const otherTrainer = await user('s4othertrainer', 'trainer', ['manual-handling']);
    const trainee = await user('s4trainee', 'trainee', ['manual-handling']);
    const other = await user('s4other', 'trainee', ['manual-handling']);
    const module = await Module.create({ key: 'manual-handling', code: 'MH', name: 'Manual Handling', description: 'Learn workplace lifting procedures.', createdBy: admin._id });
    const programme = await Programme.create({ programmeType: module.key, title: 'Beginner safe lifting', shortDescription: 'Learn safe workplace lifting.', description: 'Study the correct procedures for moving loads.', learningObjectives: 'Complete the learning, exercise and assessment.', owner: trainer._id, passMark: 70, createdBy: admin._id, authorizedTrainers: [] });
    const assignment = await Assignment.create({ trainee: trainee._id, programme: programme._id, assignedBy: admin._id });
    const sections = await Section.create([1, 2].map(order => ({ programme: programme._id, title: `Learning ${order}`, content: 'Review this required lifting procedure.', order, status: 'active', createdBy: admin._id })));
    const scenario = await Scenario.create({ programme: programme._id, title: 'Load hazard', prompt: 'Choose the safe action.', options: ['Inspect', 'Rush'], correctResponses: ['Inspect'], type: 'hazard', status: 'active', createdBy: admin._id });
    const question = await Question.create({ programme: programme._id, level: 'basic', question: 'What is safe?', options: ['Inspect', 'Rush'], correctAnswer: 'Inspect', points: 1, status: 'active', createdBy: admin._id });
    return { admin, trainer, otherTrainer, trainee, other, module, programme, assignment, sections, scenario, question };
}
async function learn(f, count = 2) { for (const section of f.sections.slice(0, count)) await Completion.create({ trainee: f.trainee._id, programme: f.programme._id, section: section._id }); }
async function exercise(f, correct = true) { return ScenarioAttempt.create({ trainee: f.trainee._id, programme: f.programme._id, assignment: f.assignment._id, scenarioSet: [f.scenario._id], responses: [{ scenario: f.scenario._id, responses: [correct ? 'Inspect' : 'Rush'], correct, answeredAt: new Date() }], status: 'submitted', score: correct ? 1 : 0, totalScenarios: 1, percentage: correct ? 100 : 0, attemptNumber: 1, submittedAt: new Date() }); }
async function assess(f, passed) { return Assessment.create({ trainee: f.trainee._id, programme: f.programme._id, assignment: f.assignment._id, questionSet: [f.question._id], answers: [{ question: f.question._id, answer: passed ? 'Inspect' : 'Rush', correct: passed, pointsAwarded: passed ? 1 : 0 }], level: 'basic', status: 'submitted', score: passed ? 1 : 0, totalPoints: 1, percentage: passed ? 100 : 0, passed, passMark: 70, attemptNumber: 1, submittedAt: new Date() }); }

describe('Sprint 4 progress and result integrity', () => {
    test('S4-P01 no activity and opening a panorama earn no completion', async () => {
        const f = await fixture();
        expect((await request(app).get(`/api/programmes/${f.programme._id}/environment`).set(header(f.trainee))).status).toBe(200);
        const r = await request(app).get(own(f)).set(header(f.trainee));
        expect(r.status).toBe(200); expect(r.body.progress.statusLabel).toBe('Not Started'); expect(r.body.progress.progress).toBe(0); expect(r.body.progress.completedAt).toBeNull();
    });
    test('S4-P02 partial and complete learning are calculated from completion rows', async () => {
        const f = await fixture(); await learn(f, 1);
        let r = await request(app).get(own(f)).set(header(f.trainee));
        expect(r.body.progress.progress).toBe(33); expect(r.body.progress.learning.completed).toBe(1);
        await Completion.create({ trainee: f.trainee._id, programme: f.programme._id, section: f.sections[1]._id });
        r = await request(app).get(own(f)).set(header(f.trainee));
        expect(r.body.progress.progress).toBe(67); expect(r.body.progress.status).toBe('in-progress');
    });
    test('S4-P03 completed hazard exercise is distinct from success', async () => {
        const f = await fixture(); await learn(f); await exercise(f, false);
        const r = await request(app).get(own(f)).set(header(f.trainee));
        expect(r.body.progress.progress).toBe(67); expect(r.body.progress.hazards.completed).toBe(1); expect(r.body.progress.hazards.successful).toBe(0);
        expect(await BadgeAward.countDocuments()).toBe(0);
    });
    test('S4-P04 failed quiz starts a retry cycle and cannot complete', async () => {
        const f = await fixture(); await learn(f); await exercise(f); await assess(f, false);
        const r = await request(app).get(own(f)).set(header(f.trainee));
        expect(r.body.progress.assessment.passed).toBe(false); expect(r.body.progress.progress).toBe(0); expect(r.body.progress.statusLabel).toBe('In Progress');
    });
    test('S4-P05 passed quiz without learning evidence cannot complete', async () => {
        const f = await fixture(); await assess(f, true);
        const r = await request(app).get(own(f)).set(header(f.trainee));
        expect(r.body.progress.assessment.passed).toBe(true); expect(r.body.progress.status).toBe('in-progress'); expect(r.body.progress.progress).toBe(33);
    });
    test('S4-P06 fully completed programme has stored date and stable unique badges', async () => {
        const f = await fixture(); await learn(f); await assess(f, true);
        let r = await request(app).get(own(f)).set(header(f.trainee));
        expect(r.body.progress.progress).toBe(100); expect(r.body.progress.statusLabel).toBe('Completed'); expect(r.body.progress.completedAt).toBeTruthy();
        expect((await Progress.findOne({ trainee: f.trainee._id, programme: f.programme._id })).completedAt).toBeInstanceOf(Date);
        r = await request(app).get('/api/users/me/badges').set(header(f.trainee)); expect(r.status).toBe(200); expect(r.body.badges).toHaveLength(2);
        expect(r.body.badges.every(award => award.programme?.title === f.programme.title)).toBe(true);
        await request(app).get('/api/users/me/badges').set(header(f.trainee)); expect(await BadgeAward.countDocuments({ trainee: f.trainee._id })).toBe(2);
    });
    test('S4-P07 forged progress cache cannot earn progress or unlock assessment', async () => {
        const f = await fixture(); await Progress.create({ trainee: f.trainee._id, programme: f.programme._id, assignment: f.assignment._id, basicPassed: true, scenarioCompleted: true, learningCompleted: true, progress: 100, status: 'completed' });
        const r = await request(app).get(own(f)).set(header(f.trainee)); expect(r.body.progress.progress).toBe(0);
        expect((await request(app).get(`${legacy(f)}/assessments/basic`).set(header(f.trainee))).status).toBe(403);
        expect((await request(app).get('/api/users/me/badges').set(header(f.trainee))).body.badges).toHaveLength(0);
    });
    test('S4-P08 missing media does not remove stored progress', async () => {
        const f = await fixture(); await learn(f, 1);
        await request(app).get('/uploads/panoramas/missing.png');
        expect((await request(app).get(own(f)).set(header(f.trainee))).body.progress.progress).toBe(33);
        expect(await Completion.countDocuments({ trainee: f.trainee._id })).toBe(1);
    });
    test.each(['score', 'passed', 'completed', 'progress', 'badgeQualified', 'traineeId'])('S4-P09 rejects browser-managed %s field', async field => {
        const f = await fixture();
        const r = await request(app).post(`${legacy(f)}/sections/${f.sections[0]._id}/complete`).set(header(f.trainee)).send({ [field]: field === 'traineeId' ? String(f.other._id) : 100 });
        expect(r.status).toBe(400); expect(r.body.code).toBe('SERVER_MANAGED_FIELD'); expect(await Completion.countDocuments()).toBe(0);
    });
    test('S4-P10 own identity, malformed IDs, missing programme and unauthenticated access', async () => {
        const f = await fixture();
        expect((await request(app).get('/api/users/me/training-progress').set(header(f.trainee)).query({ traineeId: String(f.other._id) })).status).toBe(400);
        expect((await request(app).get('/api/users/me/training-progress/programmes/no').set(header(f.trainee))).status).toBe(400);
        expect((await request(app).get('/api/users/me/training-progress/programmes/aaaaaaaaaaaaaaaaaaaaaaaa').set(header(f.trainee))).status).toBe(404);
        expect((await request(app).get(own(f))).status).toBe(401);
        expect((await request(app).get(own(f)).set(header(f.trainer))).status).toBe(403);
    });
    test('S4-P11 wrong programme/trainee evidence is ignored', async () => {
        const f = await fixture(); await Completion.create({ trainee: f.other._id, programme: f.programme._id, section: f.sections[0]._id });
        const r = await request(app).get(own(f)).set(header(f.trainee)); expect(r.body.progress.learning.completed).toBe(0);
    });
    test('S4-P12 a zero-point legacy pass cannot unlock assessment or earn a badge', async () => {
        const f = await fixture();
        await Assessment.create({ trainee: f.trainee._id, programme: f.programme._id, assignment: f.assignment._id, level: 'basic', status: 'submitted', score: 0, totalPoints: 0, percentage: 100, passed: true, attemptNumber: 1, submittedAt: new Date() });
        expect((await request(app).get(own(f)).set(header(f.trainee))).body.progress.assessment.passed).toBe(false);
        expect((await request(app).get(`${legacy(f)}/assessments/basic`).set(header(f.trainee))).status).toBe(403);
        expect((await request(app).get('/api/users/me/badges').set(header(f.trainee))).body.badges).toHaveLength(0);
    });
    test('S4-P13 tied submission dates still select the newest stored assessment', async () => {
        const f = await fixture(); await learn(f); await exercise(f);
        const submittedAt = new Date();
        for (const passed of [true, false]) await Assessment.create({ trainee: f.trainee._id, programme: f.programme._id, assignment: f.assignment._id, level: 'basic', status: 'submitted', score: passed ? 1 : 0, totalPoints: 1, percentage: passed ? 100 : 0, passed, attemptNumber: passed ? 1 : 2, submittedAt });
        const r = await request(app).get(own(f)).set(header(f.trainee));
        expect(r.body.progress.assessment.passed).toBe(false); expect(r.body.progress.assessment.latestScore).toBe(0); expect(r.body.progress.status).toBe('in-progress'); expect(r.body.progress.completedAt).toBeNull();
    });
});

describe('Sprint 4 trainer and admin scope', () => {
    test('S4-T01 owner trainer sees only assigned-programme records; admin sees all', async () => {
        const f = await fixture();
        const r = await request(app).get('/api/trainer/monitoring').set(header(f.trainer)); expect(r.status).toBe(200); expect(r.body.trainees).toHaveLength(1); expect(r.body.trainees[0].trainee._id).toBe(String(f.trainee._id)); expect(r.text).not.toContain('email');
        expect((await request(app).get('/api/trainer/monitoring').set(header(f.admin))).body.trainees).toHaveLength(1);
        expect((await request(app).get('/api/trainer/monitoring').set(header(f.trainee))).status).toBe(403);
    });
    test('S4-T02 another trainer and direct trainee/programme ID changes are denied', async () => {
        const f = await fixture();
        expect((await request(app).get(`/api/trainer/monitoring/trainees/${f.trainee._id}`).set(header(f.otherTrainer))).status).toBe(404);
        expect((await request(app).get(`/api/trainer/monitoring/trainees/${f.other._id}`).set(header(f.trainer))).status).toBe(404);
        expect((await request(app).get('/api/trainer/monitoring').set(header(f.otherTrainer)).query({ programmeId: String(f.programme._id) })).status).toBe(404);
        expect((await request(app).get(`/api/programmes/${f.programme._id}/questions`).set(header(f.otherTrainer))).status).toBe(403);
    });
    test('S4-T03 revoking a trainer module prevents monitoring, content and result access', async () => {
        const f = await fixture(); await User.updateOne({ _id: f.trainer._id }, { $set: { assignedTrainingSections: ['working-at-height'] } });
        expect((await request(app).get(`/api/trainer/monitoring/trainees/${f.trainee._id}`).set(header(f.trainer))).status).toBe(404);
        expect((await request(app).get(`/api/programmes/${f.programme._id}/manage/scenarios`).set(header(f.trainer))).status).toBe(403);
        const r = await request(app).get(`/api/training-programmes/${f.programme._id}`).set(header(f.trainer)); expect([403, 404]).toContain(r.status);
    });
    test('S4-R01 accurate empty/complete reports and role restrictions', async () => {
        const f = await fixture(); await learn(f); await exercise(f); await assess(f, true);
        const r = await request(app).get('/api/admin/reports').set(header(f.admin)); expect(r.status).toBe(200);
        expect(r.body.report.users.total).toBe(5); expect(r.body.report.users.trainees).toBe(2); expect(r.body.report.progress.completed).toBe(1); expect(r.body.report.assessments.totalAttempts).toBe(1); expect(r.body.report.assessments.averageScore).toBe(100); expect(r.body.report.hazards.successfulResponses).toBe(1);
        expect((await request(app).get('/api/admin/reports').set(header(f.trainer))).status).toBe(403); expect((await request(app).get('/api/admin/reports').set(header(f.trainee))).status).toBe(403);
        const filtered = await request(app).get('/api/admin/reports').set(header(f.admin)).query({ status: 'not-started' }); expect(filtered.body.report.assessments.totalAttempts).toBe(0);
    });
    test.each([{ role: 'root' }, { status: '100%' }, { from: '2026-10-05', to: '2026-10-01' }, { from: '2026-02-30' }, { programmeId: 'bad' }, { role: ['trainee', 'admin'] }])('S4-R02 invalid report filters rejected %j', async query => {
        const f = await fixture(); const r = await request(app).get('/api/admin/reports').set(header(f.admin)).query(query); expect(r.status).toBe(400); expect(r.text).not.toContain('stack');
    });
});

describe('Sprint 4 notifications, badges, audit and sessions', () => {
    test('S4-N01 correct recipients, unread count and idempotent read', async () => {
        const f = await fixture(); const n = await notify(f.trainee._id, { eventKey: 'test-own', type: 'progress', message: 'Your progress event.' });
        await notify(f.other._id, { eventKey: 'test-other', type: 'progress', message: 'Private other event.' });
        let r = await request(app).get('/api/notifications').set(header(f.trainee)); expect(r.status).toBe(200); expect(r.text).not.toContain('Private other'); expect(r.body.unreadCount).toBeGreaterThan(0);
        r = await request(app).patch(`/api/notifications/${n._id}/read`).set(header(f.trainee)).send({ recipient: String(f.other._id), read: false }); expect(r.status).toBe(200); expect(r.body.notification.read).toBe(true);
        const readAt = r.body.notification.readAt; r = await request(app).patch(`/api/notifications/${n._id}/read`).set(header(f.trainee)); expect(r.body.notification.readAt).toBe(readAt);
        await request(app).patch('/api/notifications/read-all').set(header(f.trainee)); expect((await request(app).get('/api/notifications/unread-count').set(header(f.trainee))).body.unreadCount).toBe(0);
        expect(await Notification.countDocuments({ recipient: f.other._id, read: false })).toBeGreaterThan(0);
    });
    test('S4-N02 wrong recipient and notification creation are denied', async () => {
        const f = await fixture(); const n = await notify(f.other._id, { eventKey: 'private', type: 'result', message: 'Private' });
        expect((await request(app).patch(`/api/notifications/${n._id}/read`).set(header(f.trainee))).status).toBe(404);
        expect((await request(app).post('/api/notifications').set(header(f.trainee)).send({ recipient: String(f.other._id), message: 'Forged' })).status).toBe(404);
        expect((await request(app).patch('/api/notifications/bad/read').set(header(f.trainee))).status).toBe(400);
    });
    test('S4-B01 no direct badge award or other trainee badge access', async () => {
        const f = await fixture(); expect((await request(app).post('/api/users/me/badges').set(header(f.trainee)).send({ badgeQualified: true })).status).toBe(400);
        expect((await request(app).get('/api/users/me/badges').set(header(f.trainee)).query({ traineeId: String(f.other._id) })).status).toBe(400);
        expect(await BadgeAward.countDocuments()).toBe(0);
    });
    test('S4-A01 actual admin updates/deletes contain actor, target, redacted before/after', async () => {
        const f = await fixture();
        const r = await request(app).patch(`/api/training-modules/${f.module._id}`).set(header(f.admin)).send({ description: 'Updated authoritative module description.' }); expect(r.status).toBe(200);
        const log = await AuditLog.findOne({ targetType: 'TrainingModule', targetId: f.module._id, action: 'TRAININGMODULE_UPDATED' }); expect(String(log.user)).toBe(String(f.admin._id)); expect(log.before.description).toBe(f.module.description); expect(log.after.description).toBe('Updated authoritative module description.');
        const d = await request(app).delete(`/api/admin/users/${f.other._id}`).set(header(f.admin)); expect(d.status).toBe(200);
        const deleted = await AuditLog.findOne({ targetType: 'User', targetId: f.other._id, action: 'USER_DELETED' }); expect(deleted.after).toBeNull(); expect(deleted.before.passwordHash).toBeUndefined(); expect(deleted.before.email).toBeUndefined();
        expect((await request(app).get('/api/admin/audit-logs').set(header(f.trainer))).status).toBe(403);
        expect((await request(app).patch(`/api/admin/audit-logs/${log._id}`).set(header(f.admin)).send({ action: 'fake' })).status).toBe(404);
    });
    test.each([{ page: '0' }, { limit: '101' }, { limit: '1e3' }, { page: '1.5' }])('S4-V01 bounded pagination %j', async query => { const f = await fixture(); expect((await request(app).get('/api/notifications').set(header(f.trainee)).query(query)).status).toBe(400); });
    test('S4-S01 logout revokes current access and refresh sessions', async () => {
        const f = await fixture(); const token = generateAccessToken(f.trainee);
        expect((await request(app).post('/api/auth/logout').set({ Authorization: `Bearer ${token}` })).status).toBe(200);
        expect((await request(app).get('/api/notifications').set({ Authorization: `Bearer ${token}` })).status).toBe(401);
    });
    test('S4-S02 refresh tokens compare their complete digest and reject another signed token', async () => {
        const f = await fixture(); const password = 'ValidLongPassword123!'; await User.updateOne({ _id: f.trainee._id }, { passwordHash: await bcrypt.hash(password, 10) });
        const login = await request(app).post('/api/auth/login').send({ username: f.trainee.username, password }); expect(login.status).toBe(200);
        const cookie = login.headers['set-cookie'][0].split(';')[0];
        expect((await request(app).post('/api/auth/refresh').set('Cookie', cookie)).status).toBe(200);
        const altered = jwt.sign({ id: f.trainee._id, authVersion: 0, extra: 'different token' }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        expect((await request(app).post('/api/auth/refresh').set('Cookie', `refreshToken=${altered}`)).status).toBe(401);
    });
    test('S4-S03 inactive accounts and forged role claims cannot reach admin reports', async () => {
        const f = await fixture(); const forged = jwt.sign({ id: f.trainee._id, role: 'admin', authVersion: 0 }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        expect((await request(app).get('/api/admin/reports').set({ Authorization: `Bearer ${forged}` })).status).toBe(403);
        await User.updateOne({ _id: f.trainee._id }, { status: 'deactivated' }); expect((await request(app).get('/api/notifications').set(header(f.trainee))).status).toBe(403);
    });
});

describe('Sprint 4 deployment and content audit', () => {
    test('S4-D01 health check uses the database connection', async () => { expect((await request(app).get('/api/health')).status).toBe(200); });
    test('S4-D02 renaming a module preserves its assignment key', async () => {
        const f = await fixture(); const r = await request(app).patch(`/api/training-modules/${f.module._id}`).set(header(f.admin)).send({ name: 'Safe Manual Handling' }); expect(r.status).toBe(200); expect(r.body.module.key).toBe('manual-handling');
        expect((await request(app).get(`/api/programmes/${f.programme._id}/questions`).set(header(f.trainer))).status).toBe(200);
    });
    test('S4-D03 inserted assessment bank content has server actor and targets', async () => {
        const f = await fixture(); const r = await request(app).post(`/api/programmes/${f.programme._id}/questions/ensure-bank`).set(header(f.admin)).send({}); expect(r.status).toBe(200);
        const logs = await AuditLog.find({ user: f.admin._id, action: 'ASSESSMENTQUESTION_CREATED', targetType: 'AssessmentQuestion' }).lean(); expect(logs.length).toBeGreaterThan(0); expect(logs.every(log => log.targetId && log.after.programme === String(f.programme._id))).toBe(true);
    });
    test('S4-D04 malformed JSON has a safe structured error', async () => {
        const r = await request(app).post('/api/auth/login').set('Content-Type', 'application/json').send('{"invalid":'); expect(r.status).toBe(400); expect(r.body.code).toBe('INVALID_INPUT'); expect(r.text).not.toContain('SyntaxError');
    });
    test('S4-D05 display mode persists per authenticated user and rejects unsupported values', async () => {
        const f = await fixture();
        let r = await request(app).patch('/api/users/me/display-mode').set(header(f.trainee)).send({ displayMode: 'dark' });
        expect(r.status).toBe(200); expect(r.body.displayMode).toBe('dark');
        r = await request(app).get('/api/users/me').set(header(f.trainee)); expect(r.status).toBe(200); expect(r.body.user.displayMode).toBe('dark');
        r = await request(app).patch('/api/users/me/display-mode').set(header(f.trainee)).send({ displayMode: 'system' });
        expect(r.status).toBe(400); expect(r.body.code).toBe('INVALID_DISPLAY_MODE');
    });
});

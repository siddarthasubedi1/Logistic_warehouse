const request = require('supertest');
const app = require('../app');
const User = require('../src/models/User');
const TrainingModule = require('../src/models/TrainingModule');
const TrainingProgramme = require('../src/models/TrainingProgramme');
const TrainingAssignment = require('../src/models/TrainingAssignment');
const TrainingProgress = require('../src/models/TrainingProgress');
const LearningSection = require('../src/models/LearningSection');
const SectionCompletion = require('../src/models/SectionCompletion');
const Scenario = require('../src/models/Scenario');
const ScenarioAttempt = require('../src/models/ScenarioAttempt');
const AssessmentAttempt = require('../src/models/AssessmentAttempt');
const Challenge = require('../src/models/Challenge');
const ChallengeAttempt = require('../src/models/ChallengeAttempt');
const { generateAccessToken } = require('../src/utils/generateTokens');
const { repairModuleSimulationContent } = require('../src/services/repairModuleSimulationContent');
const { simulationTemplate, simulationDraftForProgramme } = require('../../shared/simulationTemplates.mjs');
const { validateSimulation } = require('../../shared/simulationEngine.mjs');

const keys = ['manual-handling', 'working-at-height', 'cyber-awareness'];
const header = user => ({ Authorization: `Bearer ${generateAccessToken(user)}` });
async function fixture() {
    const admin = await User.create({ username: 'moduleadmin', firstName: 'Module', lastName: 'Admin', email: 'moduleadmin@example.invalid', passwordHash: 'fixture-only', role: 'admin', status: 'active', accountStatus: 'created', mustChangePassword: false });
    const trainee = await User.create({ username: 'moduletrainee', firstName: 'Module', lastName: 'Trainee', email: 'moduletrainee@example.invalid', passwordHash: 'fixture-only', role: 'trainee', status: 'active', accountStatus: 'created', mustChangePassword: false, assignedTrainingSections: keys, age: 25, phoneNumber: '9800000000', address: 'Kathmandu', gender: 'female' });
    const programmes = {};
    for (const key of keys) {
        await TrainingModule.create({ name: key.replace(/-/g, ' '), key, code: key.slice(0, 5), description: 'Module game regression test.', createdBy: admin._id });
        programmes[key] = await TrainingProgramme.create({ programmeType: key, title: `${key} Beginner`, shortDescription: 'Module game regression test.', description: 'Testing progression and correct module content.', learningObjectives: 'Complete learning, scenario and assessment.', owner: admin._id, level: 'beginner', passMark: 70, createdBy: admin._id });
    }
    const programme = programmes[keys[0]];
    const assignment = await TrainingAssignment.create({ trainee: trainee._id, programme: programme._id, assignedBy: admin._id });
    const progress = await TrainingProgress.create({ trainee: trainee._id, programme: programme._id, assignment: assignment._id });
    const section = await LearningSection.create({ programme: programme._id, title: 'Load preparation', content: 'Inspect the load and choose the approved equipment.', order: 1, status: 'active', createdBy: admin._id });
    const scenario = await Scenario.create({ programme: programme._id, title: 'Inspect the load', prompt: 'What is the safe first step?', options: ['Assess the load', 'Rush the lift'], correctResponses: ['Assess the load'], status: 'active', createdBy: admin._id });
    return { admin, trainee, programmes, programme, assignment, progress, section, scenario };
}
async function learning(f, completedAt = new Date()) {
    await SectionCompletion.create({
        trainee: f.trainee._id,
        programme: f.programme._id,
        section: f.section._id,
        completedAt
    });
}
async function completedScenario(f, times = {}) {
    const startedAt = times.startedAt || new Date(Date.now() - 2000);
    return ScenarioAttempt.create({ trainee: f.trainee._id, programme: f.programme._id, assignment: f.assignment._id, scenarioSet: [f.scenario._id], responses: [{ scenario: f.scenario._id, responses: ['Assess the load'], correct: true, answeredAt: times.submittedAt || new Date() }], status: 'submitted', score: 1, totalScenarios: 1, percentage: 100, attemptNumber: times.attemptNumber || 1, startedAt, submittedAt: times.submittedAt || new Date() });
}
async function assessment(f, passed, at = new Date(), attemptNumber = 1) {
    return AssessmentAttempt.create({ trainee: f.trainee._id, programme: f.programme._id, assignment: f.assignment._id, level: 'basic', status: 'submitted', score: passed ? 10 : 0, totalPoints: 10, percentage: passed ? 100 : 0, passed, attemptNumber, submittedAt: at });
}
const endpoint = f => `/api/training-content/trainee/${f.programme._id}`;

describe('assessment progression and module-specific games', () => {
    test('a completed scenario restores its stale flag and unlocks the Beginner assessment on reload', async () => {
        const f = await fixture(); await learning(f); await completedScenario(f);
        const result = await request(app).get(`${endpoint(f)}/progress`).set(header(f.trainee));
        expect(result.status).toBe(200); expect(result.body.progress.learningCompleted).toBe(true);
        expect(result.body.progress.scenarioCompleted).toBe(true); expect(result.body.progress.basicPassed).toBe(false);
        expect((await request(app).get(`${endpoint(f)}/assessments/basic`).set(header(f.trainee))).status).toBe(200);
    });
    test('scenario completion is optional and learning alone unlocks the assessment', async () => {
        const f = await fixture(); await learning(f);
        await ScenarioAttempt.create({ trainee: f.trainee._id, programme: f.programme._id, assignment: f.assignment._id, scenarioSet: [f.scenario._id], responses: [], status: 'in-progress', attemptNumber: 1 });
        const result = await request(app).get(`${endpoint(f)}/assessments/basic`).set(header(f.trainee));
        expect(result.status).toBe(200);
    });
    test('passed assessment evidence restores progress and keeps its assessment and missions accessible with legacy missing learning ticks', async () => {
        const f = await fixture(); await assessment(f, true);
        const result = await request(app).get(`${endpoint(f)}/progress`).set(header(f.trainee));
        expect(result.body.progress.basicPassed).toBe(true); expect(result.body.progress.scenarioCompleted).toBe(false);
        expect(result.body.progress.status).toBe('in-progress');
        expect(result.body.progress.completedSections).toHaveLength(0);
        expect((await request(app).get(`${endpoint(f)}/assessments/basic`).set(header(f.trainee))).status).toBe(200);
        const created = await request(app).post('/api/safety-simulations').set(header(f.admin)).send({ ...simulationTemplate(keys[0]), programmeId: String(f.programme._id), status: 'active' });
        expect(created.status).toBe(201);
        const begun = await request(app).post(`/api/safety-simulations/${created.body.game._id}/attempts/start`).set(header(f.trainee)).send({});
        expect(begun.status).toBe(201);
    });
    test('a cached legacy pass without an attempt is rejected', async () => {
        const f = await fixture(); await TrainingProgress.updateOne({ _id: f.progress._id }, { basicPassed: true, scenarioCompleted: false });
        const result = await request(app).get(`${endpoint(f)}/assessments/basic`).set(header(f.trainee));
        expect(result.status).toBe(403);
    });
    test('a newer failed assessment requires relearning but never requires the optional scenario', async () => {
        const f = await fixture();

        const initialLearningAt = new Date(Date.now() - 15000);
        const failedAt = new Date(Date.now() - 5000);
        const relearnedAt = new Date(failedAt.getTime() + 1000);

        // First learning happened BEFORE the failed assessment.
        await learning(f, initialLearningAt);

        await completedScenario(f, {
            startedAt: new Date(Date.now() - 12000),
            submittedAt: new Date(Date.now() - 10000)
        });

        // Trainee fails after completing the old learning.
        await assessment(f, false, failedAt);

        await TrainingProgress.updateOne(
            { _id: f.progress._id },
            {
                basicPassed: true,
                scenarioCompleted: true
            }
        );

        const result = await request(app)
            .get(`${endpoint(f)}/progress`)
            .set(header(f.trainee));

        expect(result.body.progress.basicPassed).toBe(false);
        expect(result.body.progress.retryRequiredLevel).toBe('basic');

        // Because the trainee failed after their learning,
        // relearning is required first.
        expect(
            (
                await request(app)
                    .get(`${endpoint(f)}/assessments/basic`)
                    .set(header(f.trainee))
            ).status
        ).toBe(403);

        // Trainee completes learning again AFTER the failed attempt.
        await SectionCompletion.updateOne(
            {
                trainee: f.trainee._id,
                section: f.section._id
            },
            {
                $set: {
                    completedAt: relearnedAt
                }
            }
        );

        // Assessment becomes available again.
        expect(
            (
                await request(app)
                    .get(`${endpoint(f)}/assessments/basic`)
                    .set(header(f.trainee))
            ).status
        ).toBe(200);
    });
    test('scenario evidence from any module is optional and does not affect assessment access', async () => {
        const f = await fixture(); await learning(f);
        await ScenarioAttempt.create({ trainee: f.trainee._id, programme: f.programmes[keys[2]]._id, assignment: f.assignment._id, scenarioSet: [f.scenario._id], responses: [{ scenario: f.scenario._id, responses: ['Assess the load'], correct: true }], status: 'submitted', attemptNumber: 1, submittedAt: new Date() });
        expect((await request(app).get(`${endpoint(f)}/assessments/basic`).set(header(f.trainee))).status).toBe(200);
    });
    test.each(keys)('selecting %s produces matching title, scenes, objects and actions', key => {
        const draft = simulationDraftForProgramme({ _id: 'programme-id', programmeType: key, level: 'medium' });
        expect(draft.moduleKey).toBe(key); expect(draft.programmeId).toBe('programme-id'); expect(draft.difficulty).toBe('intermediate');
        expect(validateSimulation(draft.simulation).objectives.length).toBeGreaterThan(0);
        if (key !== keys[0]) { expect(draft.title).not.toBe('Warehouse Handling Mission'); expect(draft.simulation.actions.some(row => row.id === 'load-trolley')).toBe(false); }
    });
    test('an unknown module receives its own editable starter rather than Manual Handling content', () => {
        const draft = simulationDraftForProgramme({ _id: 'other-id', programmeType: 'fire-awareness' });
        expect(draft.title).toBe('Fire Awareness Mission'); expect(draft.moduleKey).toBe('fire-awareness');
        expect(validateSimulation(draft.simulation).objects[0].name).toContain('Fire Awareness');
    });
    test('the API rejects a module/programme mismatch and an unchanged warehouse template labelled Cyber Awareness', async () => {
        const f = await fixture(), body = { ...simulationTemplate(keys[0]), programmeId: String(f.programmes[keys[2]]._id), status: 'active' };
        const mismatch = await request(app).post('/api/safety-simulations').set(header(f.admin)).send(body);
        expect(mismatch.status).toBe(400); expect(mismatch.body.code).toBe('MODULE_PROGRAMME_MISMATCH');
        const wrongContent = await request(app).post('/api/safety-simulations').set(header(f.admin)).send({ ...body, moduleKey: keys[2] });
        expect(wrongContent.status).toBe(400); expect(wrongContent.body.code).toBe('MISSION_CONTENT_MISMATCH');
        expect(await Challenge.countDocuments()).toBe(0);
    });
    test('startup repair corrects old inherited games, preserves lifecycle/history and custom content, and is idempotent', async () => {
        const f = await fixture(), bad = [], at = new Date(Date.now() - 10000);
        for (const key of keys.slice(1)) {
            const wrongTemplate = simulationTemplate(key === keys[1] ? keys[2] : keys[1]);
            bad.push(await Challenge.create({ ...wrongTemplate, moduleKey: key, programme: f.programmes[key]._id, type: 'safety_simulation', simulation: validateSimulation(wrongTemplate.simulation), difficulty: 'advanced', timeLimitSeconds: 500, status: 'active', activatedAt: at, createdBy: f.admin._id }));
        }
        const custom = await Challenge.create({ ...simulationTemplate(keys[0]), title: 'Custom office procedure', moduleKey: keys[2], programme: f.programmes[keys[2]]._id, type: 'safety_simulation', simulation: validateSimulation(simulationTemplate(keys[0]).simulation), createdBy: f.admin._id });
        const snapshot = bad[0].toObject();
        const attempt = await ChallengeAttempt.create({ trainee: f.trainee._id, programme: bad[0].programme, challenge: bad[0]._id, type: 'safety_simulation', simulationSnapshot: snapshot, result: 'in-progress', startedAt: at });
        const repaired = await repairModuleSimulationContent(); expect(repaired.repaired).toHaveLength(2);
        for (const row of bad) {
            const saved = await Challenge.findById(row._id).lean();
            expect(saved.title).toBe(simulationTemplate(row.moduleKey).title); expect(saved.difficulty).toBe('advanced');
            expect(saved.timeLimitSeconds).toBe(500); expect(saved.status).toBe('active'); expect(saved.activatedAt.getTime()).toBe(at.getTime());
            expect(saved.simulation.actions.some(action => action.id === 'load-trolley')).toBe(false);
        }
        expect((await Challenge.findById(custom._id)).title).toBe('Custom office procedure');
        expect((await ChallengeAttempt.findById(attempt._id)).simulationSnapshot.title).toBe(snapshot.title);
        expect((await repairModuleSimulationContent()).repaired).toHaveLength(0);
    });
    test('misplaced warehouse missions are hidden, archived with their history, and cannot be recreated in Cyber or Height', async () => {
        const f = await fixture(), bad = [], template = simulationTemplate(keys[0]);
        for (const key of keys.slice(1)) {
            bad.push(await Challenge.create({ ...template, moduleKey: key, programme: f.programmes[key]._id, type: 'safety_simulation', description: 'Previously edited warehouse example.', simulation: validateSimulation(template.simulation), status: 'active', createdBy: f.admin._id }));
        }
        const valid = await Challenge.create({ ...template, moduleKey: keys[0], programme: f.programme._id, type: 'safety_simulation', simulation: validateSimulation(template.simulation), status: 'active', createdBy: f.admin._id });
        const custom = await Challenge.create({ ...simulationTemplate(keys[2]), title: 'Custom cyber practice', programme: f.programmes[keys[2]]._id, type: 'safety_simulation', simulation: validateSimulation(simulationTemplate(keys[2]).simulation), createdBy: f.admin._id });
        const at = new Date(), snapshot = bad[1].toObject();
        const attempt = await ChallengeAttempt.create({ trainee: f.trainee._id, programme: bad[1].programme, challenge: bad[1]._id, type: 'safety_simulation', simulationSnapshot: snapshot, score: 120, result: 'completed', startedAt: at, finishedAt: at });
        const list = await request(app).get('/api/safety-simulations').set(header(f.trainee));
        expect(list.status).toBe(200); expect(list.body.games.some(game => String(game._id) === String(valid._id))).toBe(true);
        expect(list.body.games.some(game => bad.some(row => String(row._id) === game._id))).toBe(false);
        expect((await request(app).get(`/api/safety-simulations/${bad[1]._id}`).set(header(f.trainee))).status).toBe(404);
        expect((await request(app).post(`/api/safety-simulations/${bad[1]._id}/attempts/start`).set(header(f.trainee)).send({})).status).toBe(404);
        for (const key of keys.slice(1)) {
            const rejected = await request(app).post('/api/safety-simulations').set(header(f.admin)).send({ ...template, moduleKey: key, programmeId: String(f.programmes[key]._id), description: 'Edited example.' });
            expect(rejected.status).toBe(400); expect(rejected.body.code).toBe('MISSION_CONTENT_MISMATCH');
        }
        const removed = await repairModuleSimulationContent(); expect(removed.archived).toHaveLength(2);
        for (const row of bad) { const saved = await Challenge.findById(row._id); expect(saved.archivedAt).toBeInstanceOf(Date); expect(saved.status).toBe('inactive'); }
        expect((await Challenge.findById(valid._id)).archivedAt).toBeNull(); expect((await Challenge.findById(custom._id)).title).toBe('Custom cyber practice');
        expect((await ChallengeAttempt.findById(attempt._id)).simulationSnapshot).toEqual(snapshot); expect((await ChallengeAttempt.findById(attempt._id)).score).toBe(120);
        expect((await repairModuleSimulationContent()).archived).toHaveLength(0);
    });
});

// Dependency-free functional smoke test for all 45 training missions.
// Run: npm run check:mission-library (from backend/).
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { safetyMissionLibrary } = require('../../shared/safetyMissionLibrary.mjs');
const { validateSimulation, createMissionState, applyInteraction, moveMission, finishMission } = require('../../shared/simulationEngine.mjs');
const levels = ['beginner', 'intermediate', 'advanced'];
const modules = ['manual-handling', 'working-at-height', 'cyber-awareness'];
const found = {}, names = new Set(), sampleKeys = new Set();
for (const mission of safetyMissionLibrary) {
    const key = `${mission.moduleKey}/${mission.difficulty}`;
    found[key] = (found[key] || 0) + 1;
    assert(!names.has(mission.title), `Duplicate title: ${mission.title}`);
    assert(!sampleKeys.has(mission.key), `Duplicate sampleKey: ${mission.key}`);
    names.add(mission.title); sampleKeys.add(mission.key);
    const config = validateSimulation(mission.simulation);
    for (const loc of config.environment.locations) {
        assert(fs.existsSync(path.join(__dirname, '../../frontend/public', loc.panorama)), `${mission.title}: missing panorama ${loc.panorama}`);
    }
    for (const obj of config.objects) {
        assert(fs.existsSync(path.join(__dirname, '../../frontend/public', obj.imageUrl)), `${mission.title}: missing object illustration ${obj.imageUrl}`);
    }
    const now = new Date().toISOString();
    const rules = {
        timeLimitSeconds: mission.timeLimitSeconds, maxTimeBonus: mission.maxTimeBonus, maxScore: mission.maxScore,
        incorrectPenalty: mission.incorrectPenalty, completionBonus: mission.completionBonus
    };
    let state = createMissionState(config, now);
    assert.equal(state.score, 0, 'Mission must start with zero points');
    for (const safe of ['safe-1', 'safe-2', 'safe-3']) {
        state = applyInteraction(config, state, safe, rules, now);
        assert(state.score > 0, `${mission.title}: safe action should earn points`);
    }
    if (mission.difficulty !== 'beginner') state = applyInteraction(config, state, 'verify', rules, now);
    state = moveMission(config, state, 'safety-desk', now);
    state = applyInteraction(config, state, 'sign-off', rules, now);
    const result = finishMission(config, state, rules, now, 100);
    assert.equal(result.result, 'completed', `${mission.title}: should be completable`);
    assert(result.score > 0);
    let unsafe = createMissionState(config, now);
    unsafe = applyInteraction(config, unsafe, 'unsafe-1', rules, now);
    assert.equal(unsafe.score, 0, `${mission.title}: unsafe action cannot award points`);
    assert.equal(unsafe.mistakes, 1);
    if (mission.difficulty === 'advanced') assert.equal(unsafe.result, 'failed');
    else assert.equal(unsafe.result, 'in-progress');
}
for (const mod of modules) for (const level of levels) assert.equal(found[`${mod}/${level}`], 5, `Expected 5 ${mod} ${level} missions`);
assert.equal(safetyMissionLibrary.length, 45);
console.log('PASS: 45 unique valid missions (3 modules × 3 levels × 5), assets, complete/unsafe flows and scoring.');

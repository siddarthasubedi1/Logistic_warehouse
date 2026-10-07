const TrainingAssignment = require('../models/TrainingAssignment');
const TrainingModule = require('../models/TrainingModule');
const { calculateAssignments, summarizeProgrammes, withoutCache } = require('./trainingProgressService');

async function ownAssignments(traineeId) {
    await require('./traineeLevelProgressService').syncUnlockedProgressionAssignments(traineeId);
    const modules = await TrainingModule.find({ status: 'active' }).select('key').lean();
    const rows = await TrainingAssignment.find({ trainee: traineeId, status: 'active' }).populate({ path: 'programme', match: { status: 'active', deletedAt: null, programmeType: { $in: modules.map(m => m.key) } } }).lean();
    return rows.filter(r => r.programme);
}
function buildOverview(programmes) {
    const groups = new Map();
    for (const row of programmes) {
        if (!groups.has(row.moduleKey)) groups.set(row.moduleKey, []);
        groups.get(row.moduleKey).push(row);
    }
    const levels = ['beginner', 'intermediate', 'advanced'];
    const modules = [...groups.entries()].map(([moduleKey, rows]) => {
        const summary = summarizeProgrammes(rows);
        const levelsPassed = Object.fromEntries(levels.map(level => [level, rows.some(r => r.programmeLevel === level && r.assessment.passed)]));
        const levelRows = levels.map((level, index) => {
            const matching = rows.filter(r => r.programmeLevel === level);
            const stats = summarizeProgrammes(matching);
            const prerequisiteMet = levels.slice(0, index).every(previous => levelsPassed[previous]);
            return { level, ...stats, assignedCount: matching.length, completedCount: stats.completedProgrammes, completed: matching.length > 0 && stats.status === 'completed', unlocked: matching.length > 0 && prerequisiteMet, prerequisiteMet, programmes: matching.map(withoutCache) };
        });
        const withScore = rows.filter(r => r.assessment.latestScore !== null).sort((a, b) => new Date(b.assessment.latestSubmittedAt) - new Date(a.assessment.latestSubmittedAt));
        const bests = rows.map(r => r.assessment.bestScore).filter(v => v !== null);
        return { ...summary, trainingSection: moduleKey, moduleType: moduleKey, moduleKey, levels: levelRows, totalLevels: levels.length, completedLevels: levelRows.filter(l => l.completed).length, currentLevel: levelRows.find(l => l.unlocked && !l.completed)?.level || (summary.status === 'completed' ? 'completed' : null), latestPercentage: withScore[0]?.assessment.latestScore ?? null, bestPercentage: bests.length ? Math.max(...bests) : null, latestPassed: withScore[0]?.assessment.passed ?? null, programmes: rows.map(withoutCache) };
    });
    const overall = summarizeProgrammes(programmes);
    return { progress: modules, programmes: programmes.map(withoutCache), summary: { ...overall, overallProgress: overall.progress, modulesAssigned: modules.length, completedModules: modules.filter(m => m.status === 'completed').length, totalAttempts: overall.attempts } };
}
async function ownOverview(traineeId) { return buildOverview(await calculateAssignments(await ownAssignments(traineeId))); }
module.exports = { ownAssignments, ownOverview, buildOverview };

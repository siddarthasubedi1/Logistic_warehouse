const AssessmentAttempt = require('../models/AssessmentAttempt');
const ScenarioAttempt = require('../models/ScenarioAttempt');

const passFieldFor = level => ({ basic: 'basicPassed', intermediate: 'intermediatePassed', high: 'highPassed' }[level] || 'basicPassed');
const hasProgrammeAssessmentPass = (progress, level) => !!progress?.[passFieldFor(level)] && !progress?.retryRequiredLevel;

// Attempts are durable evidence. Progress flags are a cache and older versions
// can leave them out of sync. A failed assessment starts a new learning cycle;
// a scenario completed before that failure must never unlock the retry.
async function reconcileProgrammeActivityProgress({ traineeId, programmeId, level, progress }) {
    const [assessment, scenario] = await Promise.all([
        AssessmentAttempt.findOne({ trainee: traineeId, programme: programmeId, level, status: 'submitted' })
            .sort({ submittedAt: -1, createdAt: -1, attemptNumber: -1 })
            .select('passed submittedAt createdAt').lean(),
        ScenarioAttempt.findOne({ trainee: traineeId, programme: programmeId, status: 'submitted' })
            .sort({ submittedAt: -1, createdAt: -1, attemptNumber: -1 })
            .select('scenarioSet responses startedAt submittedAt createdAt').lean(),
    ]);

    const passField = passFieldFor(level);
    if (assessment?.passed) {
        progress[passField] = true;
        progress.retryRequiredLevel = null;
    } else if (assessment) {
        progress[passField] = false;
        progress.retryRequiredLevel = level;
    } else if (progress.retryRequiredLevel) {
        progress[passField] = false;
    }

    const resetAt = assessment && !assessment.passed
        ? new Date(assessment.submittedAt || assessment.createdAt).getTime()
        : null;
    const answered = new Set((scenario?.responses || []).map(row => String(row.scenario)));
    const completeExercise = !!scenario?.scenarioSet?.length
        && scenario.scenarioSet.every(id => answered.has(String(id)));
    const inCurrentCycle = resetAt === null || (
        new Date(scenario?.startedAt || scenario?.createdAt).getTime() > resetAt
        && new Date(scenario?.submittedAt).getTime() > resetAt
    );

    if (hasProgrammeAssessmentPass(progress, level)) {
        // A passed assessment proves its scenario prerequisite was satisfied.
        // Do not invent individual learning-section ticks for legacy records.
        progress.scenarioCompleted = true;
    } else if (completeExercise && inCurrentCycle) {
        progress.completedScenarios = scenario.scenarioSet;
        progress.scenarioCompleted = true;
    } else if (resetAt !== null) {
        progress.scenarioCompleted = false;
    }
    return progress;
}

module.exports = { passFieldFor, hasProgrammeAssessmentPass, reconcileProgrammeActivityProgress };

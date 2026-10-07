const TrainingProgress = require("../models/TrainingProgress");

/**
 * Return the single Sprint-2 progress document for a trainee + programme.
 *
 * This uses an atomic upsert so simultaneous page-load requests do not create
 * multiple progress documents. If MongoDB reports E11000 because another
 * request won the insert race, we immediately read and return that document.
 */
const getOrCreateProgrammeProgress = async ({ traineeId, programmeId, assignmentId }) => {
    const now = new Date();

    try {
        const progress = await TrainingProgress.findOneAndUpdate(
            { trainee: traineeId, programme: programmeId },
            {
                $set: {
                    assignment: assignmentId,
                    lastAccessedAt: now,
                },
                $setOnInsert: {
                    trainee: traineeId,
                    programme: programmeId,
                    status: "in-progress",
                    startedAt: now,
                },
            },
            {
                upsert: true,
                returnDocument: "after",
                setDefaultsOnInsert: true,
            }
        );

        if (!progress) throw new Error("Unable to initialise training progress");
        return progress;
    } catch (error) {
        // Two requests can reach an upsert at almost the same time. The
        // trainee+programme unique index guarantees one winner; the loser can
        // safely reuse the row that now exists.
        if (error?.code === 11000) {
            const existing = await TrainingProgress.findOne({
                trainee: traineeId,
                programme: programmeId,
            });

            if (existing) {
                existing.assignment = assignmentId;
                existing.lastAccessedAt = now;
                if (!existing.startedAt) existing.startedAt = now;
                if (existing.status === "not-started") existing.status = "in-progress";
                await existing.save();
                return existing;
            }
        }

        throw error;
    }
};

module.exports = {
    getOrCreateProgrammeProgress,
};

// Sprint 4: existing completion and attempt collections are evidence. This
// snapshot is a cache for the older UI, never input to the calculation.
const LearningSection = require('../models/LearningSection');
const SectionCompletion = require('../models/SectionCompletion');
const Scenario = require('../models/Scenario');
const ScenarioAttempt = require('../models/ScenarioAttempt');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const AssessmentQuestion = require('../models/AssessmentQuestion');
const ChallengeAttempt = require('../models/ChallengeAttempt');
const keyFor = (trainee, programme) => `${trainee}:${programme}`;
const assessmentLevel = programme => ({ beginner: 'basic', intermediate: 'intermediate', advanced: 'high' }[programme.level] || 'basic');
const statusLabel = status => ({ 'not-started': 'Not Started', 'in-progress': 'In Progress', completed: 'Completed' }[status]);
const groupBy = (rows, key) => {
    const map = new Map();
    for (const row of rows) { const k = key(row); if (!map.has(k)) map.set(k, []); map.get(k).push(row); }
    return map;
};
const time = value => value ? new Date(value).getTime() : 0;
const latestFirst = (a, b) => time(b.submittedAt || b.finishedAt || b.createdAt) - time(a.submittedAt || a.finishedAt || a.createdAt) || (b.attemptNumber || 0) - (a.attemptNumber || 0);

async function calculateAssignments(assignments) {
    if (!assignments.length) return [];
    const programmes = [...new Map(assignments.map(a => [String(a.programme._id), a.programme])).values()];
    const ids = programmes.map(p => p._id);
    const trainees = [...new Set(assignments.map(a => String(a.trainee)))];
    const scope = { programme: { $in: ids }, trainee: { $in: trainees } };
    // Fixed query count across the batch; no per-trainee/per-section lookups.
    const [sections, completions, scenarios, exercises, assessments, games, questions] = await Promise.all([
        LearningSection.find({ programme: { $in: ids }, status: 'active' }).select('programme title order').lean(),
        SectionCompletion.find(scope).select('trainee programme section completedAt').lean(),
        Scenario.find({ programme: { $in: ids }, status: 'active' }).select('programme title type order').lean(),
        ScenarioAttempt.find(scope).select('trainee programme scenarioSet responses status score percentage startedAt submittedAt createdAt attemptNumber').lean(),
        AssessmentAttempt.find(scope).select('trainee programme level status score totalPoints percentage passed passMark startedAt submittedAt createdAt attemptNumber questionSet').lean(),
        ChallengeAttempt.find(scope).select('trainee programme challenge type result validityStatus score accuracy startedAt finishedAt solvedHazards createdAt').lean(),
        AssessmentQuestion.aggregate([{ $match: { programme: { $in: ids }, status: 'active' } }, { $group: { _id: { programme: '$programme', level: '$level' }, count: { $sum: 1 } } }]),
    ]);
    const sectionsBy = groupBy(sections, r => String(r.programme));
    const scenariosBy = groupBy(scenarios, r => String(r.programme));
    const completionsBy = groupBy(completions, r => keyFor(r.trainee, r.programme));
    const exercisesBy = groupBy(exercises, r => keyFor(r.trainee, r.programme));
    const assessmentsBy = groupBy(assessments, r => keyFor(r.trainee, r.programme));
    const gamesBy = groupBy(games, r => keyFor(r.trainee, r.programme));
    const questionCounts = new Map(questions.map(r => [`${r._id.programme}:${r._id.level}`, r.count]));
    return assignments.map(assignment => {
        const programme = assignment.programme, pid = String(programme._id);
        const key = keyFor(assignment.trainee, pid), level = assessmentLevel(programme);
        const requiredSections = sectionsBy.get(pid) || [], requiredScenarios = scenariosBy.get(pid) || [];
        const assessmentRows = (assessmentsBy.get(key) || []).filter(a => a.level === level).sort(latestFirst);
        const submitted = assessmentRows.filter(a => a.status === 'submitted');
        const latest = submitted[0] || null;
        const resetAt = latest && !latest.passed ? time(latest.submittedAt || latest.createdAt) : 0;
        const sectionRows = (completionsBy.get(key) || []).filter(r => !resetAt || time(r.completedAt) > resetAt);
        const sectionById = new Map(sectionRows.map(r => [String(r.section), r]));
        const completedSections = requiredSections.filter(s => sectionById.has(String(s._id))).map(s => ({ id: s._id, title: s.title, completedAt: sectionById.get(String(s._id)).completedAt }));
        const exerciseRows = (exercisesBy.get(key) || []).sort(latestFirst);
        const exercise = exerciseRows.find(a => a.status === 'submitted' && (!resetAt || time(a.startedAt) > resetAt && time(a.submittedAt) > resetAt));
        const responseById = new Map((exercise?.responses || []).filter(r => (exercise.scenarioSet || []).some(id => String(id) === String(r.scenario))).map(r => [String(r.scenario), r]));
        const completedScenarios = requiredScenarios.filter(s => responseById.has(String(s._id))).map(s => ({ id: s._id, title: s.title, type: s.type, correct: !!responseById.get(String(s._id)).correct, completedAt: responseById.get(String(s._id)).answeredAt || exercise.submittedAt }));
        const passed = !!latest?.passed && Number(latest.totalPoints) > 0;
        const submittedDurations = submitted
            .map(a => ({ start: time(a.startedAt), end: time(a.submittedAt) }))
            .filter(row => row.start > 0 && row.end >= row.start)
            .map(row => Math.max(0, Math.round((row.end - row.start) / 1000)));
        const assessmentTimeSeconds = submittedDurations.reduce((sum, seconds) => sum + seconds, 0);
        const assessmentQuestionCount = submitted.reduce((sum, a) => sum + Math.max(1, Array.isArray(a.questionSet) ? a.questionSet.length : 0), 0);
        const averageSecondsPerQuestion = assessmentQuestionCount > 0 ? Math.round(assessmentTimeSeconds / assessmentQuestionCount) : null;
        const learningComplete = requiredSections.length > 0 && completedSections.length === requiredSections.length;
        const scenarioComplete = completedScenarios.length === requiredScenarios.length;
        const assessmentReady = (questionCounts.get(`${pid}:${level}`) || 0) > 0 || Number(latest?.totalPoints) > 0;
        // Core completion is intentionally based only on required learning
        // sections plus the programme assessment. Scenario exercises, puzzles
        // and safety simulations remain optional enrichment activities.
        const requiredCount = requiredSections.length + 1;
        const completedCount = completedSections.length + (passed ? 1 : 0);
        const completed = learningComplete && passed && assessmentReady;
        // An empty learning configuration must never report 100% even if a
        // historical assessment exists. Surface the missing requirement.
        const percentage = completed ? 100 : Math.min(99, Math.round(completedCount / requiredCount * 100));
        const gameRows = (gamesBy.get(key) || []).sort(latestFirst);
        const activityTimes = [
            ...completedSections.map(r => r.completedAt), ...exerciseRows.map(a => a.startedAt),
            ...assessmentRows.map(a => a.startedAt), ...gameRows.map(a => a.startedAt),
        ].filter(Boolean).sort((a, b) => time(a) - time(b));
        const started = completedCount > 0 || exerciseRows.length > 0 || assessmentRows.length > 0 || gameRows.length > 0;
        const status = completed ? 'completed' : started ? 'in-progress' : 'not-started';
        const completionTimes = [...completedSections.map(r => r.completedAt), latest?.submittedAt].filter(Boolean);
        const completedAt = completed && completionTimes.length ? new Date(Math.max(...completionTimes.map(time))) : null;
        const hazardScenarios = requiredScenarios.filter(s => s.type === 'hazard');
        const hazardDone = completedScenarios.filter(s => s.type === 'hazard');
        const successfulGames = gameRows.filter(a => a.validityStatus === 'valid' && a.result === 'completed' && a.accuracy === 1);
        const passField = { basic: 'basicPassed', intermediate: 'intermediatePassed', high: 'highPassed' }[level];
        return {
            traineeId: assignment.trainee, programmeId: programme._id, assignmentId: assignment._id,
            moduleKey: programme.programmeType, title: programme.title, programmeLevel: programme.level,
            assignedAt: assignment.assignedAt, status, statusLabel: statusLabel(status), progress: percentage,
            startedAt: activityTimes[0] || null, completedAt,
            requiredCount, completedCount,
            learning: { required: requiredSections.length, completed: completedSections.length, complete: learningComplete, sections: completedSections },
            sceneActivities: { required: requiredScenarios.length, completed: completedScenarios.length, complete: scenarioComplete, activities: completedScenarios },
            hazards: { required: hazardScenarios.length, completed: hazardDone.length, successful: hazardDone.filter(s => s.correct).length, activities: hazardDone, optionalGamesCompleted: successfulGames.length },
            assessment: { level, configured: assessmentReady, attempts: submitted.length, latestScore: latest?.percentage ?? null, bestScore: submitted.length ? Math.max(...submitted.map(a => Number(a.percentage))) : null, passed: latest ? passed : null, latestAttemptId: latest?._id || null, latestSubmittedAt: latest?.submittedAt || null, passMark: latest?.passMark ?? programme.passMark, totalTimeSeconds: assessmentTimeSeconds, totalQuestionAttempts: assessmentQuestionCount, averageSecondsPerQuestion },
            optionalGames: { attempts: gameRows.length, completed: successfulGames.length, latestScore: gameRows.find(a => a.result !== 'in-progress')?.score ?? null, bestScore: gameRows.length ? Math.max(...gameRows.map(a => a.score)) : null },
            configurationIssues: [...(!requiredSections.length ? ['NO_ACTIVE_LEARNING_SECTIONS'] : []), ...(!assessmentReady ? ['NO_ACTIVE_ASSESSMENT_BANK'] : [])],
            evidence: { scenarioAttemptId: exercise?._id || null, scenarioSubmittedAt: exercise?.submittedAt || null, hazardGame: successfulGames.find(a => a.type === 'safety_simulation' || a.solvedHazards?.length > 0) || null },
            cache: { completedSections: completedSections.map(s => s.id), completedScenarios: completedScenarios.map(s => s.id), learningCompleted: learningComplete, scenarioCompleted: scenarioComplete, basicPassed: false, intermediatePassed: false, highPassed: false, [passField]: passed, retryRequiredLevel: latest && !passed ? level : null, currentStage: completed ? 'completed' : !learningComplete ? 'learning' : level },
        };
    });
}

async function refreshProgrammeProgress({ traineeId, programmeId, assignmentId, emitEvents = false }) {
    const Programme = require('../models/TrainingProgramme');
    const Assignment = require('../models/TrainingAssignment');
    const [programme, assignment] = await Promise.all([
        Programme.findById(programmeId).lean(),
        Assignment.findOne({ _id: assignmentId, trainee: traineeId, programme: programmeId, status: 'active' }).lean(),
    ]);
    if (!programme || !assignment) throw new (require('../utils/apiValidation').ApiError)(404, 'TRAINING_NOT_AVAILABLE', 'Training record not available.');
    const [summary] = await calculateAssignments([{ ...assignment, programme }]);
    const values = { ...summary.cache, trainee: traineeId, programme: programmeId, assignment: assignmentId, status: summary.status, progress: summary.progress, startedAt: summary.startedAt, completedAt: summary.completedAt, calculatedAt: new Date() };
    let progress;
    try {
        progress = await TrainingProgress.findOneAndUpdate({ trainee: traineeId, programme: programmeId }, { $set: values }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
    } catch (error) {
        if (error.code !== 11000) throw error;
        progress = await TrainingProgress.findOneAndUpdate({ trainee: traineeId, programme: programmeId }, { $set: values }, { returnDocument: 'after' });
    }
    if (emitEvents) await require('./achievementService').reconcileAchievements(summary, progress._id);
    return { progress, summary: withoutCache(summary) };
}
function withoutCache(summary) { const { cache, evidence, ...dto } = summary; return dto; }
function summarizeProgrammes(rows) {
    const required = rows.reduce((sum, r) => sum + r.requiredCount, 0);
    const complete = rows.length > 0 && rows.every(r => r.status === 'completed');
    const status = complete ? 'completed' : rows.some(r => r.status !== 'not-started') ? 'in-progress' : 'not-started';
    const progress = required ? Math.round(rows.reduce((sum, r) => sum + r.completedCount, 0) / required * 100) : 0;
    return { status, statusLabel: statusLabel(status), progress: complete ? 100 : Math.min(99, progress), programmesAssigned: rows.length, completedProgrammes: rows.filter(r => r.status === 'completed').length, attempts: rows.reduce((sum, r) => sum + r.assessment.attempts, 0), completedAt: complete ? new Date(Math.max(...rows.map(r => time(r.completedAt)))) : null };
}
async function reconcileTraineeAchievements(assignments) {
    const summaries = await calculateAssignments(assignments);
    if (!summaries.length) return;
    const calculatedAt = new Date();
    const operations = summaries.map(row => ({ updateOne: {
        filter: { trainee: row.traineeId, programme: row.programmeId },
        update: { $set: { ...row.cache, assignment: row.assignmentId, status: row.status, progress: row.progress, startedAt: row.startedAt, completedAt: row.completedAt, calculatedAt } },
        upsert: true,
    } }));
    try { await TrainingProgress.bulkWrite(operations); }
    catch (error) { if (error.code !== 11000) throw error; await TrainingProgress.bulkWrite(operations); }
    const snapshots = await TrainingProgress.find({ trainee: assignments[0].trainee, programme: { $in: summaries.map(r => r.programmeId) } }).select('programme').lean();
    const byId = new Map(snapshots.map(r => [String(r.programme), r._id]));
    const achievements = require('./achievementService');
    const definitions = await achievements.ensureDefinitions();
    for (const row of summaries) await achievements.reconcileAchievements(row, byId.get(String(row.programmeId)), definitions);
}
module.exports = { getOrCreateProgrammeProgress, calculateAssignments, refreshProgrammeProgress, reconcileTraineeAchievements, summarizeProgrammes, withoutCache, assessmentLevel, statusLabel };

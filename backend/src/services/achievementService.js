const Badge = require('../models/Badge');
const BadgeAward = require('../models/BadgeAward');
const { notify } = require('./notificationService');
const definitions = [
    { key: 'programme-completion', name: 'Programme Complete', description: 'Complete every required learning section and pass the programme assessment.' },
    { key: 'hazard-achievement', name: 'Hazard Achievement', description: 'Correctly complete all required hazard scenarios, or complete a verified optional safety mission/investigation.' },
    { key: 'quiz-achievement', name: 'Assessment Passed', description: 'Pass the required programme assessment using server-graded answers.' },
];
async function ensureDefinitions() {
    await Badge.bulkWrite(definitions.map(definition => ({ updateOne: { filter: { key: definition.key }, update: { $setOnInsert: definition }, upsert: true } })), { ordered: true });
    return Badge.find().sort({ key: 1 }).lean();
}
async function reconcileAchievements(summary, progressId, existingDefinitions = null) {
    const qualified = [];
    if (summary.status === 'completed') qualified.push({ key: 'programme-completion', type: 'TrainingProgress', id: progressId, at: summary.completedAt });
    if (summary.assessment.passed) qualified.push({ key: 'quiz-achievement', type: 'AssessmentAttempt', id: summary.assessment.latestAttemptId, at: summary.assessment.latestSubmittedAt });
    if (summary.hazards.required > 0 && summary.hazards.successful === summary.hazards.required) {
        if (summary.evidence.scenarioAttemptId) qualified.push({ key: 'hazard-achievement', type: 'ScenarioAttempt', id: summary.evidence.scenarioAttemptId, at: summary.evidence.scenarioSubmittedAt });
    }
    if (!qualified.some(q => q.key === 'hazard-achievement')) {
        const attempt = summary.evidence.hazardGame;
        if (attempt) qualified.push({ key: 'hazard-achievement', type: 'ChallengeAttempt', id: attempt._id, at: attempt.finishedAt });
    }
    if (!qualified.length) return;
    const badges = new Map((existingDefinitions || await ensureDefinitions()).map(b => [b.key, b]));
    for (const qualification of qualified) {
        const badge = badges.get(qualification.key);
        try {
            await BadgeAward.updateOne({ trainee: summary.traineeId, badge: badge._id, programme: summary.programmeId }, { $setOnInsert: { trainee: summary.traineeId, badge: badge._id, programme: summary.programmeId, moduleKey: summary.moduleKey, evidenceType: qualification.type, evidenceId: qualification.id, awardedAt: qualification.at || new Date() } }, { upsert: true });
        } catch (error) { if (error.code !== 11000) throw error; }
        await notify(summary.traineeId, { eventKey: `badge:${badge.key}:${summary.programmeId}`, type: 'badge', message: `${badge.name}: ${summary.title}`, relatedType: 'Badge', relatedId: badge._id });
    }
    if (summary.status === 'completed') await notify(summary.traineeId, { eventKey: `completed:${summary.programmeId}`, type: 'progress', message: `You completed ${summary.title}.`, relatedType: 'TrainingProgramme', relatedId: summary.programmeId });
}
module.exports = { ensureDefinitions, reconcileAchievements };

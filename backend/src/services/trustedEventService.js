const { notify, notifyUsers } = require('./notificationService');

async function handleRecordEvent(type, before, after) {
    if (!after) return;
    const changed = !before || before.status !== after.status;
    if (type === 'TrainingAssignment' && after.status === 'active' && changed) {
        const programme = await require('../models/TrainingProgramme').findById(after.programme).select('title').lean();
        await notify(after.trainee, { eventKey: `assignment:${after._id}:${new Date(after.updatedAt || after.assignedAt).getTime()}`, type: 'assignment', message: `Training assigned: ${programme?.title || 'Training programme'}.`, relatedType: type, relatedId: after._id });
    }
    if (type === 'TrainingModule' && after.status === 'active' && changed) {
        await notifyUsers({ status: 'active', accountStatus: 'created', $or: [{ role: 'trainee' }, { role: 'trainer', assignedTrainingSections: after.key }] }, { eventKey: `module:${after._id}:${new Date(after.updatedAt).getTime()}`, type: 'module', message: `${after.name} is available.`, relatedType: type, relatedId: after._id });
    }
    if (type === 'User' && before && (before.status !== after.status || before.accountStatus !== after.accountStatus || before.authVersion !== after.authVersion)) {
        await notify(after._id, { eventKey: `account:${after._id}:${new Date(after.updatedAt).getTime()}`, type: 'admin-action', message: 'Your account settings were updated.', relatedType: type, relatedId: after._id });
    }
}
async function handleAttemptEvent(type, attempt) {
    const finished = type === 'ChallengeAttempt' ? attempt.result !== 'in-progress' : attempt.status === 'submitted';
    if (!finished) return;
    const isQuiz = type === 'AssessmentAttempt';
    await notify(attempt.trainee, { eventKey: `result:${type}:${attempt._id}`, type: 'result', message: isQuiz ? `Assessment result: ${attempt.passed ? 'Passed' : 'Failed'} (${attempt.percentage}%).` : 'Your activity result is available.', relatedType: type, relatedId: attempt._id });
    const assignment = await require('../models/TrainingAssignment').findOne({ trainee: attempt.trainee, programme: attempt.programme, status: 'active' }).select('_id').lean();
    if (assignment) await require('./trainingProgressService').refreshProgrammeProgress({ traineeId: attempt.trainee, programmeId: attempt.programme, assignmentId: assignment._id, emitEvents: true });
}
module.exports = { handleRecordEvent, handleAttemptEvent };

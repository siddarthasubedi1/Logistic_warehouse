const User = require('../models/User');
const Programme = require('../models/TrainingProgramme');
const Assignment = require('../models/TrainingAssignment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const ScenarioAttempt = require('../models/ScenarioAttempt');
const Scenario = require('../models/Scenario');
const ChallengeAttempt = require('../models/ChallengeAttempt');
const { calculateAssignments } = require('./trainingProgressService');
const { mongoId } = require('../utils/apiValidation');

async function adminReport({ programmeId, role, status, range }) {
    const programmeQuery = { deletedAt: null, ...(programmeId ? { _id: programmeId } : {}) };
    const programmes = await Programme.find(programmeQuery).lean();
    const ids = programmes.map(p => p._id), byId = new Map(programmes.map(p => [String(p._id), p]));
    const userQuery = { ...(role ? { role } : {}), ...(range ? { createdAt: range } : {}) };
    if (programmeId) {
        const traineeIds = await Assignment.distinct('trainee', { programme: programmeId });
        const programme = programmes[0];
        userQuery._id = { $in: [...traineeIds, ...(programme ? [programme.owner, ...(programme.authorizedTrainers || [])] : [])] };
    }
    const [userCounts, assignmentRows] = await Promise.all([
        User.aggregate([{ $match: Object.fromEntries(Object.entries(userQuery).map(([k, v]) => [k, k === '_id' ? { $in: v.$in.map(mongoId) } : v])) }, { $group: { _id: { role: '$role', status: '$status' }, count: { $sum: 1 } } }]),
        Assignment.find({ status: 'active', programme: { $in: ids }, ...(range ? { assignedAt: range } : {}) }).lean(),
    ]);
    let progress = role && role !== 'trainee' ? [] : await calculateAssignments(assignmentRows.filter(a => byId.has(String(a.programme))).map(a => ({ ...a, programme: byId.get(String(a.programme)) })));
    if (status) progress = progress.filter(r => r.status === status);
    const scopedTrainees = new Set(progress.map(r => String(r.traineeId)));
    const assessmentFilter = { programme: { $in: ids }, status: 'submitted', ...(range ? { submittedAt: range } : {}) };
    const scenarioFilter = { programme: { $in: ids }, status: 'submitted', ...(range ? { submittedAt: range } : {}) };
    const gameFilter = { programme: { $in: ids }, validityStatus: 'valid', result: { $ne: 'in-progress' }, ...(range ? { finishedAt: range } : {}) };
    if (role && role !== 'trainee') assessmentFilter.trainee = scenarioFilter.trainee = gameFilter.trainee = { $in: [] };
    else if (status) {
        assessmentFilter.$or = progress.map(r => ({ trainee: mongoId(r.traineeId), programme: mongoId(r.programmeId) }));
        if (!progress.length) assessmentFilter.trainee = { $in: [] }, delete assessmentFilter.$or;
        Object.assign(scenarioFilter, assessmentFilter.$or ? { $or: assessmentFilter.$or } : { trainee: assessmentFilter.trainee || { $in: [] } });
        Object.assign(gameFilter, assessmentFilter.$or ? { $or: assessmentFilter.$or } : { trainee: assessmentFilter.trainee || { $in: [] } });
    }
    const hazardIds = await Scenario.distinct('_id', { programme: { $in: ids }, type: 'hazard' });
    const [assessmentRows, hazardRows, gameRows] = await Promise.all([
        AssessmentAttempt.aggregate([{ $match: assessmentFilter }, { $group: { _id: null, totalAttempts: { $sum: 1 }, passed: { $sum: { $cond: ['$passed', 1, 0] } }, averageScore: { $avg: '$percentage' }, bestScore: { $max: '$percentage' } } }]),
        ScenarioAttempt.aggregate([{ $match: scenarioFilter }, { $unwind: '$responses' }, { $match: { 'responses.scenario': { $in: hazardIds } } }, { $group: { _id: null, attempts: { $addToSet: '$_id' }, completedResponses: { $sum: 1 }, successfulResponses: { $sum: { $cond: ['$responses.correct', 1, 0] } } } }, { $project: { _id: 0, totalAttempts: { $size: '$attempts' }, completedResponses: 1, successfulResponses: 1 } }]),
        ChallengeAttempt.aggregate([{ $match: gameFilter }, { $group: { _id: '$type', totalAttempts: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$result', 'completed'] }, 1, 0] } } } }]),
    ]);
    const users = { total: 0, trainees: 0, trainers: 0, admins: 0, active: 0, inactive: 0 };
    for (const row of userCounts) { users.total += row.count; users[`${row._id.role}s`] += row.count; users[row._id.status === 'active' ? 'active' : 'inactive'] += row.count; }
    const counts = { 'not-started': 0, 'in-progress': 0, completed: 0 };
    for (const row of progress) counts[row.status]++;
    const assessment = assessmentRows[0] || { totalAttempts: 0, passed: 0, averageScore: null, bestScore: null };
    const hazard = hazardRows[0] || { totalAttempts: 0, completedResponses: 0, successfulResponses: 0 };
    return {
        generatedAt: new Date(), filters: { programmeId: programmeId || null, role: role || null, status: status || null, dateRange: range || null },
        users,
        programmes: { total: programmes.filter(p => !range || (!range.$gte || p.createdAt >= range.$gte) && (!range.$lte || p.createdAt <= range.$lte)).length, participation: progress.length, uniqueTrainees: scopedTrainees.size, completedAssignments: counts.completed },
        progress: { notStarted: counts['not-started'], inProgress: counts['in-progress'], completed: counts.completed },
        assessments: { totalAttempts: assessment.totalAttempts, passed: assessment.passed, failed: assessment.totalAttempts - assessment.passed, averageScore: assessment.averageScore === null ? null : Math.round(assessment.averageScore * 100) / 100, bestScore: assessment.bestScore },
        hazards: { ...hazard, failedResponses: hazard.completedResponses - hazard.successfulResponses },
        optionalGames: gameRows.map(r => ({ type: r._id, totalAttempts: r.totalAttempts, completed: r.completed, unsuccessful: r.totalAttempts - r.completed })),
        completionOutcomes: { completed: counts.completed, completionRate: progress.length ? Math.round(counts.completed / progress.length * 10000) / 100 : 0 },
    };
}
module.exports = { adminReport };

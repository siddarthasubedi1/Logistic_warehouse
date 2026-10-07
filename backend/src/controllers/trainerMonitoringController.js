const User = require('../models/User');
const TrainingModule = require('../models/TrainingModule');
const { scopedAssignments } = require('../services/trainingAccessService');
const { calculateAssignments } = require('../services/trainingProgressService');
const { buildOverview } = require('../services/progressOverviewService');
const { endpoint, objectId, pagination, enumValue, onlyQuery, ApiError } = require('../utils/apiValidation');

async function filters(req) {
    onlyQuery(req.query, ['moduleId', 'programmeId', 'status', 'page', 'limit']);
    const result = {};
    if (req.query.programmeId) result.programmeId = objectId(req.query.programmeId, 'programmeId');
    if (req.query.moduleId) {
        const module = await TrainingModule.findById(objectId(req.query.moduleId, 'moduleId')).select('key').lean();
        if (!module) throw new ApiError(404, 'TRAINING_NOT_AVAILABLE', 'Training record not available.');
        result.moduleKey = module.key;
    }
    result.status = enumValue(req.query.status, ['not-started', 'in-progress', 'completed'], 'status');
    return result;
}
exports.list = endpoint(async (req, res) => {
    const f = await filters(req), { page, limit, skip } = pagination(req.query);
    const assignments = await scopedAssignments(req.user, f);
    const calculated = await calculateAssignments(assignments);
    const groups = new Map();
    for (const row of calculated) { const id = String(row.traineeId); if (!groups.has(id)) groups.set(id, []); groups.get(id).push(row); }
    const all = [...groups.entries()].map(([id, rows]) => ({ id, overview: buildOverview(rows) })).filter(row => !f.status || row.overview.summary.status === f.status).sort((a, b) => a.id.localeCompare(b.id));
    const selected = all.slice(skip, skip + limit);
    const users = await User.find({ _id: { $in: selected.map(r => r.id) }, role: 'trainee' }).select('firstName lastName username status').lean();
    const byId = new Map(users.map(u => [String(u._id), u]));
    res.json({ trainees: selected.filter(r => byId.has(r.id)).map(row => ({ trainee: byId.get(row.id), ...row.overview })), pagination: { page, limit, total: all.length, totalPages: Math.ceil(all.length / limit) } });
});
exports.detail = endpoint(async (req, res) => {
    const traineeId = objectId(req.params.traineeId, 'traineeId'), f = await filters(req);
    const assignments = await scopedAssignments(req.user, { ...f, traineeId });
    const trainee = await User.findOne({ _id: traineeId, role: 'trainee' }).select('firstName lastName username status').lean();
    if (!trainee) throw new ApiError(404, 'TRAINING_NOT_AVAILABLE', 'Training record not available.');
    const overview = buildOverview(await calculateAssignments(assignments));
    res.json({ trainee, ...overview });
});

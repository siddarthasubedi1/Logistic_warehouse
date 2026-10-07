const TrainingModule = require('../models/TrainingModule');
const { ownOverview, ownAssignments } = require('../services/progressOverviewService');
const { calculateAssignments, withoutCache } = require('../services/trainingProgressService');
const { endpoint, objectId, onlyQuery, ApiError } = require('../utils/apiValidation');

exports.me = endpoint(async (req, res) => { onlyQuery(req.query, []); res.json(await ownOverview(req.user.id)); });
exports.module = endpoint(async (req, res) => {
    onlyQuery(req.query, []);
    objectId(req.params.moduleId, 'moduleId');
    const module = await TrainingModule.findOne({ _id: req.params.moduleId, status: 'active' }).select('key name').lean();
    const overview = await ownOverview(req.user.id);
    const progress = module && overview.progress.find(r => r.moduleKey === module.key);
    if (!progress) throw new ApiError(404, 'TRAINING_NOT_AVAILABLE', 'Training record not available.');
    res.json({ module: { id: module._id, key: module.key, name: module.name }, progress });
});
exports.programme = endpoint(async (req, res) => {
    onlyQuery(req.query, []);
    objectId(req.params.programmeId, 'programmeId');
    const assignments = (await ownAssignments(req.user.id)).filter(a => String(a.programme._id) === req.params.programmeId);
    if (!assignments.length) throw new ApiError(404, 'TRAINING_NOT_AVAILABLE', 'Training record not available.');
    const [progress] = await calculateAssignments(assignments);
    res.json({ progress: withoutCache(progress) });
});

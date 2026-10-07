const BadgeAward = require('../models/BadgeAward');
const { ensureDefinitions } = require('../services/achievementService');
const { ownAssignments } = require('../services/progressOverviewService');
const { reconcileTraineeAchievements } = require('../services/trainingProgressService');
const { endpoint, onlyQuery, pagination } = require('../utils/apiValidation');
exports.definitions = endpoint(async (req, res) => { onlyQuery(req.query, []); res.json({ badges: await ensureDefinitions() }); });
exports.mine = endpoint(async (req, res) => {
    onlyQuery(req.query, ['page', 'limit']); const { page, limit, skip } = pagination(req.query);
    // Also reconciles legacy verified attempts if a previous secondary event
    // failed. Clients provide no qualification data.
    const assignments = await ownAssignments(req.user.id);
    await reconcileTraineeAchievements(assignments);
    const [badges, total] = await Promise.all([BadgeAward.find({ trainee: req.user.id }).select('-trainee').populate('badge', 'key name description').populate('programme', 'title programmeType level').sort({ awardedAt: -1, _id: -1 }).skip(skip).limit(limit).lean(), BadgeAward.countDocuments({ trainee: req.user.id })]);
    res.json({ badges, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

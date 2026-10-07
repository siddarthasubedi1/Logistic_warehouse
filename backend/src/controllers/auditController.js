const AuditLog = require('../models/AuditLog');
const { endpoint, pagination, enumValue, dateRange, scalar, objectId, onlyQuery } = require('../utils/apiValidation');
const getAuditLogs = endpoint(async (req, res) => {
    onlyQuery(req.query, ['page', 'limit', 'action', 'status', 'role', 'targetType', 'targetId', 'from', 'to']);
    const { page, limit, skip } = pagination(req.query, 50);
    const filter = {};
    if (req.query.action) filter.action = scalar(req.query.action, 'action', 100);
    if (req.query.targetType) filter.targetType = scalar(req.query.targetType, 'targetType', 60);
    if (req.query.targetId) filter.targetId = objectId(req.query.targetId, 'targetId');
    const status = enumValue(req.query.status, ['success', 'failure'], 'status');
    const role = enumValue(req.query.role, ['admin', 'trainer', 'trainee', 'unknown'], 'role');
    if (status) filter.status = status;
    if (role) filter.role = role;
    const range = dateRange(req.query); if (range) filter.createdAt = range;
    const [logs, total] = await Promise.all([AuditLog.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit).lean(), AuditLog.countDocuments(filter)]);
    res.json({ logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});
module.exports = { getAuditLogs };

const Notification = require('../models/Notification');
const { endpoint, objectId, enumValue, onlyQuery, pagination, ApiError } = require('../utils/apiValidation');
exports.list = endpoint(async (req, res) => {
    onlyQuery(req.query, ['page', 'limit', 'read']);
    const { page, limit, skip } = pagination(req.query);
    const read = enumValue(req.query.read, ['true', 'false'], 'read');
    const filter = { recipient: req.user.id, ...(read ? { read: read === 'true' } : {}) };
    const [notifications, total, unreadCount] = await Promise.all([Notification.find(filter).select('-recipient -eventKey').sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit).lean(), Notification.countDocuments(filter), Notification.countDocuments({ recipient: req.user.id, read: false })]);
    res.json({ notifications, unreadCount, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});
exports.unread = endpoint(async (req, res) => { onlyQuery(req.query, []); res.json({ unreadCount: await Notification.countDocuments({ recipient: req.user.id, read: false }) }); });
exports.read = endpoint(async (req, res) => {
    onlyQuery(req.query, []); objectId(req.params.id, 'notificationId');
    const filter = { _id: req.params.id, recipient: req.user.id };
    const own = await Notification.findOne(filter).select('read').lean();
    if (!own) throw new ApiError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found.');
    if (!own.read) await Notification.updateOne({ ...filter, read: false }, { $set: { read: true, readAt: new Date() } });
    res.json({ notification: await Notification.findOne(filter).select('-recipient -eventKey').lean() });
});
exports.readAll = endpoint(async (req, res) => { onlyQuery(req.query, []); const result = await Notification.updateMany({ recipient: req.user.id, read: false }, { $set: { read: true, readAt: new Date() } }); res.json({ updatedCount: result.modifiedCount, unreadCount: await Notification.countDocuments({ recipient: req.user.id, read: false }) }); });

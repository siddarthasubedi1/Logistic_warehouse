const AuditLog = require('../models/AuditLog');
const sensitive = /passwordHash|refreshTokenHash|password$|secret|token$|authorization|cookie|api.?key/i;
const privateField = /^(email|phoneNumber|address|age|gender)$/;
function redact(value, depth = 0) {
    if (value == null) return value;
    if (depth > 10) return '[truncated]';
    if (value instanceof Date) return value;
    if (value?._bsontype === 'ObjectId') return String(value);
    if (Array.isArray(value)) return value.slice(0, 200).map(v => redact(v, depth + 1));
    if (typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([key]) => !sensitive.test(key) && !privateField.test(key)).map(([key, v]) => [key, redact(v, depth + 1)]));
    if (typeof value === 'string') return value.slice(0, 3000);
    return value;
}
async function writeAuditLog({ req, user = null, username = '', role = 'unknown', action, status, targetUser = null, targetType = '', targetId = null, before = null, after = null, details = {} }) {
    const safeDetails = redact(details);
    if (targetUser) {
        safeDetails.targetUser = { id: String(targetUser._id || targetUser.id), firstName: targetUser.firstName || '', lastName: targetUser.lastName || '', fullName: `${targetUser.firstName || ''} ${targetUser.lastName || ''}`.trim(), username: targetUser.username || '', role: targetUser.role, status: targetUser.status, accountStatus: targetUser.accountStatus };
        targetType = targetType || 'User'; targetId = targetId || targetUser._id || targetUser.id;
    }
    // Persist actual server actions and let a failure remain observable.
    return AuditLog.create({
        user: user?._id || user?.id || null,
        username: String(user?.username || username || '').trim().toLowerCase(),
        role: user?.role || role || 'unknown', action, status,
        ipAddress: req?.ip || req?.socket?.remoteAddress || '',
        userAgent: String(req?.get?.('user-agent') || '').slice(0, 500),
        targetType, targetId, before: redact(before), after: redact(after), details: safeDetails,
    });
}
module.exports = { writeAuditLog, redact };

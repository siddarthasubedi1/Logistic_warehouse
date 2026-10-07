const mongoose = require('mongoose');

class ApiError extends Error {
    constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const invalid = message => { throw new ApiError(400, 'INVALID_INPUT', message); };
function objectId(value, label = 'ID') {
    if (typeof value !== 'string' || !/^[a-f\d]{24}$/i.test(value)) invalid(`${label} must be a valid record ID.`);
    return value;
}
function scalar(value, label, max = 150) {
    if (typeof value !== 'string' || value.length > max) invalid(`Invalid ${label}.`);
    return value.trim();
}
function enumValue(value, values, label) {
    if (value === undefined || value === '') return undefined;
    if (typeof value !== 'string' || !values.includes(value)) invalid(`Invalid ${label}.`);
    return value;
}
function pagination(query, defaultLimit = 20) {
    const parse = (value, fallback, max, name) => {
        if (value === undefined) return fallback;
        if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) invalid(`Invalid ${name}.`);
        const n = Number(value);
        if (!Number.isSafeInteger(n) || n > max) invalid(`${name} exceeds the allowed maximum of ${max}.`);
        return n;
    };
    const page = parse(query.page, 1, 10000, 'page');
    const limit = parse(query.limit, defaultLimit, 100, 'limit');
    return { page, limit, skip: (page - 1) * limit };
}
function dateRange(query) {
    const parse = (value, end = false) => {
        if (value === undefined) return null;
        const text = scalar(value, 'date', 35);
        if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/.test(text)) invalid('Dates must use ISO 8601.');
        const date = new Date(text);
        if (!Number.isFinite(date.getTime()) || new Date(text.slice(0, 10)).toISOString().slice(0, 10) !== text.slice(0, 10)) invalid('Invalid calendar date.');
        if (end && text.length === 10) date.setUTCHours(23, 59, 59, 999);
        return date;
    };
    const from = parse(query.from), to = parse(query.to, true);
    if (from && to && from > to) invalid('from must not be after to.');
    return from || to ? { ...(from ? { $gte: from } : {}), ...(to ? { $lte: to } : {}) } : null;
}
function onlyQuery(query, allowed) {
    for (const key of Object.keys(query)) if (!allowed.includes(key)) invalid(`Unsupported query parameter: ${key}.`);
    for (const value of Object.values(query)) if (typeof value !== 'string') invalid('Query parameters must be single text values.');
}
function safeError(error, res) {
    if (error.type === 'entity.parse.failed' || ['CastError', 'ValidationError', 'SyntaxError'].includes(error.name)) return res.status(400).json({ code: 'INVALID_INPUT', message: 'Invalid request data.' });
    if (error instanceof ApiError || error.status && error.status < 500) {
        return res.status(error.status).json({ code: error.code || 'REQUEST_REJECTED', message: error.message });
    }
    if (error.name === 'VersionError' || error.code === 11000) return res.status(409).json({ code: 'RECORD_CHANGED', message: 'This record changed. Reload and try again.' });
    console.error('API request failed:', error.name, error.message);
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Unable to process this request.' });
}
const endpoint = handler => async (req, res) => {
    try { res.set('Cache-Control', 'no-store'); await handler(req, res); } catch (error) { safeError(error, res); }
};
const mongoId = id => new mongoose.Types.ObjectId(String(id));
module.exports = { ApiError, invalid, objectId, scalar, enumValue, pagination, dateRange, onlyQuery, safeError, endpoint, mongoId };

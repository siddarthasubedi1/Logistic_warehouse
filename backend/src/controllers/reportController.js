const Programme = require('../models/TrainingProgramme');
const { adminReport } = require('../services/reportService');
const { endpoint, objectId, onlyQuery, enumValue, dateRange, ApiError } = require('../utils/apiValidation');
exports.summary = endpoint(async (req, res) => {
    onlyQuery(req.query, ['programmeId', 'status', 'role', 'from', 'to']);
    const programmeId = req.query.programmeId ? objectId(req.query.programmeId, 'programmeId') : undefined;
    if (programmeId && !await Programme.exists({ _id: programmeId })) throw new ApiError(404, 'PROGRAMME_NOT_FOUND', 'Programme not found.');
    const role = enumValue(req.query.role, ['admin', 'trainer', 'trainee'], 'role');
    const status = enumValue(req.query.status, ['not-started', 'in-progress', 'completed'], 'status');
    res.json({ report: await adminReport({ programmeId, role, status, range: dateRange(req.query) }) });
});

const { objectId, pagination, dateRange, safeError, ApiError } = require('../utils/apiValidation');
const ids = ['id', 'programmeId', 'moduleId', 'traineeId', 'trainerId', 'userId', 'assignmentId', 'sectionId', 'scenarioId', 'questionId', 'attemptId', 'pendingUserId', 'gameId'];
function configureRouter(router) {
    for (const name of ids) router.param(name, (req, res, next, value) => {
        try { objectId(value, name); next(); } catch (error) { safeError(error, res); }
    });
}
function inputGuard(req, res, next) {
    try {
        for (const source of [req.body || {}, req.query]) for (const name of ids) if (source[name] !== undefined && source[name] !== '') objectId(source[name], name);
        for (const [name, value] of Object.entries(req.query)) {
            if (typeof value !== 'string' || value.length > 300) throw new ApiError(400, 'INVALID_INPUT', `Invalid ${name} filter.`);
        }
        if (req.query.page !== undefined || req.query.limit !== undefined) pagination(req.query);
        if (req.query.from !== undefined || req.query.to !== undefined) dateRange(req.query);
        next();
    } catch (error) { safeError(error, res); }
}
function authoritativeGuard(req, res) {
    if (req.user.role !== 'trainee' || ['GET', 'HEAD'].includes(req.method)) return true;
    // Mission scoring already ignores extraneous client fields in its engine.
    // Apply rejection to actual trainee completion/assessment/puzzle operations,
    // and let role middleware decide access to management endpoints.
    const playerPath = /\/training-content\/trainee\/|\/programmes\/[^/]+\/(?:sections\/[^/]+\/complete|assessments\/)|\/assessments\/[^/]+\/submit|\/challenges\/[^/]+\/(?:start|submit|hazard-action)|\/challenge-attempts\/[^/]+\/hint|\/users\/me\/(?:badges|training-progress\/[^/]+\/start)/;
    if (!playerPath.test(req.originalUrl)) return true;
    const denied = ['score', 'percentage', 'progress', 'passed', 'completed', 'completion', 'status', 'badgeId', 'badgeQualified', 'qualificationStatus', 'achievementStatus', 'role', 'owner', 'ownership', 'traineeId', 'trainerId', 'userId', 'errors', 'hintsUsed', 'accuracy', 'solvedHazards', 'hazardEvents', 'startedAt', 'finishedAt', 'submittedAt', 'completedAt', 'awardedAt'];
    if (denied.some(field => Object.prototype.hasOwnProperty.call(req.body || {}, field))) {
        res.status(400).json({ code: 'SERVER_MANAGED_FIELD', message: 'Scores, progress, ownership and qualifications are managed by the server.' });
        return false;
    }
    return true;
}
module.exports = { configureRouter, inputGuard, authoritativeGuard };

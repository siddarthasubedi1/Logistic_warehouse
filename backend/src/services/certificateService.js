const crypto = require('crypto');
const CertificateRequest = require('../models/CertificateRequest');
const TrainingModule = require('../models/TrainingModule');
const User = require('../models/User');
const { ownAssignments } = require('./progressOverviewService');
const { calculateAssignments } = require('./trainingProgressService');
const { notify, notifyUsers } = require('./notificationService');
const { sendMail, configured: emailConfigured } = require('./smtpService');
const { generateCertificatePdf } = require('./certificatePdfService');

const CERTIFICATE_KEY_PREFIX = 'cumulative-completion-v1';
const DEFAULT_MODULE_KEYS = ['manual-handling', 'working-at-height', 'cyber-awareness'];
const normalize = value => String(value || '').trim().toLowerCase();
const escapeHtml = value => String(value || '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const normalizeLevel = value => ({ easy: 'beginner', basic: 'beginner', beginner: 'beginner', medium: 'intermediate', intermediate: 'intermediate', high: 'advanced', advanced: 'advanced' }[normalize(value)] || normalize(value) || 'beginner');
const LEVELS = ['beginner', 'intermediate', 'advanced'];

function requiredModuleKeys() {
    const configured = String(process.env.CERTIFICATE_MODULE_KEYS || '')
        .split(',').map(normalize).filter(Boolean);
    return configured.length ? [...new Set(configured)] : DEFAULT_MODULE_KEYS;
}

function orderedKeys(keys = []) {
    const order = requiredModuleKeys();
    return [...new Set(keys.map(normalize).filter(Boolean))].sort((a, b) => {
        const ai = order.indexOf(a), bi = order.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });
}

function certificateKeyForModules(moduleKeys) {
    return `${CERTIFICATE_KEY_PREFIX}:${orderedKeys(moduleKeys).join('+')}`;
}

function certificateNumber(traineeId, moduleKeys) {
    const year = new Date().getFullYear();
    const keys = orderedKeys(moduleKeys);
    const certificateKey = certificateKeyForModules(keys);
    const digest = crypto.createHash('sha256').update(`${certificateKey}:${traineeId}`).digest('hex').slice(0, 8).toUpperCase();
    return `UKLW-${year}-${keys.length}M-${digest}`;
}

function roundHalf(value) {
    return Math.max(1, Math.min(5, Math.round(Number(value || 0) * 2) / 2));
}

/**
 * Performance rating uses evidence the platform actually records:
 *  - 60% attempt efficiency: extra assessment attempts reduce the score.
 *  - 40% assessment pace: average active seconds per attempted question.
 * Learning-page reading time is deliberately excluded because the application
 * does not reliably track active reading time versus an idle/open browser tab.
 */
function calculateModuleRating({ assessmentAttempts, requiredAssessments, totalAssessmentSeconds, totalQuestionAttempts }) {
    const attempts = Math.max(1, Number(assessmentAttempts || 1));
    const required = Math.max(1, Number(requiredAssessments || 1));
    const seconds = Math.max(0, Number(totalAssessmentSeconds || 0));
    const questions = Math.max(0, Number(totalQuestionAttempts || 0));
    const extraAttempts = Math.max(0, attempts - required);
    const attemptScore = Math.max(1, 5 - extraAttempts * 0.75);
    const averageSecondsPerQuestion = questions > 0 ? Math.round(seconds / questions) : null;

    let paceScore = null;
    if (averageSecondsPerQuestion !== null) {
        if (averageSecondsPerQuestion <= 45) paceScore = 5;
        else if (averageSecondsPerQuestion <= 75) paceScore = 4.5;
        else if (averageSecondsPerQuestion <= 105) paceScore = 4;
        else if (averageSecondsPerQuestion <= 150) paceScore = 3.5;
        else if (averageSecondsPerQuestion <= 210) paceScore = 3;
        else if (averageSecondsPerQuestion <= 300) paceScore = 2.5;
        else paceScore = 2;
    }

    const stars = roundHalf(paceScore === null ? attemptScore : attemptScore * 0.6 + paceScore * 0.4);
    return {
        stars,
        assessmentAttempts: attempts,
        requiredAssessments: required,
        totalAssessmentSeconds: seconds,
        totalQuestionAttempts: questions,
        averageSecondsPerQuestion,
    };
}

function overallRating(modules = []) {
    if (!modules.length) return null;
    const stars = roundHalf(modules.reduce((sum, module) => sum + Number(module.rating?.stars || 1), 0) / modules.length);
    return {
        stars,
        assessmentAttempts: modules.reduce((sum, module) => sum + Number(module.rating?.assessmentAttempts || 0), 0),
        requiredAssessments: modules.reduce((sum, module) => sum + Number(module.rating?.requiredAssessments || 0), 0),
        totalAssessmentSeconds: modules.reduce((sum, module) => sum + Number(module.rating?.totalAssessmentSeconds || 0), 0),
        totalQuestionAttempts: modules.reduce((sum, module) => sum + Number(module.rating?.totalQuestionAttempts || 0), 0),
        averageSecondsPerQuestion: null,
    };
}

async function eligibilityForTrainee(traineeId) {
    const trainee = await User.findOne({ _id: traineeId, role: 'trainee', status: 'active', accountStatus: 'created' })
        .select('_id firstName lastName username email').lean();
    if (!trainee) return { eligible: false, eligibleModules: [], reason: 'TRAINEE_NOT_ACTIVE' };

    const keys = requiredModuleKeys();
    const activeModules = await TrainingModule.find({ key: { $in: keys }, status: 'active' }).select('key name').lean();
    const activeByKey = new Map(activeModules.map(module => [normalize(module.key), module]));
    const assignments = (await ownAssignments(traineeId)).filter(row => keys.includes(normalize(row.programme?.programmeType)));
    const summaries = await calculateAssignments(assignments);
    const byModule = new Map();
    for (const summary of summaries) {
        const key = normalize(summary.moduleKey);
        if (!byModule.has(key)) byModule.set(key, []);
        byModule.get(key).push(summary);
    }

    const modules = keys.map(key => {
        const activeModule = activeByKey.get(key);
        const rows = byModule.get(key) || [];
        if (!activeModule) {
            return {
                key,
                name: key.replace(/-/g, ' '),
                active: false,
                programmes: 0,
                levels: [],
                learningComplete: false,
                assessmentsPassed: false,
                complete: false,
                rating: null,
            };
        }

        // Module completion requires learning + passing assessment only.
        // Scenarios, puzzles and safety simulations are optional enrichment.
        const levels = LEVELS
            .map(level => {
                const levelRows = rows.filter(row => normalizeLevel(row.programmeLevel) === level);
                if (!levelRows.length) return null;
                const completeRow = levelRows.find(row => row.learning?.complete === true && row.assessment?.passed === true) || null;
                return {
                    level,
                    sourceProgrammeCount: levelRows.length,
                    learningComplete: levelRows.some(row => row.learning?.complete === true),
                    assessmentsPassed: levelRows.some(row => row.assessment?.passed === true),
                    complete: !!completeRow,
                    programmeId: completeRow?.programmeId || null,
                    assessmentAttempts: completeRow?.assessment?.attempts || 0,
                    totalAssessmentSeconds: completeRow?.assessment?.totalTimeSeconds || 0,
                    totalQuestionAttempts: completeRow?.assessment?.totalQuestionAttempts || 0,
                    averageSecondsPerQuestion: completeRow?.assessment?.averageSecondsPerQuestion ?? null,
                };
            })
            .filter(Boolean);

        const learningComplete = levels.length > 0 && levels.every(level => level.learningComplete);
        const assessmentsPassed = levels.length > 0 && levels.every(level => level.assessmentsPassed);
        const complete = levels.length > 0 && levels.every(level => level.complete);
        const rawRating = complete ? {
            assessmentAttempts: levels.reduce((sum, level) => sum + Number(level.assessmentAttempts || 0), 0),
            requiredAssessments: levels.length,
            totalAssessmentSeconds: levels.reduce((sum, level) => sum + Number(level.totalAssessmentSeconds || 0), 0),
            totalQuestionAttempts: levels.reduce((sum, level) => sum + Number(level.totalQuestionAttempts || 0), 0),
        } : null;
        const rating = rawRating ? calculateModuleRating(rawRating) : null;

        return {
            key,
            name: activeModule.name || key,
            active: true,
            programmes: rows.length,
            levels,
            learningComplete,
            assessmentsPassed,
            complete,
            rating,
        };
    });

    const eligibleModules = modules.filter(module => module.complete);
    return {
        eligible: eligibleModules.length > 0,
        allRequiredModulesComplete: modules.length > 0 && modules.every(module => module.complete),
        trainee,
        moduleKeys: keys,
        modules,
        eligibleModules,
    };
}

function moduleSnapshot(module) {
    return {
        key: module.key,
        name: module.name,
        levels: module.levels || [],
        learningComplete: !!module.learningComplete,
        assessmentsPassed: !!module.assessmentsPassed,
        complete: !!module.complete,
        rating: module.rating || null,
    };
}

async function upsertCumulativeCertificate(eligibility) {
    const modules = eligibility.eligibleModules.map(moduleSnapshot);
    const keys = orderedKeys(modules.map(module => module.key));
    const certificateKey = certificateKeyForModules(keys);
    const traineeId = eligibility.trainee._id;
    const summaryRating = overallRating(modules);
    let request = await CertificateRequest.findOne({ trainee: traineeId, certificateKey });
    let created = false;

    if (!request) {
        const values = {
            trainee: traineeId,
            certificateKey,
            moduleKey: `cumulative-${keys.length}`,
            moduleName: `${keys.length} Training Module${keys.length === 1 ? '' : 's'} Completed`,
            moduleKeys: keys,
            status: 'pending',
            eligibleAt: new Date(),
            certificateNumber: certificateNumber(traineeId, keys),
            recipientEmail: eligibility.trainee.email,
            rating: summaryRating,
            eligibilitySnapshot: { modules },
        };
        try {
            request = await CertificateRequest.create(values);
            created = true;
        } catch (error) {
            if (error.code !== 11000) throw error;
            request = await CertificateRequest.findOne({ trainee: traineeId, certificateKey });
        }
    } else if (request.status !== 'sent') {
        request.moduleKey = `cumulative-${keys.length}`;
        request.moduleName = `${keys.length} Training Module${keys.length === 1 ? '' : 's'} Completed`;
        request.moduleKeys = keys;
        request.recipientEmail = eligibility.trainee.email;
        request.rating = summaryRating;
        request.eligibilitySnapshot = { modules };
        if (request.status === 'superseded') request.status = 'pending';
        await request.save();
    }

    // Only the newest unsent cumulative certificate should remain actionable.
    await CertificateRequest.updateMany(
        {
            trainee: traineeId,
            certificateKey: new RegExp(`^${CERTIFICATE_KEY_PREFIX}:`),
            _id: { $ne: request._id },
            status: { $in: ['pending', 'failed'] },
        },
        { $set: { status: 'superseded' } }
    );

    return { request, created, modules };
}

async function reconcileCertificateEligibility(traineeId) {
    const eligibility = await eligibilityForTrainee(traineeId);
    if (!eligibility.trainee || !eligibility.eligibleModules?.length) {
        return { created: false, requests: [], request: null, eligibility };
    }

    const previous = await CertificateRequest.find({
        trainee: traineeId,
        certificateKey: new RegExp(`^${CERTIFICATE_KEY_PREFIX}:`),
    }).select('moduleKeys status').sort({ eligibleAt: -1 }).lean();
    const previousLargest = previous.reduce((best, row) => (row.moduleKeys?.length || 0) > (best?.moduleKeys?.length || 0) ? row : best, null);
    const previousKeys = new Set((previousLargest?.moduleKeys || []).map(normalize));

    const { request, created, modules } = await upsertCumulativeCertificate(eligibility);
    const currentKeys = modules.map(module => module.key);
    const newKeys = currentKeys.filter(key => !previousKeys.has(key));
    const name = `${eligibility.trainee.firstName} ${eligibility.trainee.lastName}`.trim();
    const moduleNames = modules.map(module => module.name).join(', ');
    const newNames = modules.filter(module => newKeys.includes(module.key)).map(module => module.name).join(', ');

    await notifyUsers(
        { role: 'admin', status: 'active', accountStatus: 'created' },
        {
            eventKey: `certificate-eligible:${traineeId}:${certificateKeyForModules(currentKeys)}`,
            type: 'certificate',
            message: newKeys.length
                ? `${name} completed ${newNames}. The updated certificate now includes ${modules.length} completed module${modules.length === 1 ? '' : 's'} (${moduleNames}) with performance ratings.`
                : `${name}'s certificate is ready with ${modules.length} completed module${modules.length === 1 ? '' : 's'} (${moduleNames}).`,
            relatedType: 'CertificateRequest',
            relatedId: request._id,
        }
    );

    return {
        created,
        requests: [request],
        request,
        eligibility,
    };
}

async function reconcileAllEligibleTrainees() {
    const trainees = await User.find({ role: 'trainee', status: 'active', accountStatus: 'created' }).select('_id').lean();
    for (const trainee of trainees) {
        try { await reconcileCertificateEligibility(trainee._id); }
        catch (error) { console.error('Certificate eligibility reconciliation failed:', trainee._id, error.message); }
    }
}

function sameKeySet(a = [], b = []) {
    const aa = orderedKeys(a), bb = orderedKeys(b);
    return aa.length === bb.length && aa.every((key, index) => key === bb[index]);
}

function moduleListText(modules = []) {
    return modules.map(module => `${module.name}: ${module.rating?.stars || 1}/5 stars, ${module.rating?.assessmentAttempts || 1} assessment attempt${Number(module.rating?.assessmentAttempts || 1) === 1 ? '' : 's'}`).join('\n');
}

function moduleListHtml(modules = []) {
    return `<ul>${modules.map(module => `<li><strong>${escapeHtml(module.name)}</strong> - ${escapeHtml(module.rating?.stars || 1)}/5 stars, ${escapeHtml(module.rating?.assessmentAttempts || 1)} assessment attempt${Number(module.rating?.assessmentAttempts || 1) === 1 ? '' : 's'}</li>`).join('')}</ul>`;
}

async function sendCertificate(requestId, adminId) {
    const request = await CertificateRequest.findById(requestId).populate('trainee', 'firstName lastName username email status accountStatus role');
    if (!request) {
        const error = new Error('Certificate request not found.');
        error.code = 'CERTIFICATE_NOT_FOUND';
        throw error;
    }
    if (!request.trainee || request.trainee.role !== 'trainee') {
        const error = new Error('The trainee account for this certificate is unavailable.');
        error.code = 'TRAINEE_NOT_FOUND';
        throw error;
    }
    if (request.status === 'sent') return request;
    if (request.status === 'superseded') {
        const error = new Error('A newer certificate is available because the trainee completed another module. Refresh the certificate page and send the latest version.');
        error.code = 'CERTIFICATE_SUPERSEDED';
        throw error;
    }

    const eligibility = await eligibilityForTrainee(request.trainee._id);
    const currentModules = eligibility.eligibleModules.map(moduleSnapshot);
    const currentKeys = currentModules.map(module => module.key);
    if (!currentModules.length) {
        const error = new Error('This trainee is no longer eligible for a certificate. Required learning sections and assessments must be complete.');
        error.code = 'CERTIFICATE_NOT_ELIGIBLE';
        throw error;
    }
    if (!sameKeySet(currentKeys, request.moduleKeys)) {
        request.status = 'superseded';
        await request.save();
        await reconcileCertificateEligibility(request.trainee._id);
        const error = new Error('The trainee has completed additional training. A newer cumulative certificate has been created. Refresh the page and send the latest certificate.');
        error.code = 'CERTIFICATE_SUPERSEDED';
        throw error;
    }

    const admin = await User.findById(adminId).select('firstName lastName username').lean();
    const adminName = `${admin?.firstName || ''} ${admin?.lastName || ''}`.trim() || admin?.username || 'System Administrator';
    const traineeName = `${request.trainee.firstName} ${request.trainee.lastName}`.trim();
    const recipient = request.trainee.email;
    const issuedAt = new Date();
    const rating = overallRating(currentModules);
    const pdf = generateCertificatePdf({
        traineeName,
        certificateNumber: request.certificateNumber,
        issuedAt,
        modules: currentModules,
        issuedBy: adminName,
    });

    request.emailAttempts += 1;
    request.rating = rating;
    request.moduleName = `${currentModules.length} Training Module${currentModules.length === 1 ? '' : 's'} Completed`;
    request.recipientEmail = recipient;
    request.eligibilitySnapshot = { modules: currentModules };
    try {
        await sendMail({
            to: recipient,
            subject: `Your UK LogiWare Training Certificate - ${currentModules.length} Module${currentModules.length === 1 ? '' : 's'} Completed`,
            text: `Hello ${traineeName},\n\nCongratulations. Your updated certificate is attached as a PDF. It includes every training module you have completed so far.\n\nCompleted modules:\n${moduleListText(currentModules)}\n\nCertificate number: ${request.certificateNumber}\nIssued by: ${adminName}\n\nLogiWare Company\nUK LogiWare Safety Training`,
            html: `<p>Hello <strong>${escapeHtml(traineeName)}</strong>,</p><p>Congratulations. Your updated certificate is attached as a PDF. It includes every training module you have completed so far.</p><p><strong>Completed modules and performance ratings:</strong></p>${moduleListHtml(currentModules)}<p><strong>Certificate number:</strong> ${escapeHtml(request.certificateNumber)}<br><strong>Issued by:</strong> ${escapeHtml(adminName)}</p><p><strong>LogiWare Company</strong><br>UK LogiWare Safety Training</p>`,
            attachments: [{ filename: `${request.certificateNumber}.pdf`, contentType: 'application/pdf', content: pdf }],
        });
        request.status = 'sent';
        request.sentAt = issuedAt;
        request.sentBy = adminId;
        request.lastEmailError = '';
        await request.save();
        await notify(request.trainee._id, {
            eventKey: `certificate-sent:${request._id}`,
            type: 'certificate',
            message: `Your certificate covering ${currentModules.map(module => module.name).join(', ')} (${request.certificateNumber}) was emailed to ${recipient}.`,
            relatedType: 'CertificateRequest',
            relatedId: request._id,
        });
        return request;
    } catch (error) {
        request.status = 'failed';
        request.lastEmailError = String(error.message || 'Email delivery failed').slice(0, 1000);
        await request.save();
        throw error;
    }
}

async function buildSentCertificatePdf(requestId) {
    const request = await CertificateRequest.findById(requestId)
        .populate('trainee', 'firstName lastName username email role')
        .populate('sentBy', 'firstName lastName username');
    if (!request) {
        const error = new Error('Certificate request not found.');
        error.code = 'CERTIFICATE_NOT_FOUND';
        throw error;
    }
    if (request.status === 'superseded') {
        const error = new Error('A newer cumulative certificate is available. Refresh the page and download that version.');
        error.code = 'CERTIFICATE_SUPERSEDED';
        throw error;
    }
    // Manual Gmail compose workflow: download is permitted for an eligible
    // certificate even before email is sent. Download does not mark it sent.
    if (request.status !== 'sent') {
        const eligibility = await eligibilityForTrainee(request.trainee?._id);
        const keys = eligibility.eligibleModules.map(m => m.key);
        if (!keys.length || !sameKeySet(keys, request.moduleKeys)) {
            const error = new Error('Certificate completion changed. Refresh the page to get the latest eligible certificate.');
            error.code = 'CERTIFICATE_NOT_ELIGIBLE';
            throw error;
        }
    }
    const modules = Array.isArray(request.eligibilitySnapshot?.modules) ? request.eligibilitySnapshot.modules : [];
    if (!modules.length) {
        const error = new Error('The saved certificate module details are unavailable.');
        error.code = 'CERTIFICATE_DATA_MISSING';
        throw error;
    }
    const traineeName = `${request.trainee?.firstName || ''} ${request.trainee?.lastName || ''}`.trim() || request.trainee?.username || 'Trainee';
    const issuedBy = `${request.sentBy?.firstName || ''} ${request.sentBy?.lastName || ''}`.trim() || request.sentBy?.username || 'System Administrator';
    const pdf = generateCertificatePdf({
        traineeName,
        certificateNumber: request.certificateNumber,
        issuedAt: request.sentAt || request.updatedAt || new Date(),
        modules,
        issuedBy,
    });
    return { request, pdf, filename: `${request.certificateNumber}.pdf` };
}

module.exports = {
    CERTIFICATE_KEY_PREFIX,
    requiredModuleKeys,
    certificateKeyForModules,
    calculateModuleRating,
    eligibilityForTrainee,
    reconcileCertificateEligibility,
    reconcileAllEligibleTrainees,
    sendCertificate,
    buildSentCertificatePdf,
    emailConfigured,
};

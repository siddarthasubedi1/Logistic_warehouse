const crypto = require('crypto');
const CertificateRequest = require('../models/CertificateRequest');
const {
    CERTIFICATE_KEY_PREFIX,
    reconcileAllEligibleTrainees,
    sendCertificate,
    buildSentCertificatePdf,
    emailConfigured,
    requiredModuleKeys,
} = require('../services/certificateService');
const { writeAuditLog } = require('../utils/auditLogger');

exports.list = async (req, res) => {
    try {
        await reconcileAllEligibleTrainees();
        const moduleKeys = requiredModuleKeys();
        const requests = await CertificateRequest.find({
            certificateKey: new RegExp(`^${CERTIFICATE_KEY_PREFIX}:`),
            status: { $in: ['pending', 'sent', 'failed'] },
        })
            .populate('trainee', 'firstName lastName username email status accountStatus')
            .populate('sentBy', 'firstName lastName username')
            .sort({ eligibleAt: -1 })
            .lean();

        const latestCountByTrainee = new Map();
        requests.forEach(row => {
            const traineeId = String(row.trainee?._id || row.trainee || '');
            const count = Array.isArray(row.moduleKeys) ? row.moduleKeys.length : 0;
            latestCountByTrainee.set(traineeId, Math.max(latestCountByTrainee.get(traineeId) || 0, count));
        });

        const rows = requests.filter(row => row.trainee).map(row => {
            const modules = Array.isArray(row.eligibilitySnapshot?.modules) ? row.eligibilitySnapshot.modules : [];
            const traineeId = String(row.trainee?._id || '');
            return {
                _id: row._id,
                status: row.status,
                moduleKey: row.moduleKey,
                moduleName: row.moduleName,
                moduleKeys: row.moduleKeys || modules.map(module => module.key),
                modules,
                completionCount: (row.moduleKeys || modules).length,
                isLatest: (row.moduleKeys || modules).length === (latestCountByTrainee.get(traineeId) || 0),
                certificateNumber: row.certificateNumber,
                eligibleAt: row.eligibleAt,
                sentAt: row.sentAt,
                recipientEmail: row.trainee.email,
                emailAttempts: row.emailAttempts,
                lastEmailError: row.lastEmailError || '',
                trainee: row.trainee,
                sentBy: row.sentBy,
                rating: row.rating || null,
                downloadAvailable: row.status === 'sent',
            };
        });

        res.json({
            certificates: rows,
            emailConfigured: emailConfigured(),
            requiredModuleKeys: moduleKeys,
            ratingPolicy: {
                scale: 5,
                basis: 'Assessment completion time and assessment attempts for each completed module',
                attemptWeight: 60,
                paceWeight: 40,
            },
            summary: {
                pending: rows.filter(row => row.status === 'pending').length,
                sent: rows.filter(row => row.status === 'sent').length,
                failed: rows.filter(row => row.status === 'failed').length,
            },
        });
    } catch (error) {
        console.error('list certificates failed:', error);
        res.status(500).json({ message: 'Unable to load certificate requests.' });
    }
};

exports.send = async (req, res) => {
    try {
        const certificate = await sendCertificate(req.params.id, req.user.id);
        await writeAuditLog({
            req,
            user: req.user,
            action: 'SEND_CERTIFICATE_EMAIL',
            status: 'success',
            targetType: 'CertificateRequest',
            targetId: certificate._id,
            details: {
                certificateNumber: certificate.certificateNumber,
                moduleKeys: certificate.moduleKeys,
                completedModules: certificate.moduleKeys?.length || 0,
                status: certificate.status,
            },
        });
        res.json({
            message: `Updated certificate with ${certificate.moduleKeys?.length || 1} completed module${certificate.moduleKeys?.length === 1 ? '' : 's'} emailed to ${certificate.recipientEmail}.`,
            certificate: {
                _id: certificate._id,
                status: certificate.status,
                moduleKeys: certificate.moduleKeys,
                moduleName: certificate.moduleName,
                rating: certificate.rating,
                certificateNumber: certificate.certificateNumber,
                recipientEmail: certificate.recipientEmail,
                sentAt: certificate.sentAt,
                downloadAvailable: certificate.status === 'sent',
            },
        });
    } catch (error) {
        console.error('send certificate failed:', error);
        await writeAuditLog({
            req,
            user: req.user,
            action: 'SEND_CERTIFICATE_EMAIL',
            status: 'failure',
            targetType: 'CertificateRequest',
            targetId: req.params.id,
            details: { code: error.code || 'EMAIL_FAILED' },
        }).catch(() => {});
        const status = error.code === 'CERTIFICATE_NOT_FOUND' ? 404
            : ['CERTIFICATE_NOT_ELIGIBLE', 'CERTIFICATE_SUPERSEDED'].includes(error.code) ? 409
                : error.code === 'EMAIL_NOT_CONFIGURED' ? 503 : 502;
        res.status(status).json({ code: error.code || 'CERTIFICATE_EMAIL_FAILED', message: error.message || 'Unable to send certificate email.' });
    }
};

// Gmail compose cannot prove delivery. Admin explicitly confirms after pressing Send in Gmail.
exports.confirmNotification = async (req, res) => {
    try {
        const request = await CertificateRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Certificate not found.' });
        if (request.status === 'superseded') return res.status(409).json({ message: 'This certificate has been replaced by a newer one.' });
        if (request.status !== 'sent') {
            request.status = 'sent';
            request.sentAt = new Date();
            request.sentBy = req.user.id;
            request.recipientEmail = request.recipientEmail || (await require('../models/User').findById(request.trainee).select('email').lean())?.email || '';
            await request.save();
            await writeAuditLog({ req, user: req.user, action: 'CONFIRM_CERTIFICATE_NOTIFICATION', status: 'success', targetType: 'CertificateRequest', targetId: request._id, details: { certificateNumber: request.certificateNumber, recipientEmail: request.recipientEmail, confirmedAt: request.sentAt, method: 'gmail_manual_confirmation' } });
        }
        res.json({ message: 'Notification recorded in certificate history.', certificate: { _id: request._id, status: request.status, sentAt: request.sentAt } });
    } catch (error) {
        console.error('confirm certificate notification failed:', error);
        res.status(500).json({ message: 'Could not record certificate notification.' });
    }
};

exports.download = async (req, res) => {
    try {
        const { request, pdf, filename } = await buildSentCertificatePdf(req.params.id);
        await writeAuditLog({
            req,
            user: req.user,
            action: 'DOWNLOAD_CERTIFICATE_PDF',
            status: 'success',
            targetType: 'CertificateRequest',
            targetId: request._id,
            details: { certificateNumber: request.certificateNumber, moduleKeys: request.moduleKeys },
        }).catch(() => {});
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdf.length);
        res.setHeader('Cache-Control', 'private, no-store');
        res.status(200).send(pdf);
    } catch (error) {
        console.error('download certificate failed:', error);
        const status = error.code === 'CERTIFICATE_NOT_FOUND' ? 404
            : ['CERTIFICATE_NOT_ELIGIBLE', 'CERTIFICATE_SUPERSEDED'].includes(error.code) ? 409
                : error.code === 'CERTIFICATE_DATA_MISSING' ? 422 : 500;
        res.status(status).json({ code: error.code || 'CERTIFICATE_DOWNLOAD_FAILED', message: error.message || 'Unable to download certificate PDF.' });
    }
};

// Short-lived, tamper-proof public links; do not require the trainee to share admin credentials.
const linkSecret = () => process.env.CERTIFICATE_LINK_SECRET || process.env.JWT_REFRESH_SECRET;
const signatureFor = (id, expiry) => crypto.createHmac('sha256', linkSecret()).update(`${id}.${expiry}`).digest('hex');

exports.createLink = async (req, res) => {
    try {
        const { request } = await buildSentCertificatePdf(req.params.id);
        const expiry = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
        const signature = signatureFor(String(request._id), expiry);
        const base = (process.env.PUBLIC_API_URL || '').trim().replace(/\/$/, '');
        if (!/^https:\/\/[^\s/]+(?::\d+)?$/i.test(base) || /^(?:https:\/\/)(?:localhost|127\.0\.0\.1|0\.0\.0\.0|(?:192\.168|10)\.\d+\.\d+\.\d+)(?::|$)/i.test(base)) {
            return res.status(422).json({ message: 'A working public HTTPS backend address is required. Deploy the backend or create an HTTPS tunnel, then set PUBLIC_API_URL in backend/.env. Localhost links cannot be opened by trainees.' });
        }
        const link = `${base}/api/certificate-links/${request._id}/pdf?expires=${expiry}&signature=${signature}`;
        res.json({ link, expiresAt: new Date(expiry * 1000).toISOString() });
    } catch (error) {
        res.status(error.code === 'CERTIFICATE_NOT_FOUND' ? 404 : 409).json({ message: error.message });
    }
};

exports.publicPdf = async (req, res) => {
    try {
        const id = req.params.id;
        const expiry = Number(req.query.expires);
        const signature = String(req.query.signature || '');
        if (!/^[a-f0-9]{24}$/i.test(id) || !Number.isSafeInteger(expiry) || expiry < Math.floor(Date.now() / 1000) || expiry > Math.floor(Date.now() / 1000) + 31 * 86400 || !/^[a-f0-9]{64}$/.test(signature)) return res.status(403).send('Invalid or expired certificate link.');
        const expected = signatureFor(id, expiry);
        if (!crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'))) return res.status(403).send('Invalid certificate link.');
        const { pdf, filename } = await buildSentCertificatePdf(id);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.setHeader('Cache-Control', 'private, no-store');
        res.setHeader('Referrer-Policy', 'no-referrer');
        return res.send(pdf);
    } catch (error) {
        return res.status(error.code === 'CERTIFICATE_NOT_FOUND' ? 404 : 410).send('This certificate is no longer available.');
    }
};

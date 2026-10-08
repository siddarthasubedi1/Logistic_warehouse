const express =
    require("express");


const authenticate =
    require(
        "../middleware/authenticate"
    );


const authorize =
    require(
        "../middleware/authorize"
    );


const checkActiveStatus =
    require(
        "../middleware/checkActiveStatus"
    );


const uploadProfileImage =
    require(
        "../middleware/uploadProfileImage"
    );


const {
    getMyProfile,
    updateProfileImage,
    deleteProfileImage,
    updateDisplayMode,
} = require(
    "../controllers/userController"
);


const {
    getMyTrainingProgress,
    startTrainingModule,
} = require(
    "../controllers/trainingProgressController"
);


const sprint4Progress = require("../controllers/sprint4ProgressController");

const router =
    express.Router();


// ======================================================
// GET OWN PROFILE
//
// Admin
// Trainer
// Trainee
// ======================================================

router.get(
    "/me",

    authenticate,

    authorize(
        "admin",
        "trainer",
        "trainee"
    ),

    checkActiveStatus,

    getMyProfile
);


// ======================================================
// GET TRAINEE'S OWN TRAINING PROGRESS
//
// GET /api/users/me/training-progress
// ======================================================

router.get(
    "/me/training-progress",

    authenticate,

    authorize(
        "trainee"
    ),

    checkActiveStatus,

    sprint4Progress.me
);


router.get('/me/training-progress/modules/:moduleId', authenticate, authorize('trainee'), sprint4Progress.module);
router.get('/me/training-progress/programmes/:programmeId', authenticate, authorize('trainee'), sprint4Progress.programme);

// ======================================================
// START / CONTINUE TRAINING MODULE
//
// POST
// /api/users/me/training-progress/manual-handling/start
//
// POST
// /api/users/me/training-progress/working-at-height/start
// ======================================================

router.post(
    "/me/training-progress/:trainingSection/start",

    authenticate,

    authorize(
        "trainee"
    ),

    checkActiveStatus,

    startTrainingModule
);


// ======================================================
// SAVE OWN DISPLAY MODE
//
// PATCH /api/users/me/display-mode
// ======================================================

router.patch(
    "/me/display-mode",

    authenticate,

    authorize(
        "admin",
        "trainer",
        "trainee"
    ),

    checkActiveStatus,

    updateDisplayMode
);


// ======================================================
// UPLOAD / CHANGE OWN PROFILE IMAGE
//
// Trainer and Trainee only
// ======================================================

router.patch(
    "/me/profile-image",

    authenticate,

    authorize(
        "trainer",
        "trainee"
    ),

    checkActiveStatus,

    uploadProfileImage.single(
        "profileImage"
    ),

    updateProfileImage
);


// ======================================================
// DELETE OWN PROFILE IMAGE
//
// Trainer and Trainee only
// ======================================================

router.delete(
    "/me/profile-image",

    authenticate,

    authorize(
        "trainer",
        "trainee"
    ),

    checkActiveStatus,

    deleteProfileImage
);


// ======================================================
// EXPORT
// ======================================================


// Trainees may only access their own latest eligible cumulative certificate.
const CertificateRequest = require('../models/CertificateRequest');
const { CERTIFICATE_KEY_PREFIX, reconcileCertificateEligibility, buildSentCertificatePdf } = require('../services/certificateService');
const myCertificate = async (req, res, pdfMode = false) => {
    try {
        await reconcileCertificateEligibility(req.user.id);
        const rows = await CertificateRequest.find({
            trainee: req.user.id,
            certificateKey: new RegExp(`^${CERTIFICATE_KEY_PREFIX}:`),
            status: { $in: ['pending', 'sent', 'failed'] }
        }).sort({ eligibleAt: -1 }).lean();
        const current = rows.sort((a,b) => (b.moduleKeys?.length || 0) - (a.moduleKeys?.length || 0))[0];
        if (!current) return res.status(404).json({ message: 'No completed training certificates are available yet.' });
        if (!pdfMode) return res.json({ certificate: {
            id: current._id, certificateNumber: current.certificateNumber,
            modules: current.eligibilitySnapshot?.modules || [],
            eligibleAt: current.eligibleAt,
        }});
        const { pdf, filename } = await buildSentCertificatePdf(current._id);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.setHeader('Cache-Control', 'private, no-store');
        return res.send(pdf);
    } catch (error) {
        console.error('trainee certificate access failed:', error);
        return res.status(500).json({ message: 'Unable to load your certificate.' });
    }
};
router.get('/me/certificate', authenticate, authorize('trainee'), checkActiveStatus, (req,res) => myCertificate(req,res));
router.get('/me/certificate/pdf', authenticate, authorize('trainee'), checkActiveStatus, (req,res) => myCertificate(req,res,true));

require("../middleware/validateRequest").configureRouter(router);

module.exports =
    router;
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

require("../middleware/validateRequest").configureRouter(router);

module.exports =
    router;
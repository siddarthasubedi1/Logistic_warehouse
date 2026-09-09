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
} = require(
    "../controllers/userController"
);


const router =
    express.Router();


// ======================================================
// USER ROUTES
// ======================================================
//
// This router now handles only account/profile
// operations.
//
// Trainee Sprint 2 training access is handled by:
//
// /api/my-training
//
// The old Sprint 1 broad-module progress endpoints:
//
// /api/users/me/training-progress
//
// have been removed.
//
// ======================================================


// ======================================================
// GET OWN PROFILE
//
// GET /api/users/me
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
// UPLOAD / CHANGE OWN PROFILE IMAGE
//
// PATCH /api/users/me/profile-image
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
// DELETE /api/users/me/profile-image
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

module.exports =
    router;
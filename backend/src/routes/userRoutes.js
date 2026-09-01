const express = require("express");

const authenticate =
    require("../middleware/authenticate");

const authorize =
    require("../middleware/authorize");

const checkActiveStatus =
    require("../middleware/checkActiveStatus");

const uploadProfileImage =
    require("../middleware/uploadProfileImage");


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
// GET OWN PROFILE
// Admin, Trainer and Trainee
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
// EXPORT ROUTER
// ======================================================

module.exports = router;
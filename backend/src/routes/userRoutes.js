const express = require("express");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const checkActiveStatus = require("../middleware/checkActiveStatus");

const {
    getMyProfile,
} = require("../controllers/userController");

const router = express.Router();


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
// EXPORT ROUTER
// ======================================================

module.exports = router;
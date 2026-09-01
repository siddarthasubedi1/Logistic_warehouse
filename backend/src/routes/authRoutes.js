const express = require("express");
const rateLimit = require("express-rate-limit");

const authenticate =
    require("../middleware/authenticate");

const checkActiveStatus =
    require("../middleware/checkActiveStatus");

const {
    login,
    changePassword,
    refreshAccessToken,
    logout,
} = require("../controllers/authController");

const {
    requestPasswordReset,
} = require(
    "../controllers/passwordResetController"
);


const router =
    express.Router();


// ======================================================
// LOGIN RATE LIMITER
// ======================================================

const loginLimiter =
    rateLimit({
        windowMs:
            15 * 60 * 1000,

        limit:
            10,

        standardHeaders:
            true,

        legacyHeaders:
            false,

        message: {
            message:
                "Too many login attempts. Please try again later.",
        },
    });


// ======================================================
// FORGOT PASSWORD RATE LIMITER
// ======================================================

const forgotPasswordLimiter =
    rateLimit({
        windowMs:
            15 * 60 * 1000,

        limit:
            5,

        standardHeaders:
            true,

        legacyHeaders:
            false,

        message: {
            message:
                "Too many password reset requests. Please try again later.",
        },
    });


// ======================================================
// PUBLIC ROUTES
// ======================================================

// Login
router.post(
    "/login",
    loginLimiter,
    login
);


// Forgot password request
router.post(
    "/forgot-password",
    forgotPasswordLimiter,
    requestPasswordReset
);


// Refresh access token
router.post(
    "/refresh",
    refreshAccessToken
);


// ======================================================
// PROTECTED ROUTES
// ======================================================

// Change own password
router.post(
    "/change-password",
    authenticate,
    checkActiveStatus,
    changePassword
);


// Logout
router.post(
    "/logout",
    authenticate,
    checkActiveStatus,
    logout
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports =
    router;
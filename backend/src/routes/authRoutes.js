const express = require("express");
const rateLimit = require("express-rate-limit");

const {
    login,
} = require("../controllers/authController");

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,

    message: {
        message:
            "Too many login attempts. Please try again later.",
    },
});

router.post(
    "/login",
    loginLimiter,
    login
);

module.exports = router;
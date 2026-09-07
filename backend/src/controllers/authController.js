const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
    writeAuditLog,
} = require("../utils/auditLogger");

const {
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/generateTokens");


// ======================================================
// HELPER
//
// IMPORTANT:
// Forced first-login password change applies ONLY to:
// - Trainer
// - Trainee
//
// Admin is NEVER included.
// ======================================================

const requiresForcedPasswordChange = (user) => {
    return (
        ["trainer", "trainee"].includes(
            user?.role
        ) &&
        user?.mustChangePassword === true
    );
};


// ======================================================
// LOGIN
// Admin, Trainer and Trainee
// ======================================================

const login = async (req, res) => {
    try {
        const {
            username,
            password,
        } = req.body;


        // ==================================================
        // REQUIRED FIELDS
        // ==================================================

        if (
            !username ||
            !password
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "Username and password are required",
                });
        }


        const normalizedUsername =
            String(username)
                .trim()
                .toLowerCase();


        // ==================================================
        // FIND USER
        // ==================================================

        const user =
            await User.findOne({
                username:
                    normalizedUsername,
            });


        // ==================================================
        // USER NOT FOUND
        // ==================================================

        if (!user) {
            await writeAuditLog({
                req,

                username:
                    normalizedUsername,

                role:
                    "unknown",

                action:
                    "LOGIN_FAILED",

                status:
                    "failure",

                details: {
                    reason:
                        "INVALID_CREDENTIALS",
                },
            });


            return res
                .status(401)
                .json({
                    message:
                        "Invalid username or password",
                });
        }


        // ==================================================
        // ACCOUNT STATUS
        // ==================================================

        if (
            user.status !==
            "active"
        ) {
            await writeAuditLog({
                req,
                user,

                action:
                    "LOGIN_FAILED",

                status:
                    "failure",

                details: {
                    reason:
                        "ACCOUNT_DEACTIVATED",
                },
            });


            return res
                .status(403)
                .json({
                    code:
                        "ACCOUNT_DEACTIVATED",

                    message:
                        "Your account has been deactivated",
                });
        }


        // ==================================================
        // PASSWORD MUST EXIST
        // ==================================================

        if (
            !user.passwordHash
        ) {
            await writeAuditLog({
                req,
                user,

                action:
                    "LOGIN_FAILED",

                status:
                    "failure",

                details: {
                    reason:
                        "ACCOUNT_CREDENTIALS_NOT_READY",
                },
            });


            return res
                .status(401)
                .json({
                    message:
                        "Account credentials are not ready",
                });
        }


        // ==================================================
        // VERIFY PASSWORD
        // ==================================================

        const passwordMatches =
            await bcrypt.compare(
                password,
                user.passwordHash
            );


        if (
            !passwordMatches
        ) {
            await writeAuditLog({
                req,
                user,

                action:
                    "LOGIN_FAILED",

                status:
                    "failure",

                details: {
                    reason:
                        "INVALID_CREDENTIALS",
                },
            });


            return res
                .status(401)
                .json({
                    message:
                        "Invalid username or password",
                });
        }


        // ==================================================
        // DETERMINE WHETHER PASSWORD CHANGE IS REQUIRED
        //
        // ADMIN IS EXCLUDED HERE.
        // ==================================================

        const passwordChangeRequired =
            requiresForcedPasswordChange(
                user
            );


        // ==================================================
        // CREATE ACCESS TOKEN
        // ==================================================

        const accessToken =
            generateAccessToken(
                user
            );


        // ==================================================
        // CREATE REFRESH TOKEN
        // ==================================================

        const refreshToken =
            generateRefreshToken(
                user
            );


        // ==================================================
        // STORE REFRESH TOKEN HASH
        // ==================================================

        user.refreshTokenHash =
            await bcrypt.hash(
                refreshToken,
                12
            );


        await user.save();


        // ==================================================
        // REFRESH TOKEN COOKIE
        // ==================================================

        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly:
                    true,

                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite:
                    "strict",

                maxAge:
                    7 *
                    24 *
                    60 *
                    60 *
                    1000,
            }
        );


        // ==================================================
        // AUDIT LOG
        //
        // Trainer/Trainee using temporary password:
        // TEMPORARY_PASSWORD_LOGIN
        //
        // Admin or normal Trainer/Trainee login:
        // LOGIN_SUCCESS
        // ==================================================

        await writeAuditLog({
            req,
            user,

            action:
                passwordChangeRequired
                    ? "TEMPORARY_PASSWORD_LOGIN"
                    : "LOGIN_SUCCESS",

            status:
                "success",

            details: {
                passwordChangeRequired,
            },
        });


        // ==================================================
        // RESPONSE
        //
        // Important:
        // Admin always receives:
        // mustChangePassword: false
        //
        // even if an old Admin database record accidentally
        // contains mustChangePassword: true.
        // ==================================================

        return res
            .status(200)
            .json({
                message:
                    passwordChangeRequired
                        ? "Login successful. Password change required."
                        : "Login successful",

                accessToken,

                user: {
                    id:
                        user._id,

                    username:
                        user.username,

                    firstName:
                        user.firstName,

                    lastName:
                        user.lastName,

                    email:
                        user.email,

                    role:
                        user.role,

                    status:
                        user.status,

                    mustChangePassword:
                        passwordChangeRequired,
                },
            });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );


        return res
            .status(500)
            .json({
                message:
                    "Server error",
            });
    }
};


// ======================================================
// CHANGE OWN PASSWORD
//
// Admin:
// Can change password normally if you have a profile
// password-change feature.
//
// Trainer/Trainee:
// If using temporary credentials, this completes the
// mandatory first-login password change.
// ======================================================

const changePassword =
    async (req, res) => {
        try {
            const {
                currentPassword,
                newPassword,
            } = req.body;


            // ==================================================
            // REQUIRED FIELDS
            // ==================================================

            if (
                !currentPassword ||
                !newPassword
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Current password and new password are required",
                    });
            }


            // ==================================================
            // PASSWORD LENGTH
            // ==================================================

            if (
                newPassword.length <
                12
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "New password must contain at least 12 characters",
                    });
            }


            // ==================================================
            // CURRENT USER
            // ==================================================

            const user =
                await User.findById(
                    req.user.id
                );


            if (!user) {
                return res
                    .status(404)
                    .json({
                        message:
                            "User not found",
                    });
            }


            // ==================================================
            // ACTIVE USER ONLY
            // ==================================================

            if (
                user.status !==
                "active"
            ) {
                return res
                    .status(403)
                    .json({
                        code:
                            "ACCOUNT_DEACTIVATED",

                        message:
                            "Your account has been deactivated",
                    });
            }


            // ==================================================
            // VERIFY CURRENT PASSWORD
            // ==================================================

            if (
                !user.passwordHash
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Current password is unavailable",
                    });
            }


            const currentPasswordMatches =
                await bcrypt.compare(
                    currentPassword,
                    user.passwordHash
                );


            // ==================================================
            // ONLY TRAINER/TRAINEE CAN BE IN FORCED MODE
            // ==================================================

            const forcedPasswordChange =
                requiresForcedPasswordChange(
                    user
                );


            if (
                !currentPasswordMatches
            ) {
                await writeAuditLog({
                    req,
                    user,

                    action:
                        forcedPasswordChange
                            ? "FORCED_PASSWORD_CHANGE_FAILED"
                            : "PASSWORD_CHANGE_FAILED",

                    status:
                        "failure",

                    details: {
                        reason:
                            "CURRENT_PASSWORD_INCORRECT",
                    },
                });


                return res
                    .status(400)
                    .json({
                        message:
                            "Current password is incorrect",
                    });
            }


            // ==================================================
            // NEW PASSWORD MUST BE DIFFERENT
            // ==================================================

            const samePassword =
                await bcrypt.compare(
                    newPassword,
                    user.passwordHash
                );


            if (
                samePassword
            ) {
                await writeAuditLog({
                    req,
                    user,

                    action:
                        forcedPasswordChange
                            ? "FORCED_PASSWORD_CHANGE_FAILED"
                            : "PASSWORD_CHANGE_FAILED",

                    status:
                        "failure",

                    details: {
                        reason:
                            "PASSWORD_REUSE",
                    },
                });


                return res
                    .status(400)
                    .json({
                        message:
                            "New password must be different from the current password",
                    });
            }


            // ==================================================
            // HASH NEW PASSWORD
            // ==================================================

            user.passwordHash =
                await bcrypt.hash(
                    newPassword,
                    12
                );


            // ==================================================
            // COMPLETE TEMPORARY PASSWORD FLOW
            //
            // Only necessary for Trainer/Trainee.
            // Setting false for Admin is harmless as well.
            // ==================================================

            if (
                ["trainer", "trainee"].includes(
                    user.role
                )
            ) {
                user.mustChangePassword =
                    false;
            }


            // ==================================================
            // INVALIDATE OLD ACCESS TOKENS
            // ==================================================

            user.authVersion =
                (
                    user.authVersion ||
                    0
                ) + 1;


            // ==================================================
            // REMOVE REFRESH SESSION
            // ==================================================

            user.refreshTokenHash =
                null;


            await user.save();


            // ==================================================
            // AUDIT LOG
            // ==================================================

            await writeAuditLog({
                req,
                user,

                action:
                    forcedPasswordChange
                        ? "FORCED_PASSWORD_CHANGE_COMPLETED"
                        : "PASSWORD_CHANGED",

                status:
                    "success",

                details: {
                    forcedPasswordChange,
                },
            });


            // ==================================================
            // CLEAR COOKIE
            // ==================================================

            res.clearCookie(
                "refreshToken",
                {
                    httpOnly:
                        true,

                    secure:
                        process.env.NODE_ENV ===
                        "production",

                    sameSite:
                        "strict",
                }
            );


            // ==================================================
            // USER MUST LOGIN AGAIN
            // ==================================================

            return res
                .status(200)
                .json({
                    message:
                        "Password changed successfully. Please log in again.",
                });

        } catch (error) {
            console.error(
                "Change password error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Server error",
                });
        }
    };


// ======================================================
// REFRESH ACCESS TOKEN
// ======================================================

const refreshAccessToken =
    async (req, res) => {
        try {
            const refreshToken =
                req.cookies
                    ?.refreshToken;


            if (
                !refreshToken
            ) {
                return res
                    .status(401)
                    .json({
                        message:
                            "Refresh token is required",
                    });
            }


            // ==================================================
            // VERIFY REFRESH TOKEN
            // ==================================================

            let decoded;


            try {
                decoded =
                    jwt.verify(
                        refreshToken,

                        process.env
                            .JWT_REFRESH_SECRET
                    );

            } catch {
                return res
                    .status(401)
                    .json({
                        message:
                            "Invalid or expired refresh token",
                    });
            }


            // ==================================================
            // USER
            // ==================================================

            const user =
                await User.findById(
                    decoded.id
                );


            if (!user) {
                return res
                    .status(401)
                    .json({
                        message:
                            "User not found",
                    });
            }


            // ==================================================
            // ACTIVE ACCOUNT
            // ==================================================

            if (
                user.status !==
                "active"
            ) {
                return res
                    .status(403)
                    .json({
                        code:
                            "ACCOUNT_DEACTIVATED",

                        message:
                            "Your account has been deactivated",
                    });
            }


            // ==================================================
            // REFRESH SESSION EXISTS
            // ==================================================

            if (
                !user.refreshTokenHash
            ) {
                return res
                    .status(401)
                    .json({
                        message:
                            "Refresh session is no longer valid",
                    });
            }


            // ==================================================
            // VERIFY STORED REFRESH TOKEN
            // ==================================================

            const refreshTokenMatches =
                await bcrypt.compare(
                    refreshToken,
                    user.refreshTokenHash
                );


            if (
                !refreshTokenMatches
            ) {
                return res
                    .status(401)
                    .json({
                        message:
                            "Invalid refresh session",
                    });
            }


            // ==================================================
            // AUTH VERSION CHECK
            // ==================================================

            const tokenAuthVersion =
                decoded.authVersion ||
                0;


            const currentAuthVersion =
                user.authVersion ||
                0;


            if (
                tokenAuthVersion !==
                currentAuthVersion
            ) {
                return res
                    .status(401)
                    .json({
                        code:
                            "SESSION_REVOKED",

                        message:
                            "Your session is no longer valid. Please log in again.",
                    });
            }


            // ==================================================
            // NEW ACCESS TOKEN
            // ==================================================

            const accessToken =
                generateAccessToken(
                    user
                );


            return res
                .status(200)
                .json({
                    message:
                        "Access token refreshed successfully",

                    accessToken,
                });

        } catch (error) {
            console.error(
                "Refresh token error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Server error",
                });
        }
    };


// ======================================================
// LOGOUT
// ======================================================

const logout =
    async (req, res) => {
        try {
            const user =
                await User.findById(
                    req.user.id
                );


            if (user) {
                user.refreshTokenHash =
                    null;


                await user.save();


                await writeAuditLog({
                    req,
                    user,

                    action:
                        "LOGOUT",

                    status:
                        "success",
                });
            }


            res.clearCookie(
                "refreshToken",
                {
                    httpOnly:
                        true,

                    secure:
                        process.env.NODE_ENV ===
                        "production",

                    sameSite:
                        "strict",
                }
            );


            return res
                .status(200)
                .json({
                    message:
                        "Logged out successfully",
                });

        } catch (error) {
            console.error(
                "Logout error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Server error",
                });
        }
    };


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    login,
    changePassword,
    refreshAccessToken,
    logout,
};
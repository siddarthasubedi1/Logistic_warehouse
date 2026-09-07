const bcrypt =
    require("bcrypt");


const User =
    require("../models/User");


const PasswordResetRequest =
    require(
        "../models/PasswordResetRequest"
    );


const generatePassword =
    require(
        "../utils/generatePassword"
    );


const {
    writeAuditLog,
} = require(
    "../utils/auditLogger"
);


// ======================================================
// REQUEST PASSWORD RESET
//
// PUBLIC
//
// POST /api/auth/forgot-password
// ======================================================

const requestPasswordReset =
    async (req, res) => {
        try {
            const username =
                req.body.username
                    ?.trim()
                    .toLowerCase();


            // ==================================================
            // USERNAME REQUIRED
            // ==================================================

            if (
                !username
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Username is required.",
                    });
            }


            // ==================================================
            // FIND USER
            // ==================================================

            const user =
                await User.findOne({
                    username,
                });


            /*
                Only Trainer and Trainee
                can request password reset.

                We intentionally do not reveal
                whether the username exists.
            */

            if (
                user &&
                user.status ===
                "active" &&
                [
                    "trainer",
                    "trainee",
                ].includes(
                    user.role
                )
            ) {
                // ==================================================
                // CHECK EXISTING REQUEST
                // ==================================================

                const existingRequest =
                    await PasswordResetRequest
                        .findOne({
                            user:
                                user._id,

                            status:
                                "pending",
                        });


                // ==================================================
                // CREATE REQUEST IF NOT ALREADY PENDING
                // ==================================================

                if (
                    !existingRequest
                ) {
                    await PasswordResetRequest
                        .create({
                            user:
                                user._id,

                            username:
                                user.username,

                            role:
                                user.role,

                            status:
                                "pending",

                            requestedAt:
                                new Date(),
                        });
                }
            }


            // ==================================================
            // GENERIC RESPONSE
            //
            // Prevent username enumeration.
            // ==================================================

            return res
                .status(200)
                .json({
                    message:
                        "If this username belongs to an active Trainer or Trainee account, a password reset request has been sent to the administrator.",
                });

        } catch (error) {
            console.error(
                "Password reset request error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to process password reset request.",
                });
        }
    };


// ======================================================
// ADMIN - GET PASSWORD RESET REQUESTS
//
// GET /api/admin/password-reset-requests
// ======================================================

const getPasswordResetRequests =
    async (req, res) => {
        try {
            const requests =
                await PasswordResetRequest
                    .find({
                        status:
                            "pending",
                    })
                    .populate(
                        "user",
                        [
                            "firstName",
                            "lastName",
                            "username",
                            "email",
                            "role",
                            "status",
                        ].join(" ")
                    )
                    .sort({
                        requestedAt:
                            -1,
                    });


            return res
                .status(200)
                .json(
                    requests
                );

        } catch (error) {
            console.error(
                "Get password reset requests error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to load password reset requests.",
                });
        }
    };


// ======================================================
// ADMIN RESET TRAINER / TRAINEE PASSWORD
//
// POST /api/admin/users/:id/reset-password
// ======================================================

const resetUserPassword =
    async (req, res) => {
        try {
            // ==================================================
            // FIND USER
            // ==================================================

            const user =
                await User.findById(
                    req.params.id
                );


            if (
                !user
            ) {
                return res
                    .status(404)
                    .json({
                        message:
                            "User not found.",
                    });
            }


            // ==================================================
            // TRAINER / TRAINEE ONLY
            //
            // ADMIN IS NEVER RESET THROUGH THIS FLOW.
            // ==================================================

            if (
                ![
                    "trainer",
                    "trainee",
                ].includes(
                    user.role
                )
            ) {
                return res
                    .status(403)
                    .json({
                        code:
                            "PASSWORD_RESET_NOT_ALLOWED",

                        message:
                            "Only Trainer and Trainee passwords can be reset using this function.",
                    });
            }


            // ==================================================
            // ACTIVE ACCOUNT ONLY
            // ==================================================

            if (
                user.status !==
                "active"
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "ACCOUNT_NOT_ACTIVE",

                        message:
                            "Only active accounts can have their password reset.",
                    });
            }


            // ==================================================
            // REQUIRE PENDING RESET REQUEST
            // ==================================================

            const resetRequest =
                await PasswordResetRequest
                    .findOne({
                        user:
                            user._id,

                        status:
                            "pending",
                    });


            if (
                !resetRequest
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "NO_RESET_REQUEST",

                        message:
                            "This user does not have a pending password reset request.",
                    });
            }


            // ==================================================
            // GENERATE NEW TEMPORARY PASSWORD
            // ==================================================

            const temporaryPassword =
                generatePassword();


            // ==================================================
            // HASH PASSWORD
            // ==================================================

            const passwordHash =
                await bcrypt.hash(
                    temporaryPassword,
                    12
                );


            // ==================================================
            // UPDATE PASSWORD
            // ==================================================

            user.passwordHash =
                passwordHash;


            // ==================================================
            // FORCE PASSWORD CHANGE AFTER NEXT LOGIN
            //
            // Trainer/Trainee only.
            // ==================================================

            user.mustChangePassword =
                true;


            // ==================================================
            // REVOKE REFRESH TOKEN
            // ==================================================

            user.refreshTokenHash =
                null;


            // ==================================================
            // REVOKE CURRENT ACCESS TOKENS
            // ==================================================

            user.authVersion =
                (
                    user.authVersion ||
                    0
                ) + 1;


            await user.save();


            // ==================================================
            // COMPLETE RESET REQUEST
            // ==================================================

            resetRequest.status =
                "completed";


            resetRequest.completedAt =
                new Date();


            resetRequest.completedBy =
                req.user.id;


            await resetRequest.save();


            // ==================================================
            // AUDIT LOG
            //
            // Temporary password is NEVER stored.
            // ==================================================

            await writeAuditLog({
                req,

                user:
                    req.user,

                action:
                    "ADMIN_RESET_USER_PASSWORD",

                status:
                    "success",

                targetUser:
                    user,

                details: {
                    message:
                        `Admin reset the password for ${user.firstName} ${user.lastName}`,

                    mustChangePassword:
                        true,

                    resetRequestId:
                        resetRequest
                            ._id
                            .toString(),
                },
            });


            // ==================================================
            // RETURN TEMPORARY PASSWORD ONCE
            // ==================================================

            return res
                .status(200)
                .json({
                    message:
                        "Password reset successfully. The temporary password is shown only once.",

                    user: {
                        id:
                            user._id,

                        firstName:
                            user.firstName,

                        lastName:
                            user.lastName,

                        username:
                            user.username,

                        email:
                            user.email,

                        role:
                            user.role,

                        status:
                            user.status,
                    },

                    credentials: {
                        username:
                            user.username,

                        password:
                            temporaryPassword,
                    },
                });

        } catch (error) {
            console.error(
                "Reset password error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to reset password.",
                });
        }
    };


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    requestPasswordReset,
    getPasswordResetRequests,
    resetUserPassword,
};
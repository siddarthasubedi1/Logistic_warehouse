const bcrypt = require("bcrypt");

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


/*
=========================================================
REQUEST PASSWORD RESET
PUBLIC ENDPOINT

POST /api/auth/forgot-password
=========================================================
*/

const requestPasswordReset =
    async (req, res) => {
        try {
            const username =
                req.body.username
                    ?.trim()
                    .toLowerCase();


            if (!username) {
                return res.status(400).json({
                    message:
                        "Username is required.",
                });
            }


            /*
                Find matching account.

                IMPORTANT:
                Response must not reveal whether
                the account exists.
            */

            const user =
                await User.findOne({
                    username,
                });


            /*
                Password-reset request is allowed
                only for Trainer and Trainee.
            */

            if (
                user &&
                user.status ===
                "active" &&
                (
                    user.role ===
                    "trainer" ||
                    user.role ===
                    "trainee"
                )
            ) {
                /*
                    Avoid duplicate pending requests.
                */

                const existingRequest =
                    await PasswordResetRequest
                        .findOne({
                            user:
                                user._id,

                            status:
                                "pending",
                        });


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


            /*
                Always return same public response.

                Prevents username enumeration.
            */

            return res.status(200).json({
                message:
                    "If this username belongs to an active Trainer or Trainee account, a password reset request has been sent to the administrator.",
            });

        } catch (error) {
            console.error(
                "Password reset request error:",
                error.message
            );


            return res.status(500).json({
                message:
                    "Unable to process password reset request.",
            });
        }
    };


/*
=========================================================
ADMIN - LIST PENDING RESET REQUESTS

GET /api/admin/password-reset-requests
=========================================================
*/

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


            return res.status(200).json(
                requests
            );

        } catch (error) {
            console.error(
                "Get password reset requests error:",
                error.message
            );


            return res.status(500).json({
                message:
                    "Unable to load password reset requests.",
            });
        }
    };


/*
=========================================================
ADMIN - RESET USER PASSWORD

POST /api/admin/users/:id/reset-password
=========================================================
*/

const resetUserPassword =
    async (req, res) => {
        try {
            const user =
                await User.findById(
                    req.params.id
                );


            if (!user) {
                return res.status(404).json({
                    message:
                        "User not found.",
                });
            }


            /*
                Never reset Admin through this flow.
            */

            if (
                ![
                    "trainer",
                    "trainee",
                ].includes(
                    user.role
                )
            ) {
                return res.status(403).json({
                    code:
                        "PASSWORD_RESET_NOT_ALLOWED",

                    message:
                        "Only Trainer and Trainee passwords can be reset using this function.",
                });
            }


            if (
                user.status !==
                "active"
            ) {
                return res.status(400).json({
                    code:
                        "ACCOUNT_NOT_ACTIVE",

                    message:
                        "Only active accounts can have their password reset.",
                });
            }


            /*
                Require a real pending request.
            */

            const resetRequest =
                await PasswordResetRequest
                    .findOne({
                        user:
                            user._id,

                        status:
                            "pending",
                    });


            if (!resetRequest) {
                return res.status(400).json({
                    code:
                        "NO_RESET_REQUEST",

                    message:
                        "This user does not have a pending password reset request.",
                });
            }


            /*
                Generate secure temporary password.
            */

            const temporaryPassword =
                generatePassword();


            const passwordHash =
                await bcrypt.hash(
                    temporaryPassword,
                    12
                );


            /*
                Keep SAME username.
                Change only password.
            */

            user.passwordHash =
                passwordHash;


            /*
                Force password change after login.
            */

            user.mustChangePassword =
                true;


            /*
                Revoke refresh token.
            */

            user.refreshTokenHash =
                null;


            /*
                Revoke current access tokens too.
            */

            user.authVersion =
                (user.authVersion || 0) +
                1;


            await user.save();


            /*
                Mark reset request completed.
            */

            resetRequest.status =
                "completed";

            resetRequest.completedAt =
                new Date();

            resetRequest.completedBy =
                req.user.id;


            await resetRequest.save();


            /*
                Plaintext password is returned
                once only.

                It is never saved in MongoDB.
            */

            return res.status(200).json({
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
                error.message
            );


            return res.status(500).json({
                message:
                    "Unable to reset password.",
            });
        }
    };


module.exports = {
    requestPasswordReset,
    getPasswordResetRequests,
    resetUserPassword,
};
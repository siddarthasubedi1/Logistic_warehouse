const bcrypt =
    require("bcrypt");


const User =
    require("../models/User");


const {
    writeAuditLog,
} = require(
    "../utils/auditLogger"
);


const generateUsername =
    require(
        "../utils/generateUsername"
    );


const generatePassword =
    require(
        "../utils/generatePassword"
    );


// ======================================================
// GENERATE USERNAME + TEMPORARY PASSWORD
//
// POST /api/admin/generate-credentials
// ======================================================

const generateCredentials =
    async (req, res) => {
        try {
            const {
                pendingUserId,
            } = req.body;


            // ==================================================
            // REQUIRED ID
            // ==================================================

            if (
                !pendingUserId
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Pending user ID is required",
                    });
            }


            // ==================================================
            // FIND PENDING USER
            // ==================================================

            const user =
                await User.findOne({
                    _id:
                        pendingUserId,

                    role: {
                        $in: [
                            "trainer",
                            "trainee",
                        ],
                    },

                    accountStatus:
                        "pending",
                });


            if (
                !user
            ) {
                return res
                    .status(404)
                    .json({
                        message:
                            "Pending user not found",
                    });
            }


            // ==================================================
            // TRAINER / TRAINEE ONLY
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
                    .status(400)
                    .json({
                        message:
                            "Invalid user role",
                    });
            }


            // ==================================================
            // GENERATE USERNAME
            // ==================================================

            const username =
                await generateUsername(
                    user.firstName,
                    user.lastName
                );


            // ==================================================
            // GENERATE TEMPORARY PASSWORD
            // ==================================================

            const generatedPassword =
                generatePassword();


            // ==================================================
            // HASH TEMPORARY PASSWORD
            // ==================================================

            const passwordHash =
                await bcrypt.hash(
                    generatedPassword,
                    12
                );


            // ==================================================
            // UPDATE USER
            // ==================================================

            user.username =
                username;


            user.passwordHash =
                passwordHash;


            user.accountStatus =
                "created";


            user.status =
                "active";


            /*
                Trainer/Trainee must change this
                generated password at first login.
            */

            user.mustChangePassword =
                true;


            await user.save();


            // ==================================================
            // AUDIT LOG
            //
            // IMPORTANT:
            // Keep the approved Sprint 1 action name.
            //
            // Never save generated password.
            // ==================================================

            await writeAuditLog({
                req,

                user:
                    req.user,

                action:
                    "TEMPORARY_CREDENTIALS_GENERATED",

                status:
                    "success",

                targetUser:
                    user,

                details: {
                    message:
                        `Admin generated temporary login credentials for ${user.firstName} ${user.lastName}`,

                    temporaryPasswordRequired:
                        true,
                },
            });


            // ==================================================
            // RETURN CREDENTIALS ONCE
            // ==================================================

            return res
                .status(200)
                .json({
                    message:
                        "Account generated successfully. These credentials are shown only once.",

                    user: {
                        id:
                            user._id,

                        firstName:
                            user.firstName,

                        lastName:
                            user.lastName,

                        age:
                            user.age,

                        email:
                            user.email,

                        phoneNumber:
                            user.phoneNumber,

                        address:
                            user.address,

                        gender:
                            user.gender,

                        role:
                            user.role,

                        status:
                            user.status,

                        accountStatus:
                            user.accountStatus,

                        assignedTrainingSections:
                            user.assignedTrainingSections,
                    },

                    credentials: {
                        username:
                            username,

                        password:
                            generatedPassword,
                    },
                });

        } catch (error) {
            console.error(
                "Generate credentials error:",
                error
            );


            if (
                error.name ===
                "CastError"
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid pending user ID",
                    });
            }


            if (
                error.code ===
                11000
            ) {
                return res
                    .status(409)
                    .json({
                        message:
                            "Generated username already exists. Please try again.",
                    });
            }


            return res
                .status(500)
                .json({
                    message:
                        "Unable to generate account credentials",
                });
        }
    };


// ======================================================
// LIST CREATED TRAINERS + TRAINEES
//
// GET /api/admin/users
// ======================================================

const listUsers =
    async (req, res) => {
        try {
            const users =
                await User.find({
                    role: {
                        $in: [
                            "trainer",
                            "trainee",
                        ],
                    },

                    accountStatus:
                        "created",
                })
                    .select(
                        [
                            "_id",
                            "firstName",
                            "lastName",
                            "age",
                            "username",
                            "email",
                            "phoneNumber",
                            "address",
                            "gender",
                            "role",
                            "status",
                            "accountStatus",
                            "assignedTrainingSections",
                            "mustChangePassword",
                            "createdAt",
                            "updatedAt",
                        ].join(" ")
                    )
                    .sort({
                        createdAt:
                            -1,
                    });


            return res
                .status(200)
                .json({
                    users,
                });

        } catch (error) {
            console.error(
                "List users error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to load users",
                });
        }
    };


// ======================================================
// UPDATE TRAINER / TRAINEE
//
// PATCH /api/admin/users/:id
// ======================================================

const updateUser =
    async (req, res) => {
        try {
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
                            "User not found",
                    });
            }


            // ==================================================
            // TRAINER / TRAINEE ONLY
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
                        message:
                            "Only Trainer and Trainee accounts can be edited",
                    });
            }


            // ==================================================
            // CREATED ACCOUNT ONLY
            // ==================================================

            if (
                user.accountStatus !==
                "created"
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Only created user accounts can be edited",
                    });
            }


            const previousData = {
                firstName:
                    user.firstName,

                lastName:
                    user.lastName,

                age:
                    user.age,

                email:
                    user.email,

                phoneNumber:
                    user.phoneNumber,

                address:
                    user.address,

                gender:
                    user.gender,
            };


            const changedFields = {};


            // ==================================================
            // FIRST NAME
            // ==================================================

            if (
                req.body.firstName !==
                undefined
            ) {
                const value =
                    String(
                        req.body.firstName
                    ).trim();


                if (
                    !value
                ) {
                    return res
                        .status(400)
                        .json({
                            message:
                                "First name cannot be empty",
                        });
                }


                if (
                    value !==
                    user.firstName
                ) {
                    changedFields.firstName = {
                        from:
                            user.firstName,

                        to:
                            value,
                    };


                    user.firstName =
                        value;
                }
            }


            // ==================================================
            // LAST NAME
            // ==================================================

            if (
                req.body.lastName !==
                undefined
            ) {
                const value =
                    String(
                        req.body.lastName
                    ).trim();


                if (
                    !value
                ) {
                    return res
                        .status(400)
                        .json({
                            message:
                                "Last name cannot be empty",
                        });
                }


                if (
                    value !==
                    user.lastName
                ) {
                    changedFields.lastName = {
                        from:
                            user.lastName,

                        to:
                            value,
                    };


                    user.lastName =
                        value;
                }
            }


            // ==================================================
            // AGE
            // ==================================================

            if (
                req.body.age !==
                undefined
            ) {
                const age =
                    Number(
                        req.body.age
                    );


                if (
                    !Number.isInteger(
                        age
                    ) ||
                    age <
                    16
                ) {
                    return res
                        .status(400)
                        .json({
                            message:
                                "Age must be 16 or above",
                        });
                }


                if (
                    age !==
                    user.age
                ) {
                    changedFields.age = {
                        from:
                            user.age,

                        to:
                            age,
                    };


                    user.age =
                        age;
                }
            }


            // ==================================================
            // EMAIL
            // ==================================================

            if (
                req.body.email !==
                undefined
            ) {
                const normalizedEmail =
                    String(
                        req.body.email
                    )
                        .trim()
                        .toLowerCase();


                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailRegex.test(
                        normalizedEmail
                    )
                ) {
                    return res
                        .status(400)
                        .json({
                            message:
                                "Please enter a valid email address",
                        });
                }


                const existingEmailUser =
                    await User.findOne({
                        email:
                            normalizedEmail,

                        _id: {
                            $ne:
                                user._id,
                        },
                    });


                if (
                    existingEmailUser
                ) {
                    return res
                        .status(409)
                        .json({
                            message:
                                "Another user already uses this email address",
                        });
                }


                if (
                    normalizedEmail !==
                    user.email
                ) {
                    changedFields.email = {
                        from:
                            user.email,

                        to:
                            normalizedEmail,
                    };


                    user.email =
                        normalizedEmail;
                }
            }


            // ==================================================
            // PHONE NUMBER
            // ==================================================

            if (
                req.body.phoneNumber !==
                undefined
            ) {
                const value =
                    String(
                        req.body.phoneNumber
                    ).trim();


                if (
                    !value
                ) {
                    return res
                        .status(400)
                        .json({
                            message:
                                "Phone number cannot be empty",
                        });
                }


                if (
                    value !==
                    user.phoneNumber
                ) {
                    changedFields.phoneNumber = {
                        from:
                            user.phoneNumber,

                        to:
                            value,
                    };


                    user.phoneNumber =
                        value;
                }
            }


            // ==================================================
            // ADDRESS
            // ==================================================

            if (
                req.body.address !==
                undefined
            ) {
                const value =
                    String(
                        req.body.address
                    ).trim();


                if (
                    !value
                ) {
                    return res
                        .status(400)
                        .json({
                            message:
                                "Address cannot be empty",
                        });
                }


                if (
                    value !==
                    user.address
                ) {
                    changedFields.address = {
                        from:
                            user.address,

                        to:
                            value,
                    };


                    user.address =
                        value;
                }
            }


            // ==================================================
            // GENDER
            // ==================================================

            if (
                req.body.gender !==
                undefined
            ) {
                const normalizedGender =
                    String(
                        req.body.gender
                    )
                        .trim()
                        .toLowerCase();


                if (
                    ![
                        "male",
                        "female",
                        "other",
                    ].includes(
                        normalizedGender
                    )
                ) {
                    return res
                        .status(400)
                        .json({
                            message:
                                "Please select a valid gender",
                        });
                }


                if (
                    normalizedGender !==
                    user.gender
                ) {
                    changedFields.gender = {
                        from:
                            user.gender,

                        to:
                            normalizedGender,
                    };


                    user.gender =
                        normalizedGender;
                }
            }


            // ==================================================
            // NOTHING CHANGED
            // ==================================================

            if (
                Object.keys(
                    changedFields
                ).length === 0
            ) {
                return res
                    .status(200)
                    .json({
                        message:
                            "No user information was changed",

                        user,
                    });
            }


            // ==================================================
            // SAVE
            // ==================================================

            await user.save();


            // ==================================================
            // UPDATED DATA
            // ==================================================

            const updatedData = {
                firstName:
                    user.firstName,

                lastName:
                    user.lastName,

                age:
                    user.age,

                email:
                    user.email,

                phoneNumber:
                    user.phoneNumber,

                address:
                    user.address,

                gender:
                    user.gender,
            };


            // ==================================================
            // AUDIT LOG
            // ==================================================

            await writeAuditLog({
                req,

                user:
                    req.user,

                action:
                    "ADMIN_EDITED_USER",

                status:
                    "success",

                targetUser:
                    user,

                details: {
                    message:
                        `Admin edited ${user.firstName} ${user.lastName}`,

                    previousData,

                    updatedData,

                    changedFields,
                },
            });


            // ==================================================
            // RESPONSE
            // ==================================================

            return res
                .status(200)
                .json({
                    message:
                        "User updated successfully",

                    user: {
                        id:
                            user._id,

                        firstName:
                            user.firstName,

                        lastName:
                            user.lastName,

                        age:
                            user.age,

                        username:
                            user.username,

                        email:
                            user.email,

                        phoneNumber:
                            user.phoneNumber,

                        address:
                            user.address,

                        gender:
                            user.gender,

                        role:
                            user.role,

                        status:
                            user.status,

                        accountStatus:
                            user.accountStatus,

                        assignedTrainingSections:
                            user.assignedTrainingSections,
                    },
                });

        } catch (error) {
            console.error(
                "Update user error:",
                error
            );


            if (
                error.code ===
                11000
            ) {
                return res
                    .status(409)
                    .json({
                        message:
                            "This email address is already being used",
                    });
            }


            return res
                .status(500)
                .json({
                    message:
                        "Unable to update user",
                });
        }
    };


// ======================================================
// DEACTIVATE USER
//
// PATCH /api/admin/users/:id/deactivate
// ======================================================

const deactivateUser =
    async (req, res) => {
        try {
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
                            "User not found",
                    });
            }


            if (
                user.role ===
                "admin"
            ) {
                return res
                    .status(403)
                    .json({
                        message:
                            "Administrator accounts cannot be deactivated",
                    });
            }


            if (
                user.accountStatus !==
                "created"
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Pending users cannot be deactivated",
                    });
            }


            if (
                user.status ===
                "deactivated"
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "User is already deactivated",
                    });
            }


            // ==================================================
            // CHANGE STATUS
            // ==================================================

            user.status =
                "deactivated";


            // ==================================================
            // INVALIDATE LOGIN
            // ==================================================

            user.refreshTokenHash =
                null;


            user.authVersion =
                (
                    user.authVersion ||
                    0
                ) + 1;


            await user.save();


            // ==================================================
            // AUDIT LOG
            // ==================================================

            await writeAuditLog({
                req,

                user:
                    req.user,

                action:
                    "ADMIN_DEACTIVATED_USER",

                status:
                    "success",

                targetUser:
                    user,

                details: {
                    message:
                        `Admin deactivated ${user.firstName} ${user.lastName}`,
                },
            });


            return res
                .status(200)
                .json({
                    message:
                        "User deactivated successfully",

                    user: {
                        id:
                            user._id,

                        username:
                            user.username,

                        firstName:
                            user.firstName,

                        lastName:
                            user.lastName,

                        role:
                            user.role,

                        status:
                            user.status,
                    },
                });

        } catch (error) {
            console.error(
                "Deactivate user error:",
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
// REACTIVATE USER
//
// PATCH /api/admin/users/:id/reactivate
// ======================================================

const reactivateUser =
    async (req, res) => {
        try {
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
                            "User not found",
                    });
            }


            if (
                user.role ===
                "admin"
            ) {
                return res
                    .status(403)
                    .json({
                        message:
                            "Administrator accounts cannot be reactivated through this endpoint",
                    });
            }


            if (
                user.accountStatus !==
                "created"
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Pending users cannot be reactivated",
                    });
            }


            if (
                user.status ===
                "active"
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "User is already active",
                    });
            }


            // ==================================================
            // ACTIVATE USER
            // ==================================================

            user.status =
                "active";


            await user.save();


            // ==================================================
            // AUDIT LOG
            // ==================================================

            await writeAuditLog({
                req,

                user:
                    req.user,

                action:
                    "ADMIN_REACTIVATED_USER",

                status:
                    "success",

                targetUser:
                    user,

                details: {
                    message:
                        `Admin reactivated ${user.firstName} ${user.lastName}`,
                },
            });


            return res
                .status(200)
                .json({
                    message:
                        "User reactivated successfully",

                    user: {
                        id:
                            user._id,

                        username:
                            user.username,

                        firstName:
                            user.firstName,

                        lastName:
                            user.lastName,

                        role:
                            user.role,

                        status:
                            user.status,
                    },
                });

        } catch (error) {
            console.error(
                "Reactivate user error:",
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
// DELETE USER
//
// DELETE /api/admin/users/:id
// ======================================================

const deleteUser =
    async (req, res) => {
        try {
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
                            "User not found",
                    });
            }


            // ==================================================
            // ADMIN CANNOT BE DELETED
            // ==================================================

            if (
                user.role ===
                "admin"
            ) {
                return res
                    .status(403)
                    .json({
                        message:
                            "Administrator accounts cannot be deleted",
                    });
            }


            // ==================================================
            // COPY TARGET INFORMATION BEFORE DELETE
            // ==================================================

            const deletedUserSnapshot = {
                _id:
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

                accountStatus:
                    user.accountStatus,
            };


            // ==================================================
            // AUDIT LOG BEFORE DELETE
            // ==================================================

            await writeAuditLog({
                req,

                user:
                    req.user,

                action:
                    "ADMIN_DELETED_USER",

                status:
                    "success",

                targetUser:
                    deletedUserSnapshot,

                details: {
                    message:
                        `Admin deleted ${user.firstName} ${user.lastName}`,

                    assignedTrainingSections:
                        user.assignedTrainingSections ||
                        [],
                },
            });


            // ==================================================
            // DELETE
            // ==================================================

            await user.deleteOne();


            return res
                .status(200)
                .json({
                    message:
                        "User deleted successfully",
                });

        } catch (error) {
            console.error(
                "Delete user error:",
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
    generateCredentials,
    listUsers,
    updateUser,
    deactivateUser,
    reactivateUser,
    deleteUser,
};
const User =
    require("../models/User");


const {
    writeAuditLog,
} = require(
    "../utils/auditLogger"
);


// ======================================================
// TRAINING SECTIONS
// ======================================================

const ALLOWED_TRAINING_SECTIONS = [
    "manual-handling",
    "working-at-height",
];


// ======================================================
// VALIDATE TRAINING SECTIONS
// ======================================================

const validateTrainingSections = (
    trainingSections
) => {
    if (
        !Array.isArray(
            trainingSections
        )
    ) {
        return {
            valid: false,

            message:
                "Training sections must be provided as an array",
        };
    }


    const uniqueSections = [
        ...new Set(
            trainingSections
        ),
    ];


    if (
        uniqueSections.length ===
        0
    ) {
        return {
            valid: false,

            message:
                "Please select at least one training section",
        };
    }


    const invalidSection =
        uniqueSections.find(
            (section) =>
                !ALLOWED_TRAINING_SECTIONS.includes(
                    section
                )
        );


    if (
        invalidSection
    ) {
        return {
            valid: false,

            message:
                "One or more selected training sections are invalid",
        };
    }


    return {
        valid: true,

        sections:
            uniqueSections,
    };
};


// ======================================================
// CREATE PENDING TRAINER / TRAINEE
//
// POST /api/admin/pending-users
//
// Trainer:
// - Manual Handling
// - Working at Height
// - Both
//
// Trainee:
// - Both automatically
// ======================================================

const createPendingUser =
    async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                age,
                email,
                phoneNumber,
                address,
                gender,
                role,
                assignedTrainingSections,
            } = req.body;


            // ==================================================
            // REQUIRED INFORMATION
            // ==================================================

            if (
                !firstName?.trim() ||
                !lastName?.trim() ||
                age === undefined ||
                age === null ||
                age === "" ||
                !email?.trim() ||
                !phoneNumber?.trim() ||
                !address?.trim() ||
                !gender ||
                !role
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "All user information is required",
                    });
            }


            // ==================================================
            // ROLE
            // ==================================================

            const normalizedRole =
                String(role)
                    .trim()
                    .toLowerCase();


            if (
                ![
                    "trainer",
                    "trainee",
                ].includes(
                    normalizedRole
                )
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Role must be Trainer or Trainee",
                    });
            }


            // ==================================================
            // TRAINING ASSIGNMENT
            // ==================================================

            let assignmentValidation;


            /*
                Trainee automatically receives
                both training sections.
            */

            if (
                normalizedRole ===
                "trainee"
            ) {
                assignmentValidation = {
                    valid:
                        true,

                    sections: [
                        ...ALLOWED_TRAINING_SECTIONS,
                    ],
                };

            } else {
                /*
                    Trainer can have one or both.
                */

                assignmentValidation =
                    validateTrainingSections(
                        assignedTrainingSections
                    );


                if (
                    !assignmentValidation.valid
                ) {
                    return res
                        .status(400)
                        .json({
                            message:
                                assignmentValidation.message,
                        });
                }
            }


            // ==================================================
            // GENDER
            // ==================================================

            const normalizedGender =
                String(gender)
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


            // ==================================================
            // AGE
            // ==================================================

            const parsedAge =
                Number(age);


            if (
                !Number.isInteger(
                    parsedAge
                ) ||
                parsedAge < 16
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Age must be 16 or above",
                    });
            }


            // ==================================================
            // EMAIL
            // ==================================================

            const normalizedEmail =
                String(email)
                    .trim()
                    .toLowerCase();


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
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


            // ==================================================
            // DUPLICATE EMAIL
            // ==================================================

            const existingUser =
                await User.findOne({
                    email:
                        normalizedEmail,
                });


            if (
                existingUser
            ) {
                return res
                    .status(409)
                    .json({
                        message:
                            "A user with this email already exists",
                    });
            }


            // ==================================================
            // CREATE PENDING USER
            //
            // Username/password are generated later.
            // ==================================================

            const user =
                await User.create({
                    passwordHash:
                        null,

                    firstName:
                        firstName.trim(),

                    lastName:
                        lastName.trim(),

                    age:
                        parsedAge,

                    email:
                        normalizedEmail,

                    phoneNumber:
                        phoneNumber.trim(),

                    address:
                        address.trim(),

                    gender:
                        normalizedGender,

                    role:
                        normalizedRole,

                    assignedTrainingSections:
                        assignmentValidation.sections,

                    accountStatus:
                        "pending",

                    status:
                        "active",

                    /*
                        Only relevant after credentials
                        are generated.
                    */

                    mustChangePassword:
                        true,

                    createdBy:
                        req.user.id,
                });


            // ==================================================
            // AUDIT LOG
            //
            // Records which Admin created which user.
            // ==================================================

            await writeAuditLog({
                req,

                user:
                    req.user,

                action:
                    "ADMIN_CREATED_USER",

                status:
                    "success",

                targetUser:
                    user,

                details: {
                    message:
                        `Admin created ${user.role} ${user.firstName} ${user.lastName}`,

                    assignedTrainingSections:
                        user.assignedTrainingSections,
                },
            });


            // ==================================================
            // RESPONSE
            // ==================================================

            return res
                .status(201)
                .json({
                    message:
                        "User information and training assignment saved successfully",

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

                        assignedTrainingSections:
                            user.assignedTrainingSections,

                        accountStatus:
                            user.accountStatus,
                    },
                });

        } catch (error) {
            console.error(
                "Create pending user error:",
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
                            "A user with this email already exists",
                    });
            }


            return res
                .status(500)
                .json({
                    message:
                        "Unable to save user information",
                });
        }
    };


// ======================================================
// GET PENDING USERS
//
// GET /api/admin/pending-users
// ======================================================

const getPendingUsers =
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
                        "pending",
                })
                    .select(
                        "firstName lastName age email phoneNumber address gender role assignedTrainingSections accountStatus createdAt"
                    )
                    .sort({
                        createdAt:
                            -1,
                    });


            const formattedUsers =
                users.map(
                    (user) => ({
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

                        assignedTrainingSections:
                            user.assignedTrainingSections,

                        accountStatus:
                            user.accountStatus,

                        createdAt:
                            user.createdAt,
                    })
                );


            return res
                .status(200)
                .json(
                    formattedUsers
                );

        } catch (error) {
            console.error(
                "Get pending users error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to load pending users",
                });
        }
    };


// ======================================================
// UPDATE TRAINER OR TRAINEE TRAINING ASSIGNMENT
//
// PATCH
// /api/admin/users/:id/training-sections
// ======================================================

const updateUserTrainingSections =
    async (req, res) => {
        try {
            const {
                trainingSections,
            } = req.body;


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
                    .status(400)
                    .json({
                        message:
                            "Training can only be assigned to a Trainer or Trainee",
                    });
            }


            // ==================================================
            // ACCOUNT MUST BE CREATED
            // ==================================================

            if (
                user.accountStatus !==
                "created"
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Generate the user's account credentials before editing the assignment here",
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
                    .status(400)
                    .json({
                        message:
                            "Training assignment cannot be changed for a deactivated user",
                    });
            }


            // ==================================================
            // SAVE PREVIOUS ASSIGNMENT FOR AUDIT LOG
            // ==================================================

            const previousTrainingSections = [
                ...(
                    user
                        .assignedTrainingSections ||
                    []
                ),
            ];


            let sectionsToSave;


            // ==================================================
            // TRAINEE ALWAYS GETS BOTH
            // ==================================================

            if (
                user.role ===
                "trainee"
            ) {
                sectionsToSave = [
                    ...ALLOWED_TRAINING_SECTIONS,
                ];

            } else {
                // ==================================================
                // TRAINER CAN HAVE ONE OR BOTH
                // ==================================================

                const validation =
                    validateTrainingSections(
                        trainingSections
                    );


                if (
                    !validation.valid
                ) {
                    return res
                        .status(400)
                        .json({
                            message:
                                validation.message,
                        });
                }


                sectionsToSave =
                    validation.sections;
            }


            // ==================================================
            // SAVE
            // ==================================================

            user.assignedTrainingSections =
                sectionsToSave;


            await user.save();


            // ==================================================
            // AUDIT LOG
            // ==================================================

            await writeAuditLog({
                req,

                user:
                    req.user,

                action:
                    "ADMIN_CHANGED_TRAINING_ASSIGNMENT",

                status:
                    "success",

                targetUser:
                    user,

                details: {
                    message:
                        `Admin changed training assignment for ${user.firstName} ${user.lastName}`,

                    previousTrainingSections,

                    newTrainingSections: [
                        ...user
                            .assignedTrainingSections,
                    ],
                },
            });


            // ==================================================
            // RESPONSE
            // ==================================================

            return res
                .status(200)
                .json({
                    message:
                        `${user.role === "trainer"
                            ? "Trainer"
                            : "Trainee"
                        } training assignment updated successfully`,

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

                        assignedTrainingSections:
                            user.assignedTrainingSections,
                    },
                });

        } catch (error) {
            console.error(
                "Update user training sections error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to update training assignment",
                });
        }
    };


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    createPendingUser,
    getPendingUsers,
    updateUserTrainingSections,
};
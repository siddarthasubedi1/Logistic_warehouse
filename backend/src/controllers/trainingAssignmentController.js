const mongoose =
    require("mongoose");

const TrainingAssignment =
    require("../models/TrainingAssignment");

const TrainingProgramme =
    require("../models/TrainingProgramme");

const User =
    require("../models/User");

const {
    writeAuditLog,
} =
    require("../utils/auditLogger");


// ======================================================
// HELPERS
// ======================================================

const isValidObjectId =
    (value) =>
        mongoose.Types.ObjectId.isValid(
            value
        );


// ======================================================
// POPULATE ASSIGNMENT
// ======================================================

const populateAssignment =
    async (
        assignmentId
    ) => {
        return TrainingAssignment
            .findById(
                assignmentId
            )
            .populate({
                path:
                    "programme",

                select:
                    "programmeType title description passMark status owner",

                populate: {
                    path:
                        "owner",

                    select:
                        "firstName lastName username email",
                },
            })
            .populate(
                "trainee",
                "firstName lastName username email role status accountStatus assignedTrainingSections"
            )
            .populate(
                "assignedBy",
                "firstName lastName username role"
            );
    };


// ======================================================
// CREATE TRAINING ASSIGNMENT
// ADMIN ONLY
// ======================================================

const createTrainingAssignment =
    async (
        req,
        res
    ) => {
        try {
            const {
                programmeId,
                traineeId,
            } =
                req.body;


            // ==================================================
            // REQUIRED FIELDS
            // ==================================================

            if (
                !programmeId ||
                !traineeId
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "ASSIGNMENT_FIELDS_REQUIRED",

                        message:
                            "Training programme and Trainee are required.",
                    });
            }


            // ==================================================
            // VALID IDS
            // ==================================================

            if (
                !isValidObjectId(
                    programmeId
                )
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "INVALID_PROGRAMME_ID",

                        message:
                            "Invalid training programme.",
                    });
            }


            if (
                !isValidObjectId(
                    traineeId
                )
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "INVALID_TRAINEE_ID",

                        message:
                            "Invalid Trainee.",
                    });
            }


            // ==================================================
            // PROGRAMME
            // ==================================================

            const programme =
                await TrainingProgramme
                    .findById(
                        programmeId
                    );


            if (
                !programme
            ) {
                return res
                    .status(404)
                    .json({
                        code:
                            "PROGRAMME_NOT_FOUND",

                        message:
                            "Training programme not found.",
                    });
            }


            // ==================================================
            // ONLY ACTIVE PROGRAMMES CAN BE ASSIGNED
            // ==================================================

            if (
                programme.status !==
                "active"
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "PROGRAMME_NOT_ACTIVE",

                        message:
                            "Only an active training programme can be assigned to a Trainee.",
                    });
            }


            // ==================================================
            // TRAINEE
            // ==================================================

            const trainee =
                await User.findById(
                    traineeId
                );


            if (
                !trainee
            ) {
                return res
                    .status(404)
                    .json({
                        code:
                            "TRAINEE_NOT_FOUND",

                        message:
                            "Trainee not found.",
                    });
            }


            // ==================================================
            // MUST BE TRAINEE
            // ==================================================

            if (
                trainee.role !==
                "trainee"
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "USER_NOT_TRAINEE",

                        message:
                            "The selected user is not a Trainee.",
                    });
            }


            // ==================================================
            // TRAINEE MUST BE ACTIVE
            // ==================================================

            if (
                trainee.status !==
                "active"
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "TRAINEE_NOT_ACTIVE",

                        message:
                            "The selected Trainee account is not active.",
                    });
            }


            // ==================================================
            // ACCOUNT MUST BE CREATED
            // ==================================================

            if (
                trainee.accountStatus !==
                "created"
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "TRAINEE_ACCOUNT_NOT_READY",

                        message:
                            "The selected Trainee account has not been fully created.",
                    });
            }


            // ==================================================
            // CHECK BROAD TRAINING ELIGIBILITY
            // ==================================================

            const assignedTrainingSections =
                Array.isArray(
                    trainee
                        .assignedTrainingSections
                )
                    ? trainee
                        .assignedTrainingSections
                    : [];


            if (
                !assignedTrainingSections
                    .includes(
                        programme
                            .programmeType
                    )
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "TRAINEE_NOT_ELIGIBLE_FOR_PROGRAMME",

                        message:
                            "This Trainee is not eligible for the selected training programme type.",
                    });
            }


            // ==================================================
            // ACTIVE DUPLICATE
            // ==================================================

            const existingActiveAssignment =
                await TrainingAssignment
                    .findOne({
                        programme:
                            programme._id,

                        trainee:
                            trainee._id,

                        status:
                            "active",
                    });


            if (
                existingActiveAssignment
            ) {
                return res
                    .status(409)
                    .json({
                        code:
                            "PROGRAMME_ALREADY_ASSIGNED",

                        message:
                            "This training programme is already assigned to the selected Trainee.",
                    });
            }


            // ==================================================
            // CHECK FOR PREVIOUS INACTIVE ASSIGNMENT
            // ==================================================

            const previousAssignment =
                await TrainingAssignment
                    .findOne({
                        programme:
                            programme._id,

                        trainee:
                            trainee._id,

                        status:
                            "inactive",
                    })
                    .sort({
                        updatedAt:
                            -1,
                    });


            let assignment;


            if (
                previousAssignment
            ) {
                previousAssignment.status =
                    "active";

                previousAssignment.assignedBy =
                    req.user.id;

                previousAssignment.assignedAt =
                    new Date();


                await previousAssignment.save();


                assignment =
                    previousAssignment;

            } else {
                assignment =
                    await TrainingAssignment
                        .create({
                            programme:
                                programme._id,

                            trainee:
                                trainee._id,

                            assignedBy:
                                req.user.id,

                            assignedAt:
                                new Date(),

                            status:
                                "active",
                        });
            }


            // ==================================================
            // AUDIT LOG
            // ==================================================

            await writeAuditLog({
                req,

                user:
                    req.user,

                action:
                    "TRAINING_PROGRAMME_ASSIGNED",

                status:
                    "success",

                targetUser:
                    trainee,

                details: {
                    assignmentId:
                        assignment._id
                            .toString(),

                    programmeId:
                        programme._id
                            .toString(),

                    programmeTitle:
                        programme.title,

                    programmeType:
                        programme
                            .programmeType,
                },
            });


            const populatedAssignment =
                await populateAssignment(
                    assignment._id
                );


            return res
                .status(201)
                .json({
                    message:
                        "Training programme assigned successfully.",

                    assignment:
                        populatedAssignment,
                });

        } catch (error) {
            console.error(
                "Create training assignment error:",
                error
            );


            // ==================================================
            // MONGODB DUPLICATE
            // ==================================================

            if (
                error?.code ===
                11000
            ) {
                return res
                    .status(409)
                    .json({
                        code:
                            "PROGRAMME_ALREADY_ASSIGNED",

                        message:
                            "This training programme is already assigned to the selected Trainee.",
                    });
            }


            return res
                .status(500)
                .json({
                    code:
                        "TRAINING_ASSIGNMENT_CREATE_FAILED",

                    message:
                        "Unable to assign the training programme.",
                });
        }
    };


// ======================================================
// GET ALL ASSIGNMENTS
// ADMIN ONLY
// ======================================================

const getTrainingAssignments =
    async (
        req,
        res
    ) => {
        try {
            const assignments =
                await TrainingAssignment
                    .find()
                    .sort({
                        assignedAt:
                            -1,
                    })
                    .populate({
                        path:
                            "programme",

                        select:
                            "programmeType title description passMark status owner",

                        populate: {
                            path:
                                "owner",

                            select:
                                "firstName lastName username",
                        },
                    })
                    .populate(
                        "trainee",
                        "firstName lastName username email role status accountStatus"
                    )
                    .populate(
                        "assignedBy",
                        "firstName lastName username role"
                    );


            return res
                .status(200)
                .json({
                    assignments,
                });

        } catch (error) {
            console.error(
                "Get training assignments error:",
                error
            );


            return res
                .status(500)
                .json({
                    code:
                        "TRAINING_ASSIGNMENTS_LOAD_FAILED",

                    message:
                        "Unable to load training assignments.",
                });
        }
    };


// ======================================================
// DEACTIVATE ASSIGNMENT
// ADMIN ONLY
// ======================================================

const deactivateTrainingAssignment =
    async (
        req,
        res
    ) => {
        try {
            const {
                assignmentId,
            } =
                req.params;


            if (
                !isValidObjectId(
                    assignmentId
                )
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "INVALID_ASSIGNMENT_ID",

                        message:
                            "Invalid training assignment.",
                    });
            }


            const assignment =
                await TrainingAssignment
                    .findById(
                        assignmentId
                    );


            if (
                !assignment
            ) {
                return res
                    .status(404)
                    .json({
                        code:
                            "ASSIGNMENT_NOT_FOUND",

                        message:
                            "Training assignment not found.",
                    });
            }


            if (
                assignment.status ===
                "inactive"
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "ASSIGNMENT_ALREADY_INACTIVE",

                        message:
                            "Training assignment is already inactive.",
                    });
            }


            assignment.status =
                "inactive";


            await assignment.save();


            const trainee =
                await User.findById(
                    assignment.trainee
                );


            const programme =
                await TrainingProgramme
                    .findById(
                        assignment.programme
                    );


            await writeAuditLog({
                req,

                user:
                    req.user,

                action:
                    "TRAINING_PROGRAMME_ASSIGNMENT_DEACTIVATED",

                status:
                    "success",

                targetUser:
                    trainee,

                details: {
                    assignmentId:
                        assignment._id
                            .toString(),

                    programmeId:
                        programme?._id
                            ?.toString() ||
                        "",

                    programmeTitle:
                        programme?.title ||
                        "",
                },
            });


            const populatedAssignment =
                await populateAssignment(
                    assignment._id
                );


            return res
                .status(200)
                .json({
                    message:
                        "Training assignment deactivated successfully.",

                    assignment:
                        populatedAssignment,
                });

        } catch (error) {
            console.error(
                "Deactivate assignment error:",
                error
            );


            return res
                .status(500)
                .json({
                    code:
                        "ASSIGNMENT_DEACTIVATION_FAILED",

                    message:
                        "Unable to deactivate the training assignment.",
                });
        }
    };


// ======================================================
// REACTIVATE ASSIGNMENT
// ADMIN ONLY
// ======================================================

const reactivateTrainingAssignment =
    async (
        req,
        res
    ) => {
        try {
            const {
                assignmentId,
            } =
                req.params;


            if (
                !isValidObjectId(
                    assignmentId
                )
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "INVALID_ASSIGNMENT_ID",

                        message:
                            "Invalid training assignment.",
                    });
            }


            const assignment =
                await TrainingAssignment
                    .findById(
                        assignmentId
                    );


            if (
                !assignment
            ) {
                return res
                    .status(404)
                    .json({
                        code:
                            "ASSIGNMENT_NOT_FOUND",

                        message:
                            "Training assignment not found.",
                    });
            }


            if (
                assignment.status ===
                "active"
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "ASSIGNMENT_ALREADY_ACTIVE",

                        message:
                            "Training assignment is already active.",
                    });
            }


            const programme =
                await TrainingProgramme
                    .findById(
                        assignment.programme
                    );


            if (
                !programme ||
                programme.status !==
                "active"
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "PROGRAMME_NOT_ACTIVE",

                        message:
                            "Reactivate the training programme before reactivating this assignment.",
                    });
            }


            const trainee =
                await User.findById(
                    assignment.trainee
                );


            if (
                !trainee ||
                trainee.role !==
                "trainee" ||
                trainee.status !==
                "active" ||
                trainee.accountStatus !==
                "created"
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "TRAINEE_NOT_ACTIVE",

                        message:
                            "The Trainee account must be active before this assignment can be reactivated.",
                    });
            }


            const duplicate =
                await TrainingAssignment
                    .findOne({
                        _id: {
                            $ne:
                                assignment._id,
                        },

                        programme:
                            assignment.programme,

                        trainee:
                            assignment.trainee,

                        status:
                            "active",
                    });


            if (
                duplicate
            ) {
                return res
                    .status(409)
                    .json({
                        code:
                            "PROGRAMME_ALREADY_ASSIGNED",

                        message:
                            "This training programme already has an active assignment for this Trainee.",
                    });
            }


            assignment.status =
                "active";

            assignment.assignedBy =
                req.user.id;

            assignment.assignedAt =
                new Date();


            await assignment.save();


            await writeAuditLog({
                req,

                user:
                    req.user,

                action:
                    "TRAINING_PROGRAMME_ASSIGNMENT_REACTIVATED",

                status:
                    "success",

                targetUser:
                    trainee,

                details: {
                    assignmentId:
                        assignment._id
                            .toString(),

                    programmeId:
                        programme._id
                            .toString(),

                    programmeTitle:
                        programme.title,
                },
            });


            const populatedAssignment =
                await populateAssignment(
                    assignment._id
                );


            return res
                .status(200)
                .json({
                    message:
                        "Training assignment reactivated successfully.",

                    assignment:
                        populatedAssignment,
                });

        } catch (error) {
            console.error(
                "Reactivate assignment error:",
                error
            );


            return res
                .status(500)
                .json({
                    code:
                        "ASSIGNMENT_REACTIVATION_FAILED",

                    message:
                        "Unable to reactivate the training assignment.",
                });
        }
    };


// ======================================================
// MY TRAINING
// TRAINEE ONLY
// ======================================================

const getMyTraining =
    async (
        req,
        res
    ) => {
        try {
            const assignments =
                await TrainingAssignment
                    .find({
                        trainee:
                            req.user.id,

                        status:
                            "active",
                    })
                    .sort({
                        assignedAt:
                            -1,
                    })
                    .populate({
                        path:
                            "programme",

                        match: {
                            status:
                                "active",
                        },

                        select:
                            "programmeType title description passMark status owner createdAt updatedAt",

                        populate: {
                            path:
                                "owner",

                            select:
                                "firstName lastName username",
                        },
                    })
                    .populate(
                        "assignedBy",
                        "firstName lastName username role"
                    );


            /*
                If a programme was later deactivated,
                populate returns programme:null.

                Do not show that programme to the Trainee.
            */

            const availableAssignments =
                assignments.filter(
                    (assignment) =>
                        assignment.programme
                );


            return res
                .status(200)
                .json({
                    assignments:
                        availableAssignments,
                });

        } catch (error) {
            console.error(
                "Get my training error:",
                error
            );


            return res
                .status(500)
                .json({
                    code:
                        "MY_TRAINING_LOAD_FAILED",

                    message:
                        "Unable to load your assigned training programmes.",
                });
        }
    };


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    createTrainingAssignment,
    getTrainingAssignments,
    deactivateTrainingAssignment,
    reactivateTrainingAssignment,
    getMyTraining,
};
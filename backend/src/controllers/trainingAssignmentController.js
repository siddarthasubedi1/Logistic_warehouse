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
            //
            // assignedTrainingSections is intentionally kept.
            //
            // It is NOT the specific programme assignment.
            //
            // It defines which broad training types the Trainee
            // is eligible to receive.
            //
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


            // ==================================================
            // REUSE PREVIOUS ASSIGNMENT
            // ==================================================

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

                // ==============================================
                // CREATE NEW ASSIGNMENT
                // ==============================================

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


            // ==================================================
            // POPULATED RESPONSE
            // ==================================================

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


            // ==================================================
            // VALID ID
            // ==================================================

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


            // ==================================================
            // FIND ASSIGNMENT
            // ==================================================

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


            // ==================================================
            // ALREADY INACTIVE
            // ==================================================

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


            // ==================================================
            // DEACTIVATE
            // ==================================================

            assignment.status =
                "inactive";


            await assignment.save();


            // ==================================================
            // LOAD RELATED DATA FOR AUDIT
            // ==================================================

            const trainee =
                await User.findById(
                    assignment.trainee
                );


            const programme =
                await TrainingProgramme
                    .findById(
                        assignment.programme
                    );


            // ==================================================
            // AUDIT LOG
            // ==================================================

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


            // ==================================================
            // POPULATED RESPONSE
            // ==================================================

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


            // ==================================================
            // VALID ASSIGNMENT ID
            // ==================================================

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


            // ==================================================
            // ASSIGNMENT
            // ==================================================

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


            // ==================================================
            // ALREADY ACTIVE
            // ==================================================

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


            // ==================================================
            // PROGRAMME
            // ==================================================

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


            // ==================================================
            // TRAINEE
            // ==================================================

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


            // ==================================================
            // CHECK TRAINEE ELIGIBILITY AGAIN
            // ==================================================
            //
            // The Trainee may have had their broad training
            // eligibility changed while this assignment was
            // inactive.
            //
            // Therefore we must validate it again before
            // reactivation.
            //
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
                            "This Trainee is no longer eligible for this training programme type.",
                    });
            }


            // ==================================================
            // DUPLICATE ACTIVE ASSIGNMENT
            // ==================================================

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


            // ==================================================
            // REACTIVATE
            // ==================================================

            assignment.status =
                "active";

            assignment.assignedBy =
                req.user.id;

            assignment.assignedAt =
                new Date();


            await assignment.save();


            // ==================================================
            // AUDIT LOG
            // ==================================================

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


            // ==================================================
            // POPULATED RESPONSE
            // ==================================================

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
// EXPORTS
// ======================================================
//
// Trainee My Training functions are intentionally NOT
// exported from this controller.
//
// Trainee learning is handled by:
//
// controllers/myTrainingController.js
//
// through:
//
// /api/my-training
//
// ======================================================

module.exports = {
    createTrainingAssignment,
    getTrainingAssignments,
    deactivateTrainingAssignment,
    reactivateTrainingAssignment,
};
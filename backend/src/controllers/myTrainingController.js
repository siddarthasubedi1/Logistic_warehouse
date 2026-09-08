const mongoose = require("mongoose");

const TrainingAssignment = require("../models/TrainingAssignment");
const TrainingProgramme = require("../models/TrainingProgramme");
const LearningSection = require("../models/LearningSection");


// ======================================================
// HELPER
// ======================================================

const isValidObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(value);
};


// ======================================================
// VERIFY TRAINEE ACCESS
// ======================================================

const getActiveAssignment = async (
    programmeId,
    traineeId
) => {
    return TrainingAssignment.findOne({
        programme: programmeId,
        trainee: traineeId,
        status: "active",
    });
};


// ======================================================
// GET MY TRAINING PROGRAMMES
// TRAINEE ONLY
// ======================================================

const getMyTrainingProgrammes = async (
    req,
    res
) => {
    try {
        const assignments =
            await TrainingAssignment.find({
                trainee: req.user.id,
                status: "active",
            })
                .sort({
                    assignedAt: -1,
                })
                .populate({
                    path: "programme",

                    match: {
                        status: "active",
                    },

                    select:
                        "programmeType title description passMark status owner createdAt updatedAt",

                    populate: {
                        path: "owner",

                        select:
                            "firstName lastName username",
                    },
                })
                .populate(
                    "assignedBy",
                    "firstName lastName username role"
                );


        const availableAssignments =
            assignments.filter(
                (assignment) =>
                    assignment.programme
            );


        return res.status(200).json({
            assignments:
                availableAssignments,
        });

    } catch (error) {
        console.error(
            "Get my training programmes error:",
            error
        );


        return res.status(500).json({
            code:
                "MY_TRAINING_LOAD_FAILED",

            message:
                "Unable to load your assigned training programmes.",
        });
    }
};


// ======================================================
// GET ONE ASSIGNED PROGRAMME
// TRAINEE ONLY
// ======================================================

const getMyTrainingProgramme = async (
    req,
    res
) => {
    try {
        const {
            programmeId,
        } = req.params;


        if (
            !isValidObjectId(
                programmeId
            )
        ) {
            return res.status(400).json({
                code:
                    "INVALID_PROGRAMME_ID",

                message:
                    "Invalid training programme.",
            });
        }


        // ==================================================
        // VERIFY ASSIGNMENT
        // ==================================================

        const assignment =
            await getActiveAssignment(
                programmeId,
                req.user.id
            );


        if (!assignment) {
            return res.status(403).json({
                code:
                    "TRAINING_NOT_ASSIGNED",

                message:
                    "This training programme is not assigned to you.",
            });
        }


        // ==================================================
        // GET PROGRAMME
        // ==================================================

        const programme =
            await TrainingProgramme
                .findOne({
                    _id:
                        programmeId,

                    status:
                        "active",
                })
                .populate(
                    "owner",
                    "firstName lastName username"
                );


        if (!programme) {
            return res.status(404).json({
                code:
                    "PROGRAMME_NOT_AVAILABLE",

                message:
                    "This training programme is currently unavailable.",
            });
        }


        // ==================================================
        // SECTION COUNT
        // ==================================================

        const sectionCount =
            await LearningSection.countDocuments({
                programme:
                    programmeId,

                status:
                    "active",
            });


        return res.status(200).json({
            programme,

            assignment: {
                _id:
                    assignment._id,

                assignedAt:
                    assignment.assignedAt,

                status:
                    assignment.status,
            },

            sectionCount,
        });

    } catch (error) {
        console.error(
            "Get my training programme error:",
            error
        );


        return res.status(500).json({
            code:
                "MY_TRAINING_PROGRAMME_LOAD_FAILED",

            message:
                "Unable to load the training programme.",
        });
    }
};


// ======================================================
// GET ACTIVE LEARNING SECTIONS
// TRAINEE ONLY
// ======================================================

const getMyTrainingSections = async (
    req,
    res
) => {
    try {
        const {
            programmeId,
        } = req.params;


        if (
            !isValidObjectId(
                programmeId
            )
        ) {
            return res.status(400).json({
                code:
                    "INVALID_PROGRAMME_ID",

                message:
                    "Invalid training programme.",
            });
        }


        // ==================================================
        // VERIFY ACTIVE ASSIGNMENT
        // ==================================================

        const assignment =
            await getActiveAssignment(
                programmeId,
                req.user.id
            );


        if (!assignment) {
            return res.status(403).json({
                code:
                    "TRAINING_NOT_ASSIGNED",

                message:
                    "This training programme is not assigned to you.",
            });
        }


        // ==================================================
        // VERIFY ACTIVE PROGRAMME
        // ==================================================

        const programme =
            await TrainingProgramme
                .findOne({
                    _id:
                        programmeId,

                    status:
                        "active",
                })
                .select(
                    "_id programmeType title description passMark status owner"
                )
                .populate(
                    "owner",
                    "firstName lastName username"
                );


        if (!programme) {
            return res.status(404).json({
                code:
                    "PROGRAMME_NOT_AVAILABLE",

                message:
                    "This training programme is currently unavailable.",
            });
        }


        // ==================================================
        // ONLY ACTIVE SECTIONS
        // ORDERED BY ORDER
        // ==================================================

        const sections =
            await LearningSection
                .find({
                    programme:
                        programmeId,

                    status:
                        "active",
                })
                .select(
                    "_id title content imageUrl imageAltText order status"
                )
                .sort({
                    order:
                        1,

                    createdAt:
                        1,
                });


        return res.status(200).json({
            programme,
            sections,
        });

    } catch (error) {
        console.error(
            "Get my training sections error:",
            error
        );


        return res.status(500).json({
            code:
                "MY_TRAINING_SECTIONS_LOAD_FAILED",

            message:
                "Unable to load the learning sections.",
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    getMyTrainingProgrammes,
    getMyTrainingProgramme,
    getMyTrainingSections,
};
const mongoose = require("mongoose");

const TrainingAssignment = require("../models/TrainingAssignment");
const TrainingProgramme = require("../models/TrainingProgramme");
const LearningSection = require("../models/LearningSection");
const AssessmentAttempt = require("../models/AssessmentAttempt");


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
// MODULE LEVEL PROGRESSION
// Beginner -> Intermediate -> Advanced. A level is complete
// only when every assigned active programme in that module/level
// has at least one passed assessment attempt.
// ======================================================
const LEVEL_ORDER = ["beginner", "intermediate", "advanced"];

const getModuleLevelAccess = async (traineeId, moduleType) => {
    const rows = await TrainingAssignment.find({ trainee: traineeId, status: "active" })
        .populate({ path: "programme", match: { status: "active", programmeType: moduleType }, select: "_id level passMark" });
    const programmes = rows.map(r => r.programme).filter(Boolean);
    const ids = programmes.map(p => p._id);
    // A programme is complete only after the trainee passes its final High
    // assessment. Passing Basic or Intermediate alone must not unlock the next
    // Beginner/Intermediate/Advanced programme level.
    const passed = ids.length ? await AssessmentAttempt.find({ trainee: traineeId, programme: { $in: ids }, level: "high", passed: true, status: { $ne: "in-progress" } }).select("programme").lean() : [];
    const passedIds = new Set(passed.map(a => String(a.programme)));
    const completed = {};
    for (const level of LEVEL_ORDER) {
        const inLevel = programmes.filter(p => (p.level || "beginner") === level);
        completed[level] = inLevel.length > 0 && inLevel.every(p => passedIds.has(String(p._id)));
    }
    return {
        beginner: { unlocked: true, completed: completed.beginner },
        intermediate: { unlocked: completed.beginner, completed: completed.intermediate },
        advanced: { unlocked: completed.beginner && completed.intermediate, completed: completed.advanced },
    };
};

const verifyProgrammeLevelUnlocked = async (traineeId, programme) => {
    const access = await getModuleLevelAccess(traineeId, programme.programmeType);
    const level = programme.level || "beginner";
    return { level, access, unlocked: access[level]?.unlocked !== false };
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
                        "programmeType title description passMark level status owner createdAt updatedAt",

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


        const moduleTypes = [...new Set(availableAssignments.map(a => a.programme?.programmeType).filter(Boolean))];
        const levelAccess = {};
        for (const type of moduleTypes) levelAccess[type] = await getModuleLevelAccess(req.user.id, type);

        return res.status(200).json({
            assignments: availableAssignments,
            levelAccess,
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


        const gate = await verifyProgrammeLevelUnlocked(req.user.id, programme);
        if (!gate.unlocked) {
            return res.status(403).json({
                code: "PROGRAMME_LEVEL_LOCKED",
                message: "Complete and pass the previous programme level before opening this programme.",
                level: gate.level,
                levelAccess: gate.access,
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
            levelAccess: gate.access,
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
                    "_id programmeType title description passMark level status owner"
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

        const gate = await verifyProgrammeLevelUnlocked(req.user.id, programme);
        if (!gate.unlocked) return res.status(403).json({ code: "PROGRAMME_LEVEL_LOCKED", message: "Complete and pass the previous programme level first.", level: gate.level, levelAccess: gate.access });

        // If this programme has never been given training content, create a
        // database-backed starter pack (6 learning sections, scenario and assessments).
        // Admin/Trainer can edit or replace all of it from Training Programmes.

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
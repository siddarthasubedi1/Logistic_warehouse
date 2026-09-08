const mongoose = require("mongoose");

const TrainingProgramme =
    require("../models/TrainingProgramme");

const LearningSection =
    require("../models/LearningSection");

const {
    writeAuditLog,
} = require("../utils/auditLogger");


// ======================================================
// HELPERS
// ======================================================

function isValidObjectId(value) {
    return mongoose.Types.ObjectId.isValid(
        value
    );
}


// ======================================================
// CHECK PROGRAMME MANAGEMENT ACCESS
// ======================================================

async function getManageableProgramme(
    programmeId,
    user
) {
    if (
        !isValidObjectId(
            programmeId
        )
    ) {
        return {
            error: {
                status: 400,

                body: {
                    code:
                        "INVALID_PROGRAMME_ID",

                    message:
                        "Invalid training programme ID.",
                },
            },
        };
    }


    const programme =
        await TrainingProgramme.findById(
            programmeId
        );


    if (!programme) {
        return {
            error: {
                status: 404,

                body: {
                    code:
                        "PROGRAMME_NOT_FOUND",

                    message:
                        "Training programme not found.",
                },
            },
        };
    }


    // ==================================================
    // ADMIN CAN MANAGE ANY PROGRAMME
    // ==================================================

    if (
        user.role ===
        "admin"
    ) {
        return {
            programme,
        };
    }


    // ==================================================
    // TRAINER MUST OWN OR BE AUTHORIZED
    // ==================================================

    const userId =
        String(
            user.id
        );


    const ownerId =
        String(
            programme.owner
        );


    const authorized =
        Array.isArray(
            programme
                .authorizedTrainers
        ) &&
        programme
            .authorizedTrainers
            .some(
                (trainerId) =>
                    String(
                        trainerId
                    ) ===
                    userId
            );


    if (
        ownerId !==
        userId &&
        !authorized
    ) {
        return {
            error: {
                status: 403,

                body: {
                    code:
                        "PROGRAMME_ACCESS_DENIED",

                    message:
                        "You are not authorized to manage this training programme.",
                },
            },
        };
    }


    return {
        programme,
    };
}


// ======================================================
// REACTIVATE TRAINING PROGRAMME
// ======================================================

async function reactivateTrainingProgramme(
    req,
    res
) {
    try {
        const {
            id,
        } =
            req.params;


        const result =
            await getManageableProgramme(
                id,
                req.user
            );


        if (result.error) {
            return res
                .status(
                    result
                        .error
                        .status
                )
                .json(
                    result
                        .error
                        .body
                );
        }


        const {
            programme,
        } =
            result;


        if (
            programme.status ===
            "active"
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "PROGRAMME_ALREADY_ACTIVE",

                    message:
                        "Training programme is already active.",
                });
        }


        programme.status =
            "active";


        programme.updatedBy =
            req.user.id;


        await programme.save();


        await writeAuditLog({
            req,

            user:
                req.user,

            action:
                "TRAINING_PROGRAMME_REACTIVATED",

            status:
                "success",

            details: {
                programmeId:
                    programme._id,

                title:
                    programme.title,

                programmeType:
                    programme.programmeType,
            },
        });


        const populatedProgramme =
            await TrainingProgramme
                .findById(
                    programme._id
                )
                .populate(
                    "owner",
                    "email firstName lastName username role assignedTrainingSections status"
                )
                .populate(
                    "authorizedTrainers",
                    "email firstName lastName username role assignedTrainingSections status"
                )
                .populate(
                    "createdBy",
                    "username firstName lastName role"
                )
                .populate(
                    "updatedBy",
                    "username firstName lastName role"
                );


        return res
            .status(200)
            .json({
                message:
                    "Training programme reactivated successfully.",

                programme:
                    populatedProgramme,
            });

    } catch (error) {
        console.error(
            "Reactivate training programme error:",
            error
        );


        return res
            .status(500)
            .json({
                code:
                    "PROGRAMME_REACTIVATION_FAILED",

                message:
                    "Unable to reactivate training programme.",
            });
    }
}


// ======================================================
// REACTIVATE LEARNING SECTION
// ======================================================

async function reactivateLearningSection(
    req,
    res
) {
    try {
        const {
            programmeId,
            sectionId,
        } =
            req.params;


        const result =
            await getManageableProgramme(
                programmeId,
                req.user
            );


        if (result.error) {
            return res
                .status(
                    result
                        .error
                        .status
                )
                .json(
                    result
                        .error
                        .body
                );
        }


        const {
            programme,
        } =
            result;


        // ==================================================
        // CANNOT REACTIVATE SECTION INSIDE INACTIVE PROGRAMME
        // ==================================================

        if (
            programme.status ===
            "inactive"
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "PROGRAMME_INACTIVE",

                    message:
                        "Reactivate the training programme before reactivating its learning sections.",
                });
        }


        if (
            !isValidObjectId(
                sectionId
            )
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_SECTION_ID",

                    message:
                        "Invalid learning section ID.",
                });
        }


        const section =
            await LearningSection.findOne({
                _id:
                    sectionId,

                programme:
                    programmeId,
            });


        if (!section) {
            return res
                .status(404)
                .json({
                    code:
                        "LEARNING_SECTION_NOT_FOUND",

                    message:
                        "Learning section not found.",
                });
        }


        if (
            section.status ===
            "active"
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "LEARNING_SECTION_ALREADY_ACTIVE",

                    message:
                        "Learning section is already active.",
                });
        }


        section.status =
            "active";


        section.updatedBy =
            req.user.id;


        await section.save();


        await writeAuditLog({
            req,

            user:
                req.user,

            action:
                "LEARNING_SECTION_REACTIVATED",

            status:
                "success",

            details: {
                programmeId:
                    programme._id,

                sectionId:
                    section._id,

                sectionTitle:
                    section.title,
            },
        });


        return res
            .status(200)
            .json({
                message:
                    "Learning section reactivated successfully.",

                section,
            });

    } catch (error) {
        console.error(
            "Reactivate learning section error:",
            error
        );


        return res
            .status(500)
            .json({
                code:
                    "LEARNING_SECTION_REACTIVATION_FAILED",

                message:
                    "Unable to reactivate learning section.",
            });
    }
}


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    reactivateTrainingProgramme,
    reactivateLearningSection,
};
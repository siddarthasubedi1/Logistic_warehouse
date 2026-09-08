const mongoose = require("mongoose");

const TrainingProgramme = require(
    "../models/TrainingProgramme"
);

const User = require(
    "../models/User"
);

const {
    writeAuditLog,
} = require(
    "../utils/auditLogger"
);


// ======================================================
// CONSTANTS
// ======================================================

const PROGRAMME_TYPES = [
    "manual-handling",
    "working-at-height",
];

const PROGRAMME_STATUSES = [
    "draft",
    "active",
    "inactive",
];


// ======================================================
// HELPERS
// ======================================================

const isValidObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(
        value
    );
};


const normalizeString = (value) => {
    if (
        typeof value !==
        "string"
    ) {
        return "";
    }

    return value.trim();
};


const normalizeObjectIdArray = (
    values = []
) => {
    if (!Array.isArray(values)) {
        return [];
    }

    return [
        ...new Set(
            values
                .map((value) =>
                    String(value).trim()
                )
                .filter(Boolean)
        ),
    ];
};


const buildManagerQuery = (
    user,
    extraQuery = {}
) => {
    if (
        user.role ===
        "admin"
    ) {
        return {
            ...extraQuery,
        };
    }

    return {
        ...extraQuery,

        $or: [
            {
                owner:
                    user.id,
            },

            {
                authorizedTrainers:
                    user.id,
            },
        ],
    };
};


const findTrainerForProgramme = async (
    trainerId,
    programmeType
) => {
    if (
        !trainerId ||
        !isValidObjectId(
            trainerId
        )
    ) {
        return null;
    }

    return User.findOne({
        _id:
            trainerId,

        role:
            "trainer",

        status:
            "active",

        accountStatus:
            "created",

        assignedTrainingSections:
            programmeType,
    }).select(
        "_id firstName lastName username email role status accountStatus assignedTrainingSections"
    );
};


const validateAuthorizedTrainers = async ({
    trainerIds,
    programmeType,
    ownerId,
}) => {
    const normalizedIds =
        normalizeObjectIdArray(
            trainerIds
        ).filter(
            (trainerId) =>
                trainerId !==
                String(ownerId)
        );

    if (
        normalizedIds.length ===
        0
    ) {
        return {
            valid: true,
            trainerIds: [],
        };
    }


    const invalidId =
        normalizedIds.find(
            (trainerId) =>
                !isValidObjectId(
                    trainerId
                )
        );


    if (invalidId) {
        return {
            valid: false,

            status: 400,

            code:
                "INVALID_AUTHORIZED_TRAINER_ID",

            message:
                "One or more authorised Trainer IDs are invalid.",
        };
    }


    const trainers =
        await User.find({
            _id: {
                $in:
                    normalizedIds,
            },

            role:
                "trainer",

            status:
                "active",

            accountStatus:
                "created",

            assignedTrainingSections:
                programmeType,
        }).select(
            "_id"
        );


    if (
        trainers.length !==
        normalizedIds.length
    ) {
        return {
            valid: false,

            status: 400,

            code:
                "INVALID_AUTHORIZED_TRAINER",

            message:
                "Every authorised Trainer must be an active Trainer assigned to the selected training type.",
        };
    }


    return {
        valid: true,

        trainerIds:
            normalizedIds,
    };
};


const populateProgramme = (
    query
) => {
    return query
        .populate(
            "owner",

            "firstName lastName username email role status assignedTrainingSections"
        )

        .populate(
            "authorizedTrainers",

            "firstName lastName username email role status assignedTrainingSections"
        )

        .populate(
            "createdBy",

            "firstName lastName username role"
        )

        .populate(
            "updatedBy",

            "firstName lastName username role"
        );
};


// ======================================================
// CREATE TRAINING PROGRAMME
//
// POST /api/training-programmes
//
// ADMIN:
// - Can create programme for an active Trainer.
// - Can authorise additional Trainers.
//
// TRAINER:
// - Programme owner is authenticated Trainer.
// - Trainer can only create a programme for a training
//   type already assigned in Sprint 1.
// ======================================================

const createTrainingProgramme = async (
    req,
    res
) => {
    try {
        const programmeType =
            normalizeString(
                req.body.programmeType
            );


        const title =
            normalizeString(
                req.body.title
            );


        const description =
            normalizeString(
                req.body.description
            );


        const status =
            normalizeString(
                req.body.status ||
                "draft"
            );


        const passMark =
            Number(
                req.body.passMark
            );


        // ==================================================
        // REQUIRED FIELDS
        // ==================================================

        if (
            !programmeType ||
            !title ||
            !description ||
            req.body.passMark ===
            undefined ||
            req.body.passMark ===
            null ||
            req.body.passMark ===
            ""
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "PROGRAMME_REQUIRED_FIELDS_MISSING",

                    message:
                        "Programme type, title, description and pass mark are required.",
                });
        }


        // ==================================================
        // PROGRAMME TYPE
        // ==================================================

        if (
            !PROGRAMME_TYPES.includes(
                programmeType
            )
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_PROGRAMME_TYPE",

                    message:
                        "Programme type must be manual-handling or working-at-height.",
                });
        }


        // ==================================================
        // TITLE
        // ==================================================

        if (
            title.length < 3 ||
            title.length > 150
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_PROGRAMME_TITLE",

                    message:
                        "Programme title must be between 3 and 150 characters.",
                });
        }


        // ==================================================
        // DESCRIPTION
        // ==================================================

        if (
            description.length < 10 ||
            description.length > 3000
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_PROGRAMME_DESCRIPTION",

                    message:
                        "Programme description must be between 10 and 3000 characters.",
                });
        }


        // ==================================================
        // PASS MARK
        // ==================================================

        if (
            !Number.isFinite(
                passMark
            ) ||
            passMark < 0 ||
            passMark > 100
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_PASS_MARK",

                    message:
                        "Pass mark must be a number between 0 and 100.",
                });
        }


        // ==================================================
        // STATUS
        // ==================================================

        if (
            !PROGRAMME_STATUSES.includes(
                status
            )
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_PROGRAMME_STATUS",

                    message:
                        "Programme status must be draft, active, or inactive.",
                });
        }


        // ==================================================
        // OWNER
        // ==================================================

        let ownerId =
            req.user.id;


        if (
            req.user.role ===
            "admin"
        ) {
            ownerId =
                normalizeString(
                    req.body.ownerId ||
                    req.body.owner
                );


            if (!ownerId) {
                return res
                    .status(400)
                    .json({
                        code:
                            "PROGRAMME_OWNER_REQUIRED",

                        message:
                            "An active Trainer must be selected as the programme owner.",
                    });
            }
        }


        const owner =
            await findTrainerForProgramme(
                ownerId,
                programmeType
            );


        if (!owner) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_PROGRAMME_OWNER",

                    message:
                        "Programme owner must be an active Trainer assigned to the selected training type.",
                });
        }


        // ==================================================
        // AUTHORISED TRAINERS
        //
        // Trainer-created programmes start without
        // additional authorised Trainers.
        //
        // Admin can assign additional Trainers.
        // ==================================================

        let authorizedTrainers = [];


        if (
            req.user.role ===
            "admin"
        ) {
            const validation =
                await validateAuthorizedTrainers({
                    trainerIds:
                        req.body
                            .authorizedTrainers,

                    programmeType,

                    ownerId,
                });


            if (
                !validation.valid
            ) {
                return res
                    .status(
                        validation.status
                    )
                    .json({
                        code:
                            validation.code,

                        message:
                            validation.message,
                    });
            }


            authorizedTrainers =
                validation.trainerIds;
        }


        // ==================================================
        // CREATE PROGRAMME
        // ==================================================

        const programme =
            await TrainingProgramme.create({
                programmeType,

                title,

                description,

                owner:
                    ownerId,

                authorizedTrainers,

                passMark,

                status,

                createdBy:
                    req.user.id,

                updatedBy:
                    req.user.id,
            });


        const populatedProgramme =
            await populateProgramme(
                TrainingProgramme.findById(
                    programme._id
                )
            );


        // ==================================================
        // AUDIT LOG
        // ==================================================

        await writeAuditLog({
            req,

            user:
                req.user,

            action:
                "TRAINING_PROGRAMME_CREATED",

            status:
                "success",

            details: {
                programmeId:
                    programme._id
                        .toString(),

                title:
                    programme.title,

                programmeType:
                    programme
                        .programmeType,

                ownerId:
                    String(
                        ownerId
                    ),

                passMark:
                    programme.passMark,

                programmeStatus:
                    programme.status,
            },
        });


        return res
            .status(201)
            .json({
                message:
                    "Training programme created successfully.",

                programme:
                    populatedProgramme,
            });

    } catch (error) {
        console.error(
            "Create training programme error:",
            error
        );


        if (
            error.name ===
            "ValidationError"
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "PROGRAMME_VALIDATION_ERROR",

                    message:
                        Object.values(
                            error.errors
                        )[0]?.message ||
                        "Invalid training programme data.",
                });
        }


        return res
            .status(500)
            .json({
                code:
                    "CREATE_PROGRAMME_FAILED",

                message:
                    "Unable to create training programme.",
            });
    }
};


// ======================================================
// GET TRAINING PROGRAMMES
//
// GET /api/training-programmes
//
// ADMIN:
// - All programmes.
//
// TRAINER:
// - Owned programmes.
// - Explicitly authorised programmes.
// ======================================================

const getTrainingProgrammes = async (
    req,
    res
) => {
    try {
        const filters = {};


        const requestedType =
            normalizeString(
                req.query.programmeType
            );


        const requestedStatus =
            normalizeString(
                req.query.status
            );


        const search =
            normalizeString(
                req.query.search
            );


        // ==================================================
        // PROGRAMME TYPE FILTER
        // ==================================================

        if (requestedType) {
            if (
                !PROGRAMME_TYPES.includes(
                    requestedType
                )
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "INVALID_PROGRAMME_TYPE",

                        message:
                            "Programme type must be manual-handling or working-at-height.",
                    });
            }


            filters.programmeType =
                requestedType;
        }


        // ==================================================
        // STATUS FILTER
        // ==================================================

        if (requestedStatus) {
            if (
                !PROGRAMME_STATUSES.includes(
                    requestedStatus
                )
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "INVALID_PROGRAMME_STATUS",

                        message:
                            "Programme status must be draft, active, or inactive.",
                    });
            }


            filters.status =
                requestedStatus;
        }


        // ==================================================
        // SEARCH
        // ==================================================

        if (search) {
            filters.$and = [
                {
                    $or: [
                        {
                            title: {
                                $regex:
                                    search,

                                $options:
                                    "i",
                            },
                        },

                        {
                            description: {
                                $regex:
                                    search,

                                $options:
                                    "i",
                            },
                        },
                    ],
                },
            ];
        }


        // ==================================================
        // ROLE-BASED QUERY
        // ==================================================

        const query =
            buildManagerQuery(
                req.user,
                filters
            );


        const programmes =
            await populateProgramme(
                TrainingProgramme.find(
                    query
                )
            ).sort({
                createdAt: -1,
            });


        return res
            .status(200)
            .json({
                count:
                    programmes.length,

                programmes,
            });

    } catch (error) {
        console.error(
            "Get training programmes error:",
            error
        );


        return res
            .status(500)
            .json({
                code:
                    "GET_PROGRAMMES_FAILED",

                message:
                    "Unable to retrieve training programmes.",
            });
    }
};


// ======================================================
// GET ONE TRAINING PROGRAMME
//
// GET /api/training-programmes/:id
// ======================================================

const getTrainingProgrammeById = async (
    req,
    res
) => {
    try {
        const programmeId =
            req.params.id;


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
                        "Invalid training programme ID.",
                });
        }


        const query =
            buildManagerQuery(
                req.user,

                {
                    _id:
                        programmeId,
                }
            );


        const programme =
            await populateProgramme(
                TrainingProgramme.findOne(
                    query
                )
            );


        if (!programme) {
            return res
                .status(404)
                .json({
                    code:
                        "PROGRAMME_NOT_FOUND_OR_ACCESS_DENIED",

                    message:
                        "Training programme was not found or you do not have permission to access it.",
                });
        }


        return res
            .status(200)
            .json({
                programme,
            });

    } catch (error) {
        console.error(
            "Get training programme error:",
            error
        );


        return res
            .status(500)
            .json({
                code:
                    "GET_PROGRAMME_FAILED",

                message:
                    "Unable to retrieve training programme.",
            });
    }
};


// ======================================================
// UPDATE TRAINING PROGRAMME
//
// PATCH /api/training-programmes/:id
//
// ADMIN:
// - Can update any programme.
// - Can change owner.
// - Can configure authorised Trainers.
//
// TRAINER:
// - Can update owned/authorised programme.
// - Cannot change owner.
// - Cannot change authorised Trainers.
// ======================================================

const updateTrainingProgramme = async (
    req,
    res
) => {
    try {
        const programmeId =
            req.params.id;


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
                        "Invalid training programme ID.",
                });
        }


        const query =
            buildManagerQuery(
                req.user,

                {
                    _id:
                        programmeId,
                }
            );


        const programme =
            await TrainingProgramme.findOne(
                query
            );


        if (!programme) {
            return res
                .status(404)
                .json({
                    code:
                        "PROGRAMME_NOT_FOUND_OR_ACCESS_DENIED",

                    message:
                        "Training programme was not found or you do not have permission to modify it.",
                });
        }


        // ==================================================
        // TRAINER CANNOT CHANGE OWNERSHIP/AUTHORISATION
        // ==================================================

        if (
            req.user.role ===
            "trainer" &&
            (
                req.body.owner !==
                undefined ||

                req.body.ownerId !==
                undefined ||

                req.body
                    .authorizedTrainers !==
                undefined
            )
        ) {
            return res
                .status(403)
                .json({
                    code:
                        "TRAINER_OWNERSHIP_CHANGE_DENIED",

                    message:
                        "Trainers cannot change programme ownership or authorised Trainer access.",
                });
        }


        // ==================================================
        // NEXT VALUES
        // ==================================================

        const nextProgrammeType =
            req.body
                .programmeType !==
                undefined
                ? normalizeString(
                    req.body
                        .programmeType
                )

                : programme
                    .programmeType;


        const nextTitle =
            req.body.title !==
                undefined
                ? normalizeString(
                    req.body.title
                )

                : programme.title;


        const nextDescription =
            req.body.description !==
                undefined
                ? normalizeString(
                    req.body
                        .description
                )

                : programme.description;


        const nextStatus =
            req.body.status !==
                undefined
                ? normalizeString(
                    req.body.status
                )

                : programme.status;


        const nextPassMark =
            req.body.passMark !==
                undefined
                ? Number(
                    req.body.passMark
                )

                : programme.passMark;


        // ==================================================
        // VALIDATE PROGRAMME TYPE
        // ==================================================

        if (
            !PROGRAMME_TYPES.includes(
                nextProgrammeType
            )
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_PROGRAMME_TYPE",

                    message:
                        "Programme type must be manual-handling or working-at-height.",
                });
        }


        // ==================================================
        // VALIDATE TITLE
        // ==================================================

        if (
            nextTitle.length < 3 ||
            nextTitle.length > 150
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_PROGRAMME_TITLE",

                    message:
                        "Programme title must be between 3 and 150 characters.",
                });
        }


        // ==================================================
        // VALIDATE DESCRIPTION
        // ==================================================

        if (
            nextDescription.length < 10 ||
            nextDescription.length > 3000
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_PROGRAMME_DESCRIPTION",

                    message:
                        "Programme description must be between 10 and 3000 characters.",
                });
        }


        // ==================================================
        // VALIDATE PASS MARK
        // ==================================================

        if (
            !Number.isFinite(
                nextPassMark
            ) ||
            nextPassMark < 0 ||
            nextPassMark > 100
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_PASS_MARK",

                    message:
                        "Pass mark must be a number between 0 and 100.",
                });
        }


        // ==================================================
        // VALIDATE STATUS
        // ==================================================

        if (
            !PROGRAMME_STATUSES.includes(
                nextStatus
            )
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_PROGRAMME_STATUS",

                    message:
                        "Programme status must be draft, active, or inactive.",
                });
        }


        // ==================================================
        // OWNER
        // ==================================================

        let nextOwnerId =
            programme.owner
                .toString();


        if (
            req.user.role ===
            "admin" &&
            (
                req.body.ownerId !==
                undefined ||

                req.body.owner !==
                undefined
            )
        ) {
            nextOwnerId =
                normalizeString(
                    req.body.ownerId ||
                    req.body.owner
                );
        }


        const owner =
            await findTrainerForProgramme(
                nextOwnerId,
                nextProgrammeType
            );


        if (!owner) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_PROGRAMME_OWNER",

                    message:
                        "Programme owner must be an active Trainer assigned to the selected training type.",
                });
        }


        // ==================================================
        // AUTHORISED TRAINERS
        // ==================================================

        let nextAuthorizedTrainers =
            programme
                .authorizedTrainers
                .map(
                    (trainerId) =>
                        trainerId
                            .toString()
                );


        if (
            req.user.role ===
            "admin" &&

            req.body
                .authorizedTrainers !==
            undefined
        ) {
            const validation =
                await validateAuthorizedTrainers({
                    trainerIds:
                        req.body
                            .authorizedTrainers,

                    programmeType:
                        nextProgrammeType,

                    ownerId:
                        nextOwnerId,
                });


            if (
                !validation.valid
            ) {
                return res
                    .status(
                        validation.status
                    )
                    .json({
                        code:
                            validation.code,

                        message:
                            validation.message,
                    });
            }


            nextAuthorizedTrainers =
                validation.trainerIds;

        } else if (
            nextProgrammeType !==
            programme.programmeType
        ) {
            const validation =
                await validateAuthorizedTrainers({
                    trainerIds:
                        nextAuthorizedTrainers,

                    programmeType:
                        nextProgrammeType,

                    ownerId:
                        nextOwnerId,
                });


            if (
                !validation.valid
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "PROGRAMME_TYPE_AUTHORIZATION_CONFLICT",

                        message:
                            "The programme type cannot be changed because one or more authorised Trainers are not assigned to the new training type.",
                    });
            }


            nextAuthorizedTrainers =
                validation.trainerIds;
        }


        // ==================================================
        // APPLY UPDATE
        // ==================================================

        programme.programmeType =
            nextProgrammeType;


        programme.title =
            nextTitle;


        programme.description =
            nextDescription;


        programme.passMark =
            nextPassMark;


        programme.status =
            nextStatus;


        programme.owner =
            nextOwnerId;


        programme.authorizedTrainers =
            nextAuthorizedTrainers;


        programme.updatedBy =
            req.user.id;


        await programme.save();


        const populatedProgramme =
            await populateProgramme(
                TrainingProgramme.findById(
                    programme._id
                )
            );


        // ==================================================
        // AUDIT LOG
        // ==================================================

        await writeAuditLog({
            req,

            user:
                req.user,

            action:
                "TRAINING_PROGRAMME_UPDATED",

            status:
                "success",

            details: {
                programmeId:
                    programme._id
                        .toString(),

                title:
                    programme.title,

                programmeType:
                    programme
                        .programmeType,

                ownerId:
                    programme.owner
                        .toString(),

                passMark:
                    programme.passMark,

                programmeStatus:
                    programme.status,
            },
        });


        return res
            .status(200)
            .json({
                message:
                    "Training programme updated successfully.",

                programme:
                    populatedProgramme,
            });

    } catch (error) {
        console.error(
            "Update training programme error:",
            error
        );


        if (
            error.name ===
            "ValidationError"
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "PROGRAMME_VALIDATION_ERROR",

                    message:
                        Object.values(
                            error.errors
                        )[0]?.message ||
                        "Invalid training programme data.",
                });
        }


        return res
            .status(500)
            .json({
                code:
                    "UPDATE_PROGRAMME_FAILED",

                message:
                    "Unable to update training programme.",
            });
    }
};


// ======================================================
// DELETE / DEACTIVATE TRAINING PROGRAMME
//
// DELETE /api/training-programmes/:id
//
// We use soft deletion.
// The programme remains in MongoDB but becomes inactive.
//
// This protects future learning section,
// assignment and audit relationships.
// ======================================================

const deleteTrainingProgramme = async (
    req,
    res
) => {
    try {
        const programmeId =
            req.params.id;


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
                        "Invalid training programme ID.",
                });
        }


        const query =
            buildManagerQuery(
                req.user,

                {
                    _id:
                        programmeId,
                }
            );


        const programme =
            await TrainingProgramme.findOne(
                query
            );


        if (!programme) {
            return res
                .status(404)
                .json({
                    code:
                        "PROGRAMME_NOT_FOUND_OR_ACCESS_DENIED",

                    message:
                        "Training programme was not found or you do not have permission to delete it.",
                });
        }


        if (
            programme.status ===
            "inactive"
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "PROGRAMME_ALREADY_INACTIVE",

                    message:
                        "Training programme is already inactive.",
                });
        }


        programme.status =
            "inactive";


        programme.updatedBy =
            req.user.id;


        await programme.save();


        // ==================================================
        // AUDIT LOG
        // ==================================================

        await writeAuditLog({
            req,

            user:
                req.user,

            action:
                "TRAINING_PROGRAMME_DEACTIVATED",

            status:
                "success",

            details: {
                programmeId:
                    programme._id
                        .toString(),

                title:
                    programme.title,

                programmeType:
                    programme
                        .programmeType,

                ownerId:
                    programme.owner
                        .toString(),
            },
        });


        return res
            .status(200)
            .json({
                message:
                    "Training programme deactivated successfully.",

                programme: {
                    id:
                        programme._id,

                    title:
                        programme.title,

                    status:
                        programme.status,
                },
            });

    } catch (error) {
        console.error(
            "Delete training programme error:",
            error
        );


        return res
            .status(500)
            .json({
                code:
                    "DELETE_PROGRAMME_FAILED",

                message:
                    "Unable to deactivate training programme.",
            });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    createTrainingProgramme,

    getTrainingProgrammes,

    getTrainingProgrammeById,

    updateTrainingProgramme,

    deleteTrainingProgramme,
};
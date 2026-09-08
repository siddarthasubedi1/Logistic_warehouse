const mongoose = require("mongoose");

const TrainingProgramme = require(
    "../models/TrainingProgramme"
);

const LearningSection = require(
    "../models/LearningSection"
);

const {
    writeAuditLog,
} = require(
    "../utils/auditLogger"
);


// ======================================================
// CONSTANTS
// ======================================================

const SECTION_STATUSES = [
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


// ======================================================
// CHECK PROGRAMME MANAGEMENT ACCESS
//
// ADMIN:
// - Can manage every programme.
//
// TRAINER:
// - Can manage programme if:
//      1. They own it
//      OR
//      2. They are in authorizedTrainers
// ======================================================

const getManageableProgramme = async (
    programmeId,
    user
) => {
    if (
        !programmeId ||
        !isValidObjectId(
            programmeId
        )
    ) {
        return null;
    }


    const query = {
        _id:
            programmeId,
    };


    if (
        user.role ===
        "trainer"
    ) {
        query.$or = [
            {
                owner:
                    user.id,
            },

            {
                authorizedTrainers:
                    user.id,
            },
        ];
    }


    return TrainingProgramme.findOne(
        query
    );
};


// ======================================================
// GET NEXT SECTION ORDER
//
// Example:
//
// Existing:
// 1
// 2
// 3
//
// New section gets:
// 4
// ======================================================

const getNextSectionOrder = async (
    programmeId
) => {
    const lastSection =
        await LearningSection.findOne({
            programme:
                programmeId,
        })
            .sort({
                order: -1,
            })
            .select(
                "order"
            );


    if (!lastSection) {
        return 1;
    }


    return (
        lastSection.order + 1
    );
};


// ======================================================
// CREATE LEARNING SECTION
//
// POST
// /api/training-programmes/:programmeId/sections
//
// ADMIN:
// - Can add section to any programme.
//
// TRAINER:
// - Can add section only to owned/authorised programme.
// ======================================================

const createLearningSection = async (
    req,
    res
) => {
    try {
        const programmeId =
            req.params.programmeId;


        // ==================================================
        // VALIDATE PROGRAMME ID
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
                        "Invalid training programme ID.",
                });
        }


        // ==================================================
        // PROGRAMME ACCESS
        // ==================================================

        const programme =
            await getManageableProgramme(
                programmeId,
                req.user
            );


        if (!programme) {
            return res
                .status(404)
                .json({
                    code:
                        "PROGRAMME_NOT_FOUND_OR_ACCESS_DENIED",

                    message:
                        "Training programme was not found or you do not have permission to manage its learning sections.",
                });
        }


        // ==================================================
        // DO NOT ADD SECTIONS TO INACTIVE PROGRAMME
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
                        "Learning sections cannot be added to an inactive training programme.",
                });
        }


        const title =
            normalizeString(
                req.body.title
            );


        const content =
            normalizeString(
                req.body.content
            );


        const imageUrl =
            normalizeString(
                req.body.imageUrl
            );


        const imageAltText =
            normalizeString(
                req.body.imageAltText
            );


        const status =
            normalizeString(
                req.body.status ||
                "active"
            );


        // ==================================================
        // TITLE
        // ==================================================

        if (!title) {
            return res
                .status(400)
                .json({
                    code:
                        "SECTION_TITLE_REQUIRED",

                    message:
                        "Learning section title is required.",
                });
        }


        if (
            title.length < 2 ||
            title.length > 150
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_SECTION_TITLE",

                    message:
                        "Learning section title must be between 2 and 150 characters.",
                });
        }


        // ==================================================
        // CONTENT
        // ==================================================

        if (!content) {
            return res
                .status(400)
                .json({
                    code:
                        "SECTION_CONTENT_REQUIRED",

                    message:
                        "Learning section content is required.",
                });
        }


        // ==================================================
        // IMAGE ALT TEXT
        // ==================================================

        if (
            imageAltText.length >
            250
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_IMAGE_ALT_TEXT",

                    message:
                        "Image alternative text cannot exceed 250 characters.",
                });
        }


        // ==================================================
        // REQUIRE ALT TEXT WHEN IMAGE EXISTS
        // ==================================================

        if (
            imageUrl &&
            !imageAltText
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "IMAGE_ALT_TEXT_REQUIRED",

                    message:
                        "Alternative text is required when a learning section contains an image.",
                });
        }


        // ==================================================
        // STATUS
        // ==================================================

        if (
            !SECTION_STATUSES.includes(
                status
            )
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_SECTION_STATUS",

                    message:
                        "Learning section status must be active or inactive.",
                });
        }


        // ==================================================
        // ORDER
        //
        // If frontend does not provide an order,
        // section is automatically placed at the end.
        // ==================================================

        let order;


        if (
            req.body.order !==
            undefined &&
            req.body.order !==
            null &&
            req.body.order !==
            ""
        ) {
            order =
                Number(
                    req.body.order
                );


            if (
                !Number.isInteger(
                    order
                ) ||
                order < 1
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "INVALID_SECTION_ORDER",

                        message:
                            "Learning section order must be a positive whole number.",
                    });
            }


            const existingOrder =
                await LearningSection.findOne({
                    programme:
                        programmeId,

                    order,
                });


            if (
                existingOrder
            ) {
                return res
                    .status(409)
                    .json({
                        code:
                            "SECTION_ORDER_ALREADY_EXISTS",

                        message:
                            `Section order ${order} is already used in this programme.`,
                    });
            }

        } else {
            order =
                await getNextSectionOrder(
                    programmeId
                );
        }


        // ==================================================
        // CREATE SECTION
        // ==================================================

        const section =
            await LearningSection.create({
                programme:
                    programmeId,

                title,

                content,

                imageUrl,

                imageAltText,

                order,

                status,

                createdBy:
                    req.user.id,

                updatedBy:
                    req.user.id,
            });


        // ==================================================
        // AUDIT LOG
        // ==================================================

        await writeAuditLog({
            req,

            user:
                req.user,

            action:
                "LEARNING_SECTION_CREATED",

            status:
                "success",

            details: {
                programmeId:
                    programme._id
                        .toString(),

                programmeTitle:
                    programme.title,

                sectionId:
                    section._id
                        .toString(),

                sectionTitle:
                    section.title,

                order:
                    section.order,
            },
        });


        return res
            .status(201)
            .json({
                message:
                    "Learning section created successfully.",

                section,
            });

    } catch (error) {
        console.error(
            "Create learning section error:",
            error
        );


        if (
            error.code ===
            11000
        ) {
            return res
                .status(409)
                .json({
                    code:
                        "SECTION_ORDER_ALREADY_EXISTS",

                    message:
                        "Another learning section already uses this order.",
                });
        }


        if (
            error.name ===
            "ValidationError"
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "SECTION_VALIDATION_ERROR",

                    message:
                        Object.values(
                            error.errors
                        )[0]?.message ||
                        "Invalid learning section data.",
                });
        }


        return res
            .status(500)
            .json({
                code:
                    "CREATE_SECTION_FAILED",

                message:
                    "Unable to create learning section.",
            });
    }
};


// ======================================================
// GET ALL LEARNING SECTIONS
//
// GET
// /api/training-programmes/:programmeId/sections
//
// Returns sections ordered:
// 1, 2, 3, 4...
// ======================================================

const getLearningSections = async (
    req,
    res
) => {
    try {
        const programmeId =
            req.params.programmeId;


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


        // ==================================================
        // PROGRAMME ACCESS
        // ==================================================

        const programme =
            await getManageableProgramme(
                programmeId,
                req.user
            );


        if (!programme) {
            return res
                .status(404)
                .json({
                    code:
                        "PROGRAMME_NOT_FOUND_OR_ACCESS_DENIED",

                    message:
                        "Training programme was not found or you do not have permission to view its learning sections.",
                });
        }


        const filters = {
            programme:
                programmeId,
        };


        // ==================================================
        // OPTIONAL STATUS FILTER
        //
        // ?status=active
        // ?status=inactive
        // ==================================================

        const requestedStatus =
            normalizeString(
                req.query.status
            );


        if (
            requestedStatus
        ) {
            if (
                !SECTION_STATUSES.includes(
                    requestedStatus
                )
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "INVALID_SECTION_STATUS",

                        message:
                            "Learning section status must be active or inactive.",
                    });
            }


            filters.status =
                requestedStatus;
        }


        const sections =
            await LearningSection.find(
                filters
            )
                .populate(
                    "createdBy",

                    "firstName lastName username role"
                )

                .populate(
                    "updatedBy",

                    "firstName lastName username role"
                )

                .sort({
                    order: 1,
                });


        return res
            .status(200)
            .json({
                programme: {
                    id:
                        programme._id,

                    title:
                        programme.title,

                    programmeType:
                        programme.programmeType,

                    status:
                        programme.status,
                },

                count:
                    sections.length,

                sections,
            });

    } catch (error) {
        console.error(
            "Get learning sections error:",
            error
        );


        return res
            .status(500)
            .json({
                code:
                    "GET_SECTIONS_FAILED",

                message:
                    "Unable to retrieve learning sections.",
            });
    }
};


// ======================================================
// GET ONE LEARNING SECTION
//
// GET
// /api/training-programmes/:programmeId/sections/:sectionId
// ======================================================

const getLearningSectionById = async (
    req,
    res
) => {
    try {
        const {
            programmeId,
            sectionId,
        } = req.params;


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


        // ==================================================
        // PROGRAMME ACCESS
        // ==================================================

        const programme =
            await getManageableProgramme(
                programmeId,
                req.user
            );


        if (!programme) {
            return res
                .status(404)
                .json({
                    code:
                        "PROGRAMME_NOT_FOUND_OR_ACCESS_DENIED",

                    message:
                        "Training programme was not found or you do not have permission to access its learning sections.",
                });
        }


        // ==================================================
        // SECTION MUST BELONG TO PROGRAMME
        // ==================================================

        const section =
            await LearningSection.findOne({
                _id:
                    sectionId,

                programme:
                    programmeId,
            })
                .populate(
                    "createdBy",

                    "firstName lastName username role"
                )

                .populate(
                    "updatedBy",

                    "firstName lastName username role"
                );


        if (!section) {
            return res
                .status(404)
                .json({
                    code:
                        "SECTION_NOT_FOUND",

                    message:
                        "Learning section was not found in this programme.",
                });
        }


        return res
            .status(200)
            .json({
                section,
            });

    } catch (error) {
        console.error(
            "Get learning section error:",
            error
        );


        return res
            .status(500)
            .json({
                code:
                    "GET_SECTION_FAILED",

                message:
                    "Unable to retrieve learning section.",
            });
    }
};


// ======================================================
// UPDATE LEARNING SECTION
//
// PATCH
// /api/training-programmes/:programmeId/sections/:sectionId
// ======================================================

const updateLearningSection = async (
    req,
    res
) => {
    try {
        const {
            programmeId,
            sectionId,
        } = req.params;


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


        // ==================================================
        // PROGRAMME ACCESS
        // ==================================================

        const programme =
            await getManageableProgramme(
                programmeId,
                req.user
            );


        if (!programme) {
            return res
                .status(404)
                .json({
                    code:
                        "PROGRAMME_NOT_FOUND_OR_ACCESS_DENIED",

                    message:
                        "Training programme was not found or you do not have permission to modify its learning sections.",
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
                        "PROGRAMME_INACTIVE",

                    message:
                        "Learning sections cannot be changed while the training programme is inactive.",
                });
        }


        // ==================================================
        // FIND SECTION
        // ==================================================

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
                        "SECTION_NOT_FOUND",

                    message:
                        "Learning section was not found in this programme.",
                });
        }


        // ==================================================
        // TITLE
        // ==================================================

        if (
            req.body.title !==
            undefined
        ) {
            const title =
                normalizeString(
                    req.body.title
                );


            if (
                title.length < 2 ||
                title.length > 150
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "INVALID_SECTION_TITLE",

                        message:
                            "Learning section title must be between 2 and 150 characters.",
                    });
            }


            section.title =
                title;
        }


        // ==================================================
        // CONTENT
        // ==================================================

        if (
            req.body.content !==
            undefined
        ) {
            const content =
                normalizeString(
                    req.body.content
                );


            if (!content) {
                return res
                    .status(400)
                    .json({
                        code:
                            "SECTION_CONTENT_REQUIRED",

                        message:
                            "Learning section content cannot be empty.",
                    });
            }


            section.content =
                content;
        }


        // ==================================================
        // IMAGE URL
        // ==================================================

        if (
            req.body.imageUrl !==
            undefined
        ) {
            section.imageUrl =
                normalizeString(
                    req.body.imageUrl
                );
        }


        // ==================================================
        // IMAGE ALT TEXT
        // ==================================================

        if (
            req.body.imageAltText !==
            undefined
        ) {
            const imageAltText =
                normalizeString(
                    req.body.imageAltText
                );


            if (
                imageAltText.length >
                250
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "INVALID_IMAGE_ALT_TEXT",

                        message:
                            "Image alternative text cannot exceed 250 characters.",
                    });
            }


            section.imageAltText =
                imageAltText;
        }


        // ==================================================
        // AFTER IMAGE CHANGES:
        // IMAGE REQUIRES ALT TEXT
        // ==================================================

        if (
            section.imageUrl &&
            !section.imageAltText
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "IMAGE_ALT_TEXT_REQUIRED",

                    message:
                        "Alternative text is required when a learning section contains an image.",
                });
        }


        // ==================================================
        // STATUS
        // ==================================================

        if (
            req.body.status !==
            undefined
        ) {
            const status =
                normalizeString(
                    req.body.status
                );


            if (
                !SECTION_STATUSES.includes(
                    status
                )
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "INVALID_SECTION_STATUS",

                        message:
                            "Learning section status must be active or inactive.",
                    });
            }


            section.status =
                status;
        }


        // ==================================================
        // ORDER
        //
        // Individual order changes are allowed only if
        // target order is not already occupied.
        //
        // For proper multi-section movement use:
        //
        // PUT /sections/reorder
        // ==================================================

        if (
            req.body.order !==
            undefined
        ) {
            const order =
                Number(
                    req.body.order
                );


            if (
                !Number.isInteger(
                    order
                ) ||
                order < 1
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "INVALID_SECTION_ORDER",

                        message:
                            "Learning section order must be a positive whole number.",
                    });
            }


            if (
                order !==
                section.order
            ) {
                const existingOrder =
                    await LearningSection.findOne({
                        programme:
                            programmeId,

                        order,

                        _id: {
                            $ne:
                                sectionId,
                        },
                    });


                if (
                    existingOrder
                ) {
                    return res
                        .status(409)
                        .json({
                            code:
                                "SECTION_ORDER_ALREADY_EXISTS",

                            message:
                                `Section order ${order} is already used. Use the reorder endpoint to rearrange multiple sections.`,
                        });
                }


                section.order =
                    order;
            }
        }


        section.updatedBy =
            req.user.id;


        await section.save();


        // ==================================================
        // AUDIT LOG
        // ==================================================

        await writeAuditLog({
            req,

            user:
                req.user,

            action:
                "LEARNING_SECTION_UPDATED",

            status:
                "success",

            details: {
                programmeId:
                    programme._id
                        .toString(),

                programmeTitle:
                    programme.title,

                sectionId:
                    section._id
                        .toString(),

                sectionTitle:
                    section.title,

                order:
                    section.order,

                sectionStatus:
                    section.status,
            },
        });


        return res
            .status(200)
            .json({
                message:
                    "Learning section updated successfully.",

                section,
            });

    } catch (error) {
        console.error(
            "Update learning section error:",
            error
        );


        if (
            error.code ===
            11000
        ) {
            return res
                .status(409)
                .json({
                    code:
                        "SECTION_ORDER_ALREADY_EXISTS",

                    message:
                        "Another learning section already uses this order.",
                });
        }


        if (
            error.name ===
            "ValidationError"
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "SECTION_VALIDATION_ERROR",

                    message:
                        Object.values(
                            error.errors
                        )[0]?.message ||
                        "Invalid learning section data.",
                });
        }


        return res
            .status(500)
            .json({
                code:
                    "UPDATE_SECTION_FAILED",

                message:
                    "Unable to update learning section.",
            });
    }
};


// ======================================================
// DEACTIVATE LEARNING SECTION
//
// DELETE
// /api/training-programmes/:programmeId/sections/:sectionId
//
// Soft delete.
// We retain the section for audit/history.
// ======================================================

const deleteLearningSection = async (
    req,
    res
) => {
    try {
        const {
            programmeId,
            sectionId,
        } = req.params;


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


        // ==================================================
        // PROGRAMME ACCESS
        // ==================================================

        const programme =
            await getManageableProgramme(
                programmeId,
                req.user
            );


        if (!programme) {
            return res
                .status(404)
                .json({
                    code:
                        "PROGRAMME_NOT_FOUND_OR_ACCESS_DENIED",

                    message:
                        "Training programme was not found or you do not have permission to modify its learning sections.",
                });
        }


        // ==================================================
        // SECTION
        // ==================================================

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
                        "SECTION_NOT_FOUND",

                    message:
                        "Learning section was not found in this programme.",
                });
        }


        if (
            section.status ===
            "inactive"
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "SECTION_ALREADY_INACTIVE",

                    message:
                        "Learning section is already inactive.",
                });
        }


        // ==================================================
        // SOFT DELETE
        // ==================================================

        section.status =
            "inactive";


        section.updatedBy =
            req.user.id;


        await section.save();


        // ==================================================
        // AUDIT LOG
        // ==================================================

        await writeAuditLog({
            req,

            user:
                req.user,

            action:
                "LEARNING_SECTION_DEACTIVATED",

            status:
                "success",

            details: {
                programmeId:
                    programme._id
                        .toString(),

                programmeTitle:
                    programme.title,

                sectionId:
                    section._id
                        .toString(),

                sectionTitle:
                    section.title,

                order:
                    section.order,
            },
        });


        return res
            .status(200)
            .json({
                message:
                    "Learning section deactivated successfully.",

                section: {
                    id:
                        section._id,

                    title:
                        section.title,

                    order:
                        section.order,

                    status:
                        section.status,
                },
            });

    } catch (error) {
        console.error(
            "Delete learning section error:",
            error
        );


        return res
            .status(500)
            .json({
                code:
                    "DELETE_SECTION_FAILED",

                message:
                    "Unable to deactivate learning section.",
            });
    }
};


// ======================================================
// REORDER LEARNING SECTIONS
//
// PUT
// /api/training-programmes/:programmeId/sections/reorder
//
// BODY:
//
// {
//   "sectionIds": [
//      "section-id-3",
//      "section-id-1",
//      "section-id-2"
//   ]
// }
//
// New order becomes:
//
// section-id-3 => 1
// section-id-1 => 2
// section-id-2 => 3
//
// IMPORTANT:
// All sections for the programme must be supplied.
// This prevents duplicate/gapped order values.
// ======================================================

const reorderLearningSections = async (
    req,
    res
) => {
    try {
        const programmeId =
            req.params.programmeId;


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


        // ==================================================
        // PROGRAMME ACCESS
        // ==================================================

        const programme =
            await getManageableProgramme(
                programmeId,
                req.user
            );


        if (!programme) {
            return res
                .status(404)
                .json({
                    code:
                        "PROGRAMME_NOT_FOUND_OR_ACCESS_DENIED",

                    message:
                        "Training programme was not found or you do not have permission to reorder its learning sections.",
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
                        "PROGRAMME_INACTIVE",

                    message:
                        "Learning sections cannot be reordered while the training programme is inactive.",
                });
        }


        // ==================================================
        // BODY VALIDATION
        // ==================================================

        const sectionIds =
            req.body.sectionIds;


        if (
            !Array.isArray(
                sectionIds
            ) ||
            sectionIds.length ===
            0
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "SECTION_ORDER_REQUIRED",

                    message:
                        "sectionIds must be a non-empty array containing the learning sections in the required order.",
                });
        }


        // ==================================================
        // VALID OBJECT IDS
        // ==================================================

        const invalidId =
            sectionIds.find(
                (sectionId) =>
                    !isValidObjectId(
                        sectionId
                    )
            );


        if (invalidId) {
            return res
                .status(400)
                .json({
                    code:
                        "INVALID_SECTION_ID",

                    message:
                        "One or more learning section IDs are invalid.",
                });
        }


        // ==================================================
        // DUPLICATE IDS
        // ==================================================

        const normalizedIds =
            sectionIds.map(
                (sectionId) =>
                    String(
                        sectionId
                    )
            );


        const uniqueIds =
            new Set(
                normalizedIds
            );


        if (
            uniqueIds.size !==
            normalizedIds.length
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "DUPLICATE_SECTION_ID",

                    message:
                        "The reorder list cannot contain the same learning section more than once.",
                });
        }


        // ==================================================
        // LOAD ALL PROGRAMME SECTIONS
        // ==================================================

        const programmeSections =
            await LearningSection.find({
                programme:
                    programmeId,
            }).select(
                "_id order"
            );


        if (
            programmeSections.length !==
            normalizedIds.length
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "INCOMPLETE_SECTION_ORDER",

                    message:
                        "The reorder request must include every learning section in the programme exactly once.",
                });
        }


        // ==================================================
        // ENSURE EVERY ID BELONGS TO PROGRAMME
        // ==================================================

        const existingSectionIds =
            new Set(
                programmeSections.map(
                    (section) =>
                        section._id
                            .toString()
                )
            );


        const foreignSectionId =
            normalizedIds.find(
                (sectionId) =>
                    !existingSectionIds.has(
                        sectionId
                    )
            );


        if (
            foreignSectionId
        ) {
            return res
                .status(400)
                .json({
                    code:
                        "SECTION_PROGRAMME_MISMATCH",

                    message:
                        "One or more learning sections do not belong to this training programme.",
                });
        }


        // ==================================================
        // TWO-PHASE REORDER
        //
        // Why?
        //
        // LearningSection has unique:
        //
        // programme + order
        //
        // Swapping:
        // 1 -> 2
        // 2 -> 1
        //
        // directly can trigger MongoDB duplicate key.
        //
        // Therefore:
        //
        // Phase 1:
        // 1 -> -1
        // 2 -> -2
        //
        // Phase 2:
        // -1 -> final positive order
        // -2 -> final positive order
        // ==================================================

        const temporaryOperations =
            normalizedIds.map(
                (
                    sectionId,
                    index
                ) => ({
                    updateOne: {
                        filter: {
                            _id:
                                sectionId,

                            programme:
                                programmeId,
                        },

                        update: {
                            $set: {
                                order:
                                    -(
                                        index +
                                        1
                                    ),

                                updatedBy:
                                    req.user.id,
                            },
                        },
                    },
                })
            );


        await LearningSection.bulkWrite(
            temporaryOperations,
            {
                ordered: true,
            }
        );


        const finalOperations =
            normalizedIds.map(
                (
                    sectionId,
                    index
                ) => ({
                    updateOne: {
                        filter: {
                            _id:
                                sectionId,

                            programme:
                                programmeId,
                        },

                        update: {
                            $set: {
                                order:
                                    index +
                                    1,

                                updatedBy:
                                    req.user.id,
                            },
                        },
                    },
                })
            );


        await LearningSection.bulkWrite(
            finalOperations,
            {
                ordered: true,
            }
        );


        // ==================================================
        // RETURN NEW ORDER
        // ==================================================

        const reorderedSections =
            await LearningSection.find({
                programme:
                    programmeId,
            })
                .populate(
                    "createdBy",

                    "firstName lastName username role"
                )

                .populate(
                    "updatedBy",

                    "firstName lastName username role"
                )

                .sort({
                    order: 1,
                });


        // ==================================================
        // AUDIT LOG
        // ==================================================

        await writeAuditLog({
            req,

            user:
                req.user,

            action:
                "LEARNING_SECTIONS_REORDERED",

            status:
                "success",

            details: {
                programmeId:
                    programme._id
                        .toString(),

                programmeTitle:
                    programme.title,

                sectionOrder:
                    reorderedSections.map(
                        (section) => ({
                            sectionId:
                                section._id
                                    .toString(),

                            title:
                                section.title,

                            order:
                                section.order,
                        })
                    ),
            },
        });


        return res
            .status(200)
            .json({
                message:
                    "Learning sections reordered successfully.",

                sections:
                    reorderedSections,
            });

    } catch (error) {
        console.error(
            "Reorder learning sections error:",
            error
        );


        return res
            .status(500)
            .json({
                code:
                    "REORDER_SECTIONS_FAILED",

                message:
                    "Unable to reorder learning sections.",
            });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    createLearningSection,

    getLearningSections,

    getLearningSectionById,

    updateLearningSection,

    deleteLearningSection,

    reorderLearningSections,
};
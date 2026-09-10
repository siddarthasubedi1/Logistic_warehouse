// ======================================================
// TRAINING UTILITY HELPERS
// ======================================================
//
// Shared between:
//
// Admin
// Trainer
// Trainee
// Training Programmes
// Learning Sections
// Training Assignments
// Trainee My Training
//
// IMPORTANT:
//
// Sprint 1:
// assignedTrainingSections
// TrainingProgress
//
// Sprint 2:
// TrainingProgramme
// LearningSection
// TrainingAssignment
//
// These helpers do NOT merge those concepts.
//
// ======================================================


// ======================================================
// PROGRAMME TYPES
// ======================================================

export const PROGRAMME_TYPES = [
    {
        value:
            "manual-handling",

        label:
            "Manual Handling",
    },

    {
        value:
            "working-at-height",

        label:
            "Working at Height",
    },
];


// ======================================================
// PROGRAMME STATUS
// ======================================================

export const PROGRAMME_STATUSES = [
    "draft",
    "active",
    "inactive",
];


// ======================================================
// LEARNING SECTION STATUS
// ======================================================

export const LEARNING_SECTION_STATUSES = [
    "active",
    "inactive",
];


// ======================================================
// FORMAT PROGRAMME TYPE
// ======================================================

export const formatProgrammeType = (
    programmeType
) => {
    switch (
    programmeType
    ) {
        case "manual-handling":
            return "Manual Handling";


        case "working-at-height":
            return "Working at Height";


        default:
            return (
                programmeType ||
                "Unknown Programme"
            );
    }
};


// ======================================================
// ALIAS
// ======================================================
//
// Some older components used:
// getProgrammeTypeLabel()
//
// Keep it so those components continue working.
//
// ======================================================

export const getProgrammeTypeLabel =
    (
        programmeType
    ) => {
        return formatProgrammeType(
            programmeType
        );
    };


// ======================================================
// USER DISPLAY NAME
// ======================================================

export const getUserDisplayName = (
    user,
    fallback = "Unknown user"
) => {
    if (!user) {
        return fallback;
    }


    // ==================================================
    // USER MAY SOMETIMES BE STRING
    // ==================================================

    if (
        typeof user ===
        "string"
    ) {
        const cleanValue =
            user.trim();


        return (
            cleanValue ||
            fallback
        );
    }


    // ==================================================
    // FULL NAME PROPERTY
    // ==================================================

    if (
        typeof user.fullName ===
        "string" &&
        user.fullName.trim()
    ) {
        return user
            .fullName
            .trim();
    }


    // ==================================================
    // FIRST + LAST NAME
    // ==================================================

    const fullName =
        [
            user.firstName,
            user.lastName,
        ]
            .filter(
                Boolean
            )
            .join(" ")
            .trim();


    if (
        fullName
    ) {
        return fullName;
    }


    // ==================================================
    // USERNAME
    // ==================================================

    if (
        typeof user.username ===
        "string" &&
        user.username.trim()
    ) {
        return user
            .username
            .trim();
    }


    return fallback;
};


// ======================================================
// DISPLAY NAME ALIAS
// ======================================================
//
// Some previous components use getDisplayName.
//
// Keep both helper names so existing components do not
// need unnecessary changes.
//
// ======================================================

export const getDisplayName = (
    user,
    fallback =
        "Unknown user"
) => {
    return getUserDisplayName(
        user,
        fallback
    );
};


// ======================================================
// PROGRAMME OWNER
// ======================================================
//
// Current and earlier frontend versions may receive:
//
// programme.ownerTrainer
// programme.owner
// programme.trainer
//
// Supporting all three prevents UI breakage while the
// backend remains the source of truth.
//
// ======================================================

export const getProgrammeOwner = (
    programme
) => {
    if (!programme) {
        return null;
    }


    return (
        programme.ownerTrainer ||
        programme.owner ||
        programme.trainer ||
        null
    );
};


// ======================================================
// PROGRAMME TRAINER NAME
// ======================================================

export const getProgrammeTrainerName =
    (
        programme
    ) => {
        const trainer =
            getProgrammeOwner(
                programme
            );


        return getUserDisplayName(
            trainer,
            "Not assigned"
        );
    };


// ======================================================
// FORMAT TRAINING DATE
// ======================================================

export const formatTrainingDate = (
    value
) => {
    if (!value) {
        return "—";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }


    return date.toLocaleDateString(
        undefined,
        {
            year:
                "numeric",

            month:
                "short",

            day:
                "numeric",
        }
    );
};


// ======================================================
// FORMAT DATE + TIME
// ======================================================

export const formatTrainingDateTime = (
    value
) => {
    if (!value) {
        return "—";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }


    return date.toLocaleString(
        undefined,
        {
            year:
                "numeric",

            month:
                "short",

            day:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit",
        }
    );
};


// ======================================================
// GET PROGRAMME FROM ASSIGNMENT
// ======================================================

export const getAssignmentProgramme =
    (
        assignment
    ) => {
        if (
            !assignment
        ) {
            return null;
        }


        return (
            assignment.programme ||
            assignment.trainingProgramme ||
            null
        );
    };


// ======================================================
// GET TRAINEE FROM ASSIGNMENT
// ======================================================

export const getAssignmentTrainee =
    (
        assignment
    ) => {
        if (
            !assignment
        ) {
            return null;
        }


        return (
            assignment.trainee ||
            assignment.user ||
            null
        );
    };


// ======================================================
// ACTIVE RECORD
// ======================================================

export const isActiveTrainingRecord =
    (
        record
    ) => {
        return (
            String(
                record?.status ||
                ""
            )
                .trim()
                .toLowerCase() ===
            "active"
        );
    };


// ======================================================
// ACTIVE PROGRAMMES
// ======================================================

export const getActiveProgrammes = (
    programmes = []
) => {
    if (
        !Array.isArray(
            programmes
        )
    ) {
        return [];
    }


    return programmes.filter(
        (
            programme
        ) =>
            isActiveTrainingRecord(
                programme
            )
    );
};


// ======================================================
// ASSIGNABLE TRAINEES
// ======================================================
//
// TrainingAssignment is a Sprint 2 concept.
//
// An assignable Trainee must:
//
// role = trainee
// status = active
//
// Older Sprint 1 users normally also have:
//
// accountStatus = created
//
// If accountStatus is present, require created.
// If older valid records do not contain accountStatus,
// they are still accepted.
//
// ======================================================

export const getAssignableTrainees =
    (
        users = []
    ) => {
        if (
            !Array.isArray(
                users
            )
        ) {
            return [];
        }


        return users.filter(
            (
                user
            ) => {
                if (
                    user?.role !==
                    "trainee"
                ) {
                    return false;
                }


                if (
                    user?.status !==
                    "active"
                ) {
                    return false;
                }


                if (
                    user.accountStatus &&
                    user.accountStatus !==
                    "created"
                ) {
                    return false;
                }


                return true;
            }
        );
    };


// ======================================================
// SORT LEARNING SECTIONS
// ======================================================

export const sortLearningSections = (
    sections = []
) => {
    if (
        !Array.isArray(
            sections
        )
    ) {
        return [];
    }


    return [
        ...sections,
    ].sort(
        (
            first,
            second
        ) => {
            const firstOrder =
                Number(
                    first?.order ??
                    0
                );


            const secondOrder =
                Number(
                    second?.order ??
                    0
                );


            // ==================================================
            // PRIMARY: SECTION ORDER
            // ==================================================

            if (
                firstOrder !==
                secondOrder
            ) {
                return (
                    firstOrder -
                    secondOrder
                );
            }


            // ==================================================
            // SECONDARY: CREATION TIME
            // ==================================================

            const firstCreated =
                new Date(
                    first?.createdAt ||
                    0
                ).getTime();


            const secondCreated =
                new Date(
                    second?.createdAt ||
                    0
                ).getTime();


            return (
                firstCreated -
                secondCreated
            );
        }
    );
};


// ======================================================
// SECTION POSITION PERCENTAGE
// ======================================================
//
// IMPORTANT:
//
// This is NOT persisted progress.
//
// It only describes where the Trainee currently is inside
// the list of Sprint 2 learning sections.
//
// Example:
//
// currentSection = 0
// totalSections = 4
//
// Section position = 25%
//
// This helper does not:
// - update TrainingProgress
// - create a database record
// - mark content completed
// - calculate quiz scores
//
// ======================================================

export const calculateSectionPercentage =
    (
        currentSection,
        totalSections
    ) => {
        const current =
            Number(
                currentSection
            );


        const total =
            Number(
                totalSections
            );


        if (
            !Number.isFinite(
                total
            ) ||
            total <=
            0
        ) {
            return 0;
        }


        if (
            !Number.isFinite(
                current
            )
        ) {
            return 0;
        }


        const normalizedCurrent =
            Math.max(
                0,
                Math.min(
                    current,
                    total -
                    1
                )
            );


        const position =
            normalizedCurrent +
            1;


        const percentage =
            Math.round(
                (
                    position /
                    total
                ) *
                100
            );


        return Math.max(
            0,
            Math.min(
                percentage,
                100
            )
        );
    };


// ======================================================
// PARSE ARRAY RESPONSE
// ======================================================
//
// APIs in the current project may return:
//
// [...]
//
// or:
//
// {
//     users: [...]
// }
//
// or:
//
// {
//     programmes: [...]
// }
//
// or:
//
// {
//     sections: [...]
// }
//
// This helper supports both.
//
// ======================================================

export const parseArrayResponse = (
    data,
    propertyName
) => {
    if (
        Array.isArray(
            data
        )
    ) {
        return data;
    }


    if (
        data &&
        propertyName &&
        Array.isArray(
            data[
            propertyName
            ]
        )
    ) {
        return data[
            propertyName
        ];
    }


    return [];
};


// ======================================================
// ARRAY RESPONSE ALIAS
// ======================================================
//
// Earlier My Training components used getArrayResponse.
// Keep the alias to prevent unnecessary import changes.
//
// ======================================================

export const getArrayResponse = (
    data,
    propertyName
) => {
    return parseArrayResponse(
        data,
        propertyName
    );
};


// ======================================================
// GET API ERROR MESSAGE
// ======================================================

export const getApiErrorMessage = (
    error,
    fallbackMessage =
        "Something went wrong."
) => {
    const serverMessage =
        error
            ?.response
            ?.data
            ?.message;


    if (
        typeof serverMessage ===
        "string" &&
        serverMessage.trim()
    ) {
        return serverMessage.trim();
    }


    const localMessage =
        error?.message;


    if (
        typeof localMessage ===
        "string" &&
        localMessage.trim()
    ) {
        return localMessage.trim();
    }


    return fallbackMessage;
};


// ======================================================
// NORMALIZE TRAINING SECTIONS
// ======================================================
//
// Sprint 1 broad training area helper.
//
// Does NOT work with Sprint 2 TrainingAssignments.
//
// ======================================================

export const normalizeTrainingSections =
    (
        sections = []
    ) => {
        if (
            !Array.isArray(
                sections
            )
        ) {
            return [];
        }


        const allowed = [
            "manual-handling",
            "working-at-height",
        ];


        return [
            ...new Set(
                sections.filter(
                    (
                        section
                    ) =>
                        allowed.includes(
                            section
                        )
                )
            ),
        ];
    };


// ======================================================
// CHECK TRAINING SECTION ACCESS
// ======================================================
//
// Sprint 1 broad role assignment only.
//
// ======================================================

export const hasTrainingSectionAccess =
    (
        user,
        programmeType
    ) => {
        if (
            !user ||
            !programmeType
        ) {
            return false;
        }


        const assignedSections =
            normalizeTrainingSections(
                user
                    .assignedTrainingSections
            );


        return assignedSections.includes(
            programmeType
        );
    };


// ======================================================
// EXPORT PROGRAMME TYPE VALUES
// ======================================================

export const PROGRAMME_TYPE_VALUES =
    PROGRAMME_TYPES.map(
        (
            type
        ) =>
            type.value
    );
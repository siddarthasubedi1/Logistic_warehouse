// ======================================================
// TRAINING UTILITY HELPERS
// ======================================================
//
// Shared helpers used throughout:
//
// - Admin training pages
// - Trainer training pages
// - Trainee training pages
// - Training assignments
// - Programme management
// - Learning sections
//
// ======================================================


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
// USER DISPLAY NAME
// ======================================================

export const getUserDisplayName = (
    user,
    fallback = "Unknown user"
) => {
    if (!user) {
        return fallback;
    }


    // ------------------------------------------
    // FULL NAME
    // ------------------------------------------

    if (
        typeof user.fullName ===
        "string" &&
        user.fullName.trim()
    ) {
        return user.fullName.trim();
    }


    // ------------------------------------------
    // FIRST + LAST NAME
    // ------------------------------------------

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


    if (fullName) {
        return fullName;
    }


    // ------------------------------------------
    // USERNAME
    // ------------------------------------------

    if (
        typeof user.username ===
        "string" &&
        user.username.trim()
    ) {
        return user.username.trim();
    }


    return fallback;
};


// ======================================================
// PROGRAMME TRAINER NAME
// ======================================================
//
// Current backend programme model uses "owner".
//
// Extra fallbacks are supported so the helper remains
// safe if a populated programme is shaped slightly
// differently elsewhere in the application.
//
// ======================================================

export const getProgrammeTrainerName = (
    programme
) => {
    if (!programme) {
        return "Not assigned";
    }


    const trainer =
        programme.owner ||
        programme.ownerTrainer ||
        programme.trainer ||
        null;


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
// GET PROGRAMME FROM ASSIGNMENT
// ======================================================

export const getAssignmentProgramme = (
    assignment
) => {
    return (
        assignment?.programme ||
        assignment?.trainingProgramme ||
        null
    );
};


// ======================================================
// GET TRAINEE FROM ASSIGNMENT
// ======================================================

export const getAssignmentTrainee = (
    assignment
) => {
    return (
        assignment?.trainee ||
        assignment?.user ||
        null
    );
};


// ======================================================
// CHECK ACTIVE RECORD
// ======================================================

export const isActiveTrainingRecord = (
    record
) => {
    return (
        record?.status ===
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
        (programme) =>
            programme?.status ===
            "active"
    );
};


// ======================================================
// ASSIGNABLE TRAINEES
// ======================================================
//
// A Trainee can receive a programme when:
//
// - role = trainee
// - status = active
// - accountStatus = created
//
// This matches the backend Training Assignment
// controller.
//
// ======================================================

export const getAssignableTrainees = (
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
        (user) =>
            user?.role ===
            "trainee" &&
            user?.status ===
            "active" &&
            user?.accountStatus ===
            "created"
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


            // ------------------------------------------
            // PRIMARY SORT: ORDER
            // ------------------------------------------

            if (
                firstOrder !==
                secondOrder
            ) {
                return (
                    firstOrder -
                    secondOrder
                );
            }


            // ------------------------------------------
            // SECONDARY SORT: CREATED DATE
            // ------------------------------------------

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
// SECTION READING PERCENTAGE
// ======================================================
//
// currentSection is ZERO-BASED.
//
// Example:
//
// Section 1 of 4
// currentSection = 0
//
// Reading progress = 25%
//
// Section 4 of 4
// currentSection = 3
//
// Reading progress = 100%
//
// This is only visual Sprint 2 navigation progress.
// It does NOT save completion to MongoDB.
//
// ======================================================

export const calculateSectionPercentage = (
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


    // currentSection is zero-based, therefore Section 1
    // is index 0.
    const sectionBeingRead =
        current +
        1;


    const percentage =
        Math.round(
            (
                sectionBeingRead /
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
// PARSE ARRAY API RESPONSE
// ======================================================
//
// Different controllers can return:
//
// [
//   ...
// ]
//
// or:
//
// {
//   programmes: [...]
// }
//
// or:
//
// {
//   assignments: [...]
// }
//
// This helper safely supports both.
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
            data[propertyName]
        )
    ) {
        return data[
            propertyName
        ];
    }


    return [];
};


// ======================================================
// API ERROR MESSAGE
// ======================================================

export const getApiErrorMessage = (
    error,
    fallbackMessage =
        "Something went wrong."
) => {
    return (
        error?.response?.data
            ?.message ||
        error?.message ||
        fallbackMessage
    );
};
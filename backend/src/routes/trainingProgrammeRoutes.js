const express =
    require("express");


const router =
    express.Router();


// ======================================================
// MIDDLEWARE
// ======================================================

const authenticate =
    require(
        "../middleware/authenticate"
    );


const authorize =
    require(
        "../middleware/authorize"
    );


const checkActiveStatus =
    require(
        "../middleware/checkActiveStatus"
    );


const uploadTrainingImage =
    require(
        "../middleware/uploadTrainingImage"
    );


// ======================================================
// TRAINING PROGRAMME CONTROLLER
// ======================================================

const {
    createTrainingProgramme,
    getTrainingProgrammes,
    getTrainingProgrammeById,
    updateTrainingProgramme,
    deleteTrainingProgramme,
    reactivateTrainingProgramme,
} =
    require(
        "../controllers/trainingProgrammeController"
    );


// ======================================================
// LEARNING SECTION CONTROLLER
// ======================================================

const {
    createLearningSection,
    getLearningSections,
    getLearningSectionById,
    updateLearningSection,
    deleteLearningSection,
    reorderLearningSections,
} =
    require(
        "../controllers/learningSectionController"
    );


// ======================================================
// COMMON SECURITY
//
// Every route below requires:
//
// 1. Valid login token
// 2. Active account
//
// Existing Sprint 1 authentication is NOT changed.
// ======================================================

router.use(
    authenticate,
    checkActiveStatus
);


// ======================================================
// GET TRAINING PROGRAMMES
//
// GET
// /api/training-programmes
//
// Admin:
// - Can view programmes.
//
// Trainer:
// - Can view programmes available to them.
// ======================================================

router.get(
    "/",

    authorize(
        "admin",
        "trainer"
    ),

    getTrainingProgrammes
);


// ======================================================
// CREATE TRAINING PROGRAMME
//
// POST
// /api/training-programmes
// ======================================================

router.post(
    "/",

    authorize(
        "admin",
        "trainer"
    ),

    uploadTrainingImage.single("coverImage"),

    createTrainingProgramme
);


// ======================================================
// REORDER LEARNING SECTIONS
//
// IMPORTANT:
// This route must remain before the dynamic
// /:sectionId routes.
//
// PUT
// /api/training-programmes/:programmeId/sections/reorder
// ======================================================

router.put(
    "/:programmeId/sections/reorder",

    authorize(
        "admin",
        "trainer"
    ),

    reorderLearningSections
);


// ======================================================
// GET ALL LEARNING SECTIONS
//
// GET
// /api/training-programmes/:programmeId/sections
// ======================================================

router.get(
    "/:programmeId/sections",

    authorize(
        "admin",
        "trainer"
    ),

    getLearningSections
);


// ======================================================
// CREATE LEARNING SECTION + IMAGE
//
// POST
// /api/training-programmes/:programmeId/sections
//
// Request:
// multipart/form-data
//
// Image field name:
// image
//
// Example frontend:
// formData.append("image", imageFile)
//
// Multer creates:
// req.file
//
// Controller:
// saves image using Sharp
// ======================================================

router.post(
    "/:programmeId/sections",

    authorize(
        "admin",
        "trainer"
    ),

    uploadTrainingImage.single(
        "image"
    ),

    createLearningSection
);


// ======================================================
// GET ONE LEARNING SECTION
//
// GET
// /api/training-programmes/:programmeId/sections/:sectionId
// ======================================================

router.get(
    "/:programmeId/sections/:sectionId",

    authorize(
        "admin",
        "trainer"
    ),

    getLearningSectionById
);


// ======================================================
// UPDATE LEARNING SECTION
//
// PATCH
// /api/training-programmes/:programmeId/sections/:sectionId
//
// New image is OPTIONAL during edit.
//
// No new image:
// existing image remains.
//
// New image selected:
// Multer puts it in req.file and controller replaces
// the previous image.
// ======================================================

router.patch(
    "/:programmeId/sections/:sectionId",

    authorize(
        "admin",
        "trainer"
    ),

    uploadTrainingImage.single(
        "image"
    ),

    updateLearningSection
);


// ======================================================
// DEACTIVATE LEARNING SECTION
//
// DELETE
// /api/training-programmes/:programmeId/sections/:sectionId
// ======================================================

router.delete(
    "/:programmeId/sections/:sectionId",

    authorize(
        "admin",
        "trainer"
    ),

    deleteLearningSection
);


// ======================================================
// GET ONE TRAINING PROGRAMME
//
// GET
// /api/training-programmes/:programmeId
// ======================================================

router.get(
    "/:programmeId",

    authorize(
        "admin",
        "trainer"
    ),

    getTrainingProgrammeById
);


// ======================================================
// UPDATE TRAINING PROGRAMME
//
// PATCH
// /api/training-programmes/:programmeId
// ======================================================

router.patch(
    "/:programmeId",

    authorize(
        "admin",
        "trainer"
    ),

    uploadTrainingImage.single("coverImage"),

    updateTrainingProgramme
);


// ======================================================
// DEACTIVATE TRAINING PROGRAMME
//
// DELETE
// /api/training-programmes/:programmeId
// ======================================================

router.delete(
    "/:programmeId",

    authorize(
        "admin",
        "trainer"
    ),

    deleteTrainingProgramme
);


// ======================================================
// REACTIVATE TRAINING PROGRAMME
//
// PATCH
// /api/training-programmes/:programmeId/reactivate
// ======================================================

router.patch(
    "/:programmeId/reactivate",

    authorize(
        "admin",
        "trainer"
    ),

    reactivateTrainingProgramme
);


// ======================================================
// EXPORT
// ======================================================

module.exports =
    router;
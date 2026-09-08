const express = require("express");

const authenticate = require(
    "../middleware/authenticate"
);

const checkActiveStatus = require(
    "../middleware/checkActiveStatus"
);

const authorize = require(
    "../middleware/authorize"
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
} = require(
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
} = require(
    "../controllers/learningSectionController"
);


const router =
    express.Router();


// ======================================================
// PROTECT ALL PROGRAMME MANAGEMENT ROUTES
//
// These management APIs belong to:
//
// ADMIN
// TRAINER
//
// Trainee read-only learning access will be implemented
// separately in Sprint 2 Task 2.9.
// ======================================================

router.use(
    authenticate,

    checkActiveStatus,

    authorize(
        "admin",
        "trainer"
    )
);


// ======================================================
// LEARNING SECTION ROUTES
//
// IMPORTANT:
// These routes are placed BEFORE /:id routes.
//
// This avoids Express interpreting:
//
// /123/sections
//
// as only:
//
// /:id
// ======================================================


// ======================================================
// CREATE LEARNING SECTION
//
// POST
// /api/training-programmes/:programmeId/sections
// ======================================================

router.post(
    "/:programmeId/sections",

    createLearningSection
);


// ======================================================
// GET ALL LEARNING SECTIONS
//
// GET
// /api/training-programmes/:programmeId/sections
//
// Optional:
//
// ?status=active
// ?status=inactive
// ======================================================

router.get(
    "/:programmeId/sections",

    getLearningSections
);


// ======================================================
// REORDER LEARNING SECTIONS
//
// PUT
// /api/training-programmes/:programmeId/sections/reorder
//
// Body:
//
// {
//     "sectionIds": [
//         "sectionId3",
//         "sectionId1",
//         "sectionId2"
//     ]
// }
// ======================================================

router.put(
    "/:programmeId/sections/reorder",

    reorderLearningSections
);


// ======================================================
// GET ONE LEARNING SECTION
//
// GET
// /api/training-programmes/:programmeId/sections/:sectionId
// ======================================================

router.get(
    "/:programmeId/sections/:sectionId",

    getLearningSectionById
);


// ======================================================
// UPDATE LEARNING SECTION
//
// PATCH
// /api/training-programmes/:programmeId/sections/:sectionId
// ======================================================

router.patch(
    "/:programmeId/sections/:sectionId",

    updateLearningSection
);


// ======================================================
// DELETE / DEACTIVATE LEARNING SECTION
//
// DELETE
// /api/training-programmes/:programmeId/sections/:sectionId
// ======================================================

router.delete(
    "/:programmeId/sections/:sectionId",

    deleteLearningSection
);


// ======================================================
// TRAINING PROGRAMME ROUTES
// ======================================================


// ======================================================
// CREATE TRAINING PROGRAMME
//
// POST
// /api/training-programmes
// ======================================================

router.post(
    "/",

    createTrainingProgramme
);


// ======================================================
// GET TRAINING PROGRAMMES
//
// GET
// /api/training-programmes
//
// Optional:
//
// ?programmeType=manual-handling
// ?programmeType=working-at-height
//
// ?status=draft
// ?status=active
// ?status=inactive
//
// ?search=safety
// ======================================================

router.get(
    "/",

    getTrainingProgrammes
);


// ======================================================
// GET ONE TRAINING PROGRAMME
//
// GET
// /api/training-programmes/:id
// ======================================================

router.get(
    "/:id",

    getTrainingProgrammeById
);


// ======================================================
// UPDATE TRAINING PROGRAMME
//
// PATCH
// /api/training-programmes/:id
// ======================================================

router.patch(
    "/:id",

    updateTrainingProgramme
);


// ======================================================
// DELETE / DEACTIVATE TRAINING PROGRAMME
//
// DELETE
// /api/training-programmes/:id
// ======================================================

router.delete(
    "/:id",

    deleteTrainingProgramme
);


// ======================================================
// EXPORT
// ======================================================

module.exports =
    router;
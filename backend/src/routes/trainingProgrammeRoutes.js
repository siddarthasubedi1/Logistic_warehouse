const express =
    require("express");

const router =
    express.Router();


const authenticate =
    require("../middleware/authenticate");

const authorize =
    require("../middleware/authorize");

const checkActiveStatus =
    require("../middleware/checkActiveStatus");


const {
    createTrainingProgramme,
    getTrainingProgrammes,
    getTrainingProgrammeById,
    updateTrainingProgramme,
    deleteTrainingProgramme,
} =
    require("../controllers/trainingProgrammeController");


const {
    createLearningSection,
    getLearningSections,
    getLearningSectionById,
    updateLearningSection,
    deleteLearningSection,
    reorderLearningSections,
} =
    require("../controllers/learningSectionController");


const {
    reactivateTrainingProgramme,
    reactivateLearningSection,
} =
    require("../controllers/trainingReactivationController");


// ======================================================
// AUTHENTICATION
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
// LEARNING SECTIONS
// ======================================================

router.post(
    "/:programmeId/sections",
    createLearningSection
);


router.get(
    "/:programmeId/sections",
    getLearningSections
);


router.put(
    "/:programmeId/sections/reorder",
    reorderLearningSections
);


router.patch(
    "/:programmeId/sections/:sectionId/reactivate",
    reactivateLearningSection
);


router.get(
    "/:programmeId/sections/:sectionId",
    getLearningSectionById
);


router.patch(
    "/:programmeId/sections/:sectionId",
    updateLearningSection
);


router.delete(
    "/:programmeId/sections/:sectionId",
    deleteLearningSection
);


// ======================================================
// TRAINING PROGRAMMES
// ======================================================

router.post(
    "/",
    createTrainingProgramme
);


router.get(
    "/",
    getTrainingProgrammes
);


router.patch(
    "/:id/reactivate",
    reactivateTrainingProgramme
);


router.get(
    "/:id",
    getTrainingProgrammeById
);


router.patch(
    "/:id",
    updateTrainingProgramme
);


router.delete(
    "/:id",
    deleteTrainingProgramme
);


module.exports =
    router;
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
    createTrainingAssignment,
    getTrainingAssignments,
    deactivateTrainingAssignment,
    reactivateTrainingAssignment,
    getMyTraining,
} =
    require("../controllers/trainingAssignmentController");


// ======================================================
// COMMON SECURITY
// ======================================================

router.use(
    authenticate,
    checkActiveStatus
);


// ======================================================
// TRAINEE - MY TRAINING
//
// IMPORTANT:
//
// Put this before /:assignmentId routes.
// ======================================================

router.get(
    "/my-training",

    authorize(
        "trainee"
    ),

    getMyTraining
);


// ======================================================
// ADMIN - GET ASSIGNMENTS
// ======================================================

router.get(
    "/",

    authorize(
        "admin"
    ),

    getTrainingAssignments
);


// ======================================================
// ADMIN - CREATE ASSIGNMENT
//
// traineeId is in request body.
// NO user ID in URL.
// ======================================================

router.post(
    "/",

    authorize(
        "admin"
    ),

    createTrainingAssignment
);


// ======================================================
// ADMIN - REACTIVATE
// ======================================================

router.patch(
    "/:assignmentId/reactivate",

    authorize(
        "admin"
    ),

    reactivateTrainingAssignment
);


// ======================================================
// ADMIN - DEACTIVATE
// ======================================================

router.patch(
    "/:assignmentId/deactivate",

    authorize(
        "admin"
    ),

    deactivateTrainingAssignment
);


module.exports =
    router;
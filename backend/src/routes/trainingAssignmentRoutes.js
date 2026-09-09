const express =
    require("express");


const router =
    express.Router();


// ======================================================
// MIDDLEWARE
// ======================================================

const authenticate =
    require("../middleware/authenticate");


const authorize =
    require("../middleware/authorize");


const checkActiveStatus =
    require("../middleware/checkActiveStatus");


// ======================================================
// CONTROLLER
// ======================================================

const {
    createTrainingAssignment,
    getTrainingAssignments,
    deactivateTrainingAssignment,
    reactivateTrainingAssignment,
} =
    require(
        "../controllers/trainingAssignmentController"
    );


// ======================================================
// COMMON SECURITY
// ======================================================
//
// Every route below requires:
//
// - Valid login token
// - Active user account
//
// Training Assignment management is Administrator-only.
//
// Trainee learning access is NOT handled here anymore.
// Trainee learning uses:
//
// /api/my-training
//
// ======================================================

router.use(
    authenticate,
    checkActiveStatus
);


// ======================================================
// ADMIN - GET ALL TRAINING ASSIGNMENTS
//
// GET
// /api/training-assignments
//
// ======================================================

router.get(
    "/",

    authorize(
        "admin"
    ),

    getTrainingAssignments
);


// ======================================================
// ADMIN - CREATE TRAINING ASSIGNMENT
//
// POST
// /api/training-assignments
//
// BODY:
//
// {
//     programmeId,
//     traineeId
// }
//
// ======================================================

router.post(
    "/",

    authorize(
        "admin"
    ),

    createTrainingAssignment
);


// ======================================================
// ADMIN - REACTIVATE TRAINING ASSIGNMENT
//
// PATCH
// /api/training-assignments/:assignmentId/reactivate
//
// ======================================================

router.patch(
    "/:assignmentId/reactivate",

    authorize(
        "admin"
    ),

    reactivateTrainingAssignment
);


// ======================================================
// ADMIN - DEACTIVATE TRAINING ASSIGNMENT
//
// PATCH
// /api/training-assignments/:assignmentId/deactivate
//
// ======================================================

router.patch(
    "/:assignmentId/deactivate",

    authorize(
        "admin"
    ),

    deactivateTrainingAssignment
);


// ======================================================
// EXPORT
// ======================================================

module.exports =
    router;
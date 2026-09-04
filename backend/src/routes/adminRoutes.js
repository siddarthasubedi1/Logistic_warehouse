const express =
    require("express");


const {
    generateCredentials,
    listUsers,
    deactivateUser,
    reactivateUser,
    deleteUser,
} = require(
    "../controllers/adminController"
);


const {
    createPendingUser,
    getPendingUsers,
    updateUserTrainingSections,
} = require(
    "../controllers/userTrainingAssignmentController"
);


const {
    getPasswordResetRequests,
    resetUserPassword,
} = require(
    "../controllers/passwordResetController"
);


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


const router =
    express.Router();


// ======================================================
// ADMIN PROTECTION
// ======================================================

router.use(
    authenticate,
    checkActiveStatus,
    authorize("admin")
);


// ======================================================
// CREATE PENDING TRAINER / TRAINEE
//
// Training section is selected during creation.
// ======================================================

router.post(
    "/pending-users",
    createPendingUser
);


// ======================================================
// GET PENDING USERS
// ======================================================

router.get(
    "/pending-users",
    getPendingUsers
);


// ======================================================
// GENERATE USERNAME + PASSWORD
// ======================================================

router.post(
    "/generate-credentials",
    generateCredentials
);


// ======================================================
// LIST CREATED TRAINERS + TRAINEES
// ======================================================

router.get(
    "/users",
    listUsers
);


// ======================================================
// PASSWORD RESET REQUESTS
// ======================================================

router.get(
    "/password-reset-requests",
    getPasswordResetRequests
);


// ======================================================
// ADMIN RESET USER PASSWORD
// ======================================================

router.post(
    "/users/:id/reset-password",
    resetUserPassword
);


// ======================================================
// UPDATE TRAINER OR TRAINEE TRAINING ASSIGNMENT
//
// Examples:
//
// Trainer:
// Manual Handling
//
// Trainer:
// Manual Handling + Working at Height
//
// Trainee:
// Working at Height
//
// Trainee:
// Manual Handling + Working at Height
// ======================================================

router.patch(
    "/users/:id/training-sections",
    updateUserTrainingSections
);


// ======================================================
// DEACTIVATE USER
// ======================================================

router.patch(
    "/users/:id/deactivate",
    deactivateUser
);


// ======================================================
// REACTIVATE USER
// ======================================================

router.patch(
    "/users/:id/reactivate",
    reactivateUser
);


// ======================================================
// DELETE USER
// ======================================================

router.delete(
    "/users/:id",
    deleteUser
);


module.exports =
    router;
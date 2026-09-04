const express =
    require("express");


const {
    createPendingUser,
    getPendingUsers,
    generateCredentials,
    listUsers,
    deactivateUser,
    reactivateUser,
    deleteUser,
} = require(
    "../controllers/adminController"
);


const {
    getPasswordResetRequests,
    resetUserPassword,
} = require(
    "../controllers/passwordResetController"
);


const {
    updateTrainerTrainingSections,
} = require(
    "../controllers/trainerAssignmentController"
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
// CREATE PENDING USER
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
// GENERATE CREDENTIALS
// ======================================================

router.post(
    "/generate-credentials",
    generateCredentials
);


// ======================================================
// LIST USERS
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
// RESET PASSWORD
// ======================================================

router.post(
    "/users/:id/reset-password",
    resetUserPassword
);


// ======================================================
// TRAINER TRAINING ASSIGNMENTS
//
// One Trainer can be assigned:
// - Manual Handling
// - Working at Height
// - Both
// ======================================================

router.patch(
    "/trainers/:id/training-sections",
    updateTrainerTrainingSections
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
const express = require("express");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const checkActiveStatus = require("../middleware/checkActiveStatus");

const {
    getPendingUsers,
    generateCredentials,
    listUsers,
    deactivateUser,
    reactivateUser,
    deleteUser,
} = require("../controllers/adminController");

const router = express.Router();
const {
    getPasswordResetRequests,
    resetUserPassword,
} = require("../controllers/passwordResetController");

// ======================================================
// PENDING USERS
// Reads users from userdata.json
// Admin only
// ======================================================

router.get(
    "/pending-users",
    authenticate,
    authorize("admin"),
    checkActiveStatus,
    getPendingUsers
);


// ======================================================
// GENERATE CREDENTIALS
// Admin selects a pending user and generates account
// ======================================================

router.post(
    "/generate-credentials",
    authenticate,
    authorize("admin"),
    checkActiveStatus,
    generateCredentials
);


// ======================================================
// LIST CREATED USERS
// Returns Trainer and Trainee accounts from MongoDB
// ======================================================

router.get(
    "/users",
    authenticate,
    authorize("admin"),
    checkActiveStatus,
    listUsers
);


// ======================================================
// DEACTIVATE USER
// ======================================================

router.patch(
    "/users/:id/deactivate",
    authenticate,
    authorize("admin"),
    checkActiveStatus,
    deactivateUser
);


// ======================================================
// REACTIVATE USER
// ======================================================

router.patch(
    "/users/:id/reactivate",
    authenticate,
    authorize("admin"),
    checkActiveStatus,
    reactivateUser
);


// ======================================================
// DELETE USER
// ======================================================

router.delete(
    "/users/:id",
    authenticate,
    authorize("admin"),
    checkActiveStatus,
    deleteUser
);

// ======================================================
// PASSWORD RESET MANAGEMENT
// ======================================================

// Admin: view pending password reset requests
router.get(
    "/password-reset-requests",
    authenticate,
    authorize("admin"),
    checkActiveStatus,
    getPasswordResetRequests
);


// Admin: reset Trainer/Trainee password
router.post(
    "/users/:id/reset-password",
    authenticate,
    authorize("admin"),
    checkActiveStatus,
    resetUserPassword
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;
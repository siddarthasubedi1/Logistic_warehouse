const express = require("express");

const {
    createPendingUser,
    getPendingUsers,
    generateCredentials,
    listUsers,
    deactivateUser,
    reactivateUser,
    deleteUser,
} = require("../controllers/adminController");

const {
    getPasswordResetRequests,
    resetUserPassword,
} = require("../controllers/passwordResetController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const checkActiveStatus = require("../middleware/checkActiveStatus");

const router = express.Router();


// ======================================================
// ADMIN PROTECTION
// All routes below require:
// 1. Logged-in user
// 2. Active account
// 3. Admin role
// ======================================================

router.use(
    authenticate,
    checkActiveStatus,
    authorize("admin")
);


// ======================================================
// CREATE USER INFORMATION
// Save Trainer/Trainee information into MongoDB
// accountStatus = pending
//
// POST /api/admin/pending-users
// ======================================================

router.post(
    "/pending-users",
    createPendingUser
);


// ======================================================
// GET PENDING USERS
// Used by Select Pending User dropdown
//
// GET /api/admin/pending-users
// ======================================================

router.get(
    "/pending-users",
    getPendingUsers
);


// ======================================================
// GENERATE ACCOUNT CREDENTIALS
// Generates username + temporary password
// Updates same User document:
// pending -> created
//
// POST /api/admin/generate-credentials
// ======================================================

router.post(
    "/generate-credentials",
    generateCredentials
);


// ======================================================
// LIST CREATED USERS
//
// GET /api/admin/users
// ======================================================

router.get(
    "/users",
    listUsers
);


// ======================================================
// PASSWORD RESET REQUESTS
// Admin views pending Trainer/Trainee reset requests
//
// GET /api/admin/password-reset-requests
// ======================================================

router.get(
    "/password-reset-requests",
    getPasswordResetRequests
);


// ======================================================
// ADMIN RESET USER PASSWORD
// Generates a new temporary password
//
// POST /api/admin/users/:id/reset-password
// ======================================================

router.post(
    "/users/:id/reset-password",
    resetUserPassword
);


// ======================================================
// DEACTIVATE USER
//
// PATCH /api/admin/users/:id/deactivate
// ======================================================

router.patch(
    "/users/:id/deactivate",
    deactivateUser
);


// ======================================================
// REACTIVATE USER
//
// PATCH /api/admin/users/:id/reactivate
// ======================================================

router.patch(
    "/users/:id/reactivate",
    reactivateUser
);


// ======================================================
// DELETE USER
//
// DELETE /api/admin/users/:id
// ======================================================

router.delete(
    "/users/:id",
    deleteUser
);


module.exports = router;
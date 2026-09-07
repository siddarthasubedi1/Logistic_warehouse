const express =
    require("express");


const {
    generateCredentials,
    listUsers,
    updateUser,
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


const {
    getAuditLogs,
} = require(
    "../controllers/auditController"
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
// PROTECT ALL ADMIN ROUTES
// ======================================================

router.use(
    authenticate,
    checkActiveStatus,
    authorize("admin")
);


// ======================================================
// AUDIT LOGS
//
// GET /api/admin/audit-logs
// ======================================================

router.get(
    "/audit-logs",
    getAuditLogs
);


// ======================================================
// CREATE PENDING TRAINER / TRAINEE
//
// POST /api/admin/pending-users
// ======================================================

router.post(
    "/pending-users",
    createPendingUser
);


// ======================================================
// GET PENDING USERS
//
// GET /api/admin/pending-users
// ======================================================

router.get(
    "/pending-users",
    getPendingUsers
);


// ======================================================
// GENERATE USERNAME + TEMPORARY PASSWORD
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
// EDIT USER
//
// PATCH /api/admin/users/:id
//
// Examples:
// {
//     "firstName": "John",
//     "lastName": "Smith",
//     "email": "john@example.com",
//     "phoneNumber": "9800000000",
//     "address": "Kathmandu",
//     "age": 25,
//     "gender": "male"
// }
// ======================================================

router.patch(
    "/users/:id",
    updateUser
);


// ======================================================
// PASSWORD RESET REQUESTS
//
// GET /api/admin/password-reset-requests
// ======================================================

router.get(
    "/password-reset-requests",
    getPasswordResetRequests
);


// ======================================================
// ADMIN RESET TRAINER / TRAINEE PASSWORD
//
// POST /api/admin/users/:id/reset-password
// ======================================================

router.post(
    "/users/:id/reset-password",
    resetUserPassword
);


// ======================================================
// UPDATE TRAINING ASSIGNMENT
//
// PATCH /api/admin/users/:id/training-sections
//
// Trainer:
// - Manual Handling
// - Working at Height
// - Both
//
// Trainee:
// - Both automatically
// ======================================================

router.patch(
    "/users/:id/training-sections",
    updateUserTrainingSections
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


// ======================================================
// EXPORT
// ======================================================

module.exports =
    router;
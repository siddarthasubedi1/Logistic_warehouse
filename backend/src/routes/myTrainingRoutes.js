const express = require("express");

const router = express.Router();


const authenticate =
    require("../middleware/authenticate");

const authorize =
    require("../middleware/authorize");

const checkActiveStatus =
    require("../middleware/checkActiveStatus");


const {
    getMyTrainingProgrammes,
    getMyTrainingProgramme,
    getMyTrainingSections,
} =
    require("../controllers/myTrainingController");


// ======================================================
// SECURITY
// ======================================================

router.use(
    authenticate,
    checkActiveStatus,
    authorize("trainee")
);


// ======================================================
// MY TRAINING LIST
// ======================================================

router.get(
    "/",
    getMyTrainingProgrammes
);


// ======================================================
// MY TRAINING SECTIONS
//
// IMPORTANT:
// This must come before /:programmeId
// ======================================================

router.get(
    "/:programmeId/sections",
    getMyTrainingSections
);


// ======================================================
// ONE ASSIGNED PROGRAMME
// ======================================================

router.get(
    "/:programmeId",
    getMyTrainingProgramme
);


module.exports = router;
const User =
    require("../models/User");


const TrainingProgress =
    require(
        "../models/TrainingProgress"
    );


const ALLOWED_TRAINING_SECTIONS = [
    "manual-handling",
    "working-at-height",
];


// ======================================================
// CHECK WHETHER MODULE IS VALID
// ======================================================

const isValidTrainingSection = (
    trainingSection
) => {
    return ALLOWED_TRAINING_SECTIONS.includes(
        trainingSection
    );
};


// ======================================================
// GET MY TRAINING PROGRESS
//
// GET
// /api/users/me/training-progress
// ======================================================

const getMyTrainingProgress =
    async (req, res) => {
        try {
            const trainee =
                await User.findById(
                    req.user.id
                ).select(
                    "role status assignedTrainingSections"
                );


            if (!trainee) {
                return res
                    .status(404)
                    .json({
                        message:
                            "Trainee account not found",
                    });
            }


            if (
                trainee.role !==
                "trainee"
            ) {
                return res
                    .status(403)
                    .json({
                        message:
                            "Only Trainees can access training progress",
                    });
            }


            const assignedSections =
                Array.isArray(
                    trainee
                        .assignedTrainingSections
                )
                    ? trainee
                        .assignedTrainingSections
                    : [];


            const progressRecords =
                await TrainingProgress.find(
                    {
                        trainee:
                            trainee._id,

                        trainingSection: {
                            $in:
                                assignedSections,
                        },
                    }
                )
                    .sort({
                        createdAt:
                            1,
                    })
                    .lean();


            // ==================================================
            // RETURN EVERY ASSIGNED MODULE
            //
            // If no MongoDB progress record exists,
            // return NOT STARTED / 0%.
            // ==================================================

            const trainingProgress =
                assignedSections.map(
                    (
                        trainingSection
                    ) => {
                        const existingProgress =
                            progressRecords.find(
                                (
                                    record
                                ) =>
                                    record.trainingSection ===
                                    trainingSection
                            );


                        if (
                            !existingProgress
                        ) {
                            return {
                                trainingSection,

                                status:
                                    "not-started",

                                progress:
                                    0,

                                startedAt:
                                    null,

                                completedAt:
                                    null,

                                lastAccessedAt:
                                    null,
                            };
                        }


                        return {
                            id:
                                existingProgress._id,

                            trainingSection:
                                existingProgress.trainingSection,

                            status:
                                existingProgress.status,

                            progress:
                                existingProgress.progress,

                            startedAt:
                                existingProgress.startedAt,

                            completedAt:
                                existingProgress.completedAt,

                            lastAccessedAt:
                                existingProgress.lastAccessedAt,
                        };
                    }
                );


            return res
                .status(200)
                .json({
                    progress:
                        trainingProgress,
                });

        } catch (error) {
            console.error(
                "Get training progress error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to load training progress",
                });
        }
    };


// ======================================================
// START TRAINING MODULE
//
// POST
// /api/users/me/training-progress/:trainingSection/start
// ======================================================

const startTrainingModule =
    async (req, res) => {
        try {
            const {
                trainingSection,
            } = req.params;


            // ==================================================
            // VALID MODULE
            // ==================================================

            if (
                !isValidTrainingSection(
                    trainingSection
                )
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid training section",
                    });
            }


            // ==================================================
            // LOAD TRAINEE
            // ==================================================

            const trainee =
                await User.findById(
                    req.user.id
                ).select(
                    "role status assignedTrainingSections"
                );


            if (!trainee) {
                return res
                    .status(404)
                    .json({
                        message:
                            "Trainee account not found",
                    });
            }


            if (
                trainee.role !==
                "trainee"
            ) {
                return res
                    .status(403)
                    .json({
                        message:
                            "Only Trainees can start training",
                    });
            }


            // ==================================================
            // CHECK ADMIN ASSIGNMENT
            // ==================================================

            const assignments =
                Array.isArray(
                    trainee
                        .assignedTrainingSections
                )
                    ? trainee
                        .assignedTrainingSections
                    : [];


            if (
                !assignments.includes(
                    trainingSection
                )
            ) {
                return res
                    .status(403)
                    .json({
                        message:
                            "This training section has not been assigned to you",
                    });
            }


            // ==================================================
            // EXISTING PROGRESS
            // ==================================================

            let progress =
                await TrainingProgress.findOne(
                    {
                        trainee:
                            trainee._id,

                        trainingSection,
                    }
                );


            // ==================================================
            // FIRST TIME START
            // ==================================================

            if (!progress) {
                progress =
                    await TrainingProgress.create(
                        {
                            trainee:
                                trainee._id,

                            trainingSection,

                            status:
                                "in-progress",

                            progress:
                                0,

                            startedAt:
                                new Date(),

                            lastAccessedAt:
                                new Date(),
                        }
                    );


                return res
                    .status(201)
                    .json({
                        message:
                            "Training started successfully",

                        progress,
                    });
            }


            // ==================================================
            // ALREADY COMPLETED
            // ==================================================

            if (
                progress.status ===
                "completed"
            ) {
                return res
                    .status(200)
                    .json({
                        message:
                            "Training has already been completed",

                        progress,
                    });
            }


            // ==================================================
            // CONTINUE EXISTING MODULE
            // ==================================================

            progress.status =
                "in-progress";


            progress.lastAccessedAt =
                new Date();


            if (
                !progress.startedAt
            ) {
                progress.startedAt =
                    new Date();
            }


            await progress.save();


            return res
                .status(200)
                .json({
                    message:
                        "Training continued successfully",

                    progress,
                });

        } catch (error) {
            console.error(
                "Start training error:",
                error
            );


            // ==================================================
            // UNIQUE INDEX PROTECTION
            // ==================================================

            if (
                error.code ===
                11000
            ) {
                return res
                    .status(409)
                    .json({
                        message:
                            "Training progress already exists",
                    });
            }


            return res
                .status(500)
                .json({
                    message:
                        "Unable to start training",
                });
        }
    };


module.exports = {
    getMyTrainingProgress,
    startTrainingModule,
};
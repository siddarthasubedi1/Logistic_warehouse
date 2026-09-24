const User =
    require("../models/User");


const TrainingProgress =
    require(
        "../models/TrainingProgress"
    );

const { getTraineeModuleProgress } = require("../services/traineeLevelProgressService");


const isValidTrainingSection = (trainingSection) =>
    typeof trainingSection === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trainingSection) &&
    trainingSection.length <= 100;




// ======================================================
// GET MY TRAINING PROGRESS
//
// GET
// /api/users/me/training-progress
// ======================================================

const getMyTrainingProgress = async (req, res) => {
    try {
        const trainee = await User.findById(req.user.id).select("role status");

        if (!trainee) {
            return res.status(404).json({ message: "Trainee account not found" });
        }

        if (trainee.role !== "trainee") {
            return res.status(403).json({ message: "Only Trainees can access training progress" });
        }

        // Training Content progress is programme-backed, not the old
        // assignedTrainingSections-only record. Aggregate every active assigned
        // programme into its module and three-level pathway so Beginner = 33%,
        // Beginner + Intermediate = 67%, and all three levels = 100%.
        const trainingProgress = await getTraineeModuleProgress(trainee._id);
        const average = trainingProgress.length
            ? Math.round(trainingProgress.reduce((sum, item) => sum + Number(item.progress || 0), 0) / trainingProgress.length)
            : 0;

        return res.status(200).json({
            progress: trainingProgress,
            summary: {
                overallProgress: average,
                modulesAssigned: trainingProgress.length,
                completedModules: trainingProgress.filter((item) => Number(item.progress) >= 100).length,
                totalAttempts: trainingProgress.reduce((sum, item) => sum + Number(item.attempts || 0), 0),
            },
        });
    } catch (error) {
        console.error("Get training progress error:", error);
        return res.status(500).json({ message: "Unable to load training progress" });
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
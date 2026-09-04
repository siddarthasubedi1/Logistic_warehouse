const User =
    require("../models/User");


const ALLOWED_TRAINING_SECTIONS = [
    "manual-handling",
    "working-at-height",
];


// ======================================================
// UPDATE TRAINER TRAINING ASSIGNMENTS
//
// PATCH
// /api/admin/trainers/:id/training-sections
//
// Body:
//
// {
//     "trainingSections": [
//         "manual-handling",
//         "working-at-height"
//     ]
// }
// ======================================================

const updateTrainerTrainingSections =
    async (req, res) => {
        try {
            const {
                trainingSections,
            } = req.body;


            // ==================================================
            // VALIDATE ARRAY
            // ==================================================

            if (
                !Array.isArray(
                    trainingSections
                )
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Training sections must be provided as an array",
                    });
            }


            // ==================================================
            // REMOVE DUPLICATES
            // ==================================================

            const uniqueSections = [
                ...new Set(
                    trainingSections
                ),
            ];


            // ==================================================
            // VALIDATE SECTION VALUES
            // ==================================================

            const invalidSection =
                uniqueSections.find(
                    (section) =>
                        !ALLOWED_TRAINING_SECTIONS.includes(
                            section
                        )
                );


            if (invalidSection) {
                return res
                    .status(400)
                    .json({
                        message:
                            "One or more training sections are invalid",
                    });
            }


            // ==================================================
            // FIND USER
            // ==================================================

            const trainer =
                await User.findById(
                    req.params.id
                );


            if (!trainer) {
                return res
                    .status(404)
                    .json({
                        message:
                            "Trainer not found",
                    });
            }


            // ==================================================
            // TRAINER ONLY
            // ==================================================

            if (
                trainer.role !==
                "trainer"
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Training sections can only be assigned to Trainers",
                    });
            }


            // ==================================================
            // ACCOUNT MUST BE CREATED
            // ==================================================

            if (
                trainer.accountStatus !==
                "created"
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Training sections can only be assigned after the Trainer account has been created",
                    });
            }


            // ==================================================
            // SAVE MULTIPLE ASSIGNMENTS
            // ==================================================

            trainer.assignedTrainingSections =
                uniqueSections;


            await trainer.save();


            return res
                .status(200)
                .json({
                    message:
                        "Trainer training assignments updated successfully",

                    trainer: {
                        id:
                            trainer._id,

                        firstName:
                            trainer.firstName,

                        lastName:
                            trainer.lastName,

                        username:
                            trainer.username,

                        role:
                            trainer.role,

                        assignedTrainingSections:
                            trainer.assignedTrainingSections,
                    },
                });

        } catch (error) {
            console.error(
                "Update Trainer training sections error:",
                error.message
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to update Trainer training assignments",
                });
        }
    };


module.exports = {
    updateTrainerTrainingSections,
};
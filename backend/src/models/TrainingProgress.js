const mongoose =
    require("mongoose");


const trainingProgressSchema =
    new mongoose.Schema(
        {
            trainee: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref:
                    "User",

                required:
                    true,

                index:
                    true,
            },


            trainingSection: {
                type:
                    String,

                enum: [
                    "manual-handling",
                    "working-at-height",
                ],

                required:
                    true,
            },


            status: {
                type:
                    String,

                enum: [
                    "not-started",
                    "in-progress",
                    "completed",
                ],

                default:
                    "not-started",
            },


            progress: {
                type:
                    Number,

                default:
                    0,

                min:
                    0,

                max:
                    100,
            },


            startedAt: {
                type:
                    Date,

                default:
                    null,
            },


            completedAt: {
                type:
                    Date,

                default:
                    null,
            },


            lastAccessedAt: {
                type:
                    Date,

                default:
                    null,
            },
        },

        {
            timestamps:
                true,
        }
    );


// ======================================================
// ONE PROGRESS RECORD PER TRAINEE PER TRAINING SECTION
// ======================================================

trainingProgressSchema.index(
    {
        trainee:
            1,

        trainingSection:
            1,
    },

    {
        unique:
            true,
    }
);


module.exports =
    mongoose.model(
        "TrainingProgress",
        trainingProgressSchema
    );
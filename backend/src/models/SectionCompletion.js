const mongoose = require("mongoose");

const sectionCompletionSchema = new mongoose.Schema(
    {
        trainee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Trainee is required"],
            index: true,
        },
        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LearningSection",
            required: [true, "Learning section is required"],
            index: true,
        },
        programme: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingProgramme",
            required: [true, "Programme is required"],
            index: true,
        },
        completedAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    { timestamps: true }
);

// A section can only be completed once by the same trainee. Retrying a
// programme must not create duplicate completion records.
sectionCompletionSchema.index(
    { trainee: 1, section: 1 },
    { unique: true }
);

sectionCompletionSchema.index({ trainee: 1, programme: 1, completedAt: 1 });

module.exports = mongoose.model("SectionCompletion", sectionCompletionSchema);

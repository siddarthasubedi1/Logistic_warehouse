const mongoose = require("mongoose");

const trainingAssignmentSchema = new mongoose.Schema(
    {
        programme: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingProgramme",
            required: [true, "Programme is required"],
            index: true,
        },

        trainee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Trainee is required"],
            index: true,
        },

        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Assigning Administrator is required"],
        },

        assignedAt: {
            type: Date,
            default: Date.now,
        },

        status: {
            type: String,
            enum: {
                values: ["active", "inactive"],
                message: "Status must be active or inactive",
            },
            default: "active",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

trainingAssignmentSchema.index(
    {
        programme: 1,
        trainee: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            status: "active",
        },
    }
);

module.exports = mongoose.model(
    "TrainingAssignment",
    trainingAssignmentSchema
);
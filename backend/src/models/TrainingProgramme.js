const mongoose = require("mongoose");

const trainingProgrammeSchema = new mongoose.Schema(
    {
        programmeType: {
            type: String,
            enum: ["manual-handling", "working-at-height"],
            required: [true, "Programme type is required"],
            index: true,
        },

        title: {
            type: String,
            required: [true, "Programme title is required"],
            trim: true,
            minlength: [3, "Programme title must be at least 3 characters"],
            maxlength: [150, "Programme title cannot exceed 150 characters"],
        },

        description: {
            type: String,
            required: [true, "Programme description is required"],
            trim: true,
            minlength: [10, "Programme description must be at least 10 characters"],
            maxlength: [3000, "Programme description cannot exceed 3000 characters"],
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Programme owner is required"],
            index: true,
        },

        authorizedTrainers: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            default: [],
        },

        passMark: {
            type: Number,
            required: [true, "Pass mark is required"],
            min: [0, "Pass mark cannot be less than 0"],
            max: [100, "Pass mark cannot be greater than 100"],
        },

        status: {
            type: String,
            enum: {
                values: ["draft", "active", "inactive"],
                message: "Status must be draft, active, or inactive",
            },
            default: "draft",
            index: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Created by user is required"],
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

trainingProgrammeSchema.index({
    owner: 1,
    status: 1,
});

trainingProgrammeSchema.index({
    programmeType: 1,
    status: 1,
});

module.exports = mongoose.model(
    "TrainingProgramme",
    trainingProgrammeSchema
);
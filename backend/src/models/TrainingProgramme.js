const mongoose = require("mongoose");

const trainingProgrammeSchema = new mongoose.Schema(
    {
        programmeType: {
            type: String,
            trim: true,
            required: [true, "Programme type is required"],
            index: true,
        },

        title: {
            type: String,
            required: [true, "Programme title is required"],
            trim: true,
            minlength: [
                3,
                "Programme title must be at least 3 characters",
            ],
            maxlength: [
                150,
                "Programme title cannot exceed 150 characters",
            ],
        },

        shortDescription: {
            type: String,
            required: [true, "Short description is required"],
            trim: true,
            minlength: [10, "Short description must be at least 10 characters"],
            maxlength: [300, "Short description cannot exceed 300 characters"],
        },

        // Existing description field is retained as the full description so
        // older programme records and APIs remain compatible.
        description: {
            type: String,
            required: [
                true,
                "Programme description is required",
            ],
            trim: true,
            minlength: [
                10,
                "Programme description must be at least 10 characters",
            ],
            maxlength: [
                3000,
                "Programme description cannot exceed 3000 characters",
            ],
        },

        learningObjectives: {
            type: String,
            required: [true, "Learning objectives are required"],
            trim: true,
            minlength: [10, "Learning objectives must be at least 10 characters"],
            maxlength: [2000, "Learning objectives cannot exceed 2000 characters"],
        },

        prerequisite: {
            type: String,
            trim: true,
            maxlength: [500, "Prerequisite cannot exceed 500 characters"],
            default: "",
        },

        coverImageUrl: {
            type: String,
            trim: true,
            default: "",
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [
                true,
                "Programme owner is required",
            ],
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

        level: {
            type: String,
            enum: {
                values: ["beginner", "intermediate", "advanced"],
                message: "Programme level must be beginner, intermediate, or advanced",
            },
            default: "beginner",
            index: true,
        },

        passMark: {
            type: Number,
            required: [
                true,
                "Pass mark is required",
            ],
            min: [
                0,
                "Pass mark cannot be less than 0",
            ],
            max: [
                100,
                "Pass mark cannot be greater than 100",
            ],
        },

        status: {
            type: String,

            enum: {
                values: [
                    "draft",
                    "active",
                    "inactive",
                ],

                message:
                    "Status must be draft, active, or inactive",
            },

            // IMPORTANT:
            // New programmes are immediately available
            // for Training Assignments.
            default: "active",

            index: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [
                true,
                "Created by user is required",
            ],
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        // Soft-delete audit metadata. The programme record is retained so
        // assignments, attempts and audit history are never orphaned.
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        deletedAt: {
            type: Date,
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
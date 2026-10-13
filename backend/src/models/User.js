const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 80,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254,
            match: [/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/, "Please enter a valid email address."],
        },

        passwordHash: {
            type: String,
            default: null,
        },

        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 60,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 60,
        },

        age: {
            type: Number,

            required: function () {
                return (
                    this.role === "trainer" ||
                    this.role === "trainee"
                );
            },

            min: 16,
            max: 100,
            validate: { validator: Number.isInteger, message: "Age must be a whole number." },
        },

        phoneNumber: {
            type: String,

            required: function () {
                return (
                    this.role === "trainer" ||
                    this.role === "trainee"
                );
            },

            trim: true,
            match: [/^\d{10}$/, "Phone number must contain exactly 10 digits."],
        },

        address: {
            type: String,

            required: function () {
                return (
                    this.role === "trainer" ||
                    this.role === "trainee"
                );
            },

            trim: true,
            minlength: 5,
            maxlength: 250,
        },

        gender: {
            type: String,

            required: function () {
                return (
                    this.role === "trainer" ||
                    this.role === "trainee"
                );
            },

            enum: [
                "male",
                "female",
                "other",
                "prefer-not-to-say",
            ],
        },

        profileImage: {
            type: String,
            trim: true,
            default: "",
        },

        displayMode: {
            type: String,
            enum: [
                "light",
                "dark",
            ],
            default: "light",
        },

        role: {
            type: String,

            enum: [
                "admin",
                "trainer",
                "trainee",
            ],

            required: true,
        },

        /*
            Training sections assigned to a Trainer.

            Training sections assigned to a user.

            Trainer: Admin selects one or more active modules.
            Trainee: receives all active modules automatically.

            Module keys are dynamic and are not limited to
            Manual Handling or Working at Height.
        */
        assignedTrainingSections: {
            type: [
                {
                    type: String,
                    trim: true,
                },
            ],

            default: [],
        },

        accountStatus: {
            type: String,

            enum: [
                "pending",
                "created",
            ],

            default: "pending",
        },

        status: {
            type: String,

            enum: [
                "active",
                "deactivated",
            ],

            default: "active",
        },

        mustChangePassword: {
            type: Boolean,
            default: true,
        },

        authVersion: {
            type: Number,
            default: 0,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        refreshTokenHash: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(require("../utils/auditPlugin"), { targetType: "User" });

userSchema.index({ role: 1, status: 1, accountStatus: 1 });
module.exports =
    mongoose.model(
        "User",
        userSchema
    );
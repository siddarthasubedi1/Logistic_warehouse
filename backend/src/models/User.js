const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        age: {
            type: Number,
            min: 16,
        },

        phoneNumber: {
            type: String,
            trim: true,
        },

        address: {
            type: String,
            trim: true,
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },

        role: {
            type: String,
            enum: ["admin", "trainer", "trainee"],
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "deactivated"],
            default: "active",
        },

        mustChangePassword: {
            type: Boolean,
            default: true,
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

module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
            default: null,
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
            default: null,
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
            required: function () {
                return this.role === "trainer" || this.role === "trainee";
            },
            min: 16,
        },

        phoneNumber: {
            type: String,
            required: function () {
                return this.role === "trainer" || this.role === "trainee";
            },
            trim: true,
        },

        address: {
            type: String,
            required: function () {
                return this.role === "trainer" || this.role === "trainee";
            },
            trim: true,
        },

        gender: {
            type: String,
            required: function () {
                return this.role === "trainer" || this.role === "trainee";
            },
            enum: ["male", "female", "other"],
        },

        profileImage: {
            type: String,
            trim: true,
            default: "",
        },

        role: {
            type: String,
            enum: ["admin", "trainer", "trainee"],
            required: true,
        },

        accountStatus: {
            type: String,
            enum: ["pending", "created"],
            default: "pending",
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

        /*
            Increment this whenever authentication
            sessions must be revoked.

            Example:
            - password reset
            - password change
            - account deactivation
        */
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

module.exports = mongoose.model("User", userSchema);
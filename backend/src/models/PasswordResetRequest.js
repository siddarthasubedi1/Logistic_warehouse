const mongoose = require("mongoose");


const passwordResetRequestSchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                index: true,
            },

            username: {
                type: String,
                required: true,
                trim: true,
            },

            role: {
                type: String,
                enum: [
                    "trainer",
                    "trainee",
                ],
                required: true,
            },

            status: {
                type: String,
                enum: [
                    "pending",
                    "completed",
                ],
                default: "pending",
                index: true,
            },

            requestedAt: {
                type: Date,
                default: Date.now,
            },

            completedAt: {
                type: Date,
                default: null,
            },

            completedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },
        },
        {
            timestamps: true,
        }
    );


module.exports =
    mongoose.model(
        "PasswordResetRequest",
        passwordResetRequestSchema
    );
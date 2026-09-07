const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        username: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },

        role: {
            type: String,
            enum: ["admin", "trainer", "trainee", "unknown"],
            default: "unknown",
        },

        action: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["success", "failure"],
            required: true,
        },

        ipAddress: {
            type: String,
            default: "",
        },

        userAgent: {
            type: String,
            default: "",
        },

        details: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model(
    "AuditLog",
    auditLogSchema
);
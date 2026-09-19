const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    programme: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgramme", required: true, index: true },
    level: { type: String, enum: ["basic", "intermediate", "high"], required: true, index: true },
    question: { type: String, required: true, trim: true, maxlength: 2000 },
    options: { type: [String], validate: { validator: v => Array.isArray(v) && v.length >= 2, message: "At least two options are required" } },
    correctAnswer: { type: String, required: true },
    points: { type: Number, min: 1, default: 1 },
    feedback: { type: String, default: "" },
    order: { type: Number, min: 1, default: 1 },
    status: { type: String, enum: ["pending", "active", "inactive"], default: "pending", index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });
schema.index({ programme: 1, level: 1, order: 1 }, { unique: true });
module.exports = mongoose.model("AssessmentQuestion", schema);

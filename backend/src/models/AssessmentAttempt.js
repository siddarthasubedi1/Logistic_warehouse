const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    trainee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    programme: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgramme", required: true, index: true },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingAssignment", required: true },
    level: { type: String, enum: ["basic", "intermediate", "high"], required: true, index: true },
    answers: { type: [{ question: { type: mongoose.Schema.Types.ObjectId, ref: "AssessmentQuestion", required: true }, answer: String, correct: Boolean, pointsAwarded: { type: Number, default: 0 } }], default: [] },
    score: { type: Number, required: true, min: 0 }, totalPoints: { type: Number, required: true, min: 0 }, percentage: { type: Number, required: true, min: 0, max: 100 }, passed: { type: Boolean, required: true, index: true }, attemptNumber: { type: Number, required: true, min: 1 }, submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });
schema.index({ trainee: 1, programme: 1, level: 1, attemptNumber: 1 }, { unique: true });
module.exports = mongoose.model("AssessmentAttempt", schema);

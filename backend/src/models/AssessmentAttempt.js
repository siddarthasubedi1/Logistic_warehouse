const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    question: { type: mongoose.Schema.Types.ObjectId, ref: "AssessmentQuestion", required: true },
    answer: String,
    correct: Boolean,
    pointsAwarded: { type: Number, default: 0 },
    answeredAt: { type: Date, default: Date.now },
}, { _id: false });

const schema = new mongoose.Schema({
    trainee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    programme: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgramme", required: true, index: true },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingAssignment", required: true },
    level: { type: String, enum: ["basic", "intermediate", "high"], required: true, index: true },

    // The exact randomized question set for this attempt. Keeping it on the
    // server means a trainee cannot change the selected questions mid-attempt.
    questionSet: [{ type: mongoose.Schema.Types.ObjectId, ref: "AssessmentQuestion" }],
    answers: { type: [answerSchema], default: [] },

    status: { type: String, enum: ["in-progress", "submitted"], default: "submitted", index: true },
    score: { type: Number, required: true, min: 0, default: 0 },
    totalPoints: { type: Number, required: true, min: 0, default: 0 },
    percentage: { type: Number, required: true, min: 0, max: 100, default: 0 },
    passed: { type: Boolean, required: true, default: false, index: true },
    attemptNumber: { type: Number, required: true, min: 1 },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date, default: null },
}, { timestamps: true });

schema.index({ trainee: 1, programme: 1, level: 1, attemptNumber: 1 }, { unique: true });
schema.index({ trainee: 1, programme: 1, level: 1, status: 1 });

module.exports = mongoose.model("AssessmentAttempt", schema);

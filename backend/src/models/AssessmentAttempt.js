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
    // Snapshot of the programme pass mark at submission time. Keeping this on
    // the attempt makes historical records auditable even if the programme is
    // edited later. Older attempts may not have the field and fall back to the
    // programme's current pass mark in the API.
    passMark: { type: Number, min: 0, max: 100, default: null },
    passed: { type: Boolean, required: true, default: false, index: true },
    attemptNumber: { type: Number, required: true, min: 1 },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date, default: null },
}, { timestamps: true });

schema.index({ trainee: 1, programme: 1, level: 1, attemptNumber: 1 }, { unique: true });
schema.index({ trainee: 1, programme: 1, level: 1, status: 1 });
schema.index({ trainee: 1, submittedAt: -1 });
schema.index({ programme: 1, level: 1, submittedAt: -1 });
schema.index({ passed: 1, submittedAt: -1 });

module.exports = mongoose.model("AssessmentAttempt", schema);

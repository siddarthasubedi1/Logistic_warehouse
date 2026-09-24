const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
    scenario: { type: mongoose.Schema.Types.ObjectId, ref: "Scenario", required: true },
    responses: { type: [String], default: [] },
    correct: { type: Boolean, required: true, default: false },
    answeredAt: { type: Date, default: Date.now },
}, { _id: false });

const schema = new mongoose.Schema({
    trainee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    programme: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgramme", required: true, index: true },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingAssignment", required: true },
    scenarioSet: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scenario" }],
    responses: { type: [responseSchema], default: [] },
    status: { type: String, enum: ["in-progress", "submitted"], default: "in-progress", index: true },
    score: { type: Number, default: 0, min: 0 },
    totalScenarios: { type: Number, default: 0, min: 0 },
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    attemptNumber: { type: Number, required: true, min: 1 },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date, default: null },
}, { timestamps: true });

schema.index({ trainee: 1, programme: 1, attemptNumber: 1 }, { unique: true });
schema.index({ trainee: 1, programme: 1, status: 1 });

module.exports = mongoose.model("ScenarioAttempt", schema);

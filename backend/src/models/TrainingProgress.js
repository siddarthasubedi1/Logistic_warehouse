const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    trainee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    programme: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgramme", default: null, index: true },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingAssignment", default: null },
    completedSections: [{ type: mongoose.Schema.Types.ObjectId, ref: "LearningSection" }],
    completedScenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scenario" }],
    learningCompleted: { type: Boolean, default: false }, scenarioCompleted: { type: Boolean, default: false },
    basicPassed: { type: Boolean, default: false }, intermediatePassed: { type: Boolean, default: false }, highPassed: { type: Boolean, default: false },
    retryRequiredLevel: { type: String, enum: ["basic", "intermediate", "high", null], default: null },
    currentStage: { type: String, enum: ["learning", "scenario", "basic", "intermediate", "high", "completed"], default: "learning" },
    status: { type: String, enum: ["not-started", "in-progress", "completed"], default: "not-started" }, progress: { type: Number, default: 0, min: 0, max: 100 },
    startedAt: { type: Date, default: null }, completedAt: { type: Date, default: null }, lastAccessedAt: { type: Date, default: null },
    trainingSection: { type: String, trim: true, default: undefined } // legacy Sprint-1 field only; Sprint-2 uses programme-scoped fields above
}, { timestamps: true });
schema.index({ trainee: 1, programme: 1 }, { unique: true, partialFilterExpression: { programme: { $type: "objectId" } } });
module.exports = mongoose.model("TrainingProgress", schema);

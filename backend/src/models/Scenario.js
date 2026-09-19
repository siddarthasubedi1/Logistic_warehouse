const mongoose = require("mongoose");
const scenarioSchema = new mongoose.Schema({
    programme: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgramme", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    prompt: { type: String, required: true, trim: true, maxlength: 3000 },
    type: { type: String, enum: ["hazard", "multiple-choice", "cyber"], default: "hazard" },
    options: { type: [String], default: [] },
    correctResponses: { type: [String], required: true, default: [] },
    feedbackCorrect: { type: String, default: "Correct. Well done." },
    feedbackIncorrect: { type: String, default: "Review the hazard and try again." },
    order: { type: Number, min: 1, default: 1 },
    status: { type: String, enum: ["pending", "active", "inactive"], default: "pending", index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });
scenarioSchema.index({ programme: 1, order: 1 }, { unique: true });
module.exports = mongoose.model("Scenario", scenarioSchema);

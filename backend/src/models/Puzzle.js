const mongoose = require('mongoose');

const propSchema = new mongoose.Schema({
  id: { type: String, required: true, trim: true },
  label: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  imageUrl: { type: String, default: '', trim: true },
  imageAlt: { type: String, default: '', trim: true },
}, { _id: false });

const puzzleSchema = new mongoose.Schema({
  programme: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingProgramme', required: true, index: true },
  moduleKey: { type: String, required: true, trim: true, lowercase: true, index: true },
  // Stable identifier used only for the built-in level puzzle bank. Existing
  // MongoDB records do not need this field; it is attached automatically the
  // first time the programme is checked.
  starterKey: { type: String, trim: true },
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 160 },
  instructions: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
  type: { type: String, enum: ['sequence', 'selection', 'matching', 'sorting', 'scenario-decision', 'environmental-hazard'], required: true },
  hazards: { type: [new mongoose.Schema({
    id: { type: String, required: true }, locationId: { type: String, required: true },
    yaw: Number, pitch: Number, label: String, hazardType: String, description: String,
    availableActions: [String], correctAction: String, points: Number, penalty: Number,
    hint: String, correctFeedback: String, incorrectFeedback: String,
  }, { _id: false })], default: [] },
  digitalProps: { type: [propSchema], default: [] },
  targets: { type: [propSchema], default: [] },
  expectedSolution: { type: mongoose.Schema.Types.Mixed, required: true },
  hint: { type: String, default: '', trim: true, maxlength: 800 },
  correctFeedback: { type: String, required: true, trim: true, maxlength: 1200 },
  incorrectFeedback: { type: String, required: true, trim: true, maxlength: 1200 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true, autoIndex: false });

puzzleSchema.index({ programme: 1, status: 1 });
puzzleSchema.index({ moduleKey: 1, status: 1 });
puzzleSchema.index({ programme: 1, starterKey: 1 }, { unique: true, partialFilterExpression: { starterKey: { $type: 'string' } } });

puzzleSchema.plugin(require("../utils/auditPlugin"), { targetType: "Puzzle" });

module.exports = mongoose.model('Puzzle', puzzleSchema);

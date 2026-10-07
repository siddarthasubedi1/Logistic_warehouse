const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  type: { type: String, enum: ['puzzle', 'safety_simulation'], default: 'puzzle', index: true },
  puzzle: { type: mongoose.Schema.Types.ObjectId, ref: 'Puzzle', required: function () { return this.type !== 'safety_simulation'; } },
  programme: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingProgramme', required: function () { return this.type === 'safety_simulation'; }, index: true },
  moduleKey: { type: String, trim: true },
  sampleKey: { type: String, trim: true, default: undefined },
  title: { type: String, trim: true, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 3000 },
  instructions: { type: String, trim: true, maxlength: 3000 },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  category: { type: String, trim: true, maxlength: 100 },
  thumbnail: { type: String, trim: true },
  estimatedDurationSeconds: { type: Number, min: 15, max: 3600 },
  // Validated, allowlisted configuration. A copy is frozen on each attempt.
  simulation: { type: mongoose.Schema.Types.Mixed, default: undefined },
  activatedAt: { type: Date, default: null },
  deactivatedAt: { type: Date, default: null },
  archivedAt: { type: Date, default: null },
  timeLimitSeconds: { type: Number, required: true, min: 15, max: 3600, default: 180 },
  basePoints: { type: Number, required: true, min: 1, max: 10000, default: 800 },
  incorrectPenalty: { type: Number, required: true, min: 0, max: 1000, default: 50 },
  hintPenalty: { type: Number, required: true, min: 0, max: 1000, default: 50 },
  completionBonus: { type: Number, required: true, min: 0, max: 5000, default: 200 },
  maxTimeBonus: { type: Number, required: true, min: 0, max: 5000, default: 200 },
  maxScore: { type: Number, required: true, min: 1, max: 20000, default: 1000 },
  tieRule: { type: String, enum: ['faster-time', 'earlier-attempt'], default: 'faster-time' },
  status: { type: String, enum: ['draft', 'active', 'inactive'], default: 'active', index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true, optimisticConcurrency: true, autoIndex: false });

// Multiple simulation challenges have no puzzle. Existing puzzle uniqueness stays intact.
challengeSchema.index({ puzzle: 1 }, { unique: true, partialFilterExpression: { puzzle: { $type: 'objectId' } } });
challengeSchema.index({ type: 1, programme: 1, status: 1 });
// Keep repeated or simultaneous sample imports from duplicating missions.
challengeSchema.index({ programme: 1, sampleKey: 1 }, { unique: true, partialFilterExpression: { type: 'safety_simulation', sampleKey: { $type: 'string' }, archivedAt: null } });

challengeSchema.plugin(require("../utils/auditPlugin"), { targetType: "Challenge" });

module.exports = mongoose.model('Challenge', challengeSchema);

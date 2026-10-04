const mongoose = require('mongoose');

const challengeAttemptSchema = new mongoose.Schema({
  trainee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  programme: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingProgramme', required: true, index: true },
  type: { type: String, enum: ['puzzle', 'safety_simulation'], default: 'puzzle' },
  puzzle: { type: mongoose.Schema.Types.ObjectId, ref: 'Puzzle', required: function () { return this.type !== 'safety_simulation'; }, index: true },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
  startedAt: { type: Date, required: true, default: Date.now },
  finishedAt: { type: Date, default: null },
  durationSeconds: { type: Number, default: null },
  answers: { type: mongoose.Schema.Types.Mixed, default: null },
  simulationSnapshot: { type: mongoose.Schema.Types.Mixed, default: undefined },
  simulationState: { type: mongoose.Schema.Types.Mixed, default: undefined },
  attemptNumber: { type: Number, min: 1 },
  // Stable shuffled card order for this attempt. This keeps a resumed puzzle
  // in the same randomised state instead of reshuffling on refresh.
  presentationOrder: { type: [String], default: [] },
  hazardEvents: { type: [mongoose.Schema.Types.Mixed], default: [] },
  solvedHazards: { type: [String], default: [] },
  errors: { type: Number, default: 0, min: 0 },
  hintsUsed: { type: Number, default: 0, min: 0 },
  score: { type: Number, default: 0, min: 0 },
  accuracy: { type: Number, default: 0, min: 0, max: 1 },
  result: { type: String, enum: ['in-progress', 'completed', 'timeout', 'invalid', 'failed', 'abandoned'], default: 'in-progress' },
  validityStatus: { type: String, enum: ['pending', 'valid', 'invalid'], default: 'pending', index: true },
  validityReason: { type: String, default: '', trim: true },
  feedback: { type: String, default: '', trim: true },
}, { timestamps: true, optimisticConcurrency: true, suppressReservedKeysWarning: true });

challengeAttemptSchema.index({ trainee: 1, challenge: 1, createdAt: -1 });

challengeAttemptSchema.index({ challenge: 1, programme: 1, result: 1, validityStatus: 1, accuracy: 1, score: -1 });

challengeAttemptSchema.index({ trainee: 1, challenge: 1 }, { name: 'active_simulation_attempt', unique: true, partialFilterExpression: { type: 'safety_simulation', result: 'in-progress' } });

module.exports = mongoose.model('ChallengeAttempt', challengeAttemptSchema);

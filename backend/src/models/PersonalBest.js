const mongoose = require('mongoose');

const personalBestSchema = new mongoose.Schema({
  trainee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
  programme: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingProgramme', required: true, index: true },
  type: { type: String, enum: ['puzzle', 'safety_simulation'], default: 'puzzle' },
  puzzle: { type: mongoose.Schema.Types.ObjectId, ref: 'Puzzle', required: function () { return this.type !== 'safety_simulation'; } },
  attempt: { type: mongoose.Schema.Types.ObjectId, ref: 'ChallengeAttempt', required: true },
  score: { type: Number, required: true, min: 0 },
  durationSeconds: { type: Number, required: true, min: 0 },
  achievedAt: { type: Date, default: null },
}, { timestamps: true });

personalBestSchema.index({ trainee: 1, challenge: 1 }, { unique: true });

module.exports = mongoose.model('PersonalBest', personalBestSchema);

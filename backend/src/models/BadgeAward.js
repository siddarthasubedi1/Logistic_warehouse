const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    trainee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge', required: true },
    programme: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingProgramme', required: true },
    moduleKey: { type: String, required: true },
    evidenceType: { type: String, enum: ['TrainingProgress', 'AssessmentAttempt', 'ScenarioAttempt', 'ChallengeAttempt'], required: true },
    evidenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    awardedAt: { type: Date, required: true, default: Date.now },
}, { timestamps: true });
schema.index({ trainee: 1, badge: 1, programme: 1 }, { unique: true });
schema.index({ trainee: 1, awardedAt: -1 });
module.exports = mongoose.model('BadgeAward', schema);

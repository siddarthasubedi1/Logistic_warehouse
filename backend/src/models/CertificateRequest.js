const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    stars: { type: Number, min: 1, max: 5, default: 1 },
    assessmentAttempts: { type: Number, min: 1, default: 1 },
    requiredAssessments: { type: Number, min: 1, default: 1 },
    totalAssessmentSeconds: { type: Number, min: 0, default: 0 },
    totalQuestionAttempts: { type: Number, min: 0, default: 0 },
    averageSecondsPerQuestion: { type: Number, min: 0, default: null },
}, { _id: false });

const certificateRequestSchema = new mongoose.Schema({
    trainee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    certificateKey: { type: String, required: true, trim: true },
    moduleKey: { type: String, required: true, trim: true, lowercase: true, index: true },
    moduleName: { type: String, required: true, trim: true },
    moduleKeys: [{ type: String, trim: true, lowercase: true }],
    status: { type: String, enum: ['pending', 'sent', 'failed', 'superseded'], default: 'pending', index: true },
    eligibleAt: { type: Date, default: Date.now },
    certificateNumber: { type: String, required: true, trim: true },
    recipientEmail: { type: String, trim: true, lowercase: true, default: '' },
    sentAt: { type: Date, default: null },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    emailAttempts: { type: Number, default: 0, min: 0 },
    lastEmailError: { type: String, default: '', maxlength: 1000 },
    rating: { type: ratingSchema, default: () => ({}) },
    eligibilitySnapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

certificateRequestSchema.index({ trainee: 1, certificateKey: 1 }, { unique: true });
certificateRequestSchema.index({ trainee: 1, moduleKey: 1 }, { unique: true });
certificateRequestSchema.index({ status: 1, eligibleAt: -1 });
certificateRequestSchema.plugin(require('../utils/auditPlugin'), { targetType: 'CertificateRequest' });

module.exports = mongoose.model('CertificateRequest', certificateRequestSchema);

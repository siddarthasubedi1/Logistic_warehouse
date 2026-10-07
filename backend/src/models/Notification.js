const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, maxlength: 500 },
    type: { type: String, enum: ['assignment', 'module', 'progress', 'result', 'admin-action', 'badge', 'certificate'], required: true },
    relatedType: { type: String, default: '' },
    relatedId: { type: mongoose.Schema.Types.ObjectId, default: null },
    eventKey: { type: String, required: true, maxlength: 250 },
    read: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
}, { timestamps: true });
schema.index({ recipient: 1, eventKey: 1 }, { unique: true });
schema.index({ recipient: 1, read: 1, createdAt: -1 });
module.exports = mongoose.model('Notification', schema);

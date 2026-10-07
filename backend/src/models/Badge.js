const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    key: { type: String, enum: ['programme-completion', 'hazard-achievement', 'quiz-achievement'], required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
}, { timestamps: true });
module.exports = mongoose.model('Badge', schema);

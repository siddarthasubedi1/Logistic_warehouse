const mongoose = require("mongoose");

const trainingModuleSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    code: { type: String, required: true, trim: true, uppercase: true, maxlength: 30 },
    key: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 3000 },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
    image: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

module.exports = mongoose.model("TrainingModule", trainingModuleSchema);

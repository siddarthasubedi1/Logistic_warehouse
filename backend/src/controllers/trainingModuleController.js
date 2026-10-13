const mongoose = require("mongoose");
const TrainingModule = require("../models/TrainingModule");
const TrainingProgramme = require("../models/TrainingProgramme");

const slug = (value) => String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const canonicalKey = (name, code) => slug(name) || slug(code);
/** Validate module fields before hitting the database (create and edit). */
function moduleValidation(body, existing = {}) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Invalid module information.';
    for (const field of ['name', 'code', 'description', 'status', 'image']) {
        if (body[field] !== undefined && typeof body[field] !== 'string') return `${field} must be text.`;
    }
    const name = (body.name ?? existing.name ?? '').trim();
    const code = (body.code ?? existing.code ?? '').trim().toUpperCase();
    const description = (body.description ?? existing.description ?? '').trim();
    const status = body.status ?? existing.status ?? 'active';
    const image = body.image ?? existing.image ?? '';
    if (name.length < 3 || name.length > 120) return 'Module name must contain 3–120 characters.';
    if (description.length < 10 || description.length > 3000) return 'Module description must contain 10–3000 characters.';
    if (code && (!/^[A-Z0-9][A-Z0-9_-]*$/.test(code) || code.length > 30)) return 'Module code must be 1–30 letters, numbers, underscores or hyphens.';
    if (!['active', 'inactive'].includes(status)) return 'Invalid module status.';
    if (image) {
        if (image.length > 2100000 || !(/^(?:data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2})$/.test(image) || /^(?:https?:\/\/[^\s]+|\/(?!\/)[^\s]*)$/.test(image))) {
            return 'Module image must be a supported image (PNG, JPEG, WebP or GIF) up to 1.5 MB, or a valid image URL.';
        }
    }
    return '';
}
const dto = (m) => ({ id: String(m._id), _id: m._id, name: m.name, code: m.code, key: m.key, description: m.description, status: m.status, image: m.image || "", createdAt: m.createdAt, updatedAt: m.updatedAt });

exports.getTrainingModules = async (req, res) => {
    try { const filter = req.user.role === 'trainer' ? { key: { $in: req.user.assignedTrainingSections || [] } } : req.user.role === 'trainee' ? { status: 'active' } : {};
        const modules = await TrainingModule.find(filter).sort({ createdAt: 1 }); return res.json({ modules: modules.map(dto) }); }
    catch (e) { console.error("Get modules error:", e); return res.status(500).json({ message: "Unable to load training modules." }); }
};
exports.getTrainingModuleById = async (req, res) => {
    try { if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid module ID." }); const m = await TrainingModule.findById(req.params.id); if (!m || req.user.role === "trainer" && !req.user.assignedTrainingSections.includes(m.key) || req.user.role === "trainee" && m.status !== "active") return res.status(404).json({ message: "Training module not found." }); return res.json({ module: dto(m) }); }
    catch (e) { return res.status(500).json({ message: "Unable to load training module." }); }
};
exports.createTrainingModule = async (req, res) => {
    try {
        const validationError = moduleValidation(req.body);
        if (validationError) return res.status(400).json({ code: 'VALIDATION_ERROR', message: validationError });
        const name = String(req.body.name || "").trim(), code = String(req.body.code || "").trim().toUpperCase(), description = String(req.body.description || "").trim();
        const key = canonicalKey(name, code);
        if (name.length < 3 || description.length < 10 || !key) return res.status(400).json({ message: "Valid module name and description are required." });
        if (await TrainingModule.findOne({ key })) return res.status(409).json({ message: "A module with this name already exists." });
        const m = await TrainingModule.create({ name, code: code || key.toUpperCase(), key, description, status: req.body.status === "inactive" ? "inactive" : "active", image: String(req.body.image || ""), createdBy: req.user.id });
        return res.status(201).json({ message: "Training module created successfully.", module: dto(m) });
    } catch (e) { console.error("Create module error:", e); return res.status(500).json({ message: "Unable to create training module." }); }
};
exports.updateTrainingModule = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid module ID." });
        const m = await TrainingModule.findById(req.params.id); if (!m) return res.status(404).json({ message: "Training module not found." });
        const validationError = moduleValidation(req.body, m);
        if (validationError) return res.status(400).json({ code: 'VALIDATION_ERROR', message: validationError });
        const name = String(req.body.name ?? m.name).trim(), code = String(req.body.code ?? m.code).trim().toUpperCase(), description = String(req.body.description ?? m.description).trim();
        const newKey = m.key; // Stable identity: renaming a label must not break assignments and game references.
        if (name.length < 3 || description.length < 10 || !newKey) return res.status(400).json({ message: "Valid module name and description are required." });
        if (newKey !== m.key && await TrainingModule.findOne({ key: newKey, _id: { $ne: m._id } })) return res.status(409).json({ message: "A module with this name already exists." });
        if (newKey !== m.key) await TrainingProgramme.updateMany({ programmeType: m.key }, { $set: { programmeType: newKey } });
        Object.assign(m, { name, code: code || newKey.toUpperCase(), key: newKey, description, status: req.body.status === undefined ? m.status : req.body.status === "inactive" ? "inactive" : "active", updatedBy: req.user.id });
        if (Object.prototype.hasOwnProperty.call(req.body, "image")) m.image = String(req.body.image || "");
        await m.save(); return res.json({ message: "Training module updated successfully.", module: dto(m) });
    } catch (e) { console.error("Update module error:", e); return res.status(500).json({ message: "Unable to update training module." }); }
};
exports.deleteTrainingModule = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid module ID." });
        const m = await TrainingModule.findById(req.params.id); if (!m) return res.status(404).json({ message: "Training module not found." });
        const count = await TrainingProgramme.countDocuments({ programmeType: m.key });
        if (count > 0) return res.status(409).json({ message: "This module has training programmes. Deactivate it instead of deleting it." });
        await m.deleteOne(); return res.json({ message: "Training module deleted successfully." });
    } catch (e) { return res.status(500).json({ message: "Unable to delete training module." }); }
};

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const mongoose = require('mongoose');
const TrainingProgramme = require('../models/TrainingProgramme');
const TrainingAssignment = require('../models/TrainingAssignment');
const LearningSection = require('../models/LearningSection');
const SectionCompletion = require('../models/SectionCompletion');
const TrainingProgress = require('../models/TrainingProgress');
const Panorama = require('../models/Panorama');
const Scenario = require('../models/Scenario');
const AssessmentQuestion = require('../models/AssessmentQuestion');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const User = require('../models/User');
const { writeAuditLog } = require('../utils/auditLogger');
const { getOrCreateProgrammeProgress } = require('../services/trainingProgressService');

const levels = ['basic', 'intermediate', 'high'];
const oid = v => mongoose.Types.ObjectId.isValid(v);
const managerProgramme = async (req, id) => {
    if (!oid(id)) return { status: 400, message: 'Invalid programme id.' };
    const p = await TrainingProgramme.findById(id);
    if (!p) return { status: 404, message: 'Programme not found.' };
    if (req.user.role === 'admin') return { programme: p };
    const uid = String(req.user.id);
    if (req.user.role === 'trainer' && (String(p.owner) === uid || (p.authorizedTrainers || []).some(x => String(x) === uid))) return { programme: p };
    return { status: 403, message: 'You are not authorised for this programme.' };
};
const activeAssignment = (trainee, programme) => TrainingAssignment.findOne({ trainee, programme, status: 'active' });
const progressFor = async (trainee, programme, assignment) => getOrCreateProgrammeProgress({ traineeId: trainee, programmeId: programme, assignmentId: assignment._id });
const syncLearning = async (trainee, programme, p) => {
    const required = await LearningSection.find({ programme, status: 'active' }).select('_id').lean();
    const done = await SectionCompletion.find({ trainee, programme, section: { $in: required.map(x => x._id) } }).select('section').lean();
    p.completedSections = done.map(x => x.section);
    p.learningCompleted = required.length > 0 && done.length === required.length;
    p.lastAccessedAt = new Date();
    if (p.highPassed) { p.currentStage = 'completed'; p.status = 'completed'; p.progress = 100; p.completedAt = p.completedAt || new Date(); }
    else if (p.intermediatePassed) { p.currentStage = 'high'; p.progress = Math.max(p.progress, 80); }
    else if (p.basicPassed) { p.currentStage = 'intermediate'; p.progress = Math.max(p.progress, 65); }
    else if (p.learningCompleted) { p.currentStage = 'scenario'; p.progress = Math.max(p.progress, 40); }
    else { p.currentStage = 'learning'; p.progress = required.length ? Math.round(done.length / required.length * 40) : 0; }
    await p.save(); return p;
};
const eligibility = async (trainee, programmeId, level) => {
    if (!levels.includes(level)) return { status: 400, message: 'Level must be Basic, Intermediate, or High.' };
    const programme = await TrainingProgramme.findOne({ _id: programmeId, status: 'active' });
    if (!programme) return { status: 404, message: 'Active programme not found.' };
    const assignment = await activeAssignment(trainee, programmeId);
    if (!assignment) return { status: 403, message: 'Programme is not assigned to you.' };
    const progress = await syncLearning(trainee, programmeId, await progressFor(trainee, programmeId, assignment));
    if (level === 'basic' && !progress.learningCompleted) return { status: 403, code: 'LEVEL_LOCKED', message: 'Complete all required learning sections before Basic.' };
    if (level === 'intermediate' && !progress.basicPassed) return { status: 403, code: 'LEVEL_LOCKED', message: 'Pass Basic before Intermediate.' };
    if (level === 'high' && !progress.intermediatePassed) return { status: 403, code: 'LEVEL_LOCKED', message: 'Pass Intermediate before High.' };
    return { programme, assignment, progress };
};


exports.listProgrammes = async (req, res) => { try { if (req.user.role === 'trainee') { const rows = await TrainingAssignment.find({ trainee: req.user.id, status: 'active' }).populate({ path: 'programme', match: { status: 'active' } }); return res.json({ programmes: rows.map(x => x.programme).filter(Boolean) }); } const query = req.user.role === 'admin' ? {} : { $or: [{ owner: req.user.id }, { authorizedTrainers: req.user.id }] }; res.json({ programmes: await TrainingProgramme.find(query).sort({ createdAt: -1 }) }); } catch (e) { res.status(500).json({ message: 'Unable to load programmes.' }); } };

exports.completeSection = async (req, res) => {
    try {
        const assignment = await activeAssignment(req.user.id, req.params.id); if (!assignment) return res.status(403).json({ code: 'TRAINING_NOT_ASSIGNED', message: 'Programme is not assigned to you.' });
        const section = await LearningSection.findOne({ _id: req.params.sectionId, programme: req.params.id, status: 'active' }); if (!section) return res.status(404).json({ message: 'Active learning section not found in this programme.' });
        const completion = await SectionCompletion.findOneAndUpdate(
            { trainee: req.user.id, section: section._id },
            {
                $setOnInsert: {
                    trainee: req.user.id,
                    section: section._id,
                    programme: req.params.id,
                    completedAt: new Date(),
                },
            },
            { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
        );
        const p = await syncLearning(req.user.id, req.params.id, await progressFor(req.user.id, req.params.id, assignment));
        res.json({ message: 'Section completion recorded.', completion, progress: p });
    } catch (e) { res.status(500).json({ message: 'Unable to record section completion.' }); }
};

exports.createAssignment = async (req, res) => {
    try {
        const programmeId = req.body.programmeId || req.body.programme, traineeId = req.body.traineeId || req.body.trainee;
        if (!oid(programmeId) || !oid(traineeId)) return res.status(400).json({ message: 'Valid programme and trainee IDs are required.' });
        const [programme, trainee] = await Promise.all([TrainingProgramme.findById(programmeId), User.findById(traineeId)]);
        if (!programme) return res.status(404).json({ message: 'Programme not found.' }); if (programme.status !== 'active') return res.status(400).json({ message: 'Only an active programme can be assigned.' });
        if (!trainee) return res.status(404).json({ message: 'Trainee not found.' }); if (trainee.role !== 'trainee' || trainee.status !== 'active' || trainee.accountStatus !== 'created') return res.status(400).json({ message: 'Only an active, created Trainee account can be assigned.' });
        if (await TrainingAssignment.exists({ programme: programmeId, trainee: traineeId, status: 'active' })) return res.status(409).json({ code: 'DUPLICATE_ACTIVE_ASSIGNMENT', message: 'This programme is already actively assigned to this Trainee.' });
        const assignment = await TrainingAssignment.create({ programme: programmeId, trainee: traineeId, assignedBy: req.user.id, assignedAt: new Date(), status: 'active' });
        await writeAuditLog({ req, user: req.user, action: 'TRAINING_ASSIGNMENT_CREATED', status: 'success', details: { programmeId, traineeId } }).catch(() => { });
        res.status(201).json({ message: 'Training programme assigned.', assignment });
    } catch (e) { if (e?.code === 11000) return res.status(409).json({ code: 'DUPLICATE_ACTIVE_ASSIGNMENT', message: 'This programme is already actively assigned to this Trainee.' }); res.status(500).json({ message: 'Unable to create assignment.' }); }
};

exports.traineeTraining = async (req, res) => { try { const assignments = await TrainingAssignment.find({ trainee: req.user.id, status: 'active' }).populate({ path: 'programme', match: { status: 'active' }, select: 'programmeType title description passMark status owner' }).sort({ assignedAt: -1 }); res.json({ assignments: assignments.filter(x => x.programme) }); } catch (e) { res.status(500).json({ message: 'Unable to load assigned training.' }); } };
exports.warehouseTour = async (req, res) => { try { const panoramas = await Panorama.find({ type: { $in: ['warehouse_tour', 'warehouse_area'] }, status: 'active' }).select('-createdBy -updatedBy').sort({ type: 1, area: 1, name: 1 }); res.json({ panoramas, fallback: panoramas.length === 0 ? 'Warehouse Tour panorama is not configured yet.' : null }); } catch (e) { res.status(500).json({ message: 'Unable to load Warehouse Tour.' }); } };

const panoramaPayload = async (req, existing = null) => {
    let imageUrl = req.body.imageUrl || existing?.imageUrl || ''; let width = Number(req.body.imageWidth || existing?.imageWidth || 0), height = Number(req.body.imageHeight || existing?.imageHeight || 0);
    if (req.file) { const meta = await sharp(req.file.path).metadata(); width = meta.width; height = meta.height; imageUrl = `/uploads/panoramas/${req.file.filename}`; }
    if (!imageUrl || !width || !height) throw new Error('Panorama image and dimensions are required.');
    if (Math.abs(width / height - 2) > 0.01) throw new Error('Panorama image must be a 2:1 equirectangular image.');
    let hotspots = req.body.hotspots !== undefined ? req.body.hotspots : existing?.hotspots || []; if (typeof hotspots === 'string') hotspots = JSON.parse(hotspots); if (!Array.isArray(hotspots)) throw new Error('Hotspots must be an array.');
    return { type: req.body.type || existing?.type, programme: req.body.programme !== undefined ? (req.body.programme || null) : existing?.programme, area: req.body.area !== undefined ? req.body.area : existing?.area, name: req.body.name || existing?.name, description: req.body.description !== undefined ? req.body.description : existing?.description, imageUrl, imageWidth: width, imageHeight: height, status: req.body.status || existing?.status || 'pending', hotspots };
};
exports.listPanoramas = async (req, res) => { try { const panoramas = await Panorama.find().populate('programme', 'title programmeType').sort({ type: 1, name: 1, createdAt: 1 }); res.json({ panoramas }); } catch (e) { res.status(500).json({ message: 'Unable to load panoramas.' }); } };
exports.createPanorama = async (req, res) => { try { const data = await panoramaPayload(req); const panorama = await Panorama.create({ ...data, createdBy: req.user.id, updatedBy: req.user.id }); await writeAuditLog({ req, user: req.user, action: 'PANORAMA_CREATED', status: 'success', details: { panoramaId: panorama.id, type: panorama.type } }).catch(() => { }); res.status(201).json({ panorama }); } catch (e) { if (req.file) fs.unlink(req.file.path, () => { }); res.status(400).json({ message: e.message }); } };
exports.updatePanorama = async (req, res) => { try { const p = await Panorama.findById(req.params.id); if (!p) return res.status(404).json({ message: 'Panorama not found.' }); const old = p.imageUrl; Object.assign(p, await panoramaPayload(req, p)); p.updatedBy = req.user.id; await p.save(); if (req.file && old?.startsWith('/uploads/panoramas/')) fs.unlink(path.join(__dirname, '../..', old), () => { }); await writeAuditLog({ req, user: req.user, action: 'PANORAMA_UPDATED', status: 'success', details: { panoramaId: p.id, type: p.type } }).catch(() => { }); res.json({ panorama: p }); } catch (e) { if (req.file) fs.unlink(req.file.path, () => { }); res.status(400).json({ message: e.message }); } };
exports.environment = async (req, res) => { try { const id = req.params.id; let permitted = false; if (req.user.role === 'trainee') permitted = !!(await activeAssignment(req.user.id, id)); else permitted = !!(await managerProgramme(req, id)).programme; if (!permitted) return res.status(403).json({ message: 'You are not authorised for this programme.' }); const panorama = await Panorama.findOne({ type: 'training_module', programme: id, status: 'active' }).select('-createdBy -updatedBy'); res.json({ panorama: panorama || null, fallback: panorama ? null : 'No active 2:1 module panorama is configured for this programme.' }); } catch (e) { res.status(500).json({ message: 'Unable to load programme environment.' }); } };

exports.traineeScenarios = async (req, res) => { try { const a = await activeAssignment(req.user.id, req.params.id); if (!a) return res.status(403).json({ message: 'Programme is not assigned to you.' }); const p = await syncLearning(req.user.id, req.params.id, await progressFor(req.user.id, req.params.id, a)); if (!p.learningCompleted) return res.status(403).json({ code: 'LEARNING_INCOMPLETE', message: 'Complete required learning first.' }); const scenarios = await Scenario.find({ programme: req.params.id, status: 'active' }).sort({ order: 1 }).select('title prompt type options order'); res.json({ scenarios }); } catch (e) { res.status(500).json({ message: 'Unable to load scenarios.' }); } };
exports.manageScenarios = async (req, res) => { try { const access = await managerProgramme(req, req.params.id); if (!access.programme) return res.status(access.status).json({ message: access.message }); res.json({ scenarios: await Scenario.find({ programme: req.params.id }).sort({ order: 1 }) }); } catch (e) { res.status(500).json({ message: 'Unable to load scenarios.' }); } };
exports.createScenario = async (req, res) => { try { const access = await managerProgramme(req, req.params.id); if (!access.programme) return res.status(access.status).json({ message: access.message }); const scenario = await Scenario.create({ ...req.body, programme: req.params.id, createdBy: req.user.id, status: req.body.status || 'pending' }); res.status(201).json({ scenario }); } catch (e) { res.status(400).json({ message: e.message }); } };

exports.manageQuestions = async (req, res) => { try { const access = await managerProgramme(req, req.params.id); if (!access.programme) return res.status(access.status).json({ message: access.message }); const q = { programme: req.params.id }; if (req.query.level) q.level = String(req.query.level).toLowerCase(); res.json({ questions: await AssessmentQuestion.find(q).sort({ level: 1, order: 1 }) }); } catch (e) { res.status(500).json({ message: 'Unable to load questions.' }); } };
exports.createQuestion = async (req, res) => { try { const access = await managerProgramme(req, req.params.id); if (!access.programme) return res.status(access.status).json({ message: access.message }); const body = { ...req.body, level: String(req.body.level || '').toLowerCase(), programme: req.params.id, createdBy: req.user.id, status: req.body.status || 'pending' }; if (!body.options?.includes(body.correctAnswer)) return res.status(400).json({ message: 'Correct answer must be one of the options.' }); const question = await AssessmentQuestion.create(body); res.status(201).json({ question }); } catch (e) { res.status(400).json({ message: e.message }); } };
exports.updateQuestion = async (req, res) => { try { const q = await AssessmentQuestion.findById(req.params.questionId); if (!q) return res.status(404).json({ message: 'Question not found.' }); const access = await managerProgramme(req, q.programme); if (!access.programme) return res.status(access.status).json({ message: access.message }); for (const k of ['level', 'question', 'options', 'correctAnswer', 'points', 'feedback', 'order', 'status']) if (req.body[k] !== undefined) q[k] = k === 'level' ? String(req.body[k]).toLowerCase() : req.body[k]; if (!q.options.includes(q.correctAnswer)) return res.status(400).json({ message: 'Correct answer must be one of the options.' }); q.updatedBy = req.user.id; await q.save(); res.json({ question: q }); } catch (e) { res.status(400).json({ message: e.message }); } };

exports.getAssessment = async (req, res) => { try { const level = String(req.params.level).toLowerCase(), e = await eligibility(req.user.id, req.params.id, level); if (e.status) return res.status(e.status).json({ code: e.code || 'ASSESSMENT_DENIED', message: e.message }); const questions = await AssessmentQuestion.find({ programme: req.params.id, level, status: 'active' }).sort({ order: 1 }).select('question options points order'); if (!questions.length) return res.status(404).json({ message: 'No active questions are available for this level.' }); const attemptCount = await AssessmentAttempt.countDocuments({ trainee: req.user.id, programme: req.params.id, level }); const configured = process.env.SPRINT2_RETAKE_LIMIT ? Number(process.env.SPRINT2_RETAKE_LIMIT) : null; res.json({ level, questions, attemptCount, retakeLimit: Number.isFinite(configured) ? configured : null }); } catch (e) { res.status(500).json({ message: 'Unable to load assessment.' }); } };
exports.submitAssessment = async (req, res) => {
    try {
        const level = String(req.params.level).toLowerCase(), e = await eligibility(req.user.id, req.params.id, level); if (e.status) return res.status(e.status).json({ code: e.code || 'ASSESSMENT_DENIED', message: e.message }); const prior = await AssessmentAttempt.countDocuments({ trainee: req.user.id, programme: req.params.id, level }); const limit = process.env.SPRINT2_RETAKE_LIMIT ? Number(process.env.SPRINT2_RETAKE_LIMIT) : null; if (Number.isFinite(limit) && prior >= limit) return res.status(403).json({ code: 'RETAKE_LIMIT_REACHED', message: 'Retake limit reached for this level.' });
        const qs = await AssessmentQuestion.find({ programme: req.params.id, level, status: 'active' }).sort({ order: 1 }); if (!qs.length) return res.status(404).json({ message: 'No active questions are available.' }); const submitted = Array.isArray(req.body.answers) ? req.body.answers : []; const map = new Map(submitted.map(x => [String(x.questionId), String(x.answer ?? '')])); if (submitted.some(x => !oid(x.questionId))) return res.status(400).json({ message: 'Invalid answer payload.' }); if (submitted.some(x => !qs.some(q => String(q._id) === String(x.questionId)))) return res.status(400).json({ message: 'An answer references a question outside this programme and level.' }); let score = 0, total = 0; const answers = qs.map(q => { const answer = map.get(String(q._id)) || ''; const correct = answer === q.correctAnswer; total += q.points; if (correct) score += q.points; return { question: q._id, answer, correct, pointsAwarded: correct ? q.points : 0 }; }); const percentage = total ? Math.round(score / total * 10000) / 100 : 0, passed = percentage >= e.programme.passMark, attemptNumber = prior + 1; const attempt = await AssessmentAttempt.create({ trainee: req.user.id, programme: req.params.id, assignment: e.assignment._id, level, answers, score, totalPoints: total, percentage, passed, attemptNumber }); if (passed) { if (level === 'basic') e.progress.basicPassed = true; if (level === 'intermediate') e.progress.intermediatePassed = true; if (level === 'high') e.progress.highPassed = true; await syncLearning(req.user.id, req.params.id, e.progress); } res.status(201).json({ attempt: { _id: attempt._id, level, score, totalPoints: total, percentage, passed, attemptNumber }, feedback: qs.map(q => ({ questionId: q._id, feedback: q.feedback })) });
    } catch (e) { if (e?.code === 11000) return res.status(409).json({ message: 'Attempt number conflict. Please submit again.' }); res.status(500).json({ message: 'Unable to submit assessment.' }); }
};
exports.results = async (req, res) => { try { const query = { status: { $ne: 'in-progress' } }; if (req.user.role === 'trainee') query.trainee = req.user.id; else if (req.user.role === 'trainer') { const programmes = await TrainingProgramme.find({ $or: [{ owner: req.user.id }, { authorizedTrainers: req.user.id }] }).select('_id'); query.programme = { $in: programmes.map(x => x._id) }; } if (req.query.traineeId && req.user.role !== 'trainee') query.trainee = req.query.traineeId; if (req.query.programmeId) query.programme = req.query.programmeId; const attempts = await AssessmentAttempt.find(query).populate('programme', 'title programmeType').populate('trainee', 'firstName lastName username').sort({ createdAt: -1 }); res.json({ attempts }); } catch (e) { res.status(500).json({ message: 'Unable to load results.' }); } };

// Admin/authorised Trainer only: create missing starter content for programmes they are allowed to manage.
// This is never called by trainee endpoints. Existing content is preserved.
exports.generateMissingProgrammeContent = async (req, res) => {
    try {
        const { ensureStarterTrainingContent } = require('../services/starterTrainingContent');
        const query = { deletedAt: null };
        if (req.user.role === 'trainer') query.$or = [{ owner: req.user.id }, { authorizedTrainers: req.user.id }];
        if (req.body?.programmeType) query.programmeType = req.body.programmeType;
        const programmes = await TrainingProgramme.find(query);
        const results = [];
        for (const programme of programmes) {
            const made = await ensureStarterTrainingContent(programme, req.user.id);
            results.push({ programmeId: programme._id, title: programme.title, level: programme.level, ...made });
        }
        res.json({ message: 'Missing learning, scenario and assessment content generated for authorised programmes. Existing content was not overwritten.', results });
    } catch (e) {
        res.status(500).json({ message: e.message || 'Unable to generate programme content.' });
    }
};

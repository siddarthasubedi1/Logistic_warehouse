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
const { getModuleLevelAccess, normalize, normalizeProgrammeLevel, syncUnlockedProgressionAssignments } = require('../services/traineeLevelProgressService');

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
const activeAssignment = async (trainee, programme) => {
    const row = await TrainingProgramme.findById(programme).select('programmeType').lean();
    if (row?.programmeType) await syncUnlockedProgressionAssignments(trainee, row.programmeType);
    return TrainingAssignment.findOne({ trainee, programme, status: 'active' });
};
const progressFor = async (trainee, programme, assignment) => getOrCreateProgrammeProgress({ traineeId: trainee, programmeId: programme, assignmentId: assignment._id });
const traineeProgrammeLevelGate = async (trainee, programmeId) => {
    const programme = await TrainingProgramme.findOne({ _id: programmeId, status: 'active' }).select('_id programmeType level').lean();
    if (!programme) return { status: 404, code: 'PROGRAMME_NOT_AVAILABLE', message: 'Active programme not found.' };
    const assignment = await activeAssignment(trainee, programmeId);
    if (!assignment) return { status: 403, code: 'TRAINING_NOT_ASSIGNED', message: 'Programme is not assigned to you.' };
    const access = await getModuleLevelAccess(trainee, programme.programmeType);
    const level = normalizeProgrammeLevel(programme.level);
    if (!access[level]?.unlocked) return { status: 403, code: 'PROGRAMME_LEVEL_LOCKED', message: 'Complete and pass the previous programme level before opening this programme.', access };
    return { programme, assignment, access, level };
};
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


exports.listProgrammes = async (req, res) => { try { if (req.user.role === 'trainee') { await syncUnlockedProgressionAssignments(req.user.id); const rows = await TrainingAssignment.find({ trainee: req.user.id, status: 'active' }).populate({ path: 'programme', match: { status: 'active' } }); return res.json({ programmes: rows.map(x => x.programme).filter(Boolean) }); } const query = req.user.role === 'admin' ? {} : { $or: [{ owner: req.user.id }, { authorizedTrainers: req.user.id }] }; res.json({ programmes: await TrainingProgramme.find(query).sort({ createdAt: -1 }) }); } catch (e) { res.status(500).json({ message: 'Unable to load programmes.' }); } };

exports.completeSection = async (req, res) => {
    try {
        const gate = await traineeProgrammeLevelGate(req.user.id, req.params.id);
        if (gate.status) return res.status(gate.status).json({ code: gate.code, message: gate.message, levelAccess: gate.access });
        const assignment = gate.assignment;
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

exports.traineeTraining = async (req, res) => { try { await syncUnlockedProgressionAssignments(req.user.id); const assignments = await TrainingAssignment.find({ trainee: req.user.id, status: 'active' }).populate({ path: 'programme', match: { status: 'active' }, select: 'programmeType title description passMark level status owner createdAt' }).sort({ assignedAt: -1 }); res.json({ assignments: assignments.filter(x => x.programme) }); } catch (e) { res.status(500).json({ message: 'Unable to load training.' }); } };
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
exports.environment = async (req, res) => { try { const id = req.params.id; if (req.user.role === 'trainee') { const gate = await traineeProgrammeLevelGate(req.user.id, id); if (gate.status) return res.status(gate.status).json({ code: gate.code, message: gate.message, levelAccess: gate.access }); } else { const access = await managerProgramme(req, id); if (!access.programme) return res.status(access.status || 403).json({ message: access.message || 'You are not authorised for this programme.' }); } const panorama = await Panorama.findOne({ type: 'training_module', programme: id, status: 'active' }).select('-createdBy -updatedBy'); res.json({ panorama: panorama || null, fallback: panorama ? null : 'No active 2:1 module panorama is configured for this programme.' }); } catch (e) { res.status(500).json({ message: 'Unable to load programme environment.' }); } };

exports.traineeScenarios = async (req, res) => { try { const gate = await traineeProgrammeLevelGate(req.user.id, req.params.id); if (gate.status) return res.status(gate.status).json({ code: gate.code, message: gate.message, levelAccess: gate.access }); const a = gate.assignment; const p = await syncLearning(req.user.id, req.params.id, await progressFor(req.user.id, req.params.id, a)); if (!p.learningCompleted) return res.status(403).json({ code: 'LEARNING_INCOMPLETE', message: 'Complete required learning first.' }); const scenarios = await Scenario.find({ programme: req.params.id, status: 'active' }).sort({ order: 1 }).select('title prompt type options order'); res.json({ scenarios }); } catch (e) { res.status(500).json({ message: 'Unable to load scenarios.' }); } };
exports.manageScenarios = async (req, res) => { try { const access = await managerProgramme(req, req.params.id); if (!access.programme) return res.status(access.status).json({ message: access.message }); res.json({ scenarios: await Scenario.find({ programme: req.params.id }).sort({ order: 1 }) }); } catch (e) { res.status(500).json({ message: 'Unable to load scenarios.' }); } };
exports.createScenario = async (req, res) => { try { const access = await managerProgramme(req, req.params.id); if (!access.programme) return res.status(access.status).json({ message: access.message }); const scenario = await Scenario.create({ ...req.body, programme: req.params.id, createdBy: req.user.id, status: req.body.status || 'pending' }); res.status(201).json({ scenario }); } catch (e) { res.status(400).json({ message: e.message }); } };

exports.manageQuestions = async (req, res) => {
    try {
        const access = await managerProgramme(req, req.params.id);
        if (!access.programme) return res.status(access.status).json({ message: access.message });
        const q = { programme: req.params.id };
        if (req.query.level) q.level = String(req.query.level).toLowerCase();
        const questions = await AssessmentQuestion.find(q).sort({ level: 1, order: 1 });
        const { MIN_QUESTIONS_PER_LEVEL, normalizeAssessmentLevel } = require('../services/assessmentQuestionBank');
        const requiredLevel = normalizeAssessmentLevel(access.programme.level);
        const activeCount = questions.filter(row => row.level === requiredLevel && row.status === 'active').length;
        res.json({
            questions,
            questionBank: {
                requiredLevel,
                activeCount,
                minimumRequired: MIN_QUESTIONS_PER_LEVEL,
                ready: activeCount >= MIN_QUESTIONS_PER_LEVEL,
            },
        });
    } catch (e) {
        res.status(500).json({ message: 'Unable to load questions.' });
    }
};
exports.ensureQuestionBank = async (req, res) => {
    try {
        const access = await managerProgramme(req, req.params.id);
        if (!access.programme) return res.status(access.status).json({ message: access.message });
        const { ensureAssessmentQuestionBank, MIN_QUESTIONS_PER_LEVEL } = require('../services/assessmentQuestionBank');
        const result = await ensureAssessmentQuestionBank(access.programme, req.user.id);
        res.json({
            message: result.created
                ? `Question bank updated. ${result.activeCount} active questions are now available for this level.`
                : `Question bank already contains at least ${MIN_QUESTIONS_PER_LEVEL} active questions for this level.`,
            ...result,
        });
    } catch (e) {
        res.status(500).json({ message: e.message || 'Unable to update question bank.' });
    }
};
exports.createQuestion = async (req, res) => { try { const access = await managerProgramme(req, req.params.id); if (!access.programme) return res.status(access.status).json({ message: access.message }); const body = { ...req.body, level: String(req.body.level || '').toLowerCase(), programme: req.params.id, createdBy: req.user.id, status: req.body.status || 'pending' }; if (!body.options?.includes(body.correctAnswer)) return res.status(400).json({ message: 'Correct answer must be one of the options.' }); const question = await AssessmentQuestion.create(body); res.status(201).json({ question }); } catch (e) { res.status(400).json({ message: e.message }); } };
exports.updateQuestion = async (req, res) => { try { const q = await AssessmentQuestion.findById(req.params.questionId); if (!q) return res.status(404).json({ message: 'Question not found.' }); const access = await managerProgramme(req, q.programme); if (!access.programme) return res.status(access.status).json({ message: access.message }); for (const k of ['level', 'question', 'options', 'correctAnswer', 'points', 'feedback', 'order', 'status']) if (req.body[k] !== undefined) q[k] = k === 'level' ? String(req.body[k]).toLowerCase() : req.body[k]; if (!q.options.includes(q.correctAnswer)) return res.status(400).json({ message: 'Correct answer must be one of the options.' }); q.updatedBy = req.user.id; await q.save(); res.json({ question: q }); } catch (e) { res.status(400).json({ message: e.message }); } };

exports.getAssessment = async (req, res) => { try { const level = String(req.params.level).toLowerCase(), e = await eligibility(req.user.id, req.params.id, level); if (e.status) return res.status(e.status).json({ code: e.code || 'ASSESSMENT_DENIED', message: e.message }); const questions = await AssessmentQuestion.find({ programme: req.params.id, level, status: 'active' }).sort({ order: 1 }).select('question options points order'); if (!questions.length) return res.status(404).json({ message: 'No active questions are available for this level.' }); const attemptCount = await AssessmentAttempt.countDocuments({ trainee: req.user.id, programme: req.params.id, level }); const configured = process.env.SPRINT2_RETAKE_LIMIT ? Number(process.env.SPRINT2_RETAKE_LIMIT) : null; res.json({ level, questions, attemptCount, retakeLimit: Number.isFinite(configured) ? configured : null }); } catch (e) { res.status(500).json({ message: 'Unable to load assessment.' }); } };
exports.submitAssessment = async (req, res) => {
    try {
        const level = String(req.params.level).toLowerCase(), e = await eligibility(req.user.id, req.params.id, level); if (e.status) return res.status(e.status).json({ code: e.code || 'ASSESSMENT_DENIED', message: e.message }); const prior = await AssessmentAttempt.countDocuments({ trainee: req.user.id, programme: req.params.id, level }); const limit = process.env.SPRINT2_RETAKE_LIMIT ? Number(process.env.SPRINT2_RETAKE_LIMIT) : null; if (Number.isFinite(limit) && prior >= limit) return res.status(403).json({ code: 'RETAKE_LIMIT_REACHED', message: 'Retake limit reached for this level.' });
        const qs = await AssessmentQuestion.find({ programme: req.params.id, level, status: 'active' }).sort({ order: 1 }); if (!qs.length) return res.status(404).json({ message: 'No active questions are available.' }); const submitted = Array.isArray(req.body.answers) ? req.body.answers : []; const map = new Map(submitted.map(x => [String(x.questionId), String(x.answer ?? '')])); if (submitted.some(x => !oid(x.questionId))) return res.status(400).json({ message: 'Invalid answer payload.' }); if (submitted.some(x => !qs.some(q => String(q._id) === String(x.questionId)))) return res.status(400).json({ message: 'An answer references a question outside this programme and level.' }); let score = 0, total = 0; const answers = qs.map(q => { const answer = map.get(String(q._id)) || ''; const correct = answer === q.correctAnswer; total += q.points; if (correct) score += q.points; return { question: q._id, answer, correct, pointsAwarded: correct ? q.points : 0 }; }); const percentage = total ? Math.round(score / total * 10000) / 100 : 0, passed = percentage >= e.programme.passMark, attemptNumber = prior + 1; const attempt = await AssessmentAttempt.create({ trainee: req.user.id, programme: req.params.id, assignment: e.assignment._id, level, answers, score, totalPoints: total, percentage, passed, attemptNumber }); if (passed) { if (level === 'basic') e.progress.basicPassed = true; if (level === 'intermediate') e.progress.intermediatePassed = true; if (level === 'high') e.progress.highPassed = true; await syncLearning(req.user.id, req.params.id, e.progress); } res.status(201).json({ attempt: { _id: attempt._id, level, score, totalPoints: total, percentage, passed, attemptNumber }, feedback: qs.map(q => ({ questionId: q._id, feedback: q.feedback })) });
    } catch (e) { if (e?.code === 11000) return res.status(409).json({ message: 'Attempt number conflict. Please submit again.' }); res.status(500).json({ message: 'Unable to submit assessment.' }); }
};
const getAttemptProgrammeIdsForUser = async (req) => {
    if (req.user.role === 'admin') return null;

    if (req.user.role === 'trainer') {
        const trainer = await User.findById(req.user.id).select('assignedTrainingSections').lean();
        const modules = (trainer?.assignedTrainingSections || []).map(x => String(x).trim().toLowerCase()).filter(Boolean);
        if (!modules.length) return [];
        const programmes = await TrainingProgramme.find({ programmeType: { $in: modules } }).select('_id').lean();
        return programmes.map(x => x._id);
    }

    return [];
};

const escapeRegex = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const attemptLevel = (value) => {
    const v = String(value || '').toLowerCase();
    if (['beginner', 'easy', 'basic'].includes(v)) return 'basic';
    if (['intermediate', 'medium'].includes(v)) return 'intermediate';
    if (['advanced', 'high'].includes(v)) return 'high';
    return '';
};
const attemptDurationSeconds = (row) => {
    if (!row?.startedAt || !(row?.submittedAt || row?.createdAt)) return null;
    const start = new Date(row.startedAt).getTime();
    const end = new Date(row.submittedAt || row.createdAt).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
    return Math.round((end - start) / 1000);
};
const intersectIds = (left, right) => {
    if (left === null) return right;
    const rightSet = new Set((right || []).map(String));
    return (left || []).filter(id => rightSet.has(String(id)));
};

exports.attemptRecords = async (req, res) => {
    try {
        const scopedProgrammeIds = await getAttemptProgrammeIdsForUser(req);
        let programmeIds = scopedProgrammeIds === null ? null : [...scopedProgrammeIds];

        if (req.query.programmeId) {
            if (!oid(req.query.programmeId)) return res.status(400).json({ message: 'Invalid programme filter.' });
            programmeIds = intersectIds(programmeIds, [req.query.programmeId]);
        }

        if (req.query.module) {
            const moduleKey = String(req.query.module).trim().toLowerCase();
            const programmeQuery = { programmeType: moduleKey };
            if (Array.isArray(programmeIds)) programmeQuery._id = { $in: programmeIds };
            const matching = await TrainingProgramme.find(programmeQuery).select('_id').lean();
            programmeIds = matching.map(row => row._id);
        }

        const query = { status: { $ne: 'in-progress' } };
        if (Array.isArray(programmeIds)) query.programme = { $in: programmeIds };

        if (req.query.traineeId) {
            if (!oid(req.query.traineeId)) return res.status(400).json({ message: 'Invalid trainee filter.' });
            query.trainee = req.query.traineeId;
        }

        const normalizedLevel = attemptLevel(req.query.level);
        if (normalizedLevel) query.level = normalizedLevel;
        if (req.query.result === 'passed') query.passed = true;
        if (req.query.result === 'failed') query.passed = false;

        const search = String(req.query.search || '').trim();
        if (search) {
            const rx = new RegExp(escapeRegex(search), 'i');
            const matchingTrainees = await User.find({
                role: 'trainee',
                $or: [
                    { firstName: rx }, { lastName: rx }, { username: rx }, { email: rx },
                ],
            }).select('_id').lean();

            const programmeSearch = {
                $or: [{ title: rx }, { programmeType: rx }],
            };
            if (Array.isArray(programmeIds)) programmeSearch._id = { $in: programmeIds };
            const matchingProgrammes = await TrainingProgramme.find(programmeSearch).select('_id').lean();

            query.$and = query.$and || [];
            query.$and.push({
                $or: [
                    { trainee: { $in: matchingTrainees.map(row => row._id) } },
                    { programme: { $in: matchingProgrammes.map(row => row._id) } },
                ],
            });
        }

        const allAttempts = await AssessmentAttempt.find(query)
            .populate('programme', 'title programmeType level passMark status')
            .populate('trainee', 'firstName lastName username email')
            .sort({ submittedAt: -1, createdAt: -1 })
            .lean();

        const enriched = allAttempts.map(row => ({
            ...row,
            effectivePassMark: Number(row.passMark ?? row.programme?.passMark ?? 0),
            durationSeconds: attemptDurationSeconds(row),
        }));

        const totalAttempts = enriched.length;
        const uniqueTrainees = new Set(enriched.map(a => String(a.trainee?._id || a.trainee)).filter(Boolean));
        const passed = enriched.filter(a => a.passed).length;
        const marks = enriched.map(a => Number(a.percentage || 0));
        const averageMark = marks.length ? Math.round((marks.reduce((a, b) => a + b, 0) / marks.length) * 100) / 100 : 0;
        const bestMark = marks.length ? Math.max(...marks) : 0;

        const traineeMap = new Map();
        for (const row of enriched) {
            const id = String(row.trainee?._id || row.trainee || 'unknown');
            if (!traineeMap.has(id)) {
                traineeMap.set(id, {
                    trainee: row.trainee,
                    totalAttempts: 0,
                    passed: 0,
                    failed: 0,
                    marks: [],
                    latestMark: Number(row.percentage || 0),
                    latestResult: !!row.passed,
                    latestSubmittedAt: row.submittedAt || row.createdAt,
                    latestProgramme: row.programme,
                    latestLevel: row.level,
                });
            }
            const item = traineeMap.get(id);
            item.totalAttempts += 1;
            if (row.passed) item.passed += 1; else item.failed += 1;
            item.marks.push(Number(row.percentage || 0));
        }
        const traineeSummaries = [...traineeMap.values()].map(item => ({
            trainee: item.trainee,
            totalAttempts: item.totalAttempts,
            passed: item.passed,
            failed: item.failed,
            averageMark: item.marks.length ? Math.round((item.marks.reduce((a, b) => a + b, 0) / item.marks.length) * 100) / 100 : 0,
            bestMark: item.marks.length ? Math.max(...item.marks) : 0,
            latestMark: item.latestMark,
            latestResult: item.latestResult,
            latestSubmittedAt: item.latestSubmittedAt,
            latestProgramme: item.latestProgramme,
            latestLevel: item.latestLevel,
        })).sort((a, b) => new Date(b.latestSubmittedAt || 0) - new Date(a.latestSubmittedAt || 0));

        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(10, Number.parseInt(req.query.limit, 10) || 25));
        const totalPages = Math.max(1, Math.ceil(totalAttempts / limit));
        const safePage = Math.min(page, totalPages);
        const attempts = enriched.slice((safePage - 1) * limit, safePage * limit);

        const scopeQuery = { status: { $ne: 'in-progress' } };
        if (Array.isArray(scopedProgrammeIds)) scopeQuery.programme = { $in: scopedProgrammeIds };
        const scopeTraineeIds = await AssessmentAttempt.distinct('trainee', scopeQuery);
        const traineeOptions = await User.find({ _id: { $in: scopeTraineeIds }, role: 'trainee' })
            .select('_id firstName lastName username email')
            .sort({ firstName: 1, lastName: 1, username: 1 })
            .lean();

        res.json({
            attempts,
            traineeSummaries,
            traineeOptions,
            summary: {
                totalAttempts,
                uniqueTrainees: uniqueTrainees.size,
                passed,
                failed: totalAttempts - passed,
                passRate: totalAttempts ? Math.round((passed / totalAttempts) * 10000) / 100 : 0,
                averageMark,
                bestMark,
            },
            pagination: {
                page: safePage,
                limit,
                total: totalAttempts,
                totalPages,
            },
        });
    } catch (e) {
        console.error('attemptRecords failed:', e);
        res.status(500).json({ message: 'Unable to load attempt records.' });
    }
};

exports.attemptRecordDetail = async (req, res) => {
    try {
        if (!oid(req.params.attemptId)) return res.status(400).json({ message: 'Invalid attempt id.' });

        const allowedProgrammeIds = await getAttemptProgrammeIdsForUser(req);
        const query = { _id: req.params.attemptId, status: { $ne: 'in-progress' } };
        if (Array.isArray(allowedProgrammeIds)) query.programme = { $in: allowedProgrammeIds };

        const attempt = await AssessmentAttempt.findOne(query)
            .populate('programme', 'title programmeType level passMark status')
            .populate('trainee', 'firstName lastName username email')
            .lean();

        if (!attempt) return res.status(404).json({ message: 'Attempt record not found or not available for your assigned modules.' });

        const questionIds = (attempt.questionSet || []).length
            ? attempt.questionSet
            : (attempt.answers || []).map(row => row.question);
        const rows = await AssessmentQuestion.find({ _id: { $in: questionIds } })
            .select('question options correctAnswer feedback points order')
            .lean();
        const byId = new Map(rows.map(q => [String(q._id), q]));
        const answerById = new Map((attempt.answers || []).map(a => [String(a.question), a]));

        const results = questionIds.map(id => {
            const q = byId.get(String(id));
            const answer = answerById.get(String(id));
            if (!q) return null;
            return {
                questionId: q._id,
                question: q.question,
                options: q.options || [],
                selectedAnswer: answer?.answer || '',
                correctAnswer: q.correctAnswer,
                correct: !!answer?.correct,
                pointsAwarded: Number(answer?.pointsAwarded || 0),
                points: Number(q.points || 1),
                feedback: q.feedback || '',
            };
        }).filter(Boolean);

        res.json({
            attempt: {
                ...attempt,
                effectivePassMark: Number(attempt.passMark ?? attempt.programme?.passMark ?? 0),
                durationSeconds: attemptDurationSeconds(attempt),
            },
            results,
        });
    } catch (e) {
        console.error('attemptRecordDetail failed:', e);
        res.status(500).json({ message: 'Unable to load attempt details.' });
    }
};

// Backward-compatible results endpoint used by older screens.
exports.results = async (req, res) => {
    if (req.user.role === 'trainee') {
        try {
            const attempts = await AssessmentAttempt.find({ trainee: req.user.id, status: { $ne: 'in-progress' } })
                .populate('programme', 'title programmeType')
                .populate('trainee', 'firstName lastName username')
                .sort({ submittedAt: -1, createdAt: -1 });
            return res.json({ attempts });
        } catch (e) {
            return res.status(500).json({ message: 'Unable to load results.' });
        }
    }
    return exports.attemptRecords(req, res);
};

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

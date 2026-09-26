const crypto = require("crypto");
const TrainingProgramme = require("../models/TrainingProgramme");
const TrainingAssignment = require("../models/TrainingAssignment");
const LearningSection = require("../models/LearningSection");
const TrainingProgress = require("../models/TrainingProgress");
const Scenario = require("../models/Scenario");
const AssessmentQuestion = require("../models/AssessmentQuestion");
const AssessmentAttempt = require("../models/AssessmentAttempt");
const ScenarioAttempt = require("../models/ScenarioAttempt");
const SectionCompletion = require("../models/SectionCompletion");
const { getOrCreateProgrammeProgress } = require("../services/trainingProgressService");
const { ensureAssessmentQuestionBank, MIN_QUESTIONS_PER_LEVEL } = require("../services/assessmentQuestionBank");
const {
    getModuleLevelAccess,
    assessmentLevelForProgramme,
    normalize,
    normalizeProgrammeLevel,
    syncUnlockedProgressionAssignments,
} = require("../services/traineeLevelProgressService");

const allowed = async (req, programmeId) => {
    const p = await TrainingProgramme.findById(programmeId);
    if (!p) return null;
    if (req.user.role === "admin") return p;
    const uid = String(req.user.id);
    if (req.user.role === "trainer" && (String(p.owner) === uid || (p.authorizedTrainers || []).some(x => String(x) === uid))) return p;
    return false;
};
const assigned = async (req, programmeId) => {
    const programme = await TrainingProgramme.findById(programmeId).select("programmeType").lean();
    if (programme?.programmeType) {
        await syncUnlockedProgressionAssignments(req.user.id, programme.programmeType);
    }
    return TrainingAssignment.findOne({ programme: programmeId, trainee: req.user.id, status: "active" });
};
const getProgress = async (req, programmeId, assignment) => {
    return getOrCreateProgrammeProgress({
        traineeId: req.user.id,
        programmeId,
        assignmentId: assignment._id,
    });
};
const updateStage = (p, requiredAssessmentLevel = "basic") => {
    const passField = {
        basic: "basicPassed",
        intermediate: "intermediatePassed",
        high: "highPassed",
    }[requiredAssessmentLevel] || "basicPassed";

    // A failed assessment sends the trainee back through the SAME programme
    // level's learning and scenario before another attempt.
    if (p.retryRequiredLevel) {
        p.status = "in-progress";
        p.completedAt = null;
        if (!p.learningCompleted) {
            p.currentStage = "learning";
            return;
        }
        if (!p.scenarioCompleted) {
            p.currentStage = "scenario";
            p.progress = Math.max(Number(p.progress || 0), 40);
            return;
        }
        p.currentStage = requiredAssessmentLevel;
        p.progress = Math.max(Number(p.progress || 0), 50);
        return;
    }

    // A programme has one trainee-facing assessment, chosen from its programme
    // level. Do not progress Basic -> Intermediate -> High inside one programme.
    if (p[passField]) {
        p.currentStage = "completed";
        p.status = "completed";
        p.progress = 100;
        p.completedAt = p.completedAt || new Date();
    } else if (p.scenarioCompleted) {
        p.currentStage = requiredAssessmentLevel;
        p.progress = Math.max(Number(p.progress || 0), 50);
    } else if (p.learningCompleted) {
        p.currentStage = "scenario";
        p.progress = Math.max(Number(p.progress || 0), 40);
    } else {
        p.currentStage = "learning";
    }
};

const shuffle = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const seededShuffle = (items, seedValue) => {
    const copy = [...items];
    const hash = crypto.createHash("sha256").update(String(seedValue)).digest();
    let state = hash.readUInt32LE(0) || 0x9e3779b9;
    const next = () => {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        return (state >>> 0) / 4294967296;
    };
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(next() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const ASSESSMENT_QUESTION_LIMIT = 10;
const normalizeLevel = normalize;

const traineeProgrammeGate = async (traineeId, programmeId) => {
    const programme = await TrainingProgramme.findById(programmeId)
        .select("_id level programmeType passMark")
        .lean();
    if (!programme) return { programme: null, unlocked: false, access: null };

    const access = await getModuleLevelAccess(traineeId, programme.programmeType);
    const programmeLevel = normalizeProgrammeLevel(programme.level);
    return {
        programme,
        access,
        programmeLevel,
        requiredAssessmentLevel: assessmentLevelForProgramme(programme),
        unlocked: !!access[programmeLevel]?.unlocked,
    };
};

// SectionCompletion is the source of truth for learning ticks. This prevents
// stale completedSections arrays from showing sections as complete before the
// trainee actually presses Mark Complete.
const syncLearningProgress = async (req, programmeId, assignment, progress = null) => {
    const p = progress || await getProgress(req, programmeId, assignment);
    const programme = await TrainingProgramme.findById(programmeId).select("level").lean();
    const requiredAssessmentLevel = assessmentLevelForProgramme(programme);
    const required = await LearningSection.find({ programme: programmeId, status: "active" }).select("_id").lean();
    const requiredIds = required.map(x => x._id);
    const completions = requiredIds.length
        ? await SectionCompletion.find({ trainee: req.user.id, programme: programmeId, section: { $in: requiredIds } }).select("section").lean()
        : [];
    p.completedSections = completions.map(x => x.section);
    p.learningCompleted = required.length > 0 && completions.length === required.length;
    p.lastAccessedAt = new Date();
    if (!p.learningCompleted && (p.retryRequiredLevel || (!p.scenarioCompleted && !p.basicPassed && !p.intermediatePassed && !p.highPassed))) {
        p.progress = required.length ? Math.round((completions.length / required.length) * 40) : 0;
    } else if (p.learningCompleted) {
        p.progress = Math.max(Number(p.progress || 0), 40);
    }
    updateStage(p, requiredAssessmentLevel);
    await p.save();
    return p;
};

exports.listScenarios = async (req, res) => { try { const p = await allowed(req, req.params.programmeId); if (p === null) return res.status(404).json({ message: "Programme not found" }); if (!p) return res.status(403).json({ message: "Not authorised for this programme" }); res.json({ scenarios: await Scenario.find({ programme: p._id }).sort({ order: 1 }) }); } catch (e) { res.status(500).json({ message: "Unable to load scenarios" }); } };
exports.createScenario = async (req, res) => { try { const p = await allowed(req, req.params.programmeId); if (!p) return res.status(p === null ? 404 : 403).json({ message: p === null ? "Programme not found" : "Not authorised" }); const s = await Scenario.create({ ...req.body, programme: p._id, createdBy: req.user.id }); res.status(201).json({ scenario: s }); } catch (e) { res.status(400).json({ message: e.message }); } };
exports.updateScenario = async (req, res) => { try { const s = await Scenario.findById(req.params.scenarioId); if (!s) return res.status(404).json({ message: "Scenario not found" }); const p = await allowed(req, s.programme); if (!p) return res.status(403).json({ message: "Not authorised" });["title", "prompt", "type", "options", "correctResponses", "feedbackCorrect", "feedbackIncorrect", "order", "status"].forEach(k => { if (req.body[k] !== undefined) s[k] = req.body[k] }); s.updatedBy = req.user.id; await s.save(); res.json({ scenario: s }); } catch (e) { res.status(400).json({ message: e.message }); } };
exports.deleteScenario = async (req, res) => { try { const s = await Scenario.findById(req.params.scenarioId); if (!s) return res.status(404).json({ message: "Scenario not found" }); const p = await allowed(req, s.programme); if (!p) return res.status(403).json({ message: "Not authorised" }); s.status = "inactive"; s.updatedBy = req.user.id; await s.save(); res.json({ scenario: s }); } catch (e) { res.status(500).json({ message: "Unable to deactivate scenario" }); } };

exports.listQuestions = async (req, res) => { try { const p = await allowed(req, req.params.programmeId); if (!p) return res.status(p === null ? 404 : 403).json({ message: "Not authorised" }); const q = { programme: p._id }; if (req.query.level) q.level = req.query.level; res.json({ questions: await AssessmentQuestion.find(q).sort({ level: 1, order: 1 }) }); } catch (e) { res.status(500).json({ message: "Unable to load questions" }); } };
exports.createQuestion = async (req, res) => { try { const p = await allowed(req, req.params.programmeId); if (!p) return res.status(p === null ? 404 : 403).json({ message: "Not authorised" }); if (!req.body.options?.includes(req.body.correctAnswer)) return res.status(400).json({ message: "Correct answer must be one of the options" }); const q = await AssessmentQuestion.create({ ...req.body, programme: p._id, createdBy: req.user.id }); res.status(201).json({ question: q }); } catch (e) { res.status(400).json({ message: e.message }); } };
exports.updateQuestion = async (req, res) => { try { const q = await AssessmentQuestion.findById(req.params.questionId); if (!q) return res.status(404).json({ message: "Question not found" }); const p = await allowed(req, q.programme); if (!p) return res.status(403).json({ message: "Not authorised" });["level", "question", "options", "correctAnswer", "points", "feedback", "order", "status"].forEach(k => { if (req.body[k] !== undefined) q[k] = req.body[k] }); if (!q.options.includes(q.correctAnswer)) return res.status(400).json({ message: "Correct answer must be one of the options" }); q.updatedBy = req.user.id; await q.save(); res.json({ question: q }); } catch (e) { res.status(400).json({ message: e.message }); } };
exports.deleteQuestion = async (req, res) => { try { const q = await AssessmentQuestion.findById(req.params.questionId); if (!q) return res.status(404).json({ message: "Question not found" }); const p = await allowed(req, q.programme); if (!p) return res.status(403).json({ message: "Not authorised" }); q.status = "inactive"; q.updatedBy = req.user.id; await q.save(); res.json({ question: q }); } catch (e) { res.status(500).json({ message: "Unable to deactivate question" }); } };

exports.completeSection = async (req, res) => {
    try {
        const a = await assigned(req, req.params.programmeId);
        if (!a) return res.status(403).json({ message: "Programme is not assigned to you" });
        const gate = await traineeProgrammeGate(req.user.id, req.params.programmeId);
        if (!gate.programme) return res.status(404).json({ message: "Programme not found" });
        if (!gate.unlocked) return res.status(403).json({
            code: "PROGRAMME_LEVEL_LOCKED",
            message: "Complete and pass the previous programme level first.",
            levelAccess: gate.access,
        });

        const sec = await LearningSection.findOne({
            _id: req.params.sectionId,
            programme: req.params.programmeId,
            status: "active",
        });
        if (!sec) return res.status(404).json({ message: "Learning section not found" });

        // Record a completion only when Mark Complete is pressed. The unique
        // trainee+section index makes repeated clicks idempotent.
        try {
            await SectionCompletion.findOneAndUpdate(
                { trainee: req.user.id, section: sec._id },
                {
                    $setOnInsert: {
                        trainee: req.user.id,
                        section: sec._id,
                        programme: req.params.programmeId,
                        completedAt: new Date(),
                    },
                },
                { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
            );
        } catch (e) {
            // Safe retry/race handling: if another request inserted it first,
            // treat the section as completed instead of returning a 500.
            if (e?.code !== 11000) throw e;
        }

        const p = await syncLearningProgress(req, req.params.programmeId, a);
        res.json({ message: "Section completion recorded", progress: p });
    } catch (e) {
        console.error("completeSection failed:", e);
        res.status(500).json({ message: "Unable to record section completion" });
    }
};
exports.getTraineeProgress = async (req, res) => {
    try {
        const a = await assigned(req, req.params.programmeId);
        if (!a) return res.status(403).json({ message: "Programme is not assigned to you" });
        const gate = await traineeProgrammeGate(req.user.id, req.params.programmeId);
        if (!gate.programme) return res.status(404).json({ message: "Programme not found" });
        if (!gate.unlocked) return res.status(403).json({
            code: "PROGRAMME_LEVEL_LOCKED",
            message: "Complete and pass the previous programme level first.",
            levelAccess: gate.access,
        });
        const p = await syncLearningProgress(req, req.params.programmeId, a);
        res.json({
            progress: p,
            programmeLevel: gate.programmeLevel,
            assessmentLevel: gate.requiredAssessmentLevel,
            levelAccess: gate.access,
        });
    } catch (e) {
        console.error("getTraineeProgress failed:", e);
        res.status(500).json({ message: "Unable to load progress" });
    }
};

const createOrResumeScenarioAttempt = async (req, programmeId, assignment, progress) => {
    let attempt = await ScenarioAttempt.findOne({
        trainee: req.user.id,
        programme: programmeId,
        status: "in-progress",
    }).sort({ attemptNumber: -1 });

    if (attempt) return attempt;

    // If the current progression already has a completed scenario exercise,
    // return the latest submitted attempt for review instead of creating a new one.
    if (progress?.scenarioCompleted) {
        return ScenarioAttempt.findOne({
            trainee: req.user.id,
            programme: programmeId,
            status: "submitted",
        }).sort({ attemptNumber: -1 });
    }

    const scenarioRows = await Scenario.find({
        programme: programmeId,
        status: "active",
    }).sort({ order: 1 }).select("_id").lean();
    const scenarioIds = scenarioRows.map(row => row._id);

    if (!scenarioIds.length) return null;

    const prior = await ScenarioAttempt.countDocuments({
        trainee: req.user.id,
        programme: programmeId,
        status: "submitted",
    });

    return ScenarioAttempt.create({
        trainee: req.user.id,
        programme: programmeId,
        assignment: assignment._id,
        scenarioSet: scenarioIds,
        responses: [],
        status: "in-progress",
        score: 0,
        totalScenarios: scenarioIds.length,
        percentage: 0,
        attemptNumber: prior + 1,
        submittedAt: null,
    });
};

exports.getTraineeScenarios = async (req, res) => {
    try {
        const a = await assigned(req, req.params.programmeId);
        if (!a) return res.status(403).json({ message: "Programme is not assigned to you" });
        const gate = await traineeProgrammeGate(req.user.id, req.params.programmeId);
        if (!gate.programme) return res.status(404).json({ message: "Programme not found" });
        if (!gate.unlocked) return res.status(403).json({
            code: "PROGRAMME_LEVEL_LOCKED",
            message: "Complete and pass the previous programme level first.",
            levelAccess: gate.access,
        });

        const p = await syncLearningProgress(req, req.params.programmeId, a);
        if (!p.learningCompleted) {
            return res.status(403).json({
                code: "LEARNING_INCOMPLETE",
                message: "Complete all learning sections before starting the exercise.",
            });
        }

        const scenarios = await Scenario.find({
            programme: req.params.programmeId,
            status: "active",
        })
            .sort({ order: 1 })
            .select("title prompt type options order");

        const attempt = scenarios.length
            ? await createOrResumeScenarioAttempt(req, req.params.programmeId, a, p)
            : null;

        const attemptedScenarioIds = attempt
            ? (attempt.responses || []).map(x => String(x.scenario))
            : (p.completedScenarios || []).map(x => String(x));

        res.json({
            scenarios,
            scenarioAttemptId: attempt?._id || null,
            scenarioAttemptNumber: attempt?.attemptNumber || null,
            attemptedScenarioIds,
            scenarioCompleted: !!p.scenarioCompleted,
            exerciseSubmitted: attempt?.status === "submitted",
            resultAvailable: !!attempt?._id && attempt?.status === "submitted",
        });
    } catch (e) {
        console.error("getTraineeScenarios failed:", e);
        res.status(500).json({ message: "Unable to load scenarios" });
    }
};

exports.submitScenario = async (req, res) => {
    try {
        const a = await assigned(req, req.params.programmeId);
        if (!a) return res.status(403).json({ message: "Programme is not assigned to you" });
        const gate = await traineeProgrammeGate(req.user.id, req.params.programmeId);
        if (!gate.programme) return res.status(404).json({ message: "Programme not found" });
        if (!gate.unlocked) return res.status(403).json({
            code: "PROGRAMME_LEVEL_LOCKED",
            message: "Complete and pass the previous programme level first.",
            levelAccess: gate.access,
        });

        const p = await syncLearningProgress(req, req.params.programmeId, a);
        if (!p.learningCompleted) {
            return res.status(403).json({ message: "Complete learning first" });
        }

        const scenario = await Scenario.findOne({
            _id: req.params.scenarioId,
            programme: req.params.programmeId,
            status: "active",
        });
        if (!scenario) return res.status(404).json({ message: "Scenario not found" });

        const attempt = await ScenarioAttempt.findOne({
            _id: req.body.attemptId,
            trainee: req.user.id,
            programme: req.params.programmeId,
            status: "in-progress",
        });

        if (!attempt) {
            return res.status(404).json({
                message: "Scenario attempt not found or already finished. Re-open the Scenario Exercise.",
            });
        }

        if (!(attempt.scenarioSet || []).some(id => String(id) === String(scenario._id))) {
            return res.status(400).json({ message: "This scenario is not part of the current exercise attempt." });
        }

        if ((attempt.responses || []).some(x => String(x.scenario) === String(scenario._id))) {
            return res.status(409).json({
                code: "SCENARIO_ALREADY_ANSWERED",
                message: "This scenario response has already been recorded. Continue to the next scenario.",
            });
        }

        const submittedResponses = (Array.isArray(req.body.responses) ? req.body.responses : [req.body.response])
            .filter(Boolean)
            .map(x => String(x).trim());

        if (!submittedResponses.length) {
            return res.status(400).json({ message: "Choose a response before submitting." });
        }

        const normalizedGiven = submittedResponses.map(x => x.toLowerCase()).sort();
        const normalizedCorrect = (scenario.correctResponses || [])
            .map(x => String(x).trim().toLowerCase())
            .sort();

        const correct = normalizedGiven.length === normalizedCorrect.length
            && normalizedGiven.every((x, i) => x === normalizedCorrect[i]);

        attempt.responses.push({
            scenario: scenario._id,
            responses: submittedResponses,
            correct,
            answeredAt: new Date(),
        });

        const attemptedIds = new Set((attempt.responses || []).map(x => String(x.scenario)));
        const exerciseCompleted = (attempt.scenarioSet || []).length > 0
            && (attempt.scenarioSet || []).every(id => attemptedIds.has(String(id)));

        if (exerciseCompleted) {
            const score = (attempt.responses || []).filter(x => x.correct).length;
            const total = attempt.scenarioSet.length;
            attempt.score = score;
            attempt.totalScenarios = total;
            attempt.percentage = total ? Math.round((score / total) * 10000) / 100 : 0;
            attempt.status = "submitted";
            attempt.submittedAt = new Date();
        }

        await attempt.save();

        // Keep TrainingProgress compatible with the existing stage-gating rules.
        p.completedScenarios = [...attemptedIds];
        p.scenarioCompleted = exerciseCompleted;
        updateStage(p, gate.requiredAssessmentLevel);
        await p.save();

        // Intentionally do NOT reveal correctness here. Results are available
        // only after the entire exercise has been submitted.
        res.json({
            recorded: true,
            exerciseCompleted,
            attemptId: attempt._id,
            attemptNumber: attempt.attemptNumber,
            answeredCount: attempt.responses.length,
            totalScenarios: attempt.scenarioSet.length,
            progress: p,
        });
    } catch (e) {
        console.error("submitScenario failed:", e);
        res.status(500).json({ message: "Unable to submit scenario response" });
    }
};

exports.getScenarioAttemptResult = async (req, res) => {
    try {
        const attempt = await ScenarioAttempt.findOne({
            _id: req.params.attemptId,
            trainee: req.user.id,
            programme: req.params.programmeId,
            status: "submitted",
        }).lean();

        if (!attempt) {
            return res.status(404).json({ message: "Completed scenario result not found." });
        }

        const rows = await Scenario.find({
            _id: { $in: attempt.scenarioSet || [] },
            programme: req.params.programmeId,
        }).select("title prompt options correctResponses feedbackCorrect feedbackIncorrect order").lean();

        const byId = new Map(rows.map(row => [String(row._id), row]));
        const responseById = new Map((attempt.responses || []).map(row => [String(row.scenario), row]));

        const results = (attempt.scenarioSet || []).map(id => {
            const scenario = byId.get(String(id));
            const response = responseById.get(String(id));
            if (!scenario) return null;
            return {
                scenarioId: scenario._id,
                title: scenario.title,
                prompt: scenario.prompt,
                options: scenario.options || [],
                selectedResponses: response?.responses || [],
                correctResponses: scenario.correctResponses || [],
                correct: !!response?.correct,
                feedback: response?.correct ? scenario.feedbackCorrect : scenario.feedbackIncorrect,
            };
        }).filter(Boolean);

        res.json({
            attempt: {
                _id: attempt._id,
                attemptNumber: attempt.attemptNumber,
                score: attempt.score,
                totalScenarios: attempt.totalScenarios,
                percentage: attempt.percentage,
                submittedAt: attempt.submittedAt,
            },
            results,
        });
    } catch (e) {
        console.error("getScenarioAttemptResult failed:", e);
        res.status(500).json({ message: "Unable to load scenario result." });
    }
};

const eligible = async (req, programmeId, level) => {
    const normalizedLevel = normalizeLevel(level);
    const a = await assigned(req, programmeId);
    if (!a) return { error: [403, "Programme is not assigned to you"] };

    const gate = await traineeProgrammeGate(req.user.id, programmeId);
    if (!gate.programme) return { error: [404, "Programme not found"] };
    if (!gate.unlocked) return { error: [403, "Complete and pass the previous programme level first"] };

    // The trainee can only take the assessment that belongs to the current
    // programme level. This prevents a Beginner programme from exposing the
    // Intermediate/High assessment tabs and prevents URL/API bypasses.
    if (normalizedLevel !== gate.requiredAssessmentLevel) {
        return {
            error: [403, `${gate.programmeLevel[0].toUpperCase()}${gate.programmeLevel.slice(1)} training only allows its ${gate.requiredAssessmentLevel} assessment.`],
        };
    }

    const p = await syncLearningProgress(req, programmeId, a);

    // Every assessment attempt must come after THIS programme level's learning
    // and scenario. A failed attempt resets those two gates before a retry.
    if (!p.learningCompleted) return { error: [403, "Complete all learning sections first"] };
    const sc = await Scenario.countDocuments({ programme: programmeId, status: "active" });
    if (sc > 0 && !p.scenarioCompleted) return { error: [403, "Complete the scenario exercise first"] };
    return {
        a,
        p,
        programme: gate.programme,
        programmeLevel: gate.programmeLevel,
        requiredAssessmentLevel: gate.requiredAssessmentLevel,
        levelAccess: gate.access,
    };
};

const createOrResumeAssessmentAttempt = async (req, programmeId, level, assignment) => {
    const normalizedLevel = normalizeLevel(level);
    let attempt = await AssessmentAttempt.findOne({
        trainee: req.user.id,
        programme: programmeId,
        level: normalizedLevel,
        status: "in-progress",
    }).sort({ attemptNumber: -1 });

    const pool = await AssessmentQuestion.find({
        programme: programmeId,
        level: normalizedLevel,
        status: "active",
    }).select("_id points").lean();
    if (!pool.length) return null;

    if (attempt) {
        // Repair an older in-progress attempt that may have been created when
        // the programme only had a very small question pool. Keep any existing
        // answers, add new question IDs only, and recalculate the total points.
        if ((attempt.questionSet || []).length < Math.min(ASSESSMENT_QUESTION_LIMIT, pool.length)) {
            const currentIds = new Set((attempt.questionSet || []).map(String));
            const additions = shuffle(pool.filter(q => !currentIds.has(String(q._id))))
                .slice(0, ASSESSMENT_QUESTION_LIMIT - currentIds.size);
            attempt.questionSet.push(...additions.map(q => q._id));
            const pointById = new Map(pool.map(q => [String(q._id), Number(q.points || 1)]));
            attempt.totalPoints = attempt.questionSet.reduce((sum, id) => sum + (pointById.get(String(id)) || 1), 0);
            await attempt.save();
        }
        return attempt;
    }

    const selected = shuffle(pool).slice(0, Math.min(ASSESSMENT_QUESTION_LIMIT, pool.length));
    const prior = await AssessmentAttempt.countDocuments({
        trainee: req.user.id,
        programme: programmeId,
        level: normalizedLevel,
        status: { $ne: "in-progress" },
    });

    attempt = await AssessmentAttempt.create({
        trainee: req.user.id,
        programme: programmeId,
        assignment: assignment._id,
        level: normalizedLevel,
        questionSet: selected.map(q => q._id),
        answers: [],
        status: "in-progress",
        score: 0,
        totalPoints: selected.reduce((sum, q) => sum + Number(q.points || 1), 0),
        percentage: 0,
        passed: false,
        attemptNumber: prior + 1,
        submittedAt: null,
    });
    return attempt;
};

exports.getAssessment = async (req, res) => {
    try {
        const level = normalizeLevel(req.params.level);
        const e = await eligible(req, req.params.programmeId, level);
        if (e.error) return res.status(e.error[0]).json({ code: "LEVEL_LOCKED", message: e.error[1] });

        // Top up the active question pool to the required minimum before a
        // new attempt is generated. Existing admin/trainer questions are kept.
        const bankProgramme = await TrainingProgramme.findById(req.params.programmeId)
            .select("_id programmeType level createdBy owner")
            .lean();
        if (bankProgramme) await ensureAssessmentQuestionBank(bankProgramme, bankProgramme.createdBy || bankProgramme.owner);

        const attempt = await createOrResumeAssessmentAttempt(req, req.params.programmeId, level, e.a);
        if (!attempt) return res.status(404).json({ message: "No active questions are available for this level" });

        const rows = await AssessmentQuestion.find({ _id: { $in: attempt.questionSet } })
            .select("question options points order")
            .lean();
        const byId = new Map(rows.map(q => [String(q._id), q]));
        const questions = attempt.questionSet
            .map(id => byId.get(String(id)))
            .filter(Boolean)
            .map(q => ({
                ...q,
                // Option order is shuffled for every attempt and stays stable
                // while that attempt is in progress. The correct answer is
                // stored as text, so grading is independent of A/B/C/D position.
                options: seededShuffle(q.options || [], `${attempt._id}:${q._id}`),
            }));
        const answered = (attempt.answers || []).map(a => ({
            questionId: String(a.question),
            answer: a.answer,
        }));

        res.json({
            level,
            attemptId: attempt._id,
            attemptNumber: attempt.attemptNumber,
            questionLimit: ASSESSMENT_QUESTION_LIMIT,
            minimumPoolSize: MIN_QUESTIONS_PER_LEVEL,
            poolSize: await AssessmentQuestion.countDocuments({ programme: req.params.programmeId, level, status: "active" }),
            poolRule: `${ASSESSMENT_QUESTION_LIMIT} questions are randomly selected from a pool of at least ${MIN_QUESTIONS_PER_LEVEL} active questions for each attempt. Question and option order vary between attempts.`,
            questions,
            answered,
        });
    } catch (e) {
        console.error("getAssessment failed:", e);
        res.status(500).json({ message: "Unable to load assessment" });
    }
};

exports.checkAssessmentAnswer = async (req, res) => {
    try {
        const level = normalizeLevel(req.params.level);
        const e = await eligible(req, req.params.programmeId, level);
        if (e.error) return res.status(e.error[0]).json({ code: "LEVEL_LOCKED", message: e.error[1] });

        const attempt = await AssessmentAttempt.findOne({
            _id: req.body.attemptId,
            trainee: req.user.id,
            programme: req.params.programmeId,
            level,
            status: "in-progress",
        });
        if (!attempt) return res.status(404).json({ message: "Assessment attempt not found or already finished" });
        if (!(attempt.questionSet || []).some(id => String(id) === String(req.params.questionId))) {
            return res.status(400).json({ message: "This question is not part of the current assessment attempt" });
        }
        if ((attempt.answers || []).some(a => String(a.question) === String(req.params.questionId))) {
            return res.status(409).json({ code: "QUESTION_ALREADY_ANSWERED", message: "You already submitted a response for this question. Move to the next question." });
        }

        const q = await AssessmentQuestion.findOne({
            _id: req.params.questionId,
            programme: req.params.programmeId,
            level,
            status: "active",
        });
        if (!q) return res.status(404).json({ message: "Assessment question not found" });

        const answer = String(req.body.answer ?? "");
        if (!q.options.includes(answer)) return res.status(400).json({ message: "Select one of the available options" });

        const correct = answer === q.correctAnswer;
        attempt.answers.push({
            question: q._id,
            answer,
            correct,
            pointsAwarded: correct ? q.points : 0,
            answeredAt: new Date(),
        });
        await attempt.save();

        // Do not reveal whether the response is correct while the assessment
        // is still running. Correct answers are released only in the submitted
        // attempt result view.
        res.json({
            recorded: true,
            answeredCount: attempt.answers.length,
            totalQuestions: attempt.questionSet.length,
        });
    } catch (e) {
        console.error("checkAssessmentAnswer failed:", e);
        res.status(500).json({ message: "Unable to check assessment response" });
    }
};

exports.submitAssessment = async (req, res) => {
    try {
        const level = normalizeLevel(req.params.level);
        const e = await eligible(req, req.params.programmeId, level);
        if (e.error) return res.status(e.error[0]).json({ code: "LEVEL_LOCKED", message: e.error[1] });

        const programme = e.programme;
        const attempt = await AssessmentAttempt.findOne({
            _id: req.body.attemptId,
            trainee: req.user.id,
            programme: req.params.programmeId,
            level,
            status: "in-progress",
        });
        if (!attempt) return res.status(404).json({ message: "Assessment attempt not found or already submitted" });

        if ((attempt.answers || []).length !== (attempt.questionSet || []).length) {
            return res.status(400).json({ message: "Answer every question once before finishing the assessment" });
        }

        const score = (attempt.answers || []).reduce((sum, a) => sum + Number(a.pointsAwarded || 0), 0);
        const total = Number(attempt.totalPoints || 0);
        const percentage = total ? Math.round((score / total) * 10000) / 100 : 0;
        const passed = percentage >= programme.passMark;

        attempt.score = score;
        attempt.percentage = percentage;
        attempt.passed = passed;
        attempt.passMark = Number(programme.passMark || 0);
        attempt.status = "submitted";
        attempt.submittedAt = new Date();
        await attempt.save();

        if (passed) {
            if (level === "basic") e.p.basicPassed = true;
            if (level === "intermediate") e.p.intermediatePassed = true;
            if (level === "high") e.p.highPassed = true;
            if (e.p.retryRequiredLevel === level) e.p.retryRequiredLevel = null;
            updateStage(e.p, e.requiredAssessmentLevel);
            await e.p.save();
        } else {
            // Failed attempt: the trainee must relearn the programme and redo
            // its scenario exercise before another randomized quiz attempt.
            await SectionCompletion.deleteMany({ trainee: req.user.id, programme: req.params.programmeId });
            e.p.completedSections = [];
            e.p.learningCompleted = false;
            e.p.completedScenarios = [];
            e.p.scenarioCompleted = false;
            e.p.retryRequiredLevel = level;
            e.p.currentStage = "learning";
            e.p.status = "in-progress";
            e.p.progress = 0;
            e.p.completedAt = null;
            await e.p.save();
        }

        const updatedLevelAccess = passed
            ? await getModuleLevelAccess(req.user.id, programme.programmeType)
            : e.levelAccess;

        res.status(201).json({
            attempt: {
                _id: attempt._id,
                level,
                score,
                totalPoints: total,
                percentage,
                passed,
                attemptNumber: attempt.attemptNumber,
            },
            programmeLevel: e.programmeLevel,
            progress: e.p,
            levelAccess: updatedLevelAccess,
            relearnRequired: !passed,
        });
    } catch (err) {
        console.error("submitAssessment failed:", err);
        res.status(500).json({ message: "Unable to submit assessment" });
    }
};


exports.getAssessmentAttemptResult = async (req, res) => {
    try {
        const level = normalizeLevel(req.params.level);
        const attempt = await AssessmentAttempt.findOne({
            _id: req.params.attemptId,
            trainee: req.user.id,
            programme: req.params.programmeId,
            level,
            status: "submitted",
        }).lean();

        if (!attempt) {
            return res.status(404).json({ message: "Completed assessment result not found." });
        }

        const questionIds = (attempt.questionSet || []).length
            ? attempt.questionSet
            : (attempt.answers || []).map(row => row.question);

        const rows = await AssessmentQuestion.find({
            _id: { $in: questionIds },
            programme: req.params.programmeId,
            level,
        }).select("question options correctAnswer feedback points order").lean();

        const byId = new Map(rows.map(row => [String(row._id), row]));
        const answerById = new Map((attempt.answers || []).map(row => [String(row.question), row]));

        const results = questionIds.map(id => {
            const question = byId.get(String(id));
            const answer = answerById.get(String(id));
            if (!question) return null;
            return {
                questionId: question._id,
                question: question.question,
                options: question.options || [],
                selectedAnswer: answer?.answer || "",
                correctAnswer: question.correctAnswer,
                correct: !!answer?.correct,
                pointsAwarded: Number(answer?.pointsAwarded || 0),
                points: Number(question.points || 1),
                feedback: question.feedback || "",
            };
        }).filter(Boolean);

        res.json({
            attempt: {
                _id: attempt._id,
                level: attempt.level,
                score: attempt.score,
                totalPoints: attempt.totalPoints,
                percentage: attempt.percentage,
                passed: attempt.passed,
                attemptNumber: attempt.attemptNumber,
                submittedAt: attempt.submittedAt,
            },
            results,
        });
    } catch (e) {
        console.error("getAssessmentAttemptResult failed:", e);
        res.status(500).json({ message: "Unable to load assessment result." });
    }
};

exports.getMyResults = async (req, res) => {
    try {
        res.json({
            attempts: await AssessmentAttempt.find({ trainee: req.user.id, status: { $ne: "in-progress" } })
                .populate("programme", "title programmeType level passMark")
                .sort({ submittedAt: -1, createdAt: -1 }),
        });
    } catch (e) {
        res.status(500).json({ message: "Unable to load results" });
    }
};

const TrainingProgramme = require("../models/TrainingProgramme");
const TrainingAssignment = require("../models/TrainingAssignment");
const LearningSection = require("../models/LearningSection");
const TrainingProgress = require("../models/TrainingProgress");
const Scenario = require("../models/Scenario");
const AssessmentQuestion = require("../models/AssessmentQuestion");
const AssessmentAttempt = require("../models/AssessmentAttempt");
const SectionCompletion = require("../models/SectionCompletion");
const { getOrCreateProgrammeProgress } = require("../services/trainingProgressService");

const allowed = async (req, programmeId) => {
    const p = await TrainingProgramme.findById(programmeId);
    if (!p) return null;
    if (req.user.role === "admin") return p;
    const uid = String(req.user.id);
    if (req.user.role === "trainer" && (String(p.owner) === uid || (p.authorizedTrainers || []).some(x => String(x) === uid))) return p;
    return false;
};
const assigned = async (req, programmeId) => TrainingAssignment.findOne({ programme: programmeId, trainee: req.user.id, status: "active" });
const getProgress = async (req, programmeId, assignment) => {
    return getOrCreateProgrammeProgress({
        traineeId: req.user.id,
        programmeId,
        assignmentId: assignment._id,
    });
};
const updateStage = (p) => {
    // A failed assessment sends the trainee back through learning + scenario
    // before another attempt at that same assessment level.
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
        p.currentStage = p.retryRequiredLevel;
        p.progress = Math.max(Number(p.progress || 0), 50);
        return;
    }

    if (p.highPassed) {
        p.currentStage = "completed";
        p.status = "completed";
        p.progress = 100;
        p.completedAt = p.completedAt || new Date();
    } else if (p.intermediatePassed) {
        p.currentStage = "high";
        p.progress = Math.max(Number(p.progress || 0), 80);
    } else if (p.basicPassed) {
        p.currentStage = "intermediate";
        p.progress = Math.max(Number(p.progress || 0), 65);
    } else if (p.scenarioCompleted) {
        p.currentStage = "basic";
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

const ASSESSMENT_QUESTION_LIMIT = 10;
const normalizeLevel = (value) => String(value || "").toLowerCase();

// SectionCompletion is the source of truth for learning ticks. This prevents
// stale completedSections arrays from showing sections as complete before the
// trainee actually presses Mark Complete.
const syncLearningProgress = async (req, programmeId, assignment, progress = null) => {
    const p = progress || await getProgress(req, programmeId, assignment);
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
    updateStage(p);
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
exports.getTraineeProgress = async (req, res) => { try { const a = await assigned(req, req.params.programmeId); if (!a) return res.status(403).json({ message: "Programme is not assigned to you" }); const p = await syncLearningProgress(req, req.params.programmeId, a); res.json({ progress: p }); } catch (e) { console.error("getTraineeProgress failed:", e); res.status(500).json({ message: "Unable to load progress" }); } };
exports.getTraineeScenarios = async (req, res) => {
    try {
        const a = await assigned(req, req.params.programmeId);
        if (!a) return res.status(403).json({ message: "Programme is not assigned to you" });
        const p = await syncLearningProgress(req, req.params.programmeId, a);
        if (!p.learningCompleted) {
            return res.status(403).json({ code: "LEARNING_INCOMPLETE", message: "Complete all learning sections before starting the exercise." });
        }
        const scenarios = await Scenario.find({ programme: req.params.programmeId, status: "active" })
            .sort({ order: 1 })
            .select("title prompt type options order");
        const attemptedScenarioIds = (p.completedScenarios || []).map(x => String(x));
        res.json({ scenarios, attemptedScenarioIds, scenarioCompleted: !!p.scenarioCompleted });
    } catch (e) {
        console.error("getTraineeScenarios failed:", e);
        res.status(500).json({ message: "Unable to load scenarios" });
    }
};

exports.submitScenario = async (req, res) => {
    try {
        const a = await assigned(req, req.params.programmeId);
        if (!a) return res.status(403).json({ message: "Programme is not assigned to you" });

        const p = await syncLearningProgress(req, req.params.programmeId, a);
        if (!p.learningCompleted) return res.status(403).json({ message: "Complete learning first" });

        const scenario = await Scenario.findOne({
            _id: req.params.scenarioId,
            programme: req.params.programmeId,
            status: "active",
        });
        if (!scenario) return res.status(404).json({ message: "Scenario not found" });

        const alreadyAttempted = (p.completedScenarios || []).some(x => String(x) === String(scenario._id));
        if (alreadyAttempted) {
            return res.status(409).json({ code: "SCENARIO_ALREADY_ANSWERED", message: "This scenario has already been answered for the current attempt." });
        }

        const given = (Array.isArray(req.body.responses) ? req.body.responses : [req.body.response])
            .filter(Boolean)
            .map(x => String(x).trim().toLowerCase())
            .sort();
        const correct = (scenario.correctResponses || [])
            .map(x => String(x).trim().toLowerCase())
            .sort();
        const ok = given.length === correct.length && given.every((x, i) => x === correct[i]);

        // A scenario question has one attempt only. Correct or incorrect, it is
        // marked as answered so the trainee moves forward instead of retrying it.
        const attempted = new Set((p.completedScenarios || []).map(x => String(x)));
        attempted.add(String(scenario._id));
        p.completedScenarios = [...attempted];

        const activeScenarioIds = await Scenario.find({
            programme: req.params.programmeId,
            status: "active",
        }).distinct("_id");
        const activeIds = new Set(activeScenarioIds.map(x => String(x)));
        p.scenarioCompleted = activeIds.size > 0 && [...activeIds].every(id => attempted.has(id));

        updateStage(p);
        await p.save();

        res.json({
            correct: ok,
            feedback: ok ? scenario.feedbackCorrect : scenario.feedbackIncorrect,
            progress: p,
            scenarioCompleted: p.scenarioCompleted,
        });
    } catch (e) {
        console.error("submitScenario failed:", e);
        res.status(500).json({ message: "Unable to submit scenario" });
    }
};

const eligible = async (req, programmeId, level) => {
    const normalizedLevel = normalizeLevel(level);
    const a = await assigned(req, programmeId);
    if (!a) return { error: [403, "Programme is not assigned to you"] };
    const p = await syncLearningProgress(req, programmeId, a);

    // Every assessment attempt must come after learning. When a trainee fails,
    // learning/scenario are reset so the same checks force a relearn before retry.
    if (!p.learningCompleted) return { error: [403, "Complete all learning sections first"] };
    const sc = await Scenario.countDocuments({ programme: programmeId, status: "active" });
    if (sc > 0 && !p.scenarioCompleted) return { error: [403, "Complete the scenario exercise first"] };
    if (normalizedLevel === "intermediate" && !p.basicPassed) return { error: [403, "Pass Basic before starting Intermediate"] };
    if (normalizedLevel === "high" && !p.intermediatePassed) return { error: [403, "Pass Intermediate before starting High"] };
    return { a, p };
};

const createOrResumeAssessmentAttempt = async (req, programmeId, level, assignment) => {
    const normalizedLevel = normalizeLevel(level);
    let attempt = await AssessmentAttempt.findOne({
        trainee: req.user.id,
        programme: programmeId,
        level: normalizedLevel,
        status: "in-progress",
    }).sort({ attemptNumber: -1 });

    if (attempt) return attempt;

    const pool = await AssessmentQuestion.find({
        programme: programmeId,
        level: normalizedLevel,
        status: "active",
    }).select("_id points").lean();
    if (!pool.length) return null;

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

        const attempt = await createOrResumeAssessmentAttempt(req, req.params.programmeId, level, e.a);
        if (!attempt) return res.status(404).json({ message: "No active questions are available for this level" });

        const rows = await AssessmentQuestion.find({ _id: { $in: attempt.questionSet } })
            .select("question options points order")
            .lean();
        const byId = new Map(rows.map(q => [String(q._id), q]));
        const questions = attempt.questionSet.map(id => byId.get(String(id))).filter(Boolean);
        const answered = (attempt.answers || []).map(a => ({
            questionId: String(a.question),
            answer: a.answer,
            correct: !!a.correct,
            pointsAwarded: Number(a.pointsAwarded || 0),
        }));

        res.json({
            level,
            attemptId: attempt._id,
            attemptNumber: attempt.attemptNumber,
            questionLimit: ASSESSMENT_QUESTION_LIMIT,
            poolRule: `Up to ${ASSESSMENT_QUESTION_LIMIT} questions are randomly selected for each attempt.`,
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

        res.json({
            correct,
            feedback: q.feedback || (correct ? "Correct response." : "Incorrect. Review the explanation, then continue to the next question."),
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

        const programme = await TrainingProgramme.findById(req.params.programmeId);
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
        attempt.status = "submitted";
        attempt.submittedAt = new Date();
        await attempt.save();

        if (passed) {
            if (level === "basic") e.p.basicPassed = true;
            if (level === "intermediate") e.p.intermediatePassed = true;
            if (level === "high") e.p.highPassed = true;
            if (e.p.retryRequiredLevel === level) e.p.retryRequiredLevel = null;
            updateStage(e.p);
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
            progress: e.p,
            relearnRequired: !passed,
        });
    } catch (err) {
        console.error("submitAssessment failed:", err);
        res.status(500).json({ message: "Unable to submit assessment" });
    }
};

exports.getMyResults = async (req, res) => {
    try {
        res.json({
            attempts: await AssessmentAttempt.find({ trainee: req.user.id, status: { $ne: "in-progress" } })
                .populate("programme", "title programmeType")
                .sort({ submittedAt: -1 }),
        });
    } catch (e) {
        res.status(500).json({ message: "Unable to load results" });
    }
};

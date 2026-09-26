const mongoose = require("mongoose");

const TrainingAssignment = require("../models/TrainingAssignment");
const TrainingProgramme = require("../models/TrainingProgramme");
const LearningSection = require("../models/LearningSection");
const { getModuleLevelAccess, normalize, normalizeProgrammeLevel, sortProgrammeCandidates, syncUnlockedProgressionAssignments } = require("../services/traineeLevelProgressService");
const { ensureStarterTrainingContent } = require("../services/starterTrainingContent");


// ======================================================
// HELPER
// ======================================================

const isValidObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(value);
};

const getLevelPeerProgrammes = async (programme) => {
    const rows = await TrainingProgramme.find({
        programmeType: programme.programmeType,
        status: "active",
        deletedAt: null,
    })
        .select("_id programmeType title shortDescription description learningObjectives level passMark owner createdBy createdAt status")
        .lean();

    const level = normalizeProgrammeLevel(programme.level);
    return sortProgrammeCandidates(
        rows.filter((row) => normalizeProgrammeLevel(row.level) === level)
    );
};

const buildTopicContent = (programme) => {
    const parts = [];
    if (programme.shortDescription) parts.push(programme.shortDescription);
    if (programme.description && programme.description !== programme.shortDescription) parts.push(programme.description);
    if (programme.learningObjectives) parts.push(`Learning objectives:\n${programme.learningObjectives}`);
    return parts.filter(Boolean).join("\n\n") || `Learn the key requirements for ${programme.title}.`;
};

// Older data sometimes stored each Intermediate/Advanced learning topic as a
// separate TrainingProgramme. For the trainee pathway those records are one
// LEVEL, not five separate assessments. The oldest programme is the canonical
// level container. Missing topic content is safely converted into Learning
// Sections under that container, while the original programme records remain
// untouched for admin/trainer history.
const ensureCanonicalLevelContentInternal = async (programme) => {
    const peers = await getLevelPeerProgrammes(programme);
    const primary = peers[0] || programme.toObject?.() || programme;
    const isPrimary = String(primary._id) === String(programme._id);
    if (!isPrimary) return { primary, peers, isPrimary, sections: [] };

    let sections = await LearningSection.find({ programme: primary._id, status: "active" })
        .sort({ order: 1, createdAt: 1 });

    const actor = primary.createdBy || primary.owner;

    if (peers.length > 1 && actor) {
        const existingTitles = new Set(sections.map((section) => String(section.title || "").trim().toLowerCase()));
        let nextOrder = sections.reduce((max, section) => Math.max(max, Number(section.order || 0)), 0) + 1;

        for (const peer of peers) {
            const peerIsPrimary = String(peer._id) === String(primary._id);
            const peerSections = peerIsPrimary
                ? sections
                : await LearningSection.find({ programme: peer._id, status: "active" }).sort({ order: 1, createdAt: 1 }).lean();

            if (peerIsPrimary && peerSections.length) continue;

            const key = String(peer.title || "").trim().toLowerCase();
            if (!key || existingTitles.has(key)) continue;

            const peerSectionContent = peerSections.length
                ? peerSections.map((section) => [section.title, section.content].filter(Boolean).join("\n")).join("\n\n")
                : buildTopicContent(peer);
            const firstPeerSection = peerSections[0] || null;
            const order = nextOrder++;
            try {
                await LearningSection.create({
                    programme: primary._id,
                    title: peer.title,
                    content: peerSectionContent,
                    imageUrl: firstPeerSection?.imageUrl || "",
                    imageAltText: firstPeerSection?.imageAltText || "",
                    order,
                    status: "active",
                    createdBy: actor,
                });
            } catch (error) {
                if (error?.code !== 11000) throw error;
            }
            existingTitles.add(key);
        }
    }

    // For a normal single-programme level, this produces the same starter
    // learning/scenario/assessment pathway used by Beginner. For a repaired
    // multi-row level, the synthesized topic sections already exist, so this
    // only fills a missing Scenario and Assessment without replacing content.
    await ensureStarterTrainingContent(primary, actor);

    sections = await LearningSection.find({ programme: primary._id, status: "active" })
        .select("_id title content imageUrl imageAltText order status")
        .sort({ order: 1, createdAt: 1 });

    return { primary, peers, isPrimary, sections };
};

const levelContentJobs = new Map();
const ensureCanonicalLevelContent = async (programme) => {
    const key = String(programme?._id || "unknown");
    if (levelContentJobs.has(key)) return levelContentJobs.get(key);

    const job = ensureCanonicalLevelContentInternal(programme);
    levelContentJobs.set(key, job);
    try {
        return await job;
    } finally {
        levelContentJobs.delete(key);
    }
};


// ======================================================
// VERIFY TRAINEE ACCESS
// ======================================================

const getActiveAssignment = async (
    programmeId,
    traineeId
) => {
    const programme = await TrainingProgramme.findById(programmeId)
        .select("programmeType")
        .lean();

    if (programme?.programmeType) {
        await syncUnlockedProgressionAssignments(traineeId, programme.programmeType);
    }

    return TrainingAssignment.findOne({
        programme: programmeId,
        trainee: traineeId,
        status: "active",
    });
};



// ======================================================
// MODULE LEVEL PROGRESSION
// Shared with the Training Content activity controller so the level card and the
// protected programme routes always use the same unlock rule.
// ======================================================
const verifyProgrammeLevelUnlocked = async (traineeId, programme) => {
    const access = await getModuleLevelAccess(traineeId, programme.programmeType);
    const level = normalizeProgrammeLevel(programme.level);
    return {
        level,
        access,
        unlocked: !!access[level]?.unlocked,
    };
};

// ======================================================
// GET MY TRAINING PROGRAMMES
// TRAINEE ONLY
// ======================================================

const getMyTrainingProgrammes = async (
    req,
    res
) => {
    try {
        // Repair/synchronise next-level assignments before loading the list so
        // a trainee who already passed Beginner immediately receives the active
        // Intermediate programme(s) in the same response.
        await syncUnlockedProgressionAssignments(req.user.id);

        const assignments =
            await TrainingAssignment.find({
                trainee: req.user.id,
                status: "active",
            })
                .sort({
                    assignedAt: -1,
                })
                .populate({
                    path: "programme",

                    match: {
                        status: "active",
                    },

                    select:
                        "programmeType title shortDescription description learningObjectives passMark level status owner createdAt updatedAt",

                    populate: {
                        path: "owner",

                        select:
                            "firstName lastName username",
                    },
                })
                .populate(
                    "assignedBy",
                    "firstName lastName username role"
                );


        const availableAssignments =
            assignments.filter(
                (assignment) =>
                    assignment.programme
            );


        const moduleTypes = [...new Set(availableAssignments.map(a => normalize(a.programme?.programmeType)).filter(Boolean))];
        const levelAccess = {};
        for (const type of moduleTypes) levelAccess[type] = await getModuleLevelAccess(req.user.id, type);

        return res.status(200).json({
            assignments: availableAssignments,
            levelAccess,
        });

    } catch (error) {
        console.error(
            "Get my training programmes error:",
            error
        );


        return res.status(500).json({
            code:
                "MY_TRAINING_LOAD_FAILED",

            message:
                "Unable to load your assigned training programmes.",
        });
    }
};


// ======================================================
// GET ONE ASSIGNED PROGRAMME
// TRAINEE ONLY
// ======================================================

const getMyTrainingProgramme = async (
    req,
    res
) => {
    try {
        const {
            programmeId,
        } = req.params;


        if (
            !isValidObjectId(
                programmeId
            )
        ) {
            return res.status(400).json({
                code:
                    "INVALID_PROGRAMME_ID",

                message:
                    "Invalid training programme.",
            });
        }


        // ==================================================
        // VERIFY ASSIGNMENT
        // ==================================================

        const assignment =
            await getActiveAssignment(
                programmeId,
                req.user.id
            );


        if (!assignment) {
            return res.status(403).json({
                code:
                    "TRAINING_NOT_ASSIGNED",

                message:
                    "This training programme is not assigned to you.",
            });
        }


        // ==================================================
        // GET PROGRAMME
        // ==================================================

        const programme =
            await TrainingProgramme
                .findOne({
                    _id:
                        programmeId,

                    status:
                        "active",
                })
                .populate(
                    "owner",
                    "firstName lastName username"
                );


        if (!programme) {
            return res.status(404).json({
                code:
                    "PROGRAMME_NOT_AVAILABLE",

                message:
                    "This training programme is currently unavailable.",
            });
        }


        const gate = await verifyProgrammeLevelUnlocked(req.user.id, programme);
        if (!gate.unlocked) {
            return res.status(403).json({
                code: "PROGRAMME_LEVEL_LOCKED",
                message: "Complete and pass the previous programme level before opening this programme.",
                level: gate.level,
                levelAccess: gate.access,
            });
        }

        const levelPeers = await getLevelPeerProgrammes(programme);
        const canonicalProgramme = levelPeers[0] || programme;
        const canonicalProgrammeId = canonicalProgramme?._id || programme._id;

        // ==================================================
        // SECTION COUNT
        // ==================================================

        const sectionCount =
            await LearningSection.countDocuments({
                programme:
                    canonicalProgrammeId,

                status:
                    "active",
            });


        return res.status(200).json({
            programme,
            canonicalProgrammeId,

            assignment: {
                _id:
                    assignment._id,

                assignedAt:
                    assignment.assignedAt,

                status:
                    assignment.status,
            },

            sectionCount,
            levelAccess: gate.access,
        });

    } catch (error) {
        console.error(
            "Get my training programme error:",
            error
        );


        return res.status(500).json({
            code:
                "MY_TRAINING_PROGRAMME_LOAD_FAILED",

            message:
                "Unable to load the training programme.",
        });
    }
};


// ======================================================
// GET ACTIVE LEARNING SECTIONS
// TRAINEE ONLY
// ======================================================

const getMyTrainingSections = async (
    req,
    res
) => {
    try {
        const {
            programmeId,
        } = req.params;


        if (
            !isValidObjectId(
                programmeId
            )
        ) {
            return res.status(400).json({
                code:
                    "INVALID_PROGRAMME_ID",

                message:
                    "Invalid training programme.",
            });
        }


        // ==================================================
        // VERIFY ACTIVE ASSIGNMENT
        // ==================================================

        const assignment =
            await getActiveAssignment(
                programmeId,
                req.user.id
            );


        if (!assignment) {
            return res.status(403).json({
                code:
                    "TRAINING_NOT_ASSIGNED",

                message:
                    "This training programme is not assigned to you.",
            });
        }


        // ==================================================
        // VERIFY ACTIVE PROGRAMME
        // ==================================================

        const programme =
            await TrainingProgramme
                .findOne({
                    _id:
                        programmeId,

                    status:
                        "active",
                })
                .select(
                    "_id programmeType title shortDescription description learningObjectives passMark level status owner createdBy createdAt"
                )
                .populate(
                    "owner",
                    "firstName lastName username"
                );


        if (!programme) {
            return res.status(404).json({
                code:
                    "PROGRAMME_NOT_AVAILABLE",

                message:
                    "This training programme is currently unavailable.",
            });
        }


        // ==================================================
        // ONLY ACTIVE SECTIONS
        // ORDERED BY ORDER
        // ==================================================

        const gate = await verifyProgrammeLevelUnlocked(req.user.id, programme);
        if (!gate.unlocked) return res.status(403).json({ code: "PROGRAMME_LEVEL_LOCKED", message: "Complete and pass the previous programme level first.", level: gate.level, levelAccess: gate.access });

        const levelContent = await ensureCanonicalLevelContent(programme);

        // A stale URL may still point at one of the old same-level topic
        // programme records. Tell the frontend which single programme now owns
        // the level pathway so completion, scenario and assessment all use the
        // same progress record.
        if (!levelContent.isPrimary) {
            return res.status(200).json({
                programme,
                canonicalProgrammeId: levelContent.primary?._id || programme._id,
                sections: [],
            });
        }

        return res.status(200).json({
            programme,
            canonicalProgrammeId: levelContent.primary?._id || programme._id,
            sections: levelContent.sections,
        });

    } catch (error) {
        console.error(
            "Get my training sections error:",
            error
        );


        return res.status(500).json({
            code:
                "MY_TRAINING_SECTIONS_LOAD_FAILED",

            message:
                "Unable to load the learning sections.",
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    getMyTrainingProgrammes,
    getMyTrainingProgramme,
    getMyTrainingSections,
};
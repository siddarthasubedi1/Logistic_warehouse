const TrainingAssignment = require("../models/TrainingAssignment");
const TrainingProgramme = require("../models/TrainingProgramme");
const AssessmentAttempt = require("../models/AssessmentAttempt");
const TrainingProgress = require("../models/TrainingProgress");
const User = require("../models/User");

const LEVEL_ORDER = ["beginner", "intermediate", "advanced"];
const ASSESSMENT_LEVEL_BY_PROGRAMME_LEVEL = {
    beginner: "basic",
    intermediate: "intermediate",
    advanced: "high",
};

const normalize = (value) => String(value || "").trim().toLowerCase();

// Older project versions used Easy / Medium / High for programme levels.
// Keep those database records compatible with the current
// Beginner / Intermediate / Advanced terminology.
const normalizeProgrammeLevel = (value) => {
    const level = normalize(value);
    return ({
        easy: "beginner",
        basic: "beginner",
        beginner: "beginner",
        medium: "intermediate",
        intermediate: "intermediate",
        high: "advanced",
        advanced: "advanced",
    }[level] || level || "beginner");
};

const sortProgrammeCandidates = (items = []) => [...items].sort((a, b) => {
    const aTime = new Date(a?.createdAt || 0).getTime();
    const bTime = new Date(b?.createdAt || 0).getTime();
    if (aTime !== bTime) return aTime - bTime;
    return String(a?._id || "").localeCompare(String(b?._id || ""));
});

const primaryProgrammeForLevel = (programmes, canonicalLevel) =>
    sortProgrammeCandidates(
        programmes.filter((programme) => normalizeProgrammeLevel(programme?.level) === canonicalLevel)
    )[0] || null;

const assessmentLevelForProgramme = (programme) =>
    ASSESSMENT_LEVEL_BY_PROGRAMME_LEVEL[normalizeProgrammeLevel(programme?.level)] || "basic";

const rawActiveAssignmentRows = async (traineeId, moduleType = null) => {
    const rows = await TrainingAssignment.find({
        trainee: traineeId,
        status: "active",
    })
        .select("programme trainee assignedBy assignedAt status")
        .populate({
            path: "programme",
            match: { status: "active" },
            select: "_id title programmeType level passMark status createdBy createdAt",
        })
        .lean();

    const requestedType = normalize(moduleType);
    return rows
        .filter((row) => row.programme)
        .filter((row) => !requestedType || normalize(row.programme.programmeType) === requestedType);
};

const getPassedProgrammeIds = async (traineeId, programmes) => {
    const programmeIds = programmes.map((programme) => programme._id);
    if (!programmeIds.length) return new Set();

    const [passedAttempts, progressRows] = await Promise.all([
        AssessmentAttempt.find({
            trainee: traineeId,
            programme: { $in: programmeIds },
            passed: true,
            status: "submitted",
        }).select("programme level").lean(),
        TrainingProgress.find({
            trainee: traineeId,
            programme: { $in: programmeIds },
        }).select("programme basicPassed intermediatePassed highPassed").lean(),
    ]);

    const programmeById = new Map(programmes.map((programme) => [String(programme._id), programme]));
    const passedProgrammeIds = new Set(
        passedAttempts
            .filter((attempt) => {
                const programme = programmeById.get(String(attempt.programme));
                return programme && normalize(attempt.level) === assessmentLevelForProgramme(programme);
            })
            .map((attempt) => String(attempt.programme))
    );

    for (const row of progressRows) {
        const programme = programmeById.get(String(row.programme));
        if (!programme) continue;
        const assessmentLevel = assessmentLevelForProgramme(programme);
        const passField = {
            basic: "basicPassed",
            intermediate: "intermediatePassed",
            high: "highPassed",
        }[assessmentLevel];
        if (passField && row[passField]) passedProgrammeIds.add(String(row.programme));
    }

    return passedProgrammeIds;
};

const buildLevelStats = (programmes, passedProgrammeIds) => {
    const stats = {};
    for (const level of LEVEL_ORDER) {
        const levelProgrammes = sortProgrammeCandidates(programmes.filter(
            (programme) => normalizeProgrammeLevel(programme.level) === level
        ));
        const primaryProgramme = levelProgrammes[0] || null;

        // A trainee completes a LEVEL once, not every database programme row
        // that happens to share that level. Older project data contains several
        // "programmes" that were really intended to be learning topics. Treat
        // those rows as one level pathway so one overall level assessment is
        // enough to unlock the next level. Any historical pass at this level is
        // accepted so existing trainee records are not lost.
        const levelPassed = levelProgrammes.some(
            (programme) => passedProgrammeIds.has(String(programme._id))
        );

        stats[level] = {
            assignedCount: primaryProgramme ? 1 : 0,
            sourceProgrammeCount: levelProgrammes.length,
            passedCount: levelPassed ? 1 : 0,
            completed: !!primaryProgramme && levelPassed,
            available: !!primaryProgramme,
            primaryProgrammeId: primaryProgramme?._id || null,
        };
    }
    return stats;
};

const programmeLevelQueryValues = (canonicalLevel) => ({
    beginner: ["beginner", "easy", "basic"],
    intermediate: ["intermediate", "medium"],
    advanced: ["advanced", "high"],
}[canonicalLevel] || [canonicalLevel]);

/**
 * Progression repair / synchronisation.
 *
 * A trainee can have a valid Beginner assignment and pass history while an
 * Intermediate TrainingAssignment was never created. That left the UI showing
 * the next level as missing even though the prerequisite was already met.
 *
 * Once a level is completely passed, this function automatically creates the
 * trainee's assignments for the next active level in the SAME module. It never
 * unlocks the level early, and it never reactivates an assignment that an admin
 * deliberately deactivated.
 *
 * This also repairs historical trainees such as someone who passed Beginner
 * before this fix: opening My Training / Progress is enough to create the
 * missing next-level assignment.
 */
const syncUnlockedProgressionAssignments = async (traineeId, moduleType = null) => {
    const trainee = await User.findById(traineeId)
        .select("_id role status accountStatus assignedTrainingSections createdBy")
        .lean();

    if (!trainee || trainee.role !== "trainee" || trainee.status !== "active" || trainee.accountStatus !== "created") {
        return [];
    }

    const requestedType = normalize(moduleType);
    let rows = await rawActiveAssignmentRows(traineeId, requestedType || null);
    if (!rows.length) return rows;

    const grouped = new Map();
    for (const row of rows) {
        const key = normalize(row.programme?.programmeType);
        if (!key || (requestedType && key !== requestedType)) continue;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key).push(row);
    }

    for (const [moduleKey, moduleRows] of grouped.entries()) {
        // Do not silently broaden a trainee into a module that is not part of
        // their module entitlement. Existing projects give trainees all active
        // module keys, while explicit programme assignments provide a backward-
        // compatible fallback for older accounts.
        const moduleEntitled = (trainee.assignedTrainingSections || [])
            .some((key) => normalize(key) === moduleKey) || moduleRows.length > 0;
        if (!moduleEntitled) continue;

        let workingRows = moduleRows;
        let programmes = workingRows.map((row) => row.programme).filter(Boolean);
        let passedIds = await getPassedProgrammeIds(traineeId, programmes);
        let stats = buildLevelStats(programmes, passedIds);

        const ensureLevelAssigned = async (canonicalLevel) => {
            const candidates = sortProgrammeCandidates(await TrainingProgramme.find({
                programmeType: moduleKey,
                level: { $in: programmeLevelQueryValues(canonicalLevel) },
                status: "active",
            })
                .select("_id title programmeType level passMark status createdBy createdAt")
                .lean());

            if (!candidates.length) return false;

            const candidateIds = candidates.map((programme) => programme._id);
            const anyHistory = await TrainingAssignment.find({
                trainee: traineeId,
                programme: { $in: candidateIds },
            }).select("programme status assignedBy").lean();

            const activeIds = new Set(
                anyHistory.filter((row) => row.status === "active").map((row) => String(row.programme))
            );
            const inactiveIds = new Set(
                anyHistory.filter((row) => row.status === "inactive").map((row) => String(row.programme))
            );

            // One programme record is the canonical pathway for each level.
            // Additional same-level rows are treated as learning topics/content,
            // not separate assessments that the trainee must pass individually.
            const primaryCandidate = candidates[0];
            const primaryId = String(primaryCandidate._id);

            // Preserve explicit admin deactivation: do not auto-reactivate it.
            const toCreate = (!activeIds.has(primaryId) && !inactiveIds.has(primaryId))
                ? [primaryCandidate]
                : [];
            if (!toCreate.length) return false;

            const sourceAssigner = workingRows.find((row) => row.assignedBy)?.assignedBy || trainee.createdBy || null;
            let createdAny = false;

            for (const programme of toCreate) {
                const assignedBy = sourceAssigner || programme.createdBy;
                if (!assignedBy) continue;
                try {
                    await TrainingAssignment.create({
                        programme: programme._id,
                        trainee: traineeId,
                        assignedBy,
                        assignedAt: new Date(),
                        status: "active",
                    });
                    createdAny = true;
                } catch (error) {
                    // Another concurrent request may have created the same active
                    // assignment. Treat duplicate-key as a successful sync.
                    if (error?.code !== 11000) throw error;
                    createdAny = true;
                }
            }
            return createdAny;
        };

        if (stats.beginner.completed) {
            const changed = await ensureLevelAssigned("intermediate");
            if (changed) {
                workingRows = await rawActiveAssignmentRows(traineeId, moduleKey);
                programmes = workingRows.map((row) => row.programme).filter(Boolean);
                passedIds = await getPassedProgrammeIds(traineeId, programmes);
                stats = buildLevelStats(programmes, passedIds);
            }
        }

        if (stats.beginner.completed && stats.intermediate.completed) {
            const changed = await ensureLevelAssigned("advanced");
            if (changed) {
                workingRows = await rawActiveAssignmentRows(traineeId, moduleKey);
            }
        }
    }

    rows = await rawActiveAssignmentRows(traineeId, requestedType || null);
    return rows;
};

const getActiveAssignedProgrammes = async (traineeId, moduleType = null) => {
    const rows = await syncUnlockedProgressionAssignments(traineeId, moduleType);
    return rows.map((row) => row.programme).filter(Boolean);
};

const getModuleLevelAccess = async (traineeId, moduleType, suppliedProgrammes = null) => {
    // Even when a caller supplies programme data, run the progression sync first
    // so a just-passed historical Beginner level can materialise Intermediate.
    const syncedProgrammes = await getActiveAssignedProgrammes(traineeId, moduleType);
    const programmes = suppliedProgrammes
        ? (() => {
            const byId = new Map();
            for (const programme of [...suppliedProgrammes, ...syncedProgrammes]) {
                if (programme?._id) byId.set(String(programme._id), programme);
            }
            return [...byId.values()];
        })()
        : syncedProgrammes;

    const passedProgrammeIds = await getPassedProgrammeIds(traineeId, programmes);
    const stats = buildLevelStats(programmes, passedProgrammeIds);

    return {
        beginner: {
            ...stats.beginner,
            unlocked: stats.beginner.available,
            prerequisiteMet: true,
        },
        intermediate: {
            ...stats.intermediate,
            unlocked: stats.intermediate.available && stats.beginner.completed,
            prerequisiteMet: stats.beginner.completed,
        },
        advanced: {
            ...stats.advanced,
            unlocked: stats.advanced.available && stats.beginner.completed && stats.intermediate.completed,
            prerequisiteMet: stats.beginner.completed && stats.intermediate.completed,
        },
    };
};

const clampPercentage = (value) => Math.max(0, Math.min(100, Number(value || 0)));

const getTraineeModuleProgress = async (traineeId) => {
    const programmes = await getActiveAssignedProgrammes(traineeId);
    const programmeIds = programmes.map((programme) => programme._id);

    const [progressRows, attempts] = await Promise.all([
        programmeIds.length
            ? TrainingProgress.find({ trainee: traineeId, programme: { $in: programmeIds } }).lean()
            : [],
        programmeIds.length
            ? AssessmentAttempt.find({
                trainee: traineeId,
                programme: { $in: programmeIds },
                status: "submitted",
            })
                .select("programme level score totalPoints percentage passed attemptNumber submittedAt createdAt")
                .sort({ submittedAt: -1, createdAt: -1 })
                .lean()
            : [],
    ]);

    const progressByProgramme = new Map(progressRows.map((row) => [String(row.programme), row]));
    const attemptsByProgramme = new Map();
    for (const attempt of attempts) {
        const key = String(attempt.programme);
        if (!attemptsByProgramme.has(key)) attemptsByProgramme.set(key, []);
        attemptsByProgramme.get(key).push(attempt);
    }

    const groups = new Map();
    for (const programme of programmes) {
        const moduleType = normalize(programme.programmeType) || "other";
        if (!groups.has(moduleType)) groups.set(moduleType, []);
        groups.get(moduleType).push(programme);
    }

    const modules = [];
    for (const [moduleType, moduleProgrammes] of groups.entries()) {
        const access = await getModuleLevelAccess(traineeId, moduleType, moduleProgrammes);
        const levelRows = LEVEL_ORDER.map((level) => {
            const levelProgrammes = moduleProgrammes.filter(
                (programme) => normalizeProgrammeLevel(programme.level) === level
            );

            const programmeRows = levelProgrammes.map((programme) => {
                const id = String(programme._id);
                const requiredAssessmentLevel = assessmentLevelForProgramme(programme);
                const programmeAttempts = (attemptsByProgramme.get(id) || [])
                    .filter((attempt) => normalize(attempt.level) === requiredAssessmentLevel);
                const progressRow = progressByProgramme.get(id);
                const legacyPassField = {
                    basic: "basicPassed",
                    intermediate: "intermediatePassed",
                    high: "highPassed",
                }[requiredAssessmentLevel];
                const passed = programmeAttempts.some((attempt) => attempt.passed) || !!progressRow?.[legacyPassField];
                const latestAttempt = programmeAttempts[0] || null;
                const bestPercentage = programmeAttempts.length
                    ? Math.max(...programmeAttempts.map((attempt) => Number(attempt.percentage || 0)))
                    : null;

                return {
                    programmeId: programme._id,
                    title: programme.title,
                    passMark: programme.passMark,
                    programmeLevel: normalizeProgrammeLevel(programme.level),
                    assessmentLevel: requiredAssessmentLevel,
                    progress: passed ? 100 : clampPercentage(progressRow?.progress),
                    passed,
                    attemptCount: programmeAttempts.length,
                    latestPercentage: latestAttempt ? Number(latestAttempt.percentage || 0) : null,
                    bestPercentage,
                    latestPassed: latestAttempt ? !!latestAttempt.passed : null,
                    latestAttemptNumber: latestAttempt ? Number(latestAttempt.attemptNumber || 0) : null,
                };
            });

            const completed = !!access[level]?.completed;
            const levelProgress = completed
                ? 100
                : (programmeRows.length ? Math.max(...programmeRows.map((row) => Number(row.progress || 0))) : 0);
            const levelAttempts = programmeRows.reduce((sum, row) => sum + row.attemptCount, 0);
            const percentages = programmeRows
                .map((row) => row.bestPercentage)
                .filter((value) => value !== null);
            const primaryProgramme = primaryProgrammeForLevel(moduleProgrammes, level);
            const primaryRow = primaryProgramme
                ? programmeRows.find((row) => String(row.programmeId) === String(primaryProgramme._id))
                : null;

            return {
                level,
                progress: levelProgress,
                assignedCount: access[level]?.available ? 1 : 0,
                completedCount: completed ? 1 : 0,
                completed,
                unlocked: access[level]?.unlocked || false,
                prerequisiteMet: access[level]?.prerequisiteMet || false,
                attempts: levelAttempts,
                bestPercentage: percentages.length ? Math.max(...percentages) : null,
                programmes: primaryRow ? [primaryRow] : [],
            };
        });

        const moduleProgress = Math.round(
            levelRows.reduce((sum, level) => sum + level.progress, 0) / LEVEL_ORDER.length
        );
        const moduleAttempts = moduleProgrammes.flatMap((programme) => attemptsByProgramme.get(String(programme._id)) || []);
        const latestAttempt = moduleAttempts
            .slice()
            .sort((a, b) => new Date(b.submittedAt || b.createdAt || 0) - new Date(a.submittedAt || a.createdAt || 0))[0] || null;
        const bestPercentage = moduleAttempts.length
            ? Math.max(...moduleAttempts.map((attempt) => Number(attempt.percentage || 0)))
            : null;
        const completedLevels = levelRows.filter((level) => level.completed).length;
        const currentLevel = LEVEL_ORDER.find((level) => {
            const row = levelRows.find((item) => item.level === level);
            return row?.assignedCount > 0 && !row.completed && row.unlocked;
        }) || (completedLevels === LEVEL_ORDER.length ? "completed" : null);

        modules.push({
            trainingSection: moduleType,
            moduleType,
            status: moduleProgress >= 100 ? "completed" : moduleProgress > 0 ? "in-progress" : "not-started",
            progress: moduleProgress,
            completedLevels,
            totalLevels: LEVEL_ORDER.length,
            currentLevel,
            attempts: moduleAttempts.length,
            bestPercentage,
            latestPercentage: latestAttempt ? Number(latestAttempt.percentage || 0) : null,
            latestPassed: latestAttempt ? !!latestAttempt.passed : null,
            latestAttemptNumber: latestAttempt ? Number(latestAttempt.attemptNumber || 0) : null,
            levels: levelRows,
            levelAccess: access,
        });
    }

    modules.sort((a, b) => a.moduleType.localeCompare(b.moduleType));
    return modules;
};

module.exports = {
    LEVEL_ORDER,
    ASSESSMENT_LEVEL_BY_PROGRAMME_LEVEL,
    normalize,
    normalizeProgrammeLevel,
    sortProgrammeCandidates,
    primaryProgrammeForLevel,
    assessmentLevelForProgramme,
    syncUnlockedProgressionAssignments,
    getActiveAssignedProgrammes,
    getModuleLevelAccess,
    getTraineeModuleProgress,
};

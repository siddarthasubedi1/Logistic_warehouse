const TrainingProgress = require("../models/TrainingProgress");

/**
 * Return the single Sprint-2 progress document for a trainee + programme.
 *
 * This uses an atomic upsert so simultaneous page-load requests do not create
 * multiple progress documents. If MongoDB reports E11000 because another
 * request won the insert race, we immediately read and return that document.
 */
const getOrCreateProgrammeProgress = async ({ traineeId, programmeId, assignmentId }) => {
    const now = new Date();

    try {
        const progress = await TrainingProgress.findOneAndUpdate(
            { trainee: traineeId, programme: programmeId },
            {
                $set: {
                    assignment: assignmentId,
                    lastAccessedAt: now,
                },
                $setOnInsert: {
                    trainee: traineeId,
                    programme: programmeId,
                    status: "in-progress",
                    startedAt: now,
                },
            },
            {
                upsert: true,
                returnDocument: "after",
                setDefaultsOnInsert: true,
            }
        );

        if (!progress) throw new Error("Unable to initialise training progress");
        return progress;
    } catch (error) {
        // Two requests can reach an upsert at almost the same time. The
        // trainee+programme unique index guarantees one winner; the loser can
        // safely reuse the row that now exists.
        if (error?.code === 11000) {
            const existing = await TrainingProgress.findOne({
                trainee: traineeId,
                programme: programmeId,
            });

            if (existing) {
                existing.assignment = assignmentId;
                existing.lastAccessedAt = now;
                if (!existing.startedAt) existing.startedAt = now;
                if (existing.status === "not-started") existing.status = "in-progress";
                await existing.save();
                return existing;
            }
        }

        throw error;
    }
};

module.exports = {
    getOrCreateProgrammeProgress,
};

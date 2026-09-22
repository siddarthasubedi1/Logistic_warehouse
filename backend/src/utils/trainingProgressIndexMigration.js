const exactKey = (index, fields) => {
    const key = index?.key || {};
    return Object.keys(key).length === fields.length
        && fields.every(([field, direction]) => key[field] === direction);
};

/**
 * Repair TrainingProgress indexes left behind by the earlier module-based
 * progress implementation.
 *
 * Old unique indexes such as trainee+trainingSection treat a missing/null
 * trainingSection as an indexed null value. That means the same trainee can
 * create only one Sprint-2 programme progress row and later programmes fail
 * with E11000. Sprint 2 requires uniqueness by trainee+programme instead.
 */
const migrateTrainingProgressIndexes = async (collection, logger = console) => {
    let indexes = [];
    try {
        indexes = await collection.indexes();
    } catch (error) {
        // A fresh database may not have the collection yet.
        if (error?.code !== 26) throw error;
    }

    for (const index of indexes) {
        if (index.name === "_id_") continue;

        const obsoleteSingleTrainee = index.unique && exactKey(index, [["trainee", 1]]);
        const obsoleteTrainingSection = index.unique
            && exactKey(index, [["trainee", 1], ["trainingSection", 1]]);

        const programmePair = exactKey(index, [["trainee", 1], ["programme", 1]]);
        const correctProgrammeIndex = programmePair
            && index.unique === true
            && index.partialFilterExpression?.programme?.$type === "objectId";
        const conflictingProgrammeIndex = programmePair && !correctProgrammeIndex;

        if (obsoleteSingleTrainee || obsoleteTrainingSection || conflictingProgrammeIndex) {
            await collection.dropIndex(index.name);
            logger.log?.(`Removed obsolete TrainingProgress index: ${index.name}`);
        }
    }

    await collection.createIndex(
        { trainee: 1, programme: 1 },
        {
            name: "trainee_1_programme_1",
            unique: true,
            partialFilterExpression: { programme: { $type: "objectId" } },
        }
    );

    await collection.createIndex(
        { trainee: 1, trainingSection: 1 },
        {
            name: "trainee_1_trainingSection_1_lookup",
            unique: false,
            partialFilterExpression: { trainingSection: { $type: "string" } },
        }
    );
};

module.exports = {
    exactKey,
    migrateTrainingProgressIndexes,
};

const mongoose = require("mongoose");

const {
    MongoMemoryServer,
} = require("mongodb-memory-server");

let mongoServer;

beforeAll(
    async () => {
        mongoServer =
            await MongoMemoryServer.create({ instance: { args: ['--nounixsocket'] } });

        const mongoUri =
            mongoServer.getUri();

        await mongoose.connect(
            mongoUri
        );
        await require('../src/utils/safetySimulationIndexMigration').migrateSafetySimulationIndexes(mongoose.connection.collection('challenges'));
        await require('../src/utils/safetySimulationIndexMigration').migratePuzzleStarterIndex(mongoose.connection.collection('puzzles'));
        await require('../src/models/Puzzle').createIndexes();
        await require('../src/models/Challenge').createIndexes();
        await require('../src/models/ChallengeAttempt').init();
        await require('../src/models/PersonalBest').init();
    }
);

afterEach(
    async () => {
        const collections =
            mongoose.connection.collections;

        for (
            const key
            in collections
        ) {
            await collections[
                key
            ].deleteMany({});
        }
    }
);

afterAll(
    async () => {
        await mongoose.connection.dropDatabase();

        await mongoose.connection.close();

        await mongoServer.stop();
    }
);
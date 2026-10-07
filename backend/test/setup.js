process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = require('node:crypto')
    .randomBytes(32)
    .toString('hex');

process.env.JWT_REFRESH_SECRET = require('node:crypto')
    .randomBytes(32)
    .toString('hex');

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Return the first path that actually exists.
 */
function firstExisting(paths) {
    return paths.find(
        candidate => candidate && fs.existsSync(candidate)
    ) || null;
}

/**
 * Find the MongoDB mongod executable already installed on the computer.
 *
 * Priority:
 * 1. MONGOMS_SYSTEM_BINARY environment variable
 * 2. MONGOD_PATH environment variable
 * 3. mongod available through Windows PATH
 * 4. Common MongoDB installation folders
 */
function findMongoExecutable() {
    const configured =
        process.env.MONGOMS_SYSTEM_BINARY ||
        process.env.MONGOD_PATH;

    if (
        configured &&
        fs.existsSync(configured)
    ) {
        return configured;
    }

    // Try Windows PATH / Linux PATH
    try {
        const command =
            process.platform === 'win32'
                ? 'where.exe'
                : 'which';

        const output = execFileSync(
            command,
            ['mongod'],
            {
                encoding: 'utf8',
                stdio: [
                    'ignore',
                    'pipe',
                    'ignore',
                ],
            }
        );

        const discovered = String(output)
            .split(/\r?\n/)
            .map(value => value.trim())
            .filter(Boolean);

        const match = firstExisting(discovered);

        if (match) {
            return match;
        }
    } catch {
        // mongod is not available through PATH.
        // Continue checking common installation locations.
    }

    if (process.platform === 'win32') {
        const direct = firstExisting([
            'C:\\mongodb\\bin\\mongod.exe',
            'C:\\MongoDB\\bin\\mongod.exe',
            'C:\\ProgramData\\chocolatey\\bin\\mongod.exe',
        ]);

        if (direct) {
            return direct;
        }

        const programRoots = [
            process.env.ProgramFiles,
            process.env['ProgramFiles(x86)'],
        ].filter(Boolean);

        for (const root of programRoots) {
            const serverRoot = path.join(
                root,
                'MongoDB',
                'Server'
            );

            if (!fs.existsSync(serverRoot)) {
                continue;
            }

            const versions = fs
                .readdirSync(
                    serverRoot,
                    {
                        withFileTypes: true,
                    }
                )
                .filter(entry =>
                    entry.isDirectory()
                )
                .map(entry => entry.name)
                .sort((a, b) =>
                    b.localeCompare(
                        a,
                        undefined,
                        {
                            numeric: true,
                        }
                    )
                );

            for (const version of versions) {
                const executable = path.join(
                    serverRoot,
                    version,
                    'bin',
                    'mongod.exe'
                );

                if (fs.existsSync(executable)) {
                    return executable;
                }
            }
        }
    }

    return null;
}

/**
 * Start isolated MongoDB test server before Jest tests.
 */
beforeAll(
    async () => {
        const systemBinary =
            findMongoExecutable();

        if (!systemBinary) {
            throw new Error(
                [
                    'MongoDB mongod.exe was not found.',
                    '',
                    'Install MongoDB Server or set MONGOMS_SYSTEM_BINARY.',
                    '',
                    'Example PowerShell:',
                    '$env:MONGOMS_SYSTEM_BINARY="C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe"',
                ].join('\n')
            );
        }

        console.log(
            `Using MongoDB test binary: ${systemBinary}`
        );

        /*
         * IMPORTANT:
         *
         * We give mongodb-memory-server the already installed
         * mongod.exe.
         *
         * This prevents mongodb-memory-server from downloading
         * another MongoDB ZIP and therefore avoids the MD5
         * download error you were receiving.
         *
         * MongoMemoryServer still creates an isolated temporary
         * database using a random port.
         *
         * Your normal database:
         *
         * mongodb://127.0.0.1:27017/logistic_warehouse
         *
         * is NOT used or deleted by these tests.
         */
        mongoServer =
            await MongoMemoryServer.create({
                binary: {
                    systemBinary,
                },

                instance: {
                    args:
                        process.platform === 'win32'
                            ? []
                            : ['--nounixsocket'],
                },
            });

        const mongoUri =
            mongoServer.getUri();

        console.log(
            `Test MongoDB started: ${mongoUri}`
        );

        await mongoose.connect(
            mongoUri
        );

        /*
         * Prepare required indexes.
         */
        const {
            migrateSafetySimulationIndexes,
            migratePuzzleStarterIndex,
        } = require(
            '../src/utils/safetySimulationIndexMigration'
        );

        await migrateSafetySimulationIndexes(
            mongoose.connection.collection(
                'challenges'
            )
        );

        await migratePuzzleStarterIndex(
            mongoose.connection.collection(
                'puzzles'
            )
        );

        await require(
            '../src/models/Puzzle'
        ).createIndexes();

        await require(
            '../src/models/Challenge'
        ).createIndexes();

        await require(
            '../src/models/ChallengeAttempt'
        ).init();

        await require(
            '../src/models/PersonalBest'
        ).init();

        /*
         * Sprint 4 collections requiring indexes.
         */
        const indexedModels = [
            'Notification',
            'Badge',
            'BadgeAward',
            'SectionCompletion',
            'CertificateRequest',
        ];

        for (const modelName of indexedModels) {
            const Model = require(
                `../src/models/${modelName}`
            );

            await Model.init();
        }
    },
    120000
);

/**
 * Clear test data after every individual test.
 */
afterEach(
    async () => {
        /*
         * readyState:
         *
         * 0 = disconnected
         * 1 = connected
         * 2 = connecting
         * 3 = disconnecting
         */
        if (
            mongoose.connection.readyState !== 1
        ) {
            return;
        }

        const collections =
            mongoose.connection.collections;

        for (
            const key of Object.keys(
                collections
            )
        ) {
            await collections[
                key
            ].deleteMany({});
        }
    },
    30000
);

/**
 * Shut down temporary database after all tests.
 */
afterAll(
    async () => {
        try {
            if (
                mongoose.connection.readyState === 1
            ) {
                await mongoose.connection
                    .dropDatabase();
            }
        } catch (error) {
            console.warn(
                'Test database cleanup warning:',
                error.message
            );
        }

        try {
            if (
                mongoose.connection.readyState !== 0
            ) {
                await mongoose.connection
                    .close();
            }
        } catch (error) {
            console.warn(
                'MongoDB connection close warning:',
                error.message
            );
        }

        try {
            if (mongoServer) {
                await mongoServer.stop();
            }
        } catch (error) {
            console.warn(
                'MongoMemoryServer stop warning:',
                error.message
            );
        }
    },
    30000
);

require("dotenv").config({
    path: require("node:path").join(__dirname, ".env"),
});

const express = require("express");
const mongoose = require("mongoose");
const app = require("./app");

const {
    migrateTrainingProgressIndexes,
} = require("./src/utils/trainingProgressIndexMigration");

const {
    migrateSafetySimulationIndexes,
    migratePuzzleStarterIndex,
} = require("./src/utils/safetySimulationIndexMigration");

const {
    ensureSprint3StarterContent,
} = require("./src/services/starterSprint3Content");

const isVercel = Boolean(process.env.VERCEL);
const serverApp = express();

let connectionPromise = null;
let httpServer = null;
let isShuttingDown = false;

// ==========================================
// ENVIRONMENT VALIDATION
// ==========================================

function checkRequiredEnvironment() {
    const required = [
        "MONGO_URI",
        "JWT_ACCESS_SECRET",
        "JWT_REFRESH_SECRET",
    ];

    const missing = required.filter(
        (key) => !process.env[key]
    );

    if (missing.length) {
        throw new Error(
            `Missing environment variable(s): ${missing.join(", ")}`
        );
    }
}

// ==========================================
// MONGODB CONNECTION
// ==========================================

async function connectMongoDB() {
    checkRequiredEnvironment();

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
                maxPoolSize: 10,
            })
            .then(() => {
                console.log("MongoDB connected");
                return mongoose.connection;
            })
            .catch((error) => {
                connectionPromise = null;
                throw error;
            });
    }

    return connectionPromise;
}

mongoose.connection.on("disconnected", () => {
    connectionPromise = null;
});

// ==========================================
// EXPRESS APPLICATION
// ==========================================

serverApp.use(async (req, res, next) => {
    try {
        await connectMongoDB();
        next();
    } catch (error) {
        console.error(
            "Backend initialization failed:",
            error
        );

        if (!res.headersSent) {
            res.status(503).json({
                code: "SERVICE_UNAVAILABLE",
                message:
                    "Backend database or configuration is unavailable.",
            });
        }
    }
});

serverApp.use(app);

// Required for serverless hosting
module.exports = serverApp;

// ==========================================
// DATABASE MAINTENANCE
// ==========================================

async function runStartupMaintenance() {
    await migrateSafetySimulationIndexes(
        mongoose.connection.collection("challenges")
    );

    await migratePuzzleStarterIndex(
        mongoose.connection.collection("puzzles")
    );

    await require("./src/models/Puzzle").createIndexes();
    await require("./src/models/Challenge").createIndexes();

    await require("./src/models/ChallengeAttempt").init();
    await require("./src/models/PersonalBest").init();

    const contentRepair =
        await require("./src/services/repairModuleSimulationContent")
            .repairModuleSimulationContent();

    if (contentRepair.repaired.length) {
        console.log(
            `Corrected module content for ${contentRepair.repaired.length} safety mission(s)`
        );
    }

    if (contentRepair.archived.length) {
        console.log(
            `Removed ${contentRepair.archived.length} misplaced warehouse mission(s)`
        );
    }

    // Repair training progress indexes
    await migrateTrainingProgressIndexes(
        mongoose.connection.collection("trainingprogresses")
    );

    if (process.env.SEED_STARTER_CONTENT !== "false") {
        // Sprint 3 puzzle content
        try {
            await ensureSprint3StarterContent();
            console.log(
                "Sprint 3 starter puzzle content checked"
            );
        } catch (error) {
            console.error(
                "Sprint 3 starter content check failed:",
                error
            );
        }

        // Safety mission library
        try {
            const User = require("./src/models/User");

            const admin = await User.findOne({
                role: "admin",
                status: "active",
            })
                .select("_id")
                .lean();

            if (admin) {
                const {
                    addSafetySimulationSamples,
                } = require(
                    "./src/services/safetySimulationSamples"
                );

                const synced =
                    await addSafetySimulationSamples(
                        {
                            id: String(admin._id),
                            role: "admin",
                        },
                        {
                            includeLibrary: true,
                            publishLibrary: true,
                        }
                    );

                console.log(
                    `Safety missions: ${synced.created.length} new, ` +
                    `${synced.existing.length} existing, ` +
                    `${synced.skipped.length} awaiting active programmes.`
                );
            } else {
                console.warn(
                    "Safety mission sync deferred: no active administrator account."
                );
            }
        } catch (error) {
            console.error(
                "Safety mission library sync failed:",
                error
            );
        }
    }
}

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

async function shutdown(signal) {
    if (isShuttingDown) return;

    isShuttingDown = true;

    console.log(
        `Received ${signal}; closing LogiWare server...`
    );

    try {
        if (httpServer) {
            await new Promise((resolve, reject) => {
                httpServer.close((error) =>
                    error ? reject(error) : resolve()
                );

                httpServer.closeIdleConnections?.();
            });
        }

        await mongoose.disconnect();
        process.exitCode = 0;
    } catch (error) {
        console.error("Shutdown failed:", error);
        process.exitCode = 1;
    }
}

// ==========================================
// LOCAL / RENDER SERVER STARTUP
// ==========================================

// Vercel handles HTTP requests itself.
// Other Node.js hosts start a listening server.

if (!isVercel) {
    process.once("SIGTERM", () => {
        void shutdown("SIGTERM");
    });

    process.once("SIGINT", () => {
        void shutdown("SIGINT");
    });

    (async () => {
        await connectMongoDB();

        await runStartupMaintenance();

        const PORT = Number(process.env.PORT) || 5000;

        httpServer = serverApp.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT}`
            );
        });
    })().catch(async (error) => {
        console.error(
            "Backend startup failed:",
            error
        );

        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            console.error(
                "Cleanup failed:",
                disconnectError
            );
        }

        process.exit(1);
    });
}

require("dotenv").config({ path: require("path").join(__dirname, ".env") });
for (const key of ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"]) {
    if (!process.env[key]) { console.error(`Missing ${key}. Set it in backend/.env before starting.`); process.exit(1); }
}

const mongoose = require("mongoose");
const app = require("./app");

let httpServer = null;
let isShuttingDown = false;

// Close existing connections cleanly during local/production restarts.
async function shutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`Received ${signal}; closing LogiWare server...`);
    try {
        if (httpServer) {
            await new Promise((resolve, reject) => {
                httpServer.close(error => error ? reject(error) : resolve());
                // Do not hold release shutdown open for inactive keep-alive sessions.
                httpServer.closeIdleConnections?.();
            });
        }
        await mongoose.disconnect();
        process.exitCode = 0;
    } catch (error) {
        console.error('Shutdown failed:', error.message);
        process.exitCode = 1;
    }
}
process.once('SIGTERM', () => { void shutdown('SIGTERM'); });
process.once('SIGINT', () => { void shutdown('SIGINT'); });
const { migrateTrainingProgressIndexes } = require("./src/utils/trainingProgressIndexMigration");
const { ensureSprint3StarterContent } = require("./src/services/starterSprint3Content");

// ======================================================
// MONGODB CONNECTION
// ======================================================
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected");
        await require("./src/utils/safetySimulationIndexMigration").migrateSafetySimulationIndexes(mongoose.connection.collection("challenges"));
        // Score comparisons depend on the unique trainee/challenge index.
        await require('./src/utils/safetySimulationIndexMigration').migratePuzzleStarterIndex(mongoose.connection.collection('puzzles'));
        await require('./src/models/Puzzle').createIndexes();
        await require("./src/models/Challenge").createIndexes();
        await require("./src/models/ChallengeAttempt").init();
        await require("./src/models/PersonalBest").init();
        const contentRepair = await require('./src/services/repairModuleSimulationContent').repairModuleSimulationContent();
        if (contentRepair.repaired.length) console.log(`Corrected module content for ${contentRepair.repaired.length} safety mission(s)`);
        if (contentRepair.archived.length) console.log(`Removed ${contentRepair.archived.length} misplaced warehouse mission(s)`);

        // Repair legacy indexes before accepting requests. This specifically
        // fixes E11000 errors such as trainee_1_trainingSection_1 with
        // trainingSection:null when the same trainee opens another programme.
        try {
            const progressCollection = mongoose.connection.collection("trainingprogresses");
            await migrateTrainingProgressIndexes(progressCollection);
        } catch (indexError) {
            console.error("TrainingProgress index migration failed:", indexError);
            process.exit(1);
        }

        try {
            await ensureSprint3StarterContent();
            console.log("Sprint 3 starter puzzle content checked");
        } catch (seedError) {
            console.error("Sprint 3 starter content check failed:", seedError.message);
        }

        // Ensure the complete 45-mission library is in MongoDB before serving users.
        // Idempotent: never overwrite trainer edits, manual status changes, or scores.
        // If the programmes are created later, Admin can run "Sync mission library".
        try {
            const User = require('./src/models/User');
            const admin = await User.findOne({ role: 'admin', status: 'active' }).select('_id').lean();
            if (admin) {
                const { addSafetySimulationSamples } = require('./src/services/safetySimulationSamples');
                const synced = await addSafetySimulationSamples({ id: String(admin._id), role: 'admin' }, { includeLibrary: true, publishLibrary: true });
                console.log(`Safety missions: ${synced.created.length} new, ${synced.existing.length} existing, ${synced.skipped.length} awaiting active programmes.`);
            } else console.warn('Safety mission sync deferred: no active administrator account.');
        } catch (missionError) {
            console.error('Safety mission library sync failed:', missionError.message);
        }

        const PORT = process.env.PORT || 5000;
        httpServer = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    });

require("dotenv").config({ path: require("path").join(__dirname, ".env") });
for (const key of ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"]) {
    if (!process.env[key]) { console.error(`Missing ${key}. Set it in backend/.env before starting.`); process.exit(1); }
}

const mongoose = require("mongoose");
const app = require("./app");
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

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    });

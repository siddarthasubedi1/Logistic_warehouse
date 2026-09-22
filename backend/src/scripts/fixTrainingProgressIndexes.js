require("dotenv").config();
const mongoose = require("mongoose");
const { migrateTrainingProgressIndexes } = require("../utils/trainingProgressIndexMigration");

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const collection = mongoose.connection.collection("trainingprogresses");
        await migrateTrainingProgressIndexes(collection);
        console.log("TrainingProgress indexes repaired successfully.");
    } catch (error) {
        console.error("TrainingProgress index repair failed:", error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect().catch(() => { });
    }
})();

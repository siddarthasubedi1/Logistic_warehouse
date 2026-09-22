require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");
const { migrateTrainingProgressIndexes } = require("./src/utils/trainingProgressIndexMigration");

// ======================================================
// MONGODB CONNECTION
// ======================================================
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected");

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

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    });

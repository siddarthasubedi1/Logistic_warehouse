require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const TrainingModule = require("../models/TrainingModule");
const TrainingProgramme = require("../models/TrainingProgramme");
const LearningSection = require("../models/LearningSection");
const TrainingAssignment = require("../models/TrainingAssignment");
const Scenario = require("../models/Scenario");
const AssessmentQuestion = require("../models/AssessmentQuestion");

const PASS_MARK = Number(process.env.SPRINT2_PASS_MARK);
if (!Number.isFinite(PASS_MARK) || PASS_MARK < 0 || PASS_MARK > 100) {
    throw new Error("Set SPRINT2_PASS_MARK (0-100) before running the Training Content seed. The project specification requires this value to be confirmed rather than hardcoded.");
}

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGO_URI) throw new Error("MONGO_URI (or MONGODB_URI) is required");

const modules = [
    { key: "manual-handling", code: "MH", name: "Manual Handling", description: "Safe lifting, carrying and movement of workplace loads." },
    { key: "working-at-height", code: "WAH", name: "Working at Height", description: "Safe work with ladders, platforms and elevated workplace areas." },
    { key: "cyber-awareness", code: "CA", name: "Cyber Awareness", description: "Practical cyber-risk awareness for warehouse and office staff." },
];

const sectionTitles = {
    "manual-handling": ["Introduction", "Know the Risks", "Assess the Load", "Safe Lifting Posture", "Carrying and Moving", "Team Lifting", "Mechanical Aids", "Review and Preparation"],
    "working-at-height": ["Introduction", "Height Hazards", "Planning the Work", "Ladder Safety", "Platforms and Guardrails", "Fall Prevention", "Equipment Inspection", "Review and Preparation"],
    "cyber-awareness": ["Introduction", "Passwords and MFA", "Phishing", "Social Engineering", "Safe Devices", "Safe Home Working", "Data and Email Safety", "Review and Preparation"],
};

const questionText = {
    "manual-handling": "Which action best supports safe manual handling?",
    "working-at-height": "Which action best supports safe work at height?",
    "cyber-awareness": "Which action best reduces cyber risk?",
};

async function upsertUser(data, password) {
    const passwordHash = await bcrypt.hash(password, 12);
    return User.findOneAndUpdate(
        { email: data.email },
        { $set: { ...data, passwordHash, accountStatus: "created", status: "active", mustChangePassword: false } },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
}

async function run() {
    await mongoose.connect(MONGO_URI);
    const password = process.env.SPRINT2_SEED_PASSWORD || "Sprint2Test123!";

    const admin = await upsertUser({ firstName: "Sprint", lastName: "Admin", email: "training-content.admin@example.test", username: "training-contentadmin", role: "admin", assignedTrainingSections: [] }, password);
    const trainerA = await upsertUser({ firstName: "Trainer", lastName: "Alpha", email: "trainer.alpha@example.test", username: "traineralpha", role: "trainer", age: 25, phoneNumber: "9800000001", address: "Training Office", gender: "female", assignedTrainingSections: modules.map(m => m.key) }, password);
    const trainerB = await upsertUser({ firstName: "Trainer", lastName: "Beta", email: "trainer.beta@example.test", username: "trainerbeta", role: "trainer", age: 26, phoneNumber: "9800000002", address: "Training Office", gender: "male", assignedTrainingSections: [] }, password);

    const trainees = [];
    for (let i = 1; i <= 4; i += 1) {
        trainees.push(await upsertUser({ firstName: "Trainee", lastName: `User${i}`, email: `trainee${i}@example.test`, username: `trainee${i}`, role: "trainee", age: 20 + i, phoneNumber: `980000001${i}`, address: "Warehouse Site", gender: i % 2 ? "female" : "male", assignedTrainingSections: modules.map(m => m.key) }, password));
    }

    for (const moduleData of modules) {
        await TrainingModule.findOneAndUpdate(
            { key: moduleData.key },
            { $set: { ...moduleData, status: "active", createdBy: admin._id } },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        );

        const programme = await TrainingProgramme.findOneAndUpdate(
            { programmeType: moduleData.key, title: `${moduleData.name} Safety Programme` },
            { $set: { description: `${moduleData.description} Complete the ordered learning, scenario and progressive assessments.`, owner: trainerA._id, authorizedTrainers: [trainerA._id], passMark: PASS_MARK, status: "active", createdBy: admin._id, updatedBy: admin._id } },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        );

        for (const [index, title] of sectionTitles[moduleData.key].entries()) {
            await LearningSection.findOneAndUpdate(
                { programme: programme._id, order: index + 1 },
                { $set: { title, content: `${title} learning content for ${moduleData.name}. This seeded content can be replaced by an Administrator or authorised Trainer.`, imageUrl: "", imageAltText: "", status: "active", createdBy: admin._id, updatedBy: admin._id } },
                { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
            );
        }

        await Scenario.findOneAndUpdate(
            { programme: programme._id, order: 1 },
            { $set: { title: `${moduleData.name} Scenario`, prompt: `Identify the safest response in this ${moduleData.name} situation.`, type: moduleData.key === "cyber-awareness" ? "cyber" : "hazard", options: ["safe-response", "unsafe-response"], correctResponses: ["safe-response"], feedbackCorrect: "Correct. You identified the safer response.", feedbackIncorrect: "That response leaves a risk. Review the learning content and try again.", status: "active", createdBy: admin._id, updatedBy: admin._id } },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        );

        for (const level of ["basic", "intermediate", "high"]) {
            for (let order = 1; order <= 3; order += 1) {
                await AssessmentQuestion.findOneAndUpdate(
                    { programme: programme._id, level, order },
                    { $set: { question: `${questionText[moduleData.key]} (${level} ${order})`, options: ["Follow the approved safe procedure", "Ignore the risk", "Continue without checking"], correctAnswer: "Follow the approved safe procedure", points: 1, feedback: "Use the approved procedure and reassess the risk before continuing.", status: "active", createdBy: admin._id, updatedBy: admin._id } },
                    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
                );
            }
        }

        // Seed assignments deliberately go to selected trainees only. This helps
        // verify that My Training is assignment-scoped rather than role-scoped.
        for (const trainee of trainees.slice(0, 3)) {
            await TrainingAssignment.findOneAndUpdate(
                { programme: programme._id, trainee: trainee._id, status: "active" },
                { $setOnInsert: { assignedBy: admin._id, assignedAt: new Date(), status: "active" } },
                { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
            );
        }
    }

    console.log("Training Content seed complete.");
    console.log("Users: training-contentadmin, traineralpha, trainerbeta, trainee1..trainee4");
    console.log("Seed password comes from SPRINT2_SEED_PASSWORD (development fallback is documented in this script).");
    await mongoose.disconnect();
}

run().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect().catch(() => { });
    process.exit(1);
});

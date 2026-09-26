const User = require("../src/models/User");
const TrainingModule = require("../src/models/TrainingModule");
const TrainingProgramme = require("../src/models/TrainingProgramme");
const TrainingAssignment = require("../src/models/TrainingAssignment");
const {
    syncUnlockedProgressionAssignments,
    getModuleLevelAccess,
    assessmentLevelForProgramme,
} = require("../src/services/traineeLevelProgressService");

const createProgramme = ({ moduleKey, level, owner }) => TrainingProgramme.create({
    programmeType: moduleKey,
    title: `${moduleKey} ${level} training`,
    shortDescription: `Short description for ${moduleKey} ${level}.`,
    description: `Full training description for ${moduleKey} ${level}.`,
    learningObjectives: `Learning objectives for ${moduleKey} ${level}.`,
    owner: owner._id,
    level,
    passMark: 70,
    status: "active",
    createdBy: owner._id,
});

const createModule = ({ name, code, key, owner }) => TrainingModule.create({
    name,
    code,
    key,
    description: `${name} module used to verify automatic trainee access.`,
    status: "active",
    createdBy: owner._id,
});

describe("Automatic trainee module access", () => {
    test("a created trainee automatically receives every active module and its level programmes", async () => {
        const admin = await User.create({
            firstName: "Auto",
            lastName: "Admin",
            email: "auto.admin@test.com",
            username: "autoadmin",
            passwordHash: "test-hash",
            role: "admin",
            accountStatus: "created",
            status: "active",
            mustChangePassword: false,
        });

        const trainee = await User.create({
            firstName: "Auto",
            lastName: "Trainee",
            email: "auto.trainee@test.com",
            username: "autotrainee",
            passwordHash: "test-hash",
            role: "trainee",
            age: 21,
            phoneNumber: "9800000000",
            address: "Kathmandu, Nepal",
            gender: "female",
            assignedTrainingSections: [],
            accountStatus: "created",
            status: "active",
            mustChangePassword: false,
            createdBy: admin._id,
        });

        await createModule({ name: "Manual Handling", code: "MH", key: "manual-handling", owner: admin });
        await createModule({ name: "Working at Height", code: "WAH", key: "working-at-height", owner: admin });

        for (const moduleKey of ["manual-handling", "working-at-height"]) {
            for (const level of ["beginner", "intermediate", "advanced"]) {
                await createProgramme({ moduleKey, level, owner: admin });
            }
        }

        const rows = await syncUnlockedProgressionAssignments(trainee._id);
        expect(rows).toHaveLength(6);

        const activeAssignments = await TrainingAssignment.find({
            trainee: trainee._id,
            status: "active",
        }).populate("programme", "programmeType level");

        const pathway = activeAssignments
            .map((row) => `${row.programme.programmeType}:${row.programme.level}`)
            .sort();

        expect(pathway).toEqual([
            "manual-handling:advanced",
            "manual-handling:beginner",
            "manual-handling:intermediate",
            "working-at-height:advanced",
            "working-at-height:beginner",
            "working-at-height:intermediate",
        ]);

        const refreshedTrainee = await User.findById(trainee._id).lean();
        expect(refreshedTrainee.assignedTrainingSections.sort()).toEqual([
            "manual-handling",
            "working-at-height",
        ]);

        const access = await getModuleLevelAccess(trainee._id, "manual-handling");
        expect(access.beginner.unlocked).toBe(true);
        expect(access.intermediate.unlocked).toBe(false);
        expect(access.advanced.unlocked).toBe(false);

        const programmes = activeAssignments.map((row) => row.programme);
        const beginner = programmes.find((programme) => programme.level === "beginner");
        const intermediate = programmes.find((programme) => programme.level === "intermediate");
        const advanced = programmes.find((programme) => programme.level === "advanced");

        expect(assessmentLevelForProgramme(beginner)).toBe("basic");
        expect(assessmentLevelForProgramme(intermediate)).toBe("intermediate");
        expect(assessmentLevelForProgramme(advanced)).toBe("high");
    });

    test("an active module added later is automatically added for an existing trainee", async () => {
        const admin = await User.create({
            firstName: "Future",
            lastName: "Admin",
            email: "future.admin@test.com",
            username: "futureadmin",
            passwordHash: "test-hash",
            role: "admin",
            accountStatus: "created",
            status: "active",
            mustChangePassword: false,
        });

        const trainee = await User.create({
            firstName: "Future",
            lastName: "Trainee",
            email: "future.trainee@test.com",
            username: "futuretrainee",
            passwordHash: "test-hash",
            role: "trainee",
            age: 21,
            phoneNumber: "9800000001",
            address: "Kathmandu, Nepal",
            gender: "female",
            assignedTrainingSections: [],
            accountStatus: "created",
            status: "active",
            mustChangePassword: false,
            createdBy: admin._id,
        });

        await createModule({ name: "Manual Handling", code: "MH", key: "manual-handling", owner: admin });
        await createProgramme({ moduleKey: "manual-handling", level: "beginner", owner: admin });
        await syncUnlockedProgressionAssignments(trainee._id);

        await createModule({ name: "Cyber Awareness", code: "CA", key: "cyber-awareness", owner: admin });
        for (const level of ["beginner", "intermediate", "advanced"]) {
            await createProgramme({ moduleKey: "cyber-awareness", level, owner: admin });
        }

        await syncUnlockedProgressionAssignments(trainee._id);

        const refreshedTrainee = await User.findById(trainee._id).lean();
        expect(refreshedTrainee.assignedTrainingSections.sort()).toEqual([
            "cyber-awareness",
            "manual-handling",
        ]);

        const cyberAssignments = await TrainingAssignment.find({ trainee: trainee._id, status: "active" })
            .populate({ path: "programme", match: { programmeType: "cyber-awareness" }, select: "programmeType level" });

        expect(cyberAssignments.filter((row) => row.programme)).toHaveLength(3);
    });
});

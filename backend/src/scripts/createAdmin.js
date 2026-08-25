require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const existingAdmin = await User.findOne({
            role: "admin",
        });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            await mongoose.disconnect();
            return;
        }

        const plainPassword = "Admin@123456";

        const passwordHash = await bcrypt.hash(
            plainPassword,
            12
        );

        const admin = await User.create({
            username: "admin.manager",

            email: "admin@example.com",

            passwordHash,

            firstName: "System",

            lastName: "Administrator",

            role: "admin",

            status: "active",

            mustChangePassword: true,

            createdBy: null,
        });

        console.log("Admin created successfully");
        console.log("Username:", admin.username);
        console.log("Temporary password:", plainPassword);

        await mongoose.disconnect();
    } catch (error) {
        console.error(
            "Error creating Admin:",
            error.message
        );

        process.exit(1);
    }
};

createAdmin();
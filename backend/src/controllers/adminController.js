const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const User = require("../models/User");

const generateUsername = require("../utils/generateUsername");
const generatePassword = require("../utils/generatePassword");

// GET PENDING USERS FROM userdata.json
const getPendingUsers = async (req, res) => {
    try {
        const filePath = path.join(
            __dirname,
            "../data/userdata.json"
        );

        const fileData = fs.readFileSync(
            filePath,
            "utf8"
        );

        const users = JSON.parse(fileData);

        const existingAccounts = await User.find({
            email: {
                $in: users.map((user) =>
                    user.email.toLowerCase()
                ),
            },
        }).select("email");

        const existingEmails = new Set(
            existingAccounts.map((user) =>
                user.email.toLowerCase()
            )
        );

        const pendingUsers = users.filter(
            (user) =>
                !existingEmails.has(
                    user.email.toLowerCase()
                )
        );

        return res.status(200).json(pendingUsers);
    } catch (error) {
        console.error(
            "Get pending users error:",
            error.message
        );

        return res.status(500).json({
            message: "Unable to load pending users",
        });
    }
};

// GENERATE USERNAME + PASSWORD FOR SELECTED PENDING USER
const generateCredentials = async (req, res) => {
    try {
        const { pendingUserId } = req.body;

        if (!pendingUserId) {
            return res.status(400).json({
                message: "Pending user ID is required",
            });
        }

        const filePath = path.join(
            __dirname,
            "../data/userdata.json"
        );

        const fileData = fs.readFileSync(
            filePath,
            "utf8"
        );

        const pendingUsers = JSON.parse(fileData);

        const pendingUser = pendingUsers.find(
            (user) =>
                String(user.id) ===
                String(pendingUserId)
        );

        if (!pendingUser) {
            return res.status(404).json({
                message: "Pending user not found",
            });
        }

        const {
            firstName,
            lastName,
            email,
            role,
            age,
            phoneNumber,
            address,
            gender,
        } = pendingUser;

        if (
            !["trainer", "trainee"].includes(role)
        ) {
            return res.status(400).json({
                message: "Invalid user role",
            });
        }

        if (
            !firstName ||
            !lastName ||
            !email
        ) {
            return res.status(400).json({
                message:
                    "First name, last name and email are required",
            });
        }

        if (role === "trainee") {
            if (
                age === undefined ||
                !phoneNumber ||
                !address ||
                !gender
            ) {
                return res.status(400).json({
                    message:
                        "Trainee information is incomplete",
                });
            }
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return res.status(409).json({
                message:
                    "An account for this user already exists",
            });
        }

        const username = await generateUsername(
            firstName,
            lastName
        );

        const generatedPassword =
            generatePassword();

        const passwordHash = await bcrypt.hash(
            generatedPassword,
            12
        );

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            passwordHash,
            firstName,
            lastName,

            ...(role === "trainee" && {
                age,
                phoneNumber,
                address,
                gender,
            }),

            role,
            status: "active",
            mustChangePassword: true,
            createdBy: req.user.id,
        });

        return res.status(201).json({
            message:
                "Account generated successfully. These credentials are shown only once.",

            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
            },

            credentials: {
                username,
                password: generatedPassword,
            },
        });
    } catch (error) {
        console.error(
            "Generate credentials error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// LIST ALL TRAINERS AND TRAINEES
const listUsers = async (req, res) => {
    try {
        const users = await User.find({
            role: {
                $in: ["trainer", "trainee"],
            },
        })
            .select("-passwordHash -refreshTokenHash")
            .sort({ createdAt: -1 });

        return res.status(200).json(users);
    } catch (error) {
        console.error(
            "List users error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// DEACTIVATE USER
const deactivateUser = async (req, res) => {
    try {
        const user = await User.findById(
            req.params.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                message:
                    "Administrator accounts cannot be deactivated",
            });
        }

        if (user.status === "deactivated") {
            return res.status(400).json({
                message:
                    "User is already deactivated",
            });
        }

        user.status = "deactivated";

        // Invalidate refresh token
        user.refreshTokenHash = null;

        await user.save();

        return res.status(200).json({
            message: "User deactivated successfully",
        });
    } catch (error) {
        console.error(
            "Deactivate user error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// REACTIVATE USER
const reactivateUser = async (req, res) => {
    try {
        const user = await User.findById(
            req.params.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                message:
                    "Administrator accounts cannot be reactivated through this endpoint",
            });
        }

        if (user.status === "active") {
            return res.status(400).json({
                message:
                    "User is already active",
            });
        }

        user.status = "active";

        await user.save();

        return res.status(200).json({
            message: "User reactivated successfully",
        });
    } catch (error) {
        console.error(
            "Reactivate user error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(
            req.params.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                message:
                    "Administrator accounts cannot be deleted",
            });
        }

        await user.deleteOne();

        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete user error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    getPendingUsers,
    generateCredentials,
    listUsers,
    deactivateUser,
    reactivateUser,
    deleteUser,
};
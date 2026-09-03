const bcrypt = require("bcrypt");

const User = require("../models/User");

const generateUsername = require("../utils/generateUsername");
const generatePassword = require("../utils/generatePassword");


// ======================================================
// CREATE / SAVE USER INFORMATION
// Saves Trainer or Trainee directly in users collection
// Account remains pending until credentials are generated
// ======================================================

const createPendingUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            age,
            email,
            phoneNumber,
            address,
            gender,
            role,
        } = req.body;

        // ----------------------------------------------
        // Required field validation
        // ----------------------------------------------

        if (
            !firstName?.trim() ||
            !lastName?.trim() ||
            age === undefined ||
            age === null ||
            age === "" ||
            !email?.trim() ||
            !phoneNumber?.trim() ||
            !address?.trim() ||
            !gender ||
            !role
        ) {
            return res.status(400).json({
                message: "All user information is required",
            });
        }

        // ----------------------------------------------
        // Role validation
        // ----------------------------------------------

        const normalizedRole = String(role)
            .trim()
            .toLowerCase();

        if (
            !["trainer", "trainee"].includes(
                normalizedRole
            )
        ) {
            return res.status(400).json({
                message:
                    "Role must be Trainer or Trainee",
            });
        }

        // ----------------------------------------------
        // Gender validation
        // ----------------------------------------------

        const normalizedGender = String(gender)
            .trim()
            .toLowerCase();

        if (
            !["male", "female", "other"].includes(
                normalizedGender
            )
        ) {
            return res.status(400).json({
                message:
                    "Please select a valid gender",
            });
        }

        // ----------------------------------------------
        // Age validation
        // ----------------------------------------------

        const parsedAge = Number(age);

        if (
            !Number.isInteger(parsedAge) ||
            parsedAge < 16
        ) {
            return res.status(400).json({
                message: "Age must be 16 or above",
            });
        }

        // ----------------------------------------------
        // Normalize email
        // ----------------------------------------------

        const normalizedEmail = String(email)
            .trim()
            .toLowerCase();

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                message:
                    "Please enter a valid email address",
            });
        }

        // ----------------------------------------------
        // Prevent duplicate email
        // ----------------------------------------------

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                message:
                    "A user with this email already exists",
            });
        }

        // ----------------------------------------------
        // Save user directly to MongoDB users collection
        // No username/password yet
        // ----------------------------------------------

        const user = await User.create({
            username: null,
            passwordHash: null,

            firstName: firstName.trim(),
            lastName: lastName.trim(),
            age: parsedAge,

            email: normalizedEmail,

            phoneNumber:
                phoneNumber.trim(),

            address:
                address.trim(),

            gender:
                normalizedGender,

            role:
                normalizedRole,

            accountStatus:
                "pending",

            status:
                "active",

            mustChangePassword:
                true,

            createdBy:
                req.user.id,
        });

        return res.status(201).json({
            message:
                "User information saved successfully",

            user: {
                id: user._id,
                firstName:
                    user.firstName,
                lastName:
                    user.lastName,
                age:
                    user.age,
                email:
                    user.email,
                phoneNumber:
                    user.phoneNumber,
                address:
                    user.address,
                gender:
                    user.gender,
                role:
                    user.role,
                accountStatus:
                    user.accountStatus,
            },
        });
    } catch (error) {
        console.error(
            "Create user information error:",
            error.message
        );

        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "A user with this email already exists",
            });
        }

        return res.status(500).json({
            message:
                "Unable to save user information",
        });
    }
};


// ======================================================
// GET PENDING USERS
// Reads pending Trainer/Trainee users from MongoDB
// ======================================================

const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({
            role: {
                $in: [
                    "trainer",
                    "trainee",
                ],
            },

            accountStatus:
                "pending",
        })
            .select(
                "firstName lastName age email phoneNumber address gender role accountStatus createdAt"
            )
            .sort({
                createdAt: -1,
            });

        const formattedUsers =
            pendingUsers.map(
                (user) => ({
                    id:
                        user._id,

                    firstName:
                        user.firstName,

                    lastName:
                        user.lastName,

                    age:
                        user.age,

                    email:
                        user.email,

                    phoneNumber:
                        user.phoneNumber,

                    address:
                        user.address,

                    gender:
                        user.gender,

                    role:
                        user.role,

                    accountStatus:
                        user.accountStatus,

                    createdAt:
                        user.createdAt,
                })
            );

        return res
            .status(200)
            .json(formattedUsers);
    } catch (error) {
        console.error(
            "Get pending users error:",
            error.message
        );

        return res.status(500).json({
            message:
                "Unable to load pending users",
        });
    }
};


// ======================================================
// GENERATE USERNAME + PASSWORD
// Updates the SAME pending User document
// Does NOT create another User
// ======================================================

const generateCredentials = async (req, res) => {
    try {
        const {
            pendingUserId,
        } = req.body;

        if (!pendingUserId) {
            return res.status(400).json({
                message:
                    "Pending user ID is required",
            });
        }

        // ----------------------------------------------
        // Find pending user in users collection
        // ----------------------------------------------

        const user = await User.findOne({
            _id: pendingUserId,

            role: {
                $in: [
                    "trainer",
                    "trainee",
                ],
            },

            accountStatus:
                "pending",
        });

        if (!user) {
            return res.status(404).json({
                message:
                    "Pending user not found",
            });
        }

        // ----------------------------------------------
        // Extra protection
        // ----------------------------------------------

        if (
            ![
                "trainer",
                "trainee",
            ].includes(user.role)
        ) {
            return res.status(400).json({
                message:
                    "Invalid user role",
            });
        }

        // ----------------------------------------------
        // Generate username
        // ----------------------------------------------

        const username =
            await generateUsername(
                user.firstName,
                user.lastName
            );

        // ----------------------------------------------
        // Generate temporary password
        // ----------------------------------------------

        const generatedPassword =
            generatePassword();

        // ----------------------------------------------
        // Hash password
        // ----------------------------------------------

        const passwordHash =
            await bcrypt.hash(
                generatedPassword,
                12
            );

        // ----------------------------------------------
        // Update SAME MongoDB document
        // ----------------------------------------------

        user.username =
            username;

        user.passwordHash =
            passwordHash;

        user.accountStatus =
            "created";

        user.status =
            "active";

        user.mustChangePassword =
            true;

        await user.save();

        // ----------------------------------------------
        // Return credentials once
        // ----------------------------------------------

        return res.status(200).json({
            message:
                "Account generated successfully. These credentials are shown only once.",

            user: {
                id:
                    user._id,

                firstName:
                    user.firstName,

                lastName:
                    user.lastName,

                age:
                    user.age,

                email:
                    user.email,

                phoneNumber:
                    user.phoneNumber,

                address:
                    user.address,

                gender:
                    user.gender,

                role:
                    user.role,

                status:
                    user.status,

                accountStatus:
                    user.accountStatus,
            },

            credentials: {
                username:
                    username,

                password:
                    generatedPassword,
            },
        });
    } catch (error) {
        console.error(
            "Generate credentials error:",
            error.message
        );

        if (
            error.name ===
            "CastError"
        ) {
            return res.status(400).json({
                message:
                    "Invalid pending user ID",
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "Generated username already exists. Please try again.",
            });
        }

        return res.status(500).json({
            message:
                "Unable to generate account credentials",
        });
    }
};


// ======================================================
// LIST ALL CREATED TRAINERS AND TRAINEES
// Pending users are not shown in Manage Users
// ======================================================

const listUsers = async (req, res) => {
    try {
        const users = await User.find({
            role: {
                $in: [
                    "trainer",
                    "trainee",
                ],
            },

            accountStatus:
                "created",
        })
            .select(
                "-passwordHash -refreshTokenHash"
            )
            .sort({
                createdAt: -1,
            });

        return res
            .status(200)
            .json(users);
    } catch (error) {
        console.error(
            "List users error:",
            error.message
        );

        return res.status(500).json({
            message:
                "Server error",
        });
    }
};


// ======================================================
// DEACTIVATE USER
// ======================================================

const deactivateUser = async (req, res) => {
    try {
        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found",
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                message:
                    "Administrator accounts cannot be deactivated",
            });
        }

        if (
            user.accountStatus !==
            "created"
        ) {
            return res.status(400).json({
                message:
                    "Pending users cannot be deactivated",
            });
        }

        if (
            user.status ===
            "deactivated"
        ) {
            return res.status(400).json({
                message:
                    "User is already deactivated",
            });
        }

        user.status =
            "deactivated";

        // Invalidate existing login sessions
        user.refreshTokenHash =
            null;

        user.authVersion += 1;

        await user.save();

        return res.status(200).json({
            message:
                "User deactivated successfully",
        });
    } catch (error) {
        console.error(
            "Deactivate user error:",
            error.message
        );

        return res.status(500).json({
            message:
                "Server error",
        });
    }
};


// ======================================================
// REACTIVATE USER
// ======================================================

const reactivateUser = async (req, res) => {
    try {
        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found",
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                message:
                    "Administrator accounts cannot be reactivated through this endpoint",
            });
        }

        if (
            user.accountStatus !==
            "created"
        ) {
            return res.status(400).json({
                message:
                    "Pending users cannot be reactivated",
            });
        }

        if (
            user.status ===
            "active"
        ) {
            return res.status(400).json({
                message:
                    "User is already active",
            });
        }

        user.status =
            "active";

        await user.save();

        return res.status(200).json({
            message:
                "User reactivated successfully",
        });
    } catch (error) {
        console.error(
            "Reactivate user error:",
            error.message
        );

        return res.status(500).json({
            message:
                "Server error",
        });
    }
};


// ======================================================
// DELETE USER
// ======================================================

const deleteUser = async (req, res) => {
    try {
        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found",
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
            message:
                "User deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete user error:",
            error.message
        );

        return res.status(500).json({
            message:
                "Server error",
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    createPendingUser,
    getPendingUsers,
    generateCredentials,
    listUsers,
    deactivateUser,
    reactivateUser,
    deleteUser,
};
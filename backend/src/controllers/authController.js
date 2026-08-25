const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/generateTokens");


// ======================================================
// LOGIN
// Admin, Trainer and Trainee can use this endpoint
// ======================================================

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check that username and password were provided
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required",
            });
        }

        // Find user using username
        const user = await User.findOne({
            username: username.toLowerCase().trim(),
        });

        // Do not reveal whether username or password was wrong
        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        // Check account status before allowing login
        if (user.status !== "active") {
            return res.status(403).json({
                code: "ACCOUNT_DEACTIVATED",
                message: "Your account has been deactivated",
            });
        }

        // Compare entered password with bcrypt hash
        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        // Generate short-lived access token
        const accessToken = generateAccessToken(user);

        // Generate refresh token
        const refreshToken = generateRefreshToken(user);

        // Store only a hash of the refresh token in MongoDB
        user.refreshTokenHash = await bcrypt.hash(
            refreshToken,
            12
        );

        await user.save();

        // Store actual refresh token in httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,

            secure:
                process.env.NODE_ENV === "production",

            sameSite: "strict",

            maxAge:
                7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",

            accessToken,

            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
                mustChangePassword:
                    user.mustChangePassword,
            },
        });
    } catch (error) {
        console.error(
            "Login error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};


// ======================================================
// CHANGE OWN PASSWORD
// Admin, Trainer and Trainee
// ======================================================

const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
        } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message:
                    "Current password and new password are required",
            });
        }

        // Minimum password length
        if (newPassword.length < 12) {
            return res.status(400).json({
                message:
                    "New password must contain at least 12 characters",
            });
        }

        // req.user.id comes from authenticate middleware
        const user = await User.findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Extra status check
        if (user.status !== "active") {
            return res.status(403).json({
                code: "ACCOUNT_DEACTIVATED",
                message:
                    "Your account has been deactivated",
            });
        }

        // Verify current password
        const passwordMatches =
            await bcrypt.compare(
                currentPassword,
                user.passwordHash
            );

        if (!passwordMatches) {
            return res.status(400).json({
                message:
                    "Current password is incorrect",
            });
        }

        // Prevent reusing the current password
        const samePassword =
            await bcrypt.compare(
                newPassword,
                user.passwordHash
            );

        if (samePassword) {
            return res.status(400).json({
                message:
                    "New password must be different from the current password",
            });
        }

        // Hash new password with bcrypt cost factor 12
        user.passwordHash =
            await bcrypt.hash(
                newPassword,
                12
            );

        // First password change has now been completed
        user.mustChangePassword = false;

        // Invalidate current refresh session
        user.refreshTokenHash = null;

        await user.save();

        // Remove refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,

            secure:
                process.env.NODE_ENV === "production",

            sameSite: "strict",
        });

        return res.status(200).json({
            message:
                "Password changed successfully. Please log in again.",
        });
    } catch (error) {
        console.error(
            "Change password error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};


// ======================================================
// REFRESH ACCESS TOKEN
// Creates a new access token using refresh token cookie
// ======================================================

const refreshAccessToken = async (
    req,
    res
) => {
    try {
        // Read refresh token from httpOnly cookie
        const refreshToken =
            req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message:
                    "Refresh token is required",
            });
        }

        let decoded;

        // Verify refresh token signature and expiry
        try {
            decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );
        } catch (error) {
            return res.status(401).json({
                message:
                    "Invalid or expired refresh token",
            });
        }

        // Find current user from database
        const user = await User.findById(
            decoded.id
        );

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        // IMPORTANT:
        // Check database status again instead of trusting token
        if (user.status !== "active") {
            return res.status(403).json({
                code: "ACCOUNT_DEACTIVATED",
                message:
                    "Your account has been deactivated",
            });
        }

        // User must have a stored refresh-token hash
        if (!user.refreshTokenHash) {
            return res.status(401).json({
                message:
                    "Refresh session is no longer valid",
            });
        }

        // Compare cookie token with stored hash
        const refreshTokenMatches =
            await bcrypt.compare(
                refreshToken,
                user.refreshTokenHash
            );

        if (!refreshTokenMatches) {
            return res.status(401).json({
                message:
                    "Invalid refresh session",
            });
        }

        // Generate a new short-lived access token
        const accessToken =
            generateAccessToken(user);

        return res.status(200).json({
            message:
                "Access token refreshed successfully",

            accessToken,
        });
    } catch (error) {
        console.error(
            "Refresh token error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};


// ======================================================
// LOGOUT
// Admin, Trainer and Trainee
// ======================================================

const logout = async (req, res) => {
    try {
        // req.user.id comes from authenticate middleware
        const user = await User.findById(
            req.user.id
        );

        if (user) {
            // Remove stored refresh-token hash
            user.refreshTokenHash = null;

            await user.save();
        }

        // Delete refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,

            secure:
                process.env.NODE_ENV === "production",

            sameSite: "strict",
        });

        return res.status(200).json({
            message:
                "Logged out successfully",
        });
    } catch (error) {
        console.error(
            "Logout error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};


// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
    login,
    changePassword,
    refreshAccessToken,
    logout,
};
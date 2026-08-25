const User = require("../models/User");


// ======================================================
// GET OWN PROFILE
// Admin, Trainer and Trainee
// ======================================================

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(
            req.user.id
        ).select(
            "-passwordHash -refreshTokenHash"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user,
        });
    } catch (error) {
        console.error(
            "Get profile error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};


module.exports = {
    getMyProfile,
};
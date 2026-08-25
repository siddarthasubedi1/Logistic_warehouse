const User = require("../models/User");

const checkActiveStatus = async (
    req,
    res,
    next
) => {
    try {
        const user = await User.findById(
            req.user.id
        ).select("status");

        if (!user) {
            return res.status(401).json({
                message: "User account not found",
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                code: "ACCOUNT_DEACTIVATED",
                message:
                    "Your account has been deactivated",
            });
        }

        next();
    } catch (error) {
        console.error(
            "Account status check error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = checkActiveStatus;
const jwt = require("jsonwebtoken");

const User = require("../models/User");


const authenticate = async (
    req,
    res,
    next
) => {
    try {
        // ==================================================
        // AUTHORIZATION HEADER
        // ==================================================

        const authHeader =
            req.headers.authorization;


        if (
            !authHeader ||
            !authHeader.startsWith(
                "Bearer "
            )
        ) {
            return res
                .status(401)
                .json({
                    code:
                        "AUTHENTICATION_REQUIRED",

                    message:
                        "Authentication required",
                });
        }


        // ==================================================
        // ACCESS TOKEN
        // ==================================================

        const token =
            authHeader
                .split(" ")[1];


        if (!token) {
            return res
                .status(401)
                .json({
                    code:
                        "AUTHENTICATION_REQUIRED",

                    message:
                        "Authentication required",
                });
        }


        // ==================================================
        // VERIFY TOKEN
        // ==================================================

        const decoded =
            jwt.verify(
                token,

                process.env
                    .JWT_ACCESS_SECRET
            );


        if (!decoded?.id) {
            return res
                .status(401)
                .json({
                    code:
                        "INVALID_ACCESS_TOKEN",

                    message:
                        "Invalid access token",
                });
        }


        // ==================================================
        // LOAD USER FROM DATABASE
        // ==================================================

        const user =
            await User.findById(
                decoded.id
            ).select(
                "_id username role status mustChangePassword authVersion"
            );


        if (!user) {
            return res
                .status(401)
                .json({
                    code:
                        "ACCOUNT_NOT_FOUND",

                    message:
                        "Account no longer exists",
                });
        }


        // ==================================================
        // ACTIVE ACCOUNT
        // ==================================================

        if (
            user.status !==
            "active"
        ) {
            return res
                .status(403)
                .json({
                    code:
                        "ACCOUNT_DEACTIVATED",

                    message:
                        "Your account has been deactivated",
                });
        }


        // ==================================================
        // AUTH VERSION CHECK
        // ==================================================

        const tokenAuthVersion =
            decoded.authVersion ||
            0;


        const databaseAuthVersion =
            user.authVersion ||
            0;


        if (
            tokenAuthVersion !==
            databaseAuthVersion
        ) {
            return res
                .status(401)
                .json({
                    code:
                        "SESSION_REVOKED",

                    message:
                        "Your session is no longer valid. Please log in again.",
                });
        }


        // ==================================================
        // ATTACH USER
        // ==================================================

        req.user = {
            id:
                user._id
                    .toString(),

            username:
                user.username,

            role:
                user.role,

            status:
                user.status,

            mustChangePassword:
                user.mustChangePassword,

            authVersion:
                databaseAuthVersion,
        };


        // ==================================================
        // FORCED PASSWORD CHANGE
        //
        // IMPORTANT:
        //
        // ONLY:
        // Trainer
        // Trainee
        //
        // Admin is NOT included.
        // ==================================================

        const requiresForcedPasswordChange =
            ["trainer", "trainee"].includes(
                user.role
            ) &&
            user.mustChangePassword ===
            true;


        // ==================================================
        // WHILE USING TEMPORARY PASSWORD:
        //
        // Trainer/Trainee can only:
        // - change password
        // - logout
        // ==================================================

        const passwordChangeAllowedPaths =
            [
                "/api/auth/change-password",
                "/api/auth/logout",
            ];


        const currentPath =
            req.originalUrl
                .split("?")[0];


        if (
            requiresForcedPasswordChange &&
            !passwordChangeAllowedPaths.includes(
                currentPath
            )
        ) {
            return res
                .status(403)
                .json({
                    code:
                        "PASSWORD_CHANGE_REQUIRED",

                    message:
                        "You must change your temporary password before continuing.",
                });
        }


        next();

    } catch (error) {
        // ==================================================
        // EXPIRED TOKEN
        // ==================================================

        if (
            error.name ===
            "TokenExpiredError"
        ) {
            return res
                .status(401)
                .json({
                    code:
                        "ACCESS_TOKEN_EXPIRED",

                    message:
                        "Access token has expired",
                });
        }


        // ==================================================
        // INVALID TOKEN
        // ==================================================

        if (
            error.name ===
            "JsonWebTokenError"
        ) {
            return res
                .status(401)
                .json({
                    code:
                        "INVALID_ACCESS_TOKEN",

                    message:
                        "Invalid access token",
                });
        }


        console.error(
            "Authentication middleware error:",
            error
        );


        return res
            .status(500)
            .json({
                code:
                    "AUTHENTICATION_ERROR",

                message:
                    "Unable to authenticate request",
            });
    }
};


module.exports = authenticate;
const jwt = require("jsonwebtoken");

const User = require("../models/User");


const authenticate = async (
    req,
    res,
    next
) => {
    try {
        /*
            =========================================
            1. CHECK AUTHORIZATION HEADER
            =========================================
        */

        const authHeader =
            req.headers.authorization;


        if (
            !authHeader ||
            !authHeader.startsWith(
                "Bearer "
            )
        ) {
            return res.status(401).json({
                code:
                    "AUTHENTICATION_REQUIRED",

                message:
                    "Authentication required",
            });
        }


        /*
            =========================================
            2. EXTRACT ACCESS TOKEN
            =========================================
        */

        const token =
            authHeader.split(" ")[1];


        if (!token) {
            return res.status(401).json({
                code:
                    "AUTHENTICATION_REQUIRED",

                message:
                    "Authentication required",
            });
        }


        /*
            =========================================
            3. VERIFY JWT
            =========================================
        */

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_ACCESS_SECRET
            );


        if (!decoded?.id) {
            return res.status(401).json({
                code:
                    "INVALID_ACCESS_TOKEN",

                message:
                    "Invalid access token",
            });
        }


        /*
            =========================================
            4. LOAD CURRENT USER FROM MONGODB

            Never trust JWT role alone.
            =========================================
        */

        const user =
            await User.findById(
                decoded.id
            ).select(
                "_id username role status mustChangePassword authVersion"
            );


        if (!user) {
            return res.status(401).json({
                code:
                    "ACCOUNT_NOT_FOUND",

                message:
                    "Account no longer exists",
            });
        }


        /*
            =========================================
            5. CHECK ACCOUNT STATUS
            =========================================
        */

        if (
            user.status !==
            "active"
        ) {
            return res.status(403).json({
                code:
                    "ACCOUNT_DEACTIVATED",

                message:
                    "Your account has been deactivated",
            });
        }


        /*
            =========================================
            6. CHECK SESSION VERSION

            Password reset/change increments
            authVersion.

            Old token then becomes invalid.
            =========================================
        */

        const tokenAuthVersion =
            decoded.authVersion || 0;

        const databaseAuthVersion =
            user.authVersion || 0;


        if (
            tokenAuthVersion !==
            databaseAuthVersion
        ) {
            return res.status(401).json({
                code:
                    "SESSION_REVOKED",

                message:
                    "Your session is no longer valid. Please log in again.",
            });
        }


        /*
            =========================================
            7. ATTACH CURRENT DATABASE USER
            =========================================
        */

        req.user = {
            id:
                user._id.toString(),

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


        next();

    } catch (error) {
        if (
            error.name ===
            "TokenExpiredError"
        ) {
            return res.status(401).json({
                code:
                    "ACCESS_TOKEN_EXPIRED",

                message:
                    "Access token has expired",
            });
        }


        if (
            error.name ===
            "JsonWebTokenError"
        ) {
            return res.status(401).json({
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


        return res.status(500).json({
            code:
                "AUTHENTICATION_ERROR",

            message:
                "Unable to authenticate request",
        });
    }
};


module.exports =
    authenticate;
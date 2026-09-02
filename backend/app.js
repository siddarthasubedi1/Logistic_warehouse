require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes =
    require("./src/routes/authRoutes");

const adminRoutes =
    require("./src/routes/adminRoutes");

const userRoutes =
    require("./src/routes/userRoutes");

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
    cors({
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:5173",

        credentials: true,
    })
);

app.use(express.json());

app.use(cookieParser());


// ======================================================
// STATIC PROFILE IMAGES
// ======================================================

app.use(
    "/uploads/profiles",

    express.static(
        path.join(
            __dirname,
            "uploads/profiles"
        ),

        {
            index: false,
            maxAge: "1d",
        }
    )
);


// ======================================================
// TEST ROUTE
// ======================================================

app.get(
    "/api/test",

    (req, res) => {

        return res
            .status(200)
            .json({
                message:
                    "Backend is working!",
            });
    }
);


// ======================================================
// ROUTES
// ======================================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/users",
    userRoutes
);


// ======================================================
// UPLOAD ERROR HANDLER
// ======================================================

app.use(
    (error, req, res, next) => {

        if (
            error?.code ===
            "LIMIT_FILE_SIZE"
        ) {

            return res
                .status(400)
                .json({
                    code:
                        "PROFILE_IMAGE_TOO_LARGE",

                    message:
                        "Profile image must not be larger than 2 MB.",
                });
        }


        if (
            error?.code ===
            "LIMIT_FILE_COUNT"
        ) {

            return res
                .status(400)
                .json({
                    code:
                        "TOO_MANY_FILES",

                    message:
                        "Only one profile image can be uploaded.",
                });
        }


        if (
            error?.message ===
            "Only JPG, JPEG, PNG and WebP images are allowed."
        ) {

            return res
                .status(400)
                .json({
                    code:
                        "INVALID_IMAGE_TYPE",

                    message:
                        error.message,
                });
        }


        next(error);
    }
);


module.exports = app;
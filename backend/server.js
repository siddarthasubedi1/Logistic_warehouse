require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
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

/*
    Example:

    Database:
    /uploads/profiles/abc123.jpg

    Browser:
    http://localhost:5000/uploads/profiles/abc123.jpg
*/

app.use(
    "/uploads/profiles",
    express.static(
        path.join(
            __dirname,
            "uploads/profiles"
        ),
        {
            /*
                Prevent directory index behaviour.
            */

            index: false,

            /*
                Browser may cache profile images.
            */

            maxAge: "1d",
        }
    )
);


// ======================================================
// ROUTES
// ======================================================

app.get(
    "/api/test",
    (req, res) => {
        return res.status(200).json({
            message:
                "Backend is working!",
        });
    }
);


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
// MONGODB CONNECTION
// ======================================================

mongoose
    .connect(
        process.env.MONGO_URI
    )
    .then(() => {
        console.log(
            "MongoDB connected"
        );
    })
    .catch((error) => {
        console.error(
            "MongoDB connection error:",
            error.message
        );
    });


// ======================================================
// UPLOAD ERROR HANDLER
// ======================================================

app.use(
    (error, req, res, next) => {
        if (
            error?.code ===
            "LIMIT_FILE_SIZE"
        ) {
            return res.status(400).json({
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
            return res.status(400).json({
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
            return res.status(400).json({
                code:
                    "INVALID_IMAGE_TYPE",

                message:
                    error.message,
            });
        }


        next(error);
    }
);




// ======================================================
// START SERVER
// ======================================================

const PORT =
    process.env.PORT ||
    5000;


app.listen(
    PORT,
    () => {
        console.log(
            `Server running on port ${PORT}`
        );
    }
);
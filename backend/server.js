require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const userRoutes = require("./src/routes/userRoutes");

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
// ROUTES
// ======================================================

app.get("/api/test", (req, res) => {
    return res.status(200).json({
        message: "Backend is working!",
    });
});


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
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error(
            "MongoDB connection error:",
            error.message
        );
    });


// ======================================================
// START SERVER
// ======================================================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});
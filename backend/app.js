require("dotenv").config();

const express =
    require("express");

const cors =
    require("cors");

const cookieParser =
    require("cookie-parser");

const path =
    require("path");


const authRoutes =
    require(
        "./src/routes/authRoutes"
    );

const adminRoutes =
    require(
        "./src/routes/adminRoutes"
    );

const userRoutes =
    require(
        "./src/routes/userRoutes"
    );

const trainingModuleRoutes = require("./src/routes/trainingModuleRoutes");

const trainingProgrammeRoutes =
    require(
        "./src/routes/trainingProgrammeRoutes"
    );

const trainingAssignmentRoutes =
    require(
        "./src/routes/trainingAssignmentRoutes"
    );

const myTrainingRoutes =
    require(
        "./src/routes/myTrainingRoutes"
    );

const warehouseTourRoutes =
    require(
        "./src/routes/warehouseTourRoutes"
    );

const panoramaAdminRoutes = require("./src/routes/panoramaAdminRoutes");
const trainingContentRoutes = require("./src/routes/trainingContentRoutes");
const trainingContentApiRoutes = require("./src/routes/trainingContentApiRoutes");
const sprint3ChallengeRoutes = require("./src/routes/sprint3ChallengeRoutes");


const app =
    express();


app.disable('x-powered-by');
const trustedProxy = Number(process.env.TRUST_PROXY || 0);
if (Number.isInteger(trustedProxy) && trustedProxy > 0 && trustedProxy <= 5) app.set('trust proxy', trustedProxy);
app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Referrer-Policy', 'no-referrer');
    const json = res.json.bind(res);
    res.json = body => {
        if (res.statusCode >= 500) return json({ code: 'INTERNAL_ERROR', message: 'Unable to process this request.' });
        if (res.statusCode >= 400 && /Cast to|validation failed|E11000|BSON|passwordHash|refreshTokenHash/.test(body?.message || '')) return json({ code: 'INVALID_INPUT', message: 'Invalid request data.' });
        return json(body);
    };
    next();
});
app.get('/api/health', (req, res) => {
    const ready = require('mongoose').connection.readyState === 1;
    res.status(ready ? 200 : 503).json({ status: ready ? 'ok' : 'unavailable', database: ready ? 'connected' : 'disconnected' });
});

// ======================================================
// CORS
// ======================================================

app.use(
    cors({
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:5173",

        credentials:
            true,
    })
);


// ======================================================
// BODY PARSING
// ======================================================

app.use(
    express.json({ limit: "3mb" })
);


app.use(
    express.urlencoded({
        extended:
            true,
    })
);


app.use(
    cookieParser()
);


app.use(require("./src/middleware/validateRequest").inputGuard);

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
            index:
                false,

            maxAge:
                "1d",
        }
    )
);


// ======================================================
// STATIC TRAINING IMAGES
// ======================================================

app.use(
    "/uploads/training",

    express.static(
        path.join(
            __dirname,
            "uploads/training"
        ),

        {
            index:
                false,

            maxAge:
                "1d",
        }
    )
);


app.use("/uploads/panoramas", express.static(path.join(__dirname, "uploads/panoramas"), { index: false, maxAge: "1d" }));

// ======================================================
// TEST ROUTE
// ======================================================

app.get(
    "/api/test",

    (
        req,
        res
    ) => {
        return res
            .status(200)
            .json({
                message:
                    "Backend is working!",
            });
    }
);


// ======================================================
// SPRINT 1 ROUTES
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
// SPRINT 2 - TRAINING MODULES + PROGRAMMES
// ======================================================

app.use("/api/training-modules", trainingModuleRoutes);

app.use(
    "/api/training-programmes",
    trainingProgrammeRoutes
);


// ======================================================
// SPRINT 2 - TRAINING ASSIGNMENTS
// ======================================================

app.use(
    "/api/training-assignments",
    trainingAssignmentRoutes
);


// ======================================================
// SPRINT 2 - TRAINEE MY TRAINING
// ======================================================

app.use(
    "/api/my-training",
    myTrainingRoutes
);


// ======================================================
// SPRINT 2 - 360 WAREHOUSE TOUR
// ======================================================

app.use(
    "/api/warehouse-tour",
    warehouseTourRoutes
);

app.use("/api/admin/panoramas", panoramaAdminRoutes);

// Training Content scenarios, assessments, attempts and progression
app.use("/api", trainingContentApiRoutes);
app.use("/api", sprint3ChallengeRoutes);
app.use("/api/safety-simulations", require("./src/routes/safetySimulationRoutes"));
app.use("/api/training-content", trainingContentRoutes);
// Public, cryptographically signed certificate PDF links (no session required).
app.get('/api/certificate-links/:id/pdf', require('./src/controllers/certificateController').publicPdf);
app.use("/api", require("./src/routes/sprint4Routes"));


// ======================================================
// UPLOAD ERROR HANDLER
// ======================================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {
        const trainingUpload =
            req.originalUrl
                ?.includes(
                    "/training-programmes/"
                );


        // ==================================================
        // FILE TOO LARGE
        // ==================================================

        if (
            error?.code ===
            "LIMIT_FILE_SIZE"
        ) {
            if (
                trainingUpload
            ) {
                return res
                    .status(400)
                    .json({
                        code:
                            "TRAINING_IMAGE_TOO_LARGE",

                        message:
                            "Training image must not be larger than 5 MB.",
                    });
            }


            return res
                .status(400)
                .json({
                    code:
                        "PROFILE_IMAGE_TOO_LARGE",

                    message:
                        "Profile image must not be larger than 2 MB.",
                });
        }


        // ==================================================
        // TOO MANY FILES
        // ==================================================

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
                        "Only one image can be uploaded at a time.",
                });
        }


        // ==================================================
        // INVALID IMAGE TYPE
        // ==================================================

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


        next(
            error
        );
    }
);


// ======================================================
// EXPORT
// ======================================================

app.use((req, res) => res.status(404).json({ code: 'NOT_FOUND', message: 'API endpoint not found.' }));
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    return require('./src/utils/apiValidation').safeError(error, res);
});

module.exports =
    app;
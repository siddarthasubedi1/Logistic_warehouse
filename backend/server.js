require("dotenv").config();

const mongoose =
    require("mongoose");

const app =
    require("./app");


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
    })
    .catch((error) => {

        console.error(
            "MongoDB connection error:",
            error.message
        );

        process.exit(1);
    });
const multer = require("multer");


// ======================================================
// STORE FILE TEMPORARILY IN MEMORY
// ======================================================

/*
    We do NOT immediately write the uploaded file
    to disk.

    The image first stays in memory so Sharp can
    validate and process it before we save anything.
*/

const storage = multer.memoryStorage();


// ======================================================
// BASIC FILE FILTER
// ======================================================

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];


    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
            new Error(
                "Only JPG, JPEG, PNG and WebP images are allowed."
            ),
            false
        );
    }


    cb(null, true);
};


// ======================================================
// MULTER CONFIGURATION
// ======================================================

const uploadProfileImage = multer({
    storage,

    limits: {
        /*
            Maximum file size:
            2 MB
        */
        fileSize: 2 * 1024 * 1024,

        /*
            Maximum one image per request.
        */
        files: 1,
    },

    fileFilter,
});


module.exports = uploadProfileImage;
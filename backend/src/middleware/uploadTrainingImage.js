const multer =
    require("multer");


/* =========================================================
   TRAINING IMAGE UPLOAD

   Purpose:
   - Accept one image from Admin/Trainer
   - Keep it in memory first
   - Sharp will validate/process it later
   - Allow JPG / PNG / WebP only
   - Maximum 5 MB
========================================================= */


/* =========================================================
   MEMORY STORAGE
========================================================= */

const storage =
    multer.memoryStorage();


/* =========================================================
   ALLOWED FILE TYPES
========================================================= */

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];


/* =========================================================
   FILE FILTER
========================================================= */

const fileFilter = (
    req,
    file,
    callback
) => {
    if (
        !allowedMimeTypes.includes(
            file.mimetype
        )
    ) {
        return callback(
            new Error(
                "Only JPG, JPEG, PNG and WebP images are allowed."
            ),
            false
        );
    }


    callback(
        null,
        true
    );
};


/* =========================================================
   MULTER CONFIG
========================================================= */

const uploadTrainingImage =
    multer({
        storage,

        limits: {
            /*
             * Maximum image size:
             * 5 MB
             */
            fileSize:
                5 *
                1024 *
                1024,

            /*
             * Only one image per learning section request.
             */
            files:
                1,
        },

        fileFilter,
    });


module.exports =
    uploadTrainingImage;
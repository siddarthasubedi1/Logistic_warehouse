const sharp =
    require("sharp");

const crypto =
    require("crypto");

const path =
    require("path");

const fs =
    require("fs/promises");


/* =========================================================
   TRAINING IMAGE STORAGE

   Uploaded files are:
   - validated by Sharp
   - auto-rotated
   - resized if very large
   - converted to WebP
   - stored under backend/uploads/training
========================================================= */


/* =========================================================
   UPLOAD DIRECTORY
========================================================= */

const TRAINING_UPLOAD_DIRECTORY =
    path.join(
        __dirname,
        "../../uploads/training"
    );


/* =========================================================
   CREATE DIRECTORY
========================================================= */

async function ensureTrainingUploadDirectory() {
    await fs.mkdir(
        TRAINING_UPLOAD_DIRECTORY,
        {
            recursive:
                true,
        }
    );
}


/* =========================================================
   GENERATE SAFE FILE NAME
========================================================= */

function createTrainingImageFileName() {
    const randomName =
        crypto
            .randomBytes(
                24
            )
            .toString(
                "hex"
            );


    return `training-${Date.now()}-${randomName}.webp`;
}


/* =========================================================
   SAVE TRAINING IMAGE
========================================================= */

async function saveTrainingImage(
    file
) {
    if (
        !file ||
        !file.buffer
    ) {
        const error =
            new Error(
                "Training image is required."
            );

        error.code =
            "TRAINING_IMAGE_REQUIRED";

        throw error;
    }


    await ensureTrainingUploadDirectory();


    const fileName =
        createTrainingImageFileName();


    const outputPath =
        path.join(
            TRAINING_UPLOAD_DIRECTORY,
            fileName
        );


    try {
        /*
         * Sharp performs real image decoding.
         * This prevents a renamed non-image file from
         * being stored just because the MIME type looks valid.
         */

        await sharp(
            file.buffer,
            {
                failOn:
                    "error",
            }
        )
            /*
             * Respect camera EXIF orientation.
             */
            .rotate()

            /*
             * Avoid storing unnecessarily huge images.
             *
             * The image keeps its aspect ratio.
             * Smaller images are not enlarged.
             */
            .resize({
                width:
                    1600,

                height:
                    1200,

                fit:
                    "inside",

                withoutEnlargement:
                    true,
            })

            /*
             * Standardise uploaded training images.
             */
            .webp({
                quality:
                    84,
            })

            .toFile(
                outputPath
            );


        /*
         * This relative URL is what MongoDB stores.
         *
         * Example:
         * /uploads/training/training-123-abcd.webp
         */

        return {
            fileName,

            filePath:
                outputPath,

            imageUrl:
                `/uploads/training/${fileName}`,
        };

    } catch (
    error
    ) {
        /*
         * If Sharp started creating a file before failing,
         * remove the partial file.
         */

        try {
            await fs.unlink(
                outputPath
            );

        } catch (
        cleanupError
        ) {
            if (
                cleanupError.code !==
                "ENOENT"
            ) {
                console.error(
                    "Training image cleanup error:",
                    cleanupError.message
                );
            }
        }


        const imageError =
            new Error(
                "The selected file is not a valid JPG, PNG or WebP image."
            );


        imageError.code =
            "INVALID_TRAINING_IMAGE";


        throw imageError;
    }
}


/* =========================================================
   DELETE TRAINING IMAGE
========================================================= */

async function deleteTrainingImage(
    imageUrl
) {
    if (
        !imageUrl ||
        typeof imageUrl !==
        "string"
    ) {
        return;
    }


    /*
     * Only allow deletion of images created by this
     * training upload system.
     */

    if (
        !imageUrl.startsWith(
            "/uploads/training/"
        )
    ) {
        return;
    }


    const fileName =
        path.basename(
            imageUrl
        );


    if (
        !fileName
    ) {
        return;
    }


    const uploadDirectory =
        path.resolve(
            TRAINING_UPLOAD_DIRECTORY
        );


    const targetPath =
        path.resolve(
            TRAINING_UPLOAD_DIRECTORY,
            fileName
        );


    /*
     * Protect against path traversal.
     */

    if (
        !targetPath.startsWith(
            `${uploadDirectory}${path.sep}`
        )
    ) {
        console.warn(
            "Blocked invalid training image deletion path:",
            imageUrl
        );

        return;
    }


    try {
        await fs.unlink(
            targetPath
        );

    } catch (
    error
    ) {
        /*
         * Missing file is harmless.
         */

        if (
            error.code !==
            "ENOENT"
        ) {
            console.error(
                "Delete training image error:",
                error.message
            );
        }
    }
}


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    saveTrainingImage,
    deleteTrainingImage,
};
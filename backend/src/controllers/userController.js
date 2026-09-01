const User = require("../models/User");

const sharp = require("sharp");

const crypto = require("crypto");

const path = require("path");

const fs = require("fs/promises");


// ======================================================
// PROFILE IMAGE DIRECTORY
// ======================================================

const PROFILE_UPLOAD_DIRECTORY = path.join(
    __dirname,
    "../../uploads/profiles"
);


// ======================================================
// GET OWN PROFILE
// Admin, Trainer and Trainee
// ======================================================

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(
            req.user.id
        ).select(
            "-passwordHash -refreshTokenHash"
        );


        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }


        return res.status(200).json({
            user,
        });

    } catch (error) {
        console.error(
            "Get profile error:",
            error.message
        );


        return res.status(500).json({
            message: "Server error",
        });
    }
};


// ======================================================
// UPLOAD / UPDATE OWN PROFILE IMAGE
// Trainer and Trainee
// ======================================================

const updateProfileImage = async (req, res) => {
    let newImageFilePath = null;


    try {
        // ==================================================
        // 1. REQUIRE AN IMAGE
        // ==================================================

        if (!req.file) {
            return res.status(400).json({
                code: "PROFILE_IMAGE_REQUIRED",

                message:
                    "Please select a profile image.",
            });
        }


        // ==================================================
        // 2. LOAD CURRENT USER FROM DATABASE
        // ==================================================

        const user = await User.findById(
            req.user.id
        );


        if (!user) {
            return res.status(404).json({
                code: "USER_NOT_FOUND",

                message:
                    "User account was not found.",
            });
        }


        // ==================================================
        // 3. ONLY TRAINER / TRAINEE
        // ==================================================

        if (
            user.role !== "trainer" &&
            user.role !== "trainee"
        ) {
            return res.status(403).json({
                code: "PROFILE_IMAGE_NOT_ALLOWED",

                message:
                    "Profile image upload is available only for Trainer and Trainee accounts.",
            });
        }


        // ==================================================
        // 4. ACCOUNT MUST BE ACTIVE
        // ==================================================

        if (user.status !== "active") {
            return res.status(403).json({
                code: "ACCOUNT_DEACTIVATED",

                message:
                    "A deactivated account cannot update its profile image.",
            });
        }


        // ==================================================
        // 5. MAKE SURE UPLOAD DIRECTORY EXISTS
        // ==================================================

        await fs.mkdir(
            PROFILE_UPLOAD_DIRECTORY,
            {
                recursive: true,
            }
        );


        // ==================================================
        // 6. GENERATE RANDOM SERVER-SIDE FILENAME
        // ==================================================

        /*
            Never use original user filename.

            Example generated filename:

            profile-a16be12345...webp
        */

        const randomFileName =
            crypto
                .randomBytes(24)
                .toString("hex");


        const fileName =
            `profile-${randomFileName}.webp`;


        newImageFilePath = path.join(
            PROFILE_UPLOAD_DIRECTORY,
            fileName
        );


        // ==================================================
        // 7. VALIDATE + PROCESS IMAGE USING SHARP
        // ==================================================

        /*
            Sharp actually decodes the image.

            If someone uploads a fake file while claiming
            it is image/jpeg, Sharp should fail.

            rotate()
                respects image orientation.

            resize()
                prevents unnecessarily huge profile images.

            webp()
                creates a fresh image controlled by server.
        */

        await sharp(req.file.buffer)
            .rotate()
            .resize({
                width: 800,
                height: 800,
                fit: "inside",
                withoutEnlargement: true,
            })
            .webp({
                quality: 82,
            })
            .toFile(
                newImageFilePath
            );


        // ==================================================
        // 8. REMEMBER OLD PROFILE IMAGE
        // ==================================================

        const oldProfileImage =
            user.profileImage;


        // ==================================================
        // 9. STORE ONLY RELATIVE URL IN MONGODB
        // ==================================================

        const newProfileImage =
            `/uploads/profiles/${fileName}`;


        user.profileImage =
            newProfileImage;


        await user.save();


        // ==================================================
        // 10. DELETE OLD PROFILE IMAGE SAFELY
        // ==================================================

        if (
            oldProfileImage &&
            oldProfileImage.startsWith(
                "/uploads/profiles/"
            )
        ) {
            const oldFileName =
                path.basename(
                    oldProfileImage
                );


            const oldFilePath =
                path.join(
                    PROFILE_UPLOAD_DIRECTORY,
                    oldFileName
                );


            /*
                Do not allow deletion outside
                uploads/profiles.
            */

            const resolvedOldPath =
                path.resolve(
                    oldFilePath
                );


            const resolvedUploadDirectory =
                path.resolve(
                    PROFILE_UPLOAD_DIRECTORY
                );


            if (
                resolvedOldPath.startsWith(
                    resolvedUploadDirectory +
                    path.sep
                )
            ) {
                try {
                    await fs.unlink(
                        resolvedOldPath
                    );
                } catch (deleteError) {
                    /*
                        Missing old image should not
                        cause profile update to fail.
                    */

                    if (
                        deleteError.code !==
                        "ENOENT"
                    ) {
                        console.error(
                            "Old profile image delete error:",
                            deleteError.message
                        );
                    }
                }
            }
        }


        // ==================================================
        // 11. RETURN UPDATED USER
        // ==================================================

        return res.status(200).json({
            message:
                "Profile image updated successfully.",

            profileImage:
                user.profileImage,

            user: {
                id:
                    user._id,

                firstName:
                    user.firstName,

                lastName:
                    user.lastName,

                username:
                    user.username,

                email:
                    user.email,

                role:
                    user.role,

                profileImage:
                    user.profileImage,
            },
        });

    } catch (error) {
        console.error(
            "Update profile image error:",
            error.message
        );


        /*
            If image processing succeeded but database
            update failed, remove the newly-created file.
        */

        if (newImageFilePath) {
            try {
                await fs.unlink(
                    newImageFilePath
                );
            } catch (cleanupError) {
                if (
                    cleanupError.code !==
                    "ENOENT"
                ) {
                    console.error(
                        "Profile image cleanup error:",
                        cleanupError.message
                    );
                }
            }
        }


        /*
            Sharp normally throws an error when it
            cannot decode the provided file.
        */

        return res.status(400).json({
            code: "INVALID_PROFILE_IMAGE",

            message:
                "The uploaded file is not a valid supported image.",
        });
    }
};


// ======================================================
// DELETE OWN PROFILE IMAGE
// Trainer and Trainee
// ======================================================

const deleteProfileImage = async (
    req,
    res
) => {
    try {
        const user =
            await User.findById(
                req.user.id
            );


        if (!user) {
            return res.status(404).json({
                code: "USER_NOT_FOUND",

                message:
                    "User account was not found.",
            });
        }


        if (
            user.role !== "trainer" &&
            user.role !== "trainee"
        ) {
            return res.status(403).json({
                code: "PROFILE_IMAGE_NOT_ALLOWED",

                message:
                    "This account cannot modify a profile image.",
            });
        }


        if (!user.profileImage) {
            return res.status(200).json({
                message:
                    "No profile image is currently set.",

                profileImage: "",
            });
        }


        const previousImage =
            user.profileImage;


        /*
            Remove database reference first.
        */

        user.profileImage = "";


        await user.save();


        /*
            Delete actual image safely.
        */

        if (
            previousImage.startsWith(
                "/uploads/profiles/"
            )
        ) {
            const fileName =
                path.basename(
                    previousImage
                );


            const filePath =
                path.resolve(
                    PROFILE_UPLOAD_DIRECTORY,
                    fileName
                );


            const uploadDirectory =
                path.resolve(
                    PROFILE_UPLOAD_DIRECTORY
                );


            if (
                filePath.startsWith(
                    uploadDirectory +
                    path.sep
                )
            ) {
                try {
                    await fs.unlink(
                        filePath
                    );
                } catch (error) {
                    if (
                        error.code !==
                        "ENOENT"
                    ) {
                        console.error(
                            "Delete profile image file error:",
                            error.message
                        );
                    }
                }
            }
        }


        return res.status(200).json({
            message:
                "Profile image removed successfully.",

            profileImage: "",
        });

    } catch (error) {
        console.error(
            "Delete profile image error:",
            error.message
        );


        return res.status(500).json({
            message:
                "Unable to remove profile image.",
        });
    }
};


// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
    getMyProfile,
    updateProfileImage,
    deleteProfileImage,
};
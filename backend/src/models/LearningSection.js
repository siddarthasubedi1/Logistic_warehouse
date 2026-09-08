const mongoose = require("mongoose");


const learningSectionSchema =
    new mongoose.Schema(
        {
            // ==================================================
            // TRAINING PROGRAMME
            //
            // Every Learning Section must belong to exactly
            // one Training Programme.
            // ==================================================

            programme: {
                type:
                    mongoose.Schema
                        .Types
                        .ObjectId,

                ref:
                    "TrainingProgramme",

                required: [
                    true,
                    "Programme is required",
                ],

                index:
                    true,
            },


            // ==================================================
            // SECTION TITLE
            // ==================================================

            title: {
                type:
                    String,

                required: [
                    true,
                    "Section title is required",
                ],

                trim:
                    true,

                minlength: [
                    2,
                    "Section title must be at least 2 characters",
                ],

                maxlength: [
                    150,
                    "Section title cannot exceed 150 characters",
                ],
            },


            // ==================================================
            // LEARNING CONTENT
            //
            // Can contain:
            // - learning information
            // - instructions
            // - examples
            //
            // Rich text can later be stored here as HTML or
            // structured content depending on frontend editor.
            // ==================================================

            content: {
                type:
                    String,

                required: [
                    true,
                    "Section content is required",
                ],

                trim:
                    true,
            },


            // ==================================================
            // OPTIONAL IMAGE
            // ==================================================

            imageUrl: {
                type:
                    String,

                trim:
                    true,

                default:
                    "",
            },


            // ==================================================
            // IMAGE ALTERNATIVE TEXT
            //
            // Used for accessibility.
            // ==================================================

            imageAltText: {
                type:
                    String,

                trim:
                    true,

                default:
                    "",

                maxlength: [
                    250,
                    "Image alternative text cannot exceed 250 characters",
                ],
            },


            // ==================================================
            // SECTION ORDER
            //
            // Example:
            //
            // Introduction       = 1
            // Safe Lifting       = 2
            // Common Hazards     = 3
            //
            // This enables Trainee Previous / Next navigation.
            // ==================================================

            order: {
                type:
                    Number,

                required: [
                    true,
                    "Section order is required",
                ],

                min: [
                    1,
                    "Section order must start from 1",
                ],
            },


            // ==================================================
            // SECTION STATUS
            //
            // active:
            // Available as part of learning content.
            //
            // inactive:
            // Soft-deactivated but retained in database.
            // ==================================================

            status: {
                type:
                    String,

                enum: {
                    values: [
                        "active",
                        "inactive",
                    ],

                    message:
                        "Status must be active or inactive",
                },

                default:
                    "active",

                index:
                    true,
            },


            // ==================================================
            // CREATED BY
            // ==================================================

            createdBy: {
                type:
                    mongoose.Schema
                        .Types
                        .ObjectId,

                ref:
                    "User",

                required: [
                    true,
                    "Created by user is required",
                ],
            },


            // ==================================================
            // LAST UPDATED BY
            // ==================================================

            updatedBy: {
                type:
                    mongoose.Schema
                        .Types
                        .ObjectId,

                ref:
                    "User",

                default:
                    null,
            },
        },

        {
            timestamps:
                true,
        }
    );


// ======================================================
// UNIQUE PROGRAMME + ORDER
//
// One programme cannot contain:
//
// Section A -> order 1
// Section B -> order 1
//
// at the same time.
//
// Another programme CAN also have order 1.
//
// Programme A:
// 1,2,3
//
// Programme B:
// 1,2,3
//
// This is correct.
// ======================================================

learningSectionSchema.index(
    {
        programme:
            1,

        order:
            1,
    },

    {
        unique:
            true,
    }
);


// ======================================================
// QUERY INDEX
//
// Useful when loading:
//
// Active sections for Programme X
//
// sorted by order.
// ======================================================

learningSectionSchema.index({
    programme:
        1,

    status:
        1,

    order:
        1,
});


// ======================================================
// MODEL
// ======================================================

module.exports =
    mongoose.model(
        "LearningSection",

        learningSectionSchema
    );
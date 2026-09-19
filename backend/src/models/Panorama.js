const mongoose = require("mongoose");

const hotspotSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, trim: true, maxlength: 120 },
        targetPanorama: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Panorama",
            default: null,
        },
        yaw: { type: Number, required: true, min: -180, max: 180 },
        pitch: { type: Number, required: true, min: -90, max: 90 },
    },
    { _id: true }
);

const panoramaSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["warehouse_tour", "warehouse_area", "training_module"],
            required: true,
            index: true,
        },
        programme: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingProgramme",
            default: null,
            index: true,
        },
        area: { type: String, trim: true, default: "", index: true },
        name: { type: String, required: true, trim: true, maxlength: 160 },
        description: { type: String, trim: true, default: "", maxlength: 2000 },
        imageUrl: { type: String, required: true, trim: true },
        imageWidth: { type: Number, required: true, min: 2 },
        imageHeight: { type: Number, required: true, min: 1 },
        status: {
            type: String,
            enum: ["pending", "active", "inactive"],
            default: "pending",
            index: true,
        },
        hotspots: { type: [hotspotSchema], default: [] },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

panoramaSchema.pre("validate", function validatePanorama(next) {
    const hasProgramme = Boolean(this.programme);
    const hasArea = Boolean(this.area && this.area.trim());

    if (this.type === "training_module" && !hasProgramme) {
        this.invalidate("programme", "Training-module panorama requires a programme");
    }
    if (this.type !== "training_module" && hasProgramme) {
        this.invalidate("programme", "Warehouse panoramas must not be linked to a training programme");
    }
    if (this.type === "warehouse_area" && !hasArea) {
        this.invalidate("area", "Warehouse-area panorama requires an area identifier");
    }
    if (this.type !== "warehouse_area" && hasArea) {
        this.invalidate("area", "Area is only valid for warehouse-area panoramas");
    }

    if (this.imageWidth && this.imageHeight) {
        const ratio = this.imageWidth / this.imageHeight;
        if (Math.abs(ratio - 2) > 0.01) {
            this.invalidate("imageWidth", "Panorama image must use a 2:1 equirectangular aspect ratio");
        }
    }
    next();
});

// Only one active module panorama per programme. Warehouse-tour/area records
// are deliberately outside this index so their data can never collide with a module.
panoramaSchema.index(
    { programme: 1, type: 1 },
    {
        unique: true,
        partialFilterExpression: {
            type: "training_module",
            status: "active",
            programme: { $type: "objectId" },
        },
    }
);

panoramaSchema.index({ type: 1, area: 1, status: 1 });

module.exports = mongoose.model("Panorama", panoramaSchema);

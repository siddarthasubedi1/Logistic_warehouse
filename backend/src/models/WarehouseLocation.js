const mongoose = require("mongoose");

const hotspotSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, enum: ["navigation", "training"], required: true },
    label: { type: String, required: true },
    yaw: { type: Number, default: 0 },
    pitch: { type: Number, default: 0 },
    targetLocationId: String,
    activityType: String,
    title: String,
    content: String,
}, { _id: false });

const warehouseLocationSchema = new mongoose.Schema({
    locationId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    panorama: { type: String, required: true },
    description: { type: String, default: "" },
    mapX: { type: Number, default: 50 },
    mapY: { type: Number, default: 50 },
    connectedLocations: [{ type: String }],
    hotspots: [hotspotSchema],
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("WarehouseLocation", warehouseLocationSchema);

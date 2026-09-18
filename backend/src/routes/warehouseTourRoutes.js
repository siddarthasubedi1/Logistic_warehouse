const express = require("express");
const path = require("path");
const WarehouseLocation = require("../models/WarehouseLocation");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const checkActiveStatus = require("../middleware/checkActiveStatus");
const router = express.Router();

const SCENES = new Set(["entrance", "security", "receiving", "inbound", "main-aisle", "rack-a", "rack-b", "high-rack", "forklift", "charging", "picking", "packing", "quality", "dispatch", "loading", "manual", "height", "emergency", "office", "yard"]);
const OUTDOOR_SCENES = new Set(["entrance", "security", "receiving", "dispatch", "loading", "emergency", "yard"]);
const PANORAMA_DIR = path.resolve(__dirname, "../assets/panoramas");
const INDOOR = path.join(PANORAMA_DIR, "logistics-indoor.png");
const OUTDOOR = path.join(PANORAMA_DIR, "logistics-indoor-outdoor.png");

router.get("/locations", authenticate, checkActiveStatus, authorize("trainee"), async (_req, res) => {
    try {
        const locations = await WarehouseLocation.find({ active: true }).sort({ order: 1, name: 1 }).lean();
        const normalized = locations.map((location) => ({ ...location, panorama: location.panorama || `/api/warehouse-tour/panorama/${location.locationId}` }));
        return res.status(200).json({ locations: normalized });
    } catch (_error) { return res.status(500).json({ message: "Unable to load warehouse tour locations." }); }
});

router.get("/panorama/:sceneId", async (req, res) => {
    const { sceneId } = req.params;
    const record = await WarehouseLocation.findOne({ locationId: sceneId, active: true }).lean().catch(() => null);
    if (record?.panorama?.startsWith('/uploads/panoramas/')) return res.redirect(record.panorama);
    if (!SCENES.has(sceneId)) return res.status(404).json({ message: "Panorama not found." });
    const file = OUTDOOR_SCENES.has(sceneId) ? OUTDOOR : INDOOR;
    res.set("Cache-Control", "no-store");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    return res.sendFile(file);
});
module.exports = router;

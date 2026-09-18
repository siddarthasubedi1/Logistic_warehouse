const fs = require('fs');
const path = require('path');
const WarehouseLocation = require('../models/WarehouseLocation');
const { writeAuditLog } = require('../utils/auditLogger');

const safeDeleteUpload = (url) => {
    if (!url || !url.startsWith('/uploads/panoramas/')) return;
    const file = path.join(__dirname, '../..', url.replace(/^\//, ''));
    fs.unlink(file, () => { });
};

const parseHotspots = (value) => {
    if (value == null || value === '') return undefined;
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) throw new Error('Hotspots must be an array.');
    return parsed.map((h, index) => ({
        id: String(h.id || `hotspot-${Date.now()}-${index}`),
        type: h.type === 'training' ? 'training' : 'navigation',
        label: String(h.label || '').trim(),
        yaw: Number(h.yaw) || 0,
        pitch: Number(h.pitch) || 0,
        targetLocationId: String(h.targetLocationId || '').trim(),
        activityType: String(h.activityType || '').trim(),
        title: String(h.title || '').trim(),
        content: String(h.content || '').trim(),
    })).filter((h) => h.label);
};

exports.listLocations = async (_req, res) => {
    const locations = await WarehouseLocation.find().sort({ order: 1, name: 1 }).lean();
    res.json({ locations });
};

exports.createLocation = async (req, res) => {
    try {
        const locationId = String(req.body.locationId || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
        const name = String(req.body.name || '').trim();
        if (!locationId || !name) return res.status(400).json({ message: 'Location ID and name are required.' });
        if (await WarehouseLocation.exists({ locationId })) return res.status(409).json({ message: 'That location ID already exists.' });
        const panorama = req.file ? `/uploads/panoramas/${req.file.filename}` : String(req.body.panorama || '').trim();
        if (!panorama) return res.status(400).json({ message: 'A panorama image is required.' });
        const location = await WarehouseLocation.create({
            locationId, name, panorama,
            description: String(req.body.description || '').trim(),
            order: Number(req.body.order) || 0,
            active: String(req.body.active ?? 'true') !== 'false',
            hotspots: parseHotspots(req.body.hotspots) || [],
        });
        await writeAuditLog({ req, user: req.user, action: 'PANORAMA_LOCATION_CREATED', status: 'success', details: { locationId, name } });
        res.status(201).json({ message: 'Panorama location created.', location });
    } catch (error) {
        if (req.file) safeDeleteUpload(`/uploads/panoramas/${req.file.filename}`);
        res.status(400).json({ message: error.message || 'Unable to create panorama location.' });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const location = await WarehouseLocation.findById(req.params.id);
        if (!location) return res.status(404).json({ message: 'Panorama location not found.' });
        const oldPanorama = location.panorama;
        if (req.body.name != null) location.name = String(req.body.name).trim();
        if (req.body.description != null) location.description = String(req.body.description).trim();
        if (req.body.order != null) location.order = Number(req.body.order) || 0;
        if (req.body.active != null) location.active = String(req.body.active) !== 'false';
        const hotspots = parseHotspots(req.body.hotspots);
        if (hotspots !== undefined) location.hotspots = hotspots;
        if (req.file) location.panorama = `/uploads/panoramas/${req.file.filename}`;
        await location.save();
        if (req.file && oldPanorama !== location.panorama) safeDeleteUpload(oldPanorama);
        await writeAuditLog({ req, user: req.user, action: 'PANORAMA_LOCATION_UPDATED', status: 'success', details: { locationId: location.locationId, name: location.name } });
        res.json({ message: 'Panorama location updated.', location });
    } catch (error) {
        if (req.file) safeDeleteUpload(`/uploads/panoramas/${req.file.filename}`);
        res.status(400).json({ message: error.message || 'Unable to update panorama location.' });
    }
};

exports.deleteLocation = async (req, res) => {
    const location = await WarehouseLocation.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Panorama location not found.' });
    location.active = false;
    await location.save();
    await writeAuditLog({ req, user: req.user, action: 'PANORAMA_LOCATION_DEACTIVATED', status: 'success', details: { locationId: location.locationId, name: location.name } });
    res.json({ message: 'Panorama location deactivated.', location });
};

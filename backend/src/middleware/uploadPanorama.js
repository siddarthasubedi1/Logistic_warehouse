const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const dir = path.join(__dirname, '../../uploads/panoramas');
fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
        cb(null, `panorama-${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
    },
});

module.exports = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) return cb(new Error('Only JPG, JPEG, PNG and WebP images are allowed.'));
        cb(null, true);
    },
});

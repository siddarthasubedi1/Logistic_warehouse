require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
async function main() {
    const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
    const username = process.env.ADMIN_BOOTSTRAP_USERNAME;
    const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
    if (!process.env.MONGO_URI || !username || !email || !password || password.length < 12 || Buffer.byteLength(password) > 72) throw new Error('Set MONGO_URI and ADMIN_BOOTSTRAP_USERNAME/EMAIL/PASSWORD (12 characters minimum, 72 UTF-8 bytes maximum).');
    await mongoose.connect(process.env.MONGO_URI);
    if (await User.exists({ role: 'admin' })) { console.log('An Admin already exists; no account was changed.'); return; }
    await User.create({ username, email, passwordHash: await bcrypt.hash(password, 12), firstName: 'System', lastName: 'Administrator', role: 'admin', accountStatus: 'created', status: 'active', mustChangePassword: false });
    console.log('Admin created. The configured password was not printed.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());

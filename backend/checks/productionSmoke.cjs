const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const source = path.resolve(__dirname, '../..');
const { MongoMemoryServer } = require(path.join(source, 'backend/node_modules/mongodb-memory-server'));
const mongoose = require(path.join(source, 'backend/node_modules/mongoose'));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const checks = [];
const check = (name, condition) => { assert(condition, name); checks.push({ name, status: 'passed' }); };
async function main() {
  const clean = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'bug-busters-smoke-'));
  const backend = path.join(clean, 'backend');
  fs.mkdirSync(backend);
  for (const name of ['app.js', 'server.js', 'package.json', 'package-lock.json', '.env.example', 'src']) fs.cpSync(path.join(source, 'backend', name), path.join(backend, name), { recursive: true });
  fs.cpSync(path.join(source, 'shared'), path.join(clean, 'shared'), { recursive: true });
  fs.symlinkSync(path.join(source, 'backend/node_modules'), path.join(backend, 'node_modules'), 'dir');
  check('Clean source starts without a private .env file', !fs.existsSync(path.join(backend, '.env')));
  const mongo = await MongoMemoryServer.create({ instance: { args: ['--nounixsocket'] } });
  const socket = net.createServer(); await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port; await new Promise(resolve => socket.close(resolve));
  const env = { ...process.env, NODE_ENV: 'production', PORT: String(port), MONGO_URI: mongo.getUri(), JWT_ACCESS_SECRET: crypto.randomBytes(32).toString('hex'), JWT_REFRESH_SECRET: crypto.randomBytes(32).toString('hex'), CLIENT_URL: 'https://training.example.invalid', TRUST_PROXY: '0', SEED_STARTER_CONTENT: 'false', ADMIN_BOOTSTRAP_USERNAME: 'smokeadmin', ADMIN_BOOTSTRAP_EMAIL: 'smoke-admin@example.invalid', ADMIN_BOOTSTRAP_PASSWORD: crypto.randomBytes(24).toString('hex') };
  const runChild = args => new Promise((resolve, reject) => { const child = spawn(process.execPath, args, { cwd: backend, env, stdio: ['ignore', 'ignore', 'pipe'] }); let error = ''; child.stderr.on('data', data => { error += data; }); child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Setup exited ${code}: ${error}`))); });
  let server;
  try {
    await runChild(['src/scripts/setupSprint4.js']); check('Documented setup command succeeds against a new MongoDB database', true);
    await runChild(['src/scripts/createAdmin.js']); check('Private admin bootstrap command succeeds', true);
    server = spawn(process.execPath, ['server.js'], { cwd: backend, env, stdio: ['ignore', 'ignore', 'pipe'] });
    let error = ''; server.stderr.on('data', data => { error += data; });
    const base = `http://127.0.0.1:${port}`;
    let health;
    for (let i = 0; i < 100; i++) { if (server.exitCode !== null) throw new Error(`Startup failed: ${error}`); try { health = await fetch(`${base}/api/health`); if (health.status === 200) break; } catch {} await delay(150); }
    check('Production-mode startup and database-aware health check return 200', health?.status === 200);
    const denied = await fetch(`${base}/api/admin/reports`); check('Anonymous report access returns 401', denied.status === 401);
    const login = await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: env.CLIENT_URL }, body: JSON.stringify({ username: env.ADMIN_BOOTSTRAP_USERNAME, password: env.ADMIN_BOOTSTRAP_PASSWORD }) });
    check('Privately bootstrapped admin can log in', login.status === 200);
    check('Configured HTTPS origin receives credentialed CORS headers', login.headers.get('access-control-allow-origin') === env.CLIENT_URL && login.headers.get('access-control-allow-credentials') === 'true');
    const cookie = login.headers.get('set-cookie') || '';
    check('Production refresh cookie uses HttpOnly, Secure and SameSite=Strict', /HttpOnly/i.test(cookie) && /Secure/i.test(cookie) && /SameSite=Strict/i.test(cookie));
    const credentials = await login.json(); const headers = { Authorization: `Bearer ${credentials.accessToken}` };
    const report = await fetch(`${base}/api/admin/reports`, { headers }); const body = await report.json();
    check('Authenticated admin report uses stored user count', report.status === 200 && body.report?.users.admins === 1);
    await mongoose.connect(env.MONGO_URI);
    check('Production startup does not create sample training content', await mongoose.connection.collection('trainingprogrammes').countDocuments() === 0 && await mongoose.connection.collection('learningsections').countDocuments() === 0 && await mongoose.connection.collection('challenges').countDocuments() === 0);
    check('Three server badge definitions and unique award index exist', await mongoose.connection.collection('badges').countDocuments() === 3 && (await mongoose.connection.collection('badgeawards').indexes()).some(i => i.unique && i.key.trainee && i.key.badge && i.key.programme));
    await mongoose.disconnect();
    const logout = await fetch(`${base}/api/auth/logout`, { method: 'POST', headers });
    check('Logout succeeds and revokes the old access token', logout.status === 200 && (await fetch(`${base}/api/admin/reports`, { headers })).status === 401);
    server.kill('SIGTERM'); await new Promise(resolve => server.once('exit', resolve));
    check('SIGTERM closes the server successfully', server.exitCode === 0);
    fs.writeFileSync(path.join(source, 'backend/docs/PRODUCTION_SMOKE_RESULTS.json'), JSON.stringify({ scope: 'Local production-mode process with a fresh isolated MongoDB database; no external hosting, real credentials, TLS transport or backup restoration tested.', runtime: process.version, dependencyInstall: 'Uses the npm ci installation validated for this task; no uploaded node_modules used.', checks }, null, 2) + '\n');
    console.log(JSON.stringify({ passed: checks.length, failed: 0 }));
  } finally {
    if (server && server.exitCode === null) { server.kill('SIGKILL'); await delay(100); }
    if (mongoose.connection.readyState) await mongoose.disconnect();
    await mongo.stop();
    fs.rmSync(clean, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { addSafetySimulationSamples } = require('../services/safetySimulationSamples');
const { migrateSafetySimulationIndexes } = require('../utils/safetySimulationIndexMigration');
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await migrateSafetySimulationIndexes(Challenge.collection);
    await Challenge.createIndexes();
    const admin = await User.findOne({ role: 'admin', status: 'active' });
    if (!admin) throw new Error('Create an active Admin first.');
    const result = await addSafetySimulationSamples({ id: String(admin._id), role: 'admin' });
    for (const row of result.created) console.log(`Created draft: ${row.title}`);
    for (const row of result.existing) console.log(`Already exists: ${row.title}`);
    for (const row of result.skipped) console.log(`Skipped ${row.title}: ${row.reason}`);
    console.log(`${result.created.length} created, ${result.existing.length} already present, ${result.skipped.length} skipped. Activate reviewed missions in Safety Simulations.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
})();

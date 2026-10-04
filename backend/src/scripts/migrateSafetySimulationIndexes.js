require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { migrateSafetySimulationIndexes, migratePuzzleStarterIndex } = require('../utils/safetySimulationIndexMigration');
(async () => {
  try { await mongoose.connect(process.env.MONGO_URI); await migrateSafetySimulationIndexes(mongoose.connection.collection('challenges')); await migratePuzzleStarterIndex(mongoose.connection.collection('puzzles')); await require('../models/Challenge').createIndexes(); await require('../models/Puzzle').createIndexes(); console.log('Challenge puzzle uniqueness index is simulation-compatible.'); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
})();

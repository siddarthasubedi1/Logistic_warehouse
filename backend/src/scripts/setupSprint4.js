/**
 * Idempotent Sprint 4 database preparation.
 *
 * - Does not delete, reset, or seed training programmes/trainee attempts.
 * - Restores required indexes on existing collections and installs the three
 *   approved badge definitions.
 * - Fails rather than silently discarding conflicting historical records.
 *
 * Usage from backend/: npm run setup:sprint4
 * Requires MONGO_URI in backend/.env (or the caller environment).
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { migrateTrainingProgressIndexes } = require('../utils/trainingProgressIndexMigration');
const { migrateSafetySimulationIndexes, migratePuzzleStarterIndex } = require('../utils/safetySimulationIndexMigration');
const { ensureDefinitions } = require('../services/achievementService');

async function setup() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required; configure backend/.env before running setup:sprint4.');
  await mongoose.connect(process.env.MONGO_URI);
  const database = mongoose.connection;

  // Migrations only correct obsolete index definitions. They never remove data.
  await migrateTrainingProgressIndexes(database.collection('trainingprogresses'));
  await migrateSafetySimulationIndexes(database.collection('challenges'));
  await migratePuzzleStarterIndex(database.collection('puzzles'));

  // Server-validated scoring, progress and achievements require unique indexes.
  for (const name of ['Puzzle', 'Challenge', 'ChallengeAttempt', 'PersonalBest', 'BadgeAward', 'Notification', 'AuditLog']) {
    const Model = require(`../models/${name}`);
    await Model.createIndexes();
  }
  await ensureDefinitions();
  console.log('Sprint 4 indexes and badge definitions are ready. Existing training data was preserved.');
}

setup().catch(error => {
  console.error('Sprint 4 setup failed:', error.message);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect().catch(() => {});
});

// Replace only the legacy puzzle uniqueness index. No documents are removed.
async function migrateSafetySimulationIndexes(collection) {
  let indexes = [];
  try { indexes = await collection.indexes(); } catch (error) { if (error.code !== 26) throw error; }
  const legacy = indexes.find(index => index.key?.puzzle === 1 && Object.keys(index.key).length === 1 && index.unique && !index.partialFilterExpression);
  if (legacy) await collection.dropIndex(legacy.name);
  await collection.createIndex({ puzzle: 1 }, { name: 'puzzle_1', unique: true, partialFilterExpression: { puzzle: { $type: 'objectId' } } });
}
module.exports = { migrateSafetySimulationIndexes };

// The supplied project used a compound sparse index: programme is always present,
// so custom puzzles with no starterKey wrongly collided with each other.
async function migratePuzzleStarterIndex(collection) {
  let indexes = [];
  try { indexes = await collection.indexes(); } catch (error) { if (error.code !== 26) throw error; }
  const legacy = indexes.find(index => index.key?.programme === 1 && index.key?.starterKey === 1 && index.unique && !index.partialFilterExpression);
  if (legacy) await collection.dropIndex(legacy.name);
  await collection.createIndex({ programme: 1, starterKey: 1 }, { name: 'programme_1_starterKey_1', unique: true, partialFilterExpression: { starterKey: { $type: 'string' } } });
}
module.exports.migratePuzzleStarterIndex = migratePuzzleStarterIndex;

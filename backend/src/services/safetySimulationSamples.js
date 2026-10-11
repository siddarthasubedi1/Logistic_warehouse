const Challenge = require('../models/Challenge');
const TrainingModule = require('../models/TrainingModule');
const { managerProgrammes } = require('./safetySimulationAccess');
const { simulationSamples } = require('../../../shared/simulationTemplates.mjs');
const { safetyMissionLibrary } = require('../../../shared/safetyMissionLibrary.mjs');
const { validateSimulation } = require('../../../shared/simulationEngine.mjs');

async function addSafetySimulationSamples(user, { includeLibrary = false, publishLibrary = false } = {}) {
  const programmes = (await managerProgrammes(user)).filter(row => row.status === 'active' && !row.deletedAt);
  const modules = await TrainingModule.find({ status: 'active' }).select('key').lean();
  const activeKeys = new Set(modules.map(row => row.key));
  const permittedKeys = new Set(programmes.map(row => row.programmeType));
  const libraryKeys = new Set(safetyMissionLibrary.map(row => row.key));
  const availableSamples = includeLibrary ? [...simulationSamples, ...safetyMissionLibrary] : simulationSamples;
  const samples = availableSamples.filter(sample => user.role === 'admin' || permittedKeys.has(sample.moduleKey));
  const result = { created: [], existing: [], skipped: [] };
  for (const sample of samples) {
    const isLibraryMission = libraryKeys.has(sample.key);
    // Never attach Intermediate or Advanced missions to Beginner programmes.
    // Access progression and assessment checks are linked to a programme's level.
    const candidates = programmes.filter(row => row.programmeType === sample.moduleKey &&
      (!isLibraryMission || row.level === sample.difficulty))
      .sort((a, b) => Number(b.level === sample.difficulty) - Number(a.level === sample.difficulty)
        || Number(b.level === 'beginner') - Number(a.level === 'beginner')
        || new Date(a.createdAt) - new Date(b.createdAt) || String(a._id).localeCompare(String(b._id)));
    const programme = candidates[0];
    if (!activeKeys.has(sample.moduleKey) || !programme) {
      result.skipped.push({ title: sample.title, moduleKey: sample.moduleKey, reason: isLibraryMission ? `Create an active ${sample.difficulty} training programme for ${sample.moduleKey} first.` : 'Create an active module and training programme first.' });
      continue;
    }
    const startActive = isLibraryMission && publishLibrary;
    // Preserve previously seeded or edited examples, including their status.
    const previous = await Challenge.findOne({
      type: 'safety_simulation', programme: programme._id, archivedAt: null,
      $or: [{ sampleKey: sample.key }, { sampleKey: { $exists: false }, title: sample.title }]
    }).lean();
    if (previous) { result.existing.push({ id: String(previous._id), title: previous.title }); continue; }
    const { key, ...template } = sample;
    let saved;
    try {
      saved = await Challenge.findOneAndUpdate(
        { type: 'safety_simulation', programme: programme._id, sampleKey: key, archivedAt: null },
        {
          $setOnInsert: {
            ...template, sampleKey: key, type: 'safety_simulation', programme: programme._id,
            simulation: validateSimulation(template.simulation), createdBy: user.id, updatedBy: user.id,
            status: startActive ? 'active' : 'draft', ...(startActive ? { activatedAt: new Date() } : {})
          }
        },
        { upsert: true, returnDocument: 'after', includeResultMetadata: true, runValidators: true, setDefaultsOnInsert: true }
      );
    } catch (error) {
      if (error.code !== 11000) throw error;
      const concurrent = await Challenge.findOne({ programme: programme._id, sampleKey: key, archivedAt: null }).lean();
      if (!concurrent) throw error;
      result.existing.push({ id: String(concurrent._id), title: concurrent.title }); continue;
    }
    const row = { id: String(saved.value._id), title: saved.value.title, moduleKey: sample.moduleKey, programmeId: String(programme._id) };
    (saved.lastErrorObject.updatedExisting ? result.existing : result.created).push(row);
  }
  return result;
}

module.exports = { addSafetySimulationSamples };

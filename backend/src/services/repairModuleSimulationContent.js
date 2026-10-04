const Challenge = require('../models/Challenge');
const TrainingProgramme = require('../models/TrainingProgramme');
const { simulationTemplates, simulationTemplate } = require('../../../shared/simulationTemplates.mjs');
const { validateSimulation } = require('../../../shared/simulationEngine.mjs');

const canonical = value => Array.isArray(value) ? value.map(canonical)
    : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const signature = simulation => JSON.stringify(canonical(validateSimulation(simulation)));

function inheritedTemplateModule(game) {
    try {
        return Object.entries(simulationTemplates).find(([, template]) =>
            game.title === template.title && game.description === template.description
            && game.instructions === template.instructions
            && signature(game.simulation) === signature(template.simulation))?.[0] || null;
    } catch { return null; }
}

// The user-requested removal also covers older edited copies whose description
// or artwork differs from the original template fingerprint.
function misplacedWarehouseMission(game, targetKey = game.moduleKey) {
    return ['cyber-awareness', 'working-at-height'].includes(targetKey)
        && /^warehouse handling mission(?:\s*\(copy\))?$/i.test(String(game.title || '').trim());
}

// Remove misplaced warehouse missions through the existing archive lifecycle.
// Other unchanged inherited templates are repaired. Historical scores and
// attempt snapshots remain intact; running this repeatedly is safe.
async function repairModuleSimulationContent() {
    const games = await Challenge.find({ type: 'safety_simulation', archivedAt: null }).lean();
    const programmes = await TrainingProgramme.find({ _id: { $in: games.map(game => game.programme) } }).select('programmeType').lean();
    const programmeKeys = new Map(programmes.map(row => [String(row._id), row.programmeType]));
    const repaired = [], archived = [];
    for (const game of games) {
        const targetKey = programmeKeys.get(String(game.programme));
        if (misplacedWarehouseMission(game, targetKey)) {
            const at = new Date();
            const result = await Challenge.updateOne({ _id: game._id, __v: game.__v, updatedAt: game.updatedAt }, {
                $set: { status: 'inactive', archivedAt: at, deactivatedAt: at }, $inc: { __v: 1 },
            }, { runValidators: true });
            if (result.modifiedCount) archived.push({ id: String(game._id), moduleKey: targetKey, title: game.title });
            continue;
        }
        const sourceKey = inheritedTemplateModule(game);
        if (!sourceKey || sourceKey === targetKey || !simulationTemplates[targetKey]) continue;
        const template = simulationTemplate(targetKey);
        const result = await Challenge.updateOne({ _id: game._id, __v: game.__v, updatedAt: game.updatedAt }, {
            $set: { moduleKey: targetKey, title: template.title, description: template.description,
                instructions: template.instructions, thumbnail: template.thumbnail,
                simulation: validateSimulation(template.simulation) },
            $inc: { __v: 1 },
        }, { runValidators: true });
        if (result.modifiedCount) repaired.push({ id: String(game._id), from: sourceKey, to: targetKey, title: template.title });
    }
    return { repaired, archived };
}

module.exports = { inheritedTemplateModule, misplacedWarehouseMission, repairModuleSimulationContent };

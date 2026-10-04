const { randomUUID } = require('crypto');
const Puzzle = require('../models/Puzzle');
const Challenge = require('../models/Challenge');

const definitions = {
  'manual-handling': {
    title: 'Prop Lab — Prepare the Load Move',
    pairs: [
      ['A heavy boxed load needs moving along a level clear route', 'Suitable rated trolley', 'move'],
      ['The planned route contains loose packaging', 'Route clearance before moving', 'route'],
      ['A bulky load needs coordinated handling by two people', 'Agreed team lifting commands', 'communicate'],
    ],
    feedback: 'A suitable trolley reduces carrying. Clear loose packaging before movement. A planned team lift needs agreed commands; stop if the load exceeds safe capability.',
  },
  'working-at-height': {
    title: 'Prop Lab — Protect the Work Area',
    pairs: [
      ['People could walk below the elevated work area', 'Exclusion barriers', 'barrier'],
      ['Access equipment has a visible defect', 'Remove from service and report', 'report'],
      ['A task could be completed safely without climbing', 'Ground-level working method', 'plan'],
    ],
    feedback: 'Barriers restrict access below the work. Defective equipment must be removed from service and reported. Avoid work at height where a safe ground-level method is available.',
  },
  'cyber-awareness': {
    title: 'Prop Lab — Secure the Workstation',
    pairs: [
      ['You are leaving your workstation unattended', 'Screen lock', 'lock'],
      ['An unexpected payment request arrives by email', 'Independent trusted verification', 'verify'],
      ['You find an unknown USB device', 'Isolate and report without connecting', 'report'],
    ],
    feedback: 'Lock an unattended workstation. Verify unusual payment requests independently through a known contact. Do not connect unknown USB devices; report them through the approved process.',
  },
};

async function ensurePropChallenge(programme, actor) {
  const definition = definitions[programme.programmeType];
  if (!definition || !actor) return;
  const starterKey = `prop-lab:${programme.programmeType}`;
  let puzzle = await Puzzle.findOne({ programme: programme._id, starterKey });
  if (!puzzle) {
    const props = definition.pairs.map(([, label, image]) => ({ id: randomUUID(), label, imageUrl: `/puzzle-images/${image}.svg`, imageAlt: label }));
    const targets = definition.pairs.map(([label]) => ({ id: randomUUID(), label }));
    const definitionRow = {
      programme: programme._id, moduleKey: programme.programmeType, starterKey,
      title: definition.title, type: 'matching',
      instructions: 'Match each digital prop or control to the situation where it belongs. Select a prop and then a target, or drag it. Fill every target before checking.',
      digitalProps: props, targets, expectedSolution: Object.fromEntries(targets.map((t, i) => [t.id, props[i].id])),
      hint: 'Consider which control directly reduces the risk in each situation.',
      correctFeedback: definition.feedback, incorrectFeedback: `Review the placements. ${definition.feedback}`,
      createdBy: actor, status: 'active',
    };
    try { puzzle = await Puzzle.create(definitionRow); }
    catch (error) { if (error.code !== 11000) throw error; puzzle = await Puzzle.findOne({ programme: programme._id, starterKey }); }
  }
  // Insert only: retain manager edits and deactivation on future checks.
  await Challenge.updateOne({ puzzle: puzzle._id }, { $setOnInsert: {
    puzzle: puzzle._id, createdBy: actor, timeLimitSeconds: 240, basePoints: 800,
    maxTimeBonus: 200, maxScore: 1000, hintPenalty: 40, incorrectPenalty: 0,
    tieRule: 'faster-time', status: 'active',
  } }, { upsert: true, setDefaultsOnInsert: true });
}
module.exports = { definitions, ensurePropChallenge };

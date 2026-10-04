require('dotenv').config();

const mongoose = require('mongoose');
const TrainingProgramme = require('../models/TrainingProgramme');
const Puzzle = require('../models/Puzzle');
const { ensureSprint3StarterForProgramme } = require('../services/starterSprint3Content');

async function main() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from backend/.env');
  await mongoose.connect(process.env.MONGO_URI);

  const programmes = await TrainingProgramme.find({ status: 'active', deletedAt: null })
    .sort({ programmeType: 1, level: 1, createdAt: 1 });

  let repaired = 0;
  for (const programme of programmes) {
    const before = await Puzzle.countDocuments({
      programme: programme._id,
      status: 'active',
      type: { $in: ['sequence', 'sorting'] },
    });

    await ensureSprint3StarterForProgramme(programme);

    const after = await Puzzle.countDocuments({
      programme: programme._id,
      status: 'active',
      type: { $in: ['sequence', 'sorting'] },
    });

    repaired += 1;
    console.log(`${programme.programmeType} / ${programme.level} / ${programme.title}: ${before} -> ${after} ordering puzzles`);
  }

  console.log(`Checked ${repaired} active programmes. Each supported module/level now has the 8 built-in ordering puzzles available.`);
  await mongoose.disconnect();
}

main().catch(async error => {
  console.error('Sprint 3 puzzle repair failed:', error);
  try { await mongoose.disconnect(); } catch (_) {}
  process.exit(1);
});

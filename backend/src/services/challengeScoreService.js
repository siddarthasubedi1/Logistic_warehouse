const PersonalBest = require('../models/PersonalBest');
const ChallengeAttempt = require('../models/ChallengeAttempt');

async function maybeUpdatePersonalBest(attempt, challenge) {
  // A personal best exists only for a fully correct solution. Partial or
  // incorrect arrangements are still kept as attempts, but never as scores.
  if (attempt.validityStatus !== 'valid' || Number(attempt.accuracy) !== 1 || Number(attempt.score) <= 0) return { updated: false, personalBest: null };
  const current = await PersonalBest.findOne({ trainee: attempt.trainee, challenge: attempt.challenge });
  if (current && Number(current.score) >= Number(attempt.score)) return { updated: false, personalBest: current };
  const alternatives = [{ score: { $lt: attempt.score } }];
  try {
    const personalBest = await PersonalBest.findOneAndUpdate(
      { trainee: attempt.trainee, challenge: attempt.challenge, $or: alternatives },
      { $set: { trainee: attempt.trainee, challenge: attempt.challenge, programme: attempt.programme, puzzle: attempt.puzzle, type: attempt.type || 'puzzle', achievedAt: attempt.finishedAt || new Date(), attempt: attempt._id, score: attempt.score, durationSeconds: attempt.durationSeconds } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return { updated: true, personalBest };
  } catch (error) {
    // The unique trainee/challenge index prevents a slower or lower concurrent
    // attempt from replacing an existing best when the comparison does not match.
    if (error.code !== 11000) throw error;
    // Two first submissions can race to insert. Retry the comparison so a
    // higher score that lost the insert race still becomes the personal best.
    const improved = await PersonalBest.findOneAndUpdate(
      { trainee: attempt.trainee, challenge: attempt.challenge, $or: alternatives },
      { $set: { achievedAt: attempt.finishedAt || new Date(), attempt: attempt._id, score: attempt.score, durationSeconds: attempt.durationSeconds } },
      { new: true }
    );
    return { updated: !!improved, personalBest: improved || await PersonalBest.findOne({ trainee: attempt.trainee, challenge: attempt.challenge }) };
  }
}

async function leaderboardEntries(challengeId, programmeId) {
  const rows = await ChallengeAttempt.aggregate([
    { $match: { challenge: challengeId, programme: programmeId, result: 'completed', validityStatus: 'valid', accuracy: 1, score: { $gt: 0 } } },
    { $group: { _id: '$trainee', score: { $max: '$score' } } },
    { $sort: { score: -1, _id: 1 } }, { $limit: 100 }, { $project: { _id: 0, score: 1 } },
  ]);
  let rank = 0;
  return rows.map((row, index) => { if (!index || row.score !== rows[index - 1].score) rank = index + 1; return { rank, score: row.score }; });
}
module.exports = { maybeUpdatePersonalBest, leaderboardEntries };

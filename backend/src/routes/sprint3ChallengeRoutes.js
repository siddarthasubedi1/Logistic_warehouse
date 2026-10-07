const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const active = require('../middleware/checkActiveStatus');
const c = require('../controllers/sprint3ChallengeController');

const r = express.Router();
r.use(authenticate, active);

r.get('/puzzles', authorize('admin', 'trainer'), c.listPuzzles);
r.post('/puzzles', authorize('admin', 'trainer'), c.createPuzzle);
r.patch('/puzzles/:id', authorize('admin', 'trainer'), c.updatePuzzle);
r.post('/challenges', authorize('admin', 'trainer'), c.createChallenge);
r.get('/programmes/:id/activities', authorize('admin', 'trainer', 'trainee'), c.programmeActivities);
r.get('/challenges/:id/leaderboard', authorize('trainee'), c.leaderboard);
r.post('/challenges/:id/start', authorize('trainee'), c.startChallenge);
r.post('/challenge-attempts/:attemptId/hint', authorize('trainee'), c.useHint);
r.post('/challenges/:id/hazard-action', authorize('trainee'), c.hazardAction);
r.post('/challenges/:id/submit', authorize('trainee'), c.submitChallenge);
r.get('/trainee/challenge-attempts', authorize('trainee'), c.myAttempts);
r.get('/trainee/personal-bests', authorize('trainee'), c.myPersonalBests);
r.get('/trainee/puzzle-scores', authorize('trainee'), c.totalScores);
r.get('/programmes/:id/challenge-results', authorize('admin', 'trainer'), c.challengeResults);

require("../middleware/validateRequest").configureRouter(r);

module.exports = r;

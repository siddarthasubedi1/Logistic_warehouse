const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const monitoring = require('../controllers/trainerMonitoringController');
const notifications = require('../controllers/notificationController');
const badges = require('../controllers/badgeController');
router.use(authenticate);
router.get('/trainer/monitoring', authorize('admin', 'trainer'), monitoring.list);
router.get('/trainer/monitoring/trainees/:traineeId', authorize('admin', 'trainer'), monitoring.detail);
router.get('/notifications', notifications.list);
router.get('/notifications/unread-count', notifications.unread);
router.patch('/notifications/read-all', notifications.readAll);
router.patch('/notifications/:id/read', notifications.read);
router.get('/badges', badges.definitions);
router.get('/users/me/badges', authorize('trainee'), badges.mine);
require("../middleware/validateRequest").configureRouter(router);

module.exports = router;

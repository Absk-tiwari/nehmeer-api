const express = require('express');
const router = express.Router();
const NotificationController = require('../modules/notification.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, NotificationController.getMyNotifications);
router.patch('/read-all', authenticate, NotificationController.markAllAsRead);
router.post('/:id/read', authenticate, NotificationController.markAsRead);
module.exports = router;

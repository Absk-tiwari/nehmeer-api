const NotificationService = require('../services/NotificationService');

class NotificationController {
    async getMyNotifications(req, res, next) {
        try {
            const { page, limit, unread_only } = req.query;
            const result = await NotificationService.getForUser(req.user.id, {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20,
                unread_only: unread_only === 'true',
            });
            const unreadCount = await NotificationService.getUnreadCount(req.user.id);
            res.json({
                success: true,
                data: result.results,
                unread_count: unreadCount,
                pagination: { total: result.total },
            });
        } catch (err) { next(err); }
    }

    async markAsRead(req, res, next) {
        try {
            await NotificationService.markAsRead(req.params.id, req.user.id);
            res.json({ success: true, message: 'Notification marked as read' });
        } catch (err) { next(err); }
    }

    async markAllAsRead(req, res, next) {
        try {
            await NotificationService.markAllAsRead(req.user.id);
            res.json({ success: true, message: 'All notifications marked as read' });
        } catch (err) { next(err); }
    }
}

module.exports = new NotificationController();

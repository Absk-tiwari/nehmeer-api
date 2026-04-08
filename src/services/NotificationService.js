const Notification = require('../database/models/Notification');

class NotificationService {
    async create({ user_id, type, title, message, data = null }) {
        return Notification.query().insertAndFetch({ user_id, type, title, message, data });
    }

    async getForUser(userId, { page = 1, limit = 20, unread_only = false } = {}) {
        let query = Notification.query()
            .where('user_id', userId)
            .orderBy('created_at', 'desc')
            .page(page - 1, limit);

        if (unread_only) query = query.modify('unread');

        return query;
    }

    async markAsRead(notificationId, userId) {
        return Notification.query()
            .patchAndFetchById(notificationId, { is_read: true, read_at: new Date() })
            .where('user_id', userId);
    }

    async markAllAsRead(userId) {
        return Notification.query()
            .patch({ is_read: true, read_at: new Date() })
            .where({ user_id: userId, is_read: false });
    }

    async getUnreadCount(userId) {
        const result = await Notification.query()
            .where({ user_id: userId, is_read: false })
            .count('id as count')
            .first();
        return parseInt(result.count, 10);
    }

    // ─── Typed Helpers ───────────────────────────────────────────────────────────
    async notifyApplicationReceived(employerId, applicantName, jobTitle, jobId, applicationId) {
        return this.create({
            user_id: employerId,
            type: 'application_received',
            title: 'New Application Received',
            message: `${applicantName} applied for your job: ${jobTitle}`,
            data: { job_id: jobId, application_id: applicationId },
        });
    }

    async notifyApplicationStatusChanged(applicantId, status, jobTitle, applicationId) {
        return this.create({
            user_id: applicantId,
            type: 'application_status_changed',
            title: 'Application Status Updated',
            message: `Your application for "${jobTitle}" has been updated to: ${status}`,
            data: { application_id: applicationId, status },
        });
    }

    async notifyReviewReceived(userId, reviewerName, rating) {
        return this.create({
            user_id: userId,
            type: 'review_received',
            title: 'New Review Received',
            message: `${reviewerName} left you a ${rating}-star review`,
            data: { rating },
        });
    }

    async notifySubscriptionActivated(userId, planName) {
        return this.create({
            user_id: userId,
            type: 'subscription_activated',
            title: 'Subscription Activated',
            message: `Your ${planName} plan is now active. Enjoy your benefits!`,
            data: { plan_name: planName },
        });
    }

    async notifySubscriptionExpiring(userId, planName, daysLeft) {
        return this.create({
            user_id: userId,
            type: 'subscription_expiring',
            title: 'Subscription Expiring Soon',
            message: `Your ${planName} plan expires in ${daysLeft} day(s). Renew to keep access.`,
            data: { plan_name: planName, days_left: daysLeft },
        });
    }
}

module.exports = new NotificationService();

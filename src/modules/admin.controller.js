const User = require('../database/models/User');
const Job = require('../database/models/Job');
const UserSubscription = require('../database/models/UserSubscription');
const SubscriptionPlan = require('../database/models/SubscriptionPlan');

class AdminController {
    // ─── Dashboard Stats ─────────────────────────────────────────────────────────
    async getStats(req, res, next) {
        try {
            const [totalUsers, totalJobs, activeSubscriptions, totalJobSeekers, totalEmployers] =
                await Promise.all([
                    User.query().count('id as count').first(),
                    Job.query().count('id as count').first(),
                    UserSubscription.query().where('status', 'active').count('id as count').first(),
                    User.query().where('role', 'job_seeker').count('id as count').first(),
                    User.query().where('role', 'employer').count('id as count').first(),
                ]);

            res.json({
                success: true,
                data: {
                    total_users: parseInt(totalUsers.count),
                    total_jobs: parseInt(totalJobs.count),
                    active_subscriptions: parseInt(activeSubscriptions.count),
                    total_job_seekers: parseInt(totalJobSeekers.count),
                    total_employers: parseInt(totalEmployers.count),
                },
            });
        } catch (err) { next(err); }
    }

    // ─── Users ───────────────────────────────────────────────────────────────────
    async listUsers(req, res, next) {
        try {
            const { page = 1, limit = 20, role, search, is_active } = req.query;
            let query = User.query()
                .withGraphFetched('[workerProfile, employerProfile]')
                .orderBy('created_at', 'desc')
                .page(parseInt(page) - 1, parseInt(limit));

            if (role) query = query.where('role', role);
            if (search) query = query.where((b) => b.whereLike('email', `%${search}%`).orWhereLike('first_name', `%${search}%`));
            if (is_active !== undefined) query = query.where('is_active', is_active === 'true');

            const result = await query;
            res.json({ success: true, data: result.results, pagination: { total: result.total } });
        } catch (err) { next(err); }
    }

    async toggleUserStatus(req, res, next) {
        try {
            const user = await User.query().findById(req.params.id);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            const updated = await User.query().patchAndFetchById(user.id, { is_active: !user.is_active });
            res.json({ success: true, message: `User ${updated.is_active ? 'activated' : 'deactivated'}`, data: updated });
        } catch (err) { next(err); }
    }

    // ─── Jobs ────────────────────────────────────────────────────────────────────
    async listJobs(req, res, next) {
        try {
            const { page = 1, limit = 20, status } = req.query;
            let query = Job.query()
                .withGraphFetched('employer.[employerProfile]')
                .orderBy('created_at', 'desc')
                .page(parseInt(page) - 1, parseInt(limit));

            if (status) query = query.where('status', status);

            const result = await query;
            res.json({ success: true, data: result.results, pagination: { total: result.total } });
        } catch (err) { next(err); }
    }

    async toggleJobFeatured(req, res, next) {
        try {
            const job = await Job.query().findById(req.params.id);
            if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

            const updated = await Job.query().patchAndFetchById(job.id, { is_featured: !job.is_featured });
            res.json({ success: true, message: `Job ${updated.is_featured ? 'featured' : 'unfeatured'}`, data: updated });
        } catch (err) { next(err); }
    }

    // ─── Plans ───────────────────────────────────────────────────────────────────
    async createPlan(req, res, next) {
        try {
            const plan = await SubscriptionPlan.query().insertAndFetch(req.body);
            res.status(201).json({ success: true, data: plan });
        } catch (err) { next(err); }
    }

    async updatePlan(req, res, next) {
        try {
            const plan = await SubscriptionPlan.query().patchAndFetchById(req.params.id, req.body);
            res.json({ success: true, data: plan });
        } catch (err) { next(err); }
    }

    async deletePlan(req, res, next) {
        try {
            await SubscriptionPlan.query().deleteById(req.params.id);
            res.json({ success: true, message: 'Plan deleted' });
        } catch (err) { next(err); }
    }
}

module.exports = new AdminController();

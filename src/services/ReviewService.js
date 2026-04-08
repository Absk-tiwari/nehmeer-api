const Review = require('../database/models/Review');
const User = require('../database/models/User');
const NotificationService = require('./NotificationService');

class ReviewService {
    async create(reviewerId, { reviewee_id, job_id, rating, comment, reviewer_role }) {
        if (reviewerId === reviewee_id) {
            const err = new Error('You cannot review yourself');
            err.status = 400;
            throw err;
        }

        const existing = await Review.query().findOne({ reviewer_id: reviewerId, reviewee_id, job_id: job_id || null });
        if (existing) {
            const err = new Error('You have already reviewed this user for this job');
            err.status = 409;
            throw err;
        }

        const review = await Review.query().insertAndFetch({
            reviewer_id: reviewerId,
            reviewee_id,
            job_id: job_id || null,
            rating,
            comment,
            reviewer_role,
        });

        const reviewer = await User.query().findById(reviewerId);
        await NotificationService.notifyReviewReceived(
            reviewee_id,
            `${reviewer.first_name} ${reviewer.last_name}`,
            rating
        );

        return review;
    }

    async getForUser(userId, { page = 1, limit = 20 } = {}) {
        return Review.query()
            .where('reviewee_id', userId)
            .where('is_visible', true)
            .withGraphFetched('reviewer')
            .orderBy('created_at', 'desc')
            .page(page - 1, limit);
    }

    async getAverageRating(userId) {
        const result = await Review.query()
            .where({ reviewee_id: userId, is_visible: true })
            .avg('rating as average')
            .count('id as total')
            .first();

        return {
            average: parseFloat(result.average) || 0,
            total: parseInt(result.total, 10),
        };
    }

    async delete(reviewId, reviewerId) {
        const review = await Review.query().findOne({ id: reviewId, reviewer_id: reviewerId });
        if (!review) {
            const err = new Error('Review not found or access denied');
            err.status = 404;
            throw err;
        }
        return Review.query().deleteById(reviewId);
    }
}

module.exports = new ReviewService();

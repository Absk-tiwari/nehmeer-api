const ReviewService = require('../services/ReviewService');

class ReviewController {
  async create(req, res, next) {
    try {
      const review = await ReviewService.create(req.user.id, req.body);
      res.status(201).json({ success: true, message: 'Review submitted', data: review });
    } catch (err) { next(err); }
  }

  async getForUser(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await ReviewService.getForUser(req.params.userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      });
      const stats = await ReviewService.getAverageRating(req.params.userId);
      res.json({ success: true, data: result.results, stats, pagination: { total: result.total } });
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await ReviewService.delete(req.params.id, req.user.id);
      res.json({ success: true, message: 'Review deleted' });
    } catch (err) { next(err); }
  }
}

module.exports = new ReviewController();

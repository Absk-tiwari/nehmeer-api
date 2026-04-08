const JobCustomRequirementService = require('../services/JobCustomRequirementService');
const JobService = require('../services/JobService');

class JobController {
    async list(req, res, next) {
        try {
            // const { tab, page, limit, sortBy, search, job_type, experience_level, location } = req.query;
            const {
                tab = "all",
                pagination = {},
                filters = {},
                sortBy
            } = req.body;
            const { page = 1, limit = 20 } = pagination;

            const result = await JobService.list({
                tab,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20,
                sortBy,
                filters
            });
            res.json({
                success: true,
                data: result.results.map(job => ({
                    ...job,
                    role: job.role.name,
                    answers: job.answers.map(a => ({
                        question: a.question.question_text,
                        answer: a.answer
                    }))
                })),
                pagination: {
                    total: result.total,
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 20
                }
            });
        } catch (err) { next(err); }
    }

    async getById(req, res, next) {
        try {
            const job = await JobService.getById(req.params.id, req.user.id);
            res.json({ success: true, data: job });
        } catch (err) { next(err); }
    }

    async create(req, res, next) {
        try {
            const job = await JobService.create(req.user.id, req.body);
            res.status(201).json({ success: true, message: 'Job created', data: job });
        } catch (err) { next(err); }
    }

    async getMyJobs(req, res, next) {
        try {
            const { page, limit, search, job_type, experience_level, location } = req.query;
            const result = await JobService.getOwnJobs(req.user.id, {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20,
                search, job_type, experience_level, location
            });
            res.json({
                success: true,
                data: result.results.map(job => ({
                    ...job,
                    role: job.role.name,
                    answers: job.answers.map(a => ({
                        question: a.question.question_text,
                        answer: a.answer
                    }))
                })),
                pagination: {
                    total: result.total,
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 20
                }
            });
        } catch (err) { next(err); }
    }

    async update(req, res, next) {
        try {
            const job = await JobService.update(req.params.id, req.user.id, req.body);
            res.json({ success: true, message: 'Job updated', data: job });
        } catch (err) { next(err); }
    }

    async closeJob(req, res, next) {
        try {
            const job = await JobService.closeJob(req.params.id, req.user.id);
            res.json({ success: true, message: 'Job closed', data: job });
        } catch (err) { next(err); }
    }

    async delete(req, res, next) {
        try {
            await JobService.delete(req.params.id, req.user.id);
            res.json({ success: true, message: 'Job deleted' });
        } catch (err) { next(err); }
    }

    async sendHireRequest(req, res, next) {
        try {
            const job = await JobCustomRequirementService.customRequest(req.user.id, req.body);
            res.status(201).json({ success: true, message: 'Requirements sent!', data: job });
        } catch (err) { next(err); }
        1
    }

    async getMyCustomRequests(req, res, next) {
        try {

            const { page, limit } = req.query;
            // console.log("Ye rha mai: "+ JSON.stringify(req.user.role) + " aur ye Meri custom requests : " + page + " limit: " + limit);
            const result = await JobCustomRequirementService.getOwnCustomRequests(req.user.id, {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20
            });
            res.json({
                success: true,
                data: result.results,
                pagination: {
                    total: result.total,
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 20
                }
            });

        } catch (err) { next(err); }
    }

}

module.exports = new JobController();

const JobRole = require('../database/models/JobRole');
const ApplicationService = require('../services/ApplicationService');
const { requirementDetails } = require('../utils/helpers');

class ApplicationController {

    async apply(req, res, next) {
        try {
            const application = await ApplicationService
                .apply(req.user.id, req.params.jobId, req.body);

            res.status(201)
                .json({
                    success: true,
                    message: 'Application submitted',
                    data: application
                });

        } catch (err) { next(err); }
    }

    async getMyApplications(req, res, next) {
        try {
            const { page, limit, status } = req.query;
            const result = await ApplicationService
                .getMyApplications(req.user.id, {
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 20,
                    status,
                });

            res.json({
                success: true,
                data: result.results,
                pagination: { total: result.total }
            });

        } catch (err) { next(err); }
    }

    async getJobApplications(req, res, next) {
        try {
            const { page, limit, status } = req.query;
            const result = await ApplicationService
                .getJobApplications(req.params.jobId, req.user.id, {
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 20,
                    status,
                });

            res.json({
                success: true,
                data: result.results,
                pagination: { total: result.total }
            });

        } catch (err) { next(err); }
    }

    async updateStatus(req, res, next) {
        try {
            const { status, employer_notes } = req.body;
            const application = await ApplicationService
                .updateStatus(req.params.id, req.user.id, status, employer_notes);

            res.json({
                success: true,
                message: 'Application status updated',
                data: application
            });

        } catch (err) { next(err); }
    }

    async withdraw(req, res, next) {
        try {
            const application = await ApplicationService
                .withdraw(req.params.id, req.user.id);

            res.json({
                success: true,
                message: 'Application withdrawn',
                data: application
            });

        } catch (err) { next(err); }
    }

    async getQuestionAnswers(req, res, next) {
        try {
            const result = await JobRole.query()
                .withGraphFetched('qa');
            console.log(result);
            res.json(result);
        } catch (error) {
            next(error)
        }
    }

    async getCustomQuestions(req, res, next) {
        try {
            const { role } = req.query;
            const result = await JobRole.query()
                .whereLike('name', `%${role}%`)
                .withGraphFetched('custom_questions')
                .modifyGraph('custom_questions', builder => {
                    builder.select('id','question_key', 'question_text');
                });

            res.json({
                requirementDetails: [...requirementDetails],
                duties: result[0]?.custom_questions || [],
            });

        } catch (error) {
            next(error)
        }
    }

}

module.exports = new ApplicationController();

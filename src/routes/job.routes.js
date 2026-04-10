const express = require('express');
const router = express.Router();
const JobController = require('../modules/job.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {validate} = require('../middleware/validation.middleware');
const { createJobSchema, updateJobSchema, applySchema, updateApplicationStatusSchema } = require('../validations/schemas');
const ApplicationController = require('../modules/application.controller');

// Public
router.post('/', JobController.list);
router.get('/qa', ApplicationController.getQuestionAnswers);
router.get('/custom-questions', ApplicationController.getCustomQuestions);
router.get('/custom-requests', authenticate, JobController.getMyCustomRequests);
router.post('/custom-request', authenticate, JobController.sendHireRequest);
router.post('/custom-request-response', authenticate, JobController.respondRequest);

// Employer: manage jobs
router.post('/create', authenticate, authorize('employer', 'admin'), validate(createJobSchema), JobController.create);
router.get('/my/listings', authenticate, authorize('employer', 'admin'), JobController.getMyJobs);
router.put('/:id', authenticate, authorize('employer', 'admin'), validate(updateJobSchema), JobController.update);
router.patch('/:id/close', authenticate, authorize('employer', 'admin'), JobController.closeJob);
router.get('/:id', authenticate, JobController.getById);
router.delete('/:id', authenticate, authorize('employer', 'admin'), JobController.delete);



// Employer: manage applications for a job
router.patch('/applications/:id/status', authenticate, authorize('employer'), validate(updateApplicationStatusSchema), ApplicationController.updateStatus);
router.post('/:jobId/apply', authenticate, authorize('worker'), ApplicationController.apply);
router.post('/:jobId/applicants', authenticate, authorize('employer'), ApplicationController.getJobApplications);

// Job Seeker: apply
router.post('/:jobId/apply', authenticate, authorize('job_seeker'), validate(applySchema), ApplicationController.apply);

module.exports = router;

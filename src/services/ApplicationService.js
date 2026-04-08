const Application = require('../database/models/Application');
const Job = require('../database/models/Job');
const User = require('../database/models/User');
const NotificationService = require('./NotificationService');
const JobCustomRequirementService = require('./JobCustomRequirementService');

class ApplicationService {
    // ─── Apply to a Job ──────────────────────────────────────────────────────────
    async apply(applicantId, jobId) {
        const job = await Job.query().findOne({ id: jobId, status: 'active' });
        if (!job) {
            const err = new Error('Job not found or no longer accepting applications');
            err.status = 404;
            throw err;
        }
        const existing = await Application.query().findOne({ job_id: jobId, applicant_id: applicantId });
        if (existing) {
            const err = new Error('You have already applied to this job');
            err.status = 409;
            throw err;
        }

        const application = await Application.query().insertAndFetch({
            job_id: jobId,
            applicant_id: applicantId,
            cover_letter,
            resume_url,
        });
        // Save custom answers if any
        if (custom_answers.length > 0) {
            await JobCustomRequirementService.saveAnswers(application.id, jobId, custom_answers);
        }

        // Notify employer
        const applicant = await User.query().findById(applicantId);
        await NotificationService.notifyApplicationReceived(
            job.employer_id,
            `${applicant.first_name} ${applicant.last_name}`,
            job.title,
            job.id,
            application.id
        );

        return application;
    }

    // ─── Applicant: My Applications ──────────────────────────────────────────────
    async getMyApplications(applicantId, { page = 1, limit = 20, status } = {}) {
        let query = Application.query()
            .where('applicant_id', applicantId)
            .withGraphFetched('job.[employer.[employerProfile]]')
            .orderBy('created_at', 'desc')
            .page(page - 1, limit);

        if (status) query = query.where('status', status);
        return query;
    }

    // ─── Employer: Applications for a Job ───────────────────────────────────────
    async getJobApplications(jobId, employerId, { page = 1, limit = 20, status } = {}) {
        // Verify ownership
        const job = await Job.query().findOne({ id: jobId, employer_id: employerId });
        if (!job) {
            const err = new Error('Job not found or access denied');
            err.status = 404;
            throw err;
        }

        let query = Application.query()
            .where('job_id', jobId)
            .withGraphFetched('applicant.[workerProfile]')
            .orderBy('created_at', 'desc')
            .page(page - 1, limit);

        if (status) query = query.where('status', status);
        return query;
    }

    // ─── Employer: Update Application Status ────────────────────────────────────
    async updateStatus(applicationId, employerId, status, notes = null) {
        const application = await Application.query()
            .findById(applicationId)
            .withGraphFetched('job');

        if (!application || application.job.employer_id !== employerId) {
            const err = new Error('Application not found or access denied');
            err.status = 404;
            throw err;
        }

        const updated = await Application.query().patchAndFetchById(applicationId, {
            status,
            employer_notes: notes,
            viewed_at: application.viewed_at || new Date(),
        });

        // Notify applicant
        await NotificationService.notifyApplicationStatusChanged(
            application.applicant_id,
            status,
            application.job.title,
            applicationId
        );

        return updated;
    }

    // ─── Applicant: Withdraw Application ────────────────────────────────────────
    async withdraw(applicationId, applicantId) {
        const application = await Application.query().findOne({
            id: applicationId,
            applicant_id: applicantId,
        });

        if (!application) {
            const err = new Error('Application not found');
            err.status = 404;
            throw err;
        }

        if (['rejected', 'withdrawn'].includes(application.status)) {
            const err = new Error('Application cannot be withdrawn at this stage');
            err.status = 400;
            throw err;
        }

        return Application.query().patchAndFetchById(applicationId, { status: 'withdrawn' });
    }
}

module.exports = new ApplicationService();

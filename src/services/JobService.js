const Job = require('../database/models/Job');
const Application = require('../database/models/Application');
const NotificationService = require('./NotificationService');
const JobAnswer = require('../database/models/JobAnswer');

class JobService {
    // ─── Create Job ──────────────────────────────────────────────────────────────
    async create(employerId, data) {
        const job = await Job.query().insertAndFetch({
            employer_id: employerId,
            role_id: data.role_id,
            description: data.description,
            police_verification: data.police_verification
        });
        await JobAnswer.query().insertGraph(
            Object.keys(data.qa).map(k => ({
                job_post_id: job.id,
                question_id: Number(k),
                answer: data.qa[k],
            }))
        );
        return job;
    }

    // ─── List Jobs (public, with filters) ───────────────────────────────────────
    async list({ tab, page = 1, limit = 20, sortBy, filters } = {}) {
        const sorting = {
            "Newest First": 'created_at+desc',
            "Oldest First": 'created_at+asc',
            "Recently Updated": 'updated_at+desc',
        }
        const sorted = sorting[sortBy] || sorting["Newest First"];
        const [sortField, sortOrder] = sorted.split('+'); // hogya sortBy
        const statusFilter = tab.toLowerCase() === 'all' ? '' : tab; // hogya tab

        let query = Job.query()
            .withGraphFetched('[answers.question,role]')
            .orderBy(sortField, sortOrder)
            .page(page - 1, limit);
        if (statusFilter) {
            query = query.where('status', statusFilter);
        }
        // console.log("ye rhe filters ..." , filters, "ye rhe pagination", page, limit, "ye rhe sorting", sortBy);
        if (filters.search) {
            query.join('job_roles as jr', 'jr.id', 'jp.role_id')
                .where('jr.name', 'like', `%${filters.search}%`)
                .where('job_posts.description', 'like', `%${filters.search}%`);
        }
        if (filters.experience) {
            const exp = filters.experience.split('(')[1].replace(")", "");
            // console.log("Experience filter applied: ", exp);
            query
                .join('job_answers as ja_exp', 'ja_exp.job_post_id', 'job_posts.id')
                .join('job_questions as jq_exp', 'jq_exp.id', 'ja_exp.question_id')
                .where('jq_exp.question_text', 'like', '%experience%')
                .where('ja_exp.answer',  'like', `%${exp}%`); // 1-3
        }
        if (filters.location) {
            query
                .join('job_answers as ja_loc', 'ja_loc.job_post_id', 'job_posts.id')
                .join('job_questions as jq_loc', 'jq_loc.id', 'ja_loc.question_id')
                .where('jq_loc.question_text', 'like', '%location%')
                .where('ja_loc.answer', 'like', `%${filters.location}%`);
        }
        // console.log("Final Query: ", query.toKnexQuery().toString());
        return query;
    }

    // ─── Get Single Job ──────────────────────────────────────────────────────────
    async getById(jobId, userId) {
        const job = await Job.query()
            .findById(jobId)
            .withGraphFetched('[answers.question,role,employer]')

        if (!job) {
            const err = new Error('Job not found');
            err.status = 404;
            throw err;
        }
        const applied = await Application.query().where('applicant_id', userId).first();
        console.log("Returning response: ", { ...job, hasApplied: !!applied });
        return { ...job, hasApplied: !!applied };
    }

    // ─── Employer: Get Own Jobs ──────────────────────────────────────────────────
    async getOwnJobs(employerId, { page = 1, limit = 20, search, status } = {}) {
        // let query = Job.query()
        //     .where('employer_id', employerId)
        //     .withGraphFetched('[applications(selectCount)]')
        //     .modifiers({
        //         selectCount: (builder) => builder.count('id as count'),
        //     })
        //     .orderBy('created_at', 'desc')
        //     .page(page - 1, limit);

        // if (status) query = query.where('status', status);
        let query = Job.query()
            .where('employer_id', employerId)
            .withGraphFetched('[answers.question,role]')
            .orderBy('created_at', 'desc')
            .page(page - 1, limit);

        if (search) {
            query.join('job_roles as jr', 'jr.id', 'jp.role_id')
                .whereLike('jr.name', `%${search}%`)
                .whereLike('job_posts.description', `%${search}%`);
        }
        return query;
    }

    // ─── Update Job ──────────────────────────────────────────────────────────────
    async update(jobId, employerId, data) {
        const job = await Job.query().findOne({ id: jobId, employer_id: employerId });
        if (!job) {
            const err = new Error('Job not found or access denied');
            err.status = 404;
            throw err;
        }
        return Job.query().patchAndFetchById(jobId, data);
    }

    // ─── Delete / Close Job ──────────────────────────────────────────────────────
    async closeJob(jobId, employerId) {
        return this.update(jobId, employerId, { status: 'closed' });
    }

    async delete(jobId, employerId) {
        const job = await Job.query().findOne({ id: jobId, employer_id: employerId });
        if (!job) {
            const err = new Error('Job not found or access denied');
            err.status = 404;
            throw err;
        }
        return Job.query().deleteById(jobId);
    }
}

module.exports = new JobService();

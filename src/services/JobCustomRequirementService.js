const CustomRequest = require('../database/models/CustomRequest');

class JobCustomRequirementService {
    async customRequest(employerId, data) {
        console.log("Ye sab aya hai mere pas employer id: " + employerId + " k liye ", data);
        
        const {worker_id, ...rest} = data;

        const job = await CustomRequest.query().insertAndFetch({
            employer_id: employerId,
            worker_id, // This will be assigned by the backend when a worker accepts the request
            data: {...rest}
        });

        /*
        Ye sab aya hai mere pas employer id: 10 k liye  {
            title: 'Babysitter',
            availability: 'Full-time',
            shift: 'Night Shift: 9 PM - 12 AM',
            'experience of work': 'Intermediate (2-5 years)',
            language: 'hindi',
            religion: 'hindu',
            gender: 'Female',
            age: 'Adult (21–30)',
            baby_related_all_work: true,
            preparing_baby_for_sleep: true,
            description: 'Hmko ek worker ki talaas hai\n' +
                'Jo koi bhi gareeb ka bacha tayar ho\n' +
                'Wo iss location pr aakr join kar sakta hai\n'
            }
        */
        return job;
    }
    // ─── Get Requirements for a Job ───────────────────────────────────────────────
    async getForJob(jobId) {
        // return JobCustomRequirement.query()
        //     .where('job_id', jobId)
        //     .orderBy('sort_order', 'asc');
    }

    async getOwnCustomRequests(userId, { page = 1, limit = 20 }) {
        try {
            const result = await CustomRequest.query()
                .where('employer_id', userId)
                .orWhere('worker_id', userId)
                .orderBy('created_at', 'desc')
                .page(page - 1, limit);
            return result;

        } catch (err) {
            throw err;
        }
    }

    // ─── Add a Single Requirement ─────────────────────────────────────────────────
    // async add(jobId, employerId, data) {
    //     await this._assertOwnership(jobId, employerId);
    //     return JobCustomRequirement.query().insertAndFetch({ ...data, job_id: jobId });
    // }

    // // ─── Bulk Replace Requirements (save all at once) ─────────────────────────────
    // async bulkReplace(jobId, employerId, requirements) {
    //     await this._assertOwnership(jobId, employerId);

    //     // Delete existing, re-insert new set
    //     await JobCustomRequirement.query().delete().where('job_id', jobId);

    //     if (!requirements || requirements.length === 0) return [];

    //     const toInsert = requirements.map((req, index) => ({
    //         ...req,
    //         job_id: jobId,
    //         sort_order: req.sort_order ?? index,
    //     }));

    //     return JobCustomRequirement.query().insertAndFetch(toInsert);
    // }

    // // ─── Update a Requirement ─────────────────────────────────────────────────────
    // async update(requirementId, jobId, employerId, data) {
    //     await this._assertOwnership(jobId, employerId);

    //     const requirement = await JobCustomRequirement.query().findOne({ id: requirementId, job_id: jobId });
    //     if (!requirement) {
    //         const err = new Error('Requirement not found');
    //         err.status = 404;
    //         throw err;
    //     }

    //     return JobCustomRequirement.query().patchAndFetchById(requirementId, data);
    // }

    // // ─── Delete a Requirement ─────────────────────────────────────────────────────
    // async delete(requirementId, jobId, employerId) {
    //     await this._assertOwnership(jobId, employerId);
    //     const requirement = await JobCustomRequirement.query().findOne({ id: requirementId, job_id: jobId });
    //     if (!requirement) {
    //         const err = new Error('Requirement not found');
    //         err.status = 404;
    //         throw err;
    //     }
    //     return JobCustomRequirement.query().deleteById(requirementId);
    // }

    // // ─── Reorder Requirements ─────────────────────────────────────────────────────
    // async reorder(jobId, employerId, orderedIds) {
    //     await this._assertOwnership(jobId, employerId);

    //     const updates = orderedIds.map((id, index) =>
    //         JobCustomRequirement.query()
    //             .patch({ sort_order: index })
    //             .where({ id, job_id: jobId })
    //     );

    //     await Promise.all(updates);
    //     return this.getForJob(jobId);
    // }

    // // ─── Save Answers (on application submit) ─────────────────────────────────────
    // async saveAnswers(applicationId, jobId, answers) {
    //     const requirements = await this.getForJob(jobId);

    //     // Validate all required fields are answered
    //     for (const req of requirements) {
    //         if (req.is_required) {
    //             const answer = answers.find((a) => a.requirement_id === req.id);
    //             if (!answer || answer.answer === null || answer.answer === undefined || answer.answer === '') {
    //                 const err = new Error(`Required field "${req.label}" must be answered`);
    //                 err.status = 400;
    //                 throw err;
    //             }
    //         }
    //     }

    //     // Validate select/multi_select options
    //     for (const answer of answers) {
    //         const req = requirements.find((r) => r.id === answer.requirement_id);
    //         if (!req) continue;

    //         if (req.field_type === 'select' && req.options) {
    //             const options = Array.isArray(req.options) ? req.options : JSON.parse(req.options);
    //             if (!options.includes(answer.answer)) {
    //                 const err = new Error(`Invalid option for field "${req.label}"`);
    //                 err.status = 400;
    //                 throw err;
    //             }
    //         }

    //         if (req.field_type === 'multi_select' && req.options) {
    //             const options = Array.isArray(req.options) ? req.options : JSON.parse(req.options);
    //             const selected = JSON.parse(answer.answer);
    //             if (!Array.isArray(selected) || !selected.every((s) => options.includes(s))) {
    //                 const err = new Error(`Invalid options selected for field "${req.label}"`);
    //                 err.status = 400;
    //                 throw err;
    //             }
    //         }
    //     }

    //     // Upsert answers
    //     const toInsert = answers.map((a) => ({
    //         application_id: applicationId,
    //         requirement_id: a.requirement_id,
    //         answer: typeof a.answer === 'object' ? JSON.stringify(a.answer) : String(a.answer ?? ''),
    //     }));

    //     if (toInsert.length === 0) return [];

    //     // Delete old answers for this application, re-insert
    //     await ApplicationCustomAnswer.query().delete().where('application_id', applicationId);
    //     return ApplicationCustomAnswer.query().insertAndFetch(toInsert);
    // }

    // // ─── Get Answers for an Application ──────────────────────────────────────────
    // async getAnswers(applicationId) {
    //     return ApplicationCustomAnswer.query()
    //         .where('application_id', applicationId)
    //         .withGraphFetched('requirement');
    // }

    // // ─── Private ─────────────────────────────────────────────────────────────────
    // async _assertOwnership(jobId, employerId) {
    //     const job = await Job.query().findOne({ id: jobId, employer_id: employerId });
    //     if (!job) {
    //         const err = new Error('Job not found or access denied');
    //         err.status = 404;
    //         throw err;
    //     }
    //     return job;
    // }
}

module.exports = new JobCustomRequirementService();

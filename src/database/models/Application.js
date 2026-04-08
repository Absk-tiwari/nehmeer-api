const BaseModel = require('./BaseModel');

class Application extends BaseModel {
    static get tableName() {
        return 'applications';
    }

    static get modifiers() {
        return {
            pending(builder) {
                builder.where('status', 'pending');
            },
            active(builder) {
                builder.whereNotIn('status', ['rejected', 'withdrawn']);
            },
        };
    }

    static get relationMappings() {

        const User = require('./User');
        const Job = require('./Job');

        return {
            job: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Job,
                join: { from: 'applications.job_id', to: 'jobs.id' },
            },
            applicant: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: { from: 'applications.applicant_id', to: 'users.id' },
            },
        };
    }
}

module.exports = Application;

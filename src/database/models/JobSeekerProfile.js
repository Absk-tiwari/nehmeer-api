const BaseModel = require('./BaseModel');

class JobSeekerProfile extends BaseModel {
    static get tableName() {
        return 'job_seeker_profiles';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id'],
            properties: {
                id: { type: 'integer' },
                user_id: { type: 'integer' },
                headline: { type: ['string', 'null'] },
                bio: { type: ['string', 'null'] },
                location: { type: ['string', 'null'] },
                resume_url: { type: ['string', 'null'] },
                portfolio_url: { type: ['string', 'null'] },
                years_of_experience: { type: 'integer' },
                experience_level: { type: 'string', enum: ['entry', 'mid', 'senior', 'lead', 'executive'] },
                skills: {},
                languages: {},
                job_type_preference: { type: 'string' },
                is_open_to_work: { type: 'boolean' },
            },
        };
    }

    static get relationMappings() {
        const User = require('./User');
        return {
            user: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: { from: 'job_seeker_profiles.user_id', to: 'users.id' },
            },
        };
    }
}

module.exports = JobSeekerProfile;

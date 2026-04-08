const BaseModel = require("./BaseModel");

class CustomRequest extends BaseModel {

    static get tableName() {
        return "custom_requests";
    }

    // ✅ Tell Objection this column is JSON
    static get jsonAttributes() {
        return ['data'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['worker_id'],

            properties: {
                id: { type: 'integer' },
                employer_id: { type: 'integer' },
                worker_id: { type: 'integer' },

                message: { type: ['string', 'null'], maxLength: 1000 },
                // what_you_think: { type: ['string', 'null'] },

                status: {
                    type: 'string',
                    enum: ['pending', 'accepted', 'rejected'],
                    default: 'pending'
                },

                // 🔥 Your JSON column
                data: {
                    type: ['object', 'array', 'null']
                },

                created_at: { type: 'string' },
                updated_at: { type: 'string' }
            }
        };
    }
    
    static get relationMappings() {

        const User = require('./User');

        return {
            employer: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'custom_requests.employer_id',
                    to: 'users.id',
                },
            },

            worker: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'custom_requests.worker_id',
                    to: 'users.id',
                },
            },
        };
    }
}

module.exports = CustomRequest;
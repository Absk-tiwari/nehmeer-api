const BaseModel = require("./BaseModel");

class CustomRequest extends BaseModel {

    static get tableName() {
        return "custom_requests";
    }

    // ✅ Tell Objection this column is JSON
    static get jsonAttributes() {
        return ['data'];
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
const BaseModel = require('./BaseModel');

class EmployerProfile extends BaseModel {
    static get tableName() {
        return 'employer_profiles';
    }

    static get relationMappings() {
        const User = require('./User');
        return {
            user: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: { from: 'employer_profiles.user_id', to: 'users.id' },
            },
        };
    }
}

module.exports = EmployerProfile;

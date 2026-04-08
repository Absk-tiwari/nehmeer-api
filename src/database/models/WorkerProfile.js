const BaseModel = require("./BaseModel");

class WorkerProfile extends BaseModel {
    static get tableName() {
        return "worker_profiles";
    }

    static get relationMappings() {
        const User = require("./User");

        return {
            user: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "worker_profiles.user_id",
                    to: "users.id",
                },
            },
        };
    }
}

module.exports = WorkerProfile;
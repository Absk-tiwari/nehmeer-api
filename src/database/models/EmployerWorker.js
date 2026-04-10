const BaseModel = require('./BaseModel');

class EmployerWorker extends BaseModel {
    static get tableName() {
        return 'employer_workers';
    }

    static get relationMappings() {

        const User = require('./User');

        return {
            employer: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: { from: 'employer_workers.employer_id', to: 'users.id' },
            },
            worker: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: { from: 'employer_workers.worker_id', to: 'users.id' },
            },
        };
    }
}

module.exports = EmployerWorker;

const BaseModel = require('./BaseModel');
const CustomRequest = require('./CustomRequest');
const JobQuestion = require('./JobQuestion');

class CustomRequestRequirement extends BaseModel {
    static get tableName() {
        return 'custom_request_requirements';
    }

    static get relationMappings() {
        
        return {
            customRequest: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: CustomRequest,
                join: {
                    from: 'custom_request_requirements.custom_request_id',
                    to: 'custom_requests.id',
                },
            },

            question: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: JobQuestion,
                join: {
                    from: 'custom_request_requirements.question_id',
                    to: 'job_questions.id',
                },
            },
        };
    }
}

module.exports = CustomRequestRequirement;

const BaseModel = require("./BaseModel");
const JobQuestion = require("./JobQuestion");

class JobAnswer extends BaseModel {
    static get tableName() {
        return "job_answers";
    }
    static get relationMappings() {
        return {
            question: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: JobQuestion,
                join: {
                    from: 'job_answers.question_id',
                    to: 'job_questions.id',
                },
            },
        };
    }
}

module.exports = JobAnswer;
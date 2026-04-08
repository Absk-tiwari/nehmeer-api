const BaseModel = require("./BaseModel");
const JobRole = require("./JobRole");

class Job extends BaseModel {
    static get tableName() {
        return "job_posts";
    }
    
    static get relationMappings() {
        const User = require("./User");
        const HireRequest = require("./CustomRequest");
        const JobAnswer = require("./JobAnswer");
        const JobQuestion = require("./JobQuestion");

        return {
            employer: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "job_posts.employer_id",
                    to: "users.id",
                },
            },

            role: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: JobRole,
                join: {
                    from: "job_posts.role_id",
                    to : "job_roles.id"
                }
            },
            // applicants: {
            //     relation: BaseModel.HasManyRelation,
            //     modelClass: User,
            //     join: {

            //     }
            // },
            hireRequests: {
                relation: BaseModel.HasManyRelation,
                modelClass: HireRequest,
                join: {
                    from: "job_posts.id",
                    to: "hire_requests.job_id",
                },
            },

            // ✅ Job → Answers
            answers: {
                relation: BaseModel.HasManyRelation,
                modelClass: JobAnswer,
                join: {
                    from: 'job_posts.id',
                    to: 'job_answers.job_post_id',
                },
            },
            // ✅ Job → Questions (through answers)
            questions: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: JobQuestion,
                join: {
                    from: 'job_posts.id',
                    through: {
                        from: 'job_answers.job_post_id',
                        to: 'job_answers.question_id',
                    },
                    to: 'job_questions.id',
                },
            },
        };
    }
}

module.exports = Job;
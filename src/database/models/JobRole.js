const BaseModel = require("./BaseModel");

class JobRole extends BaseModel {
    static get tableName() {
        return "job_roles";
    }

    static get relationMappings() {
        const JobQuestion = require("./JobQuestion");

        return {
            qa: {
                relation: BaseModel.HasManyRelation,
                modelClass: JobQuestion,
                join: {
                    from: "job_roles.id",
                    to: "job_questions.job_role_id",
                },
            },
            custom_questions: {
                relation: BaseModel.HasManyRelation,
                modelClass: JobQuestion,
                join: {
                    from: "job_roles.id",
                    to: "job_questions.job_role_id",
                },
                modify: (builder) => builder.where("is_custom", true),
            }
        };
    }
}

module.exports = JobRole;
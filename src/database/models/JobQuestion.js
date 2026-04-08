const BaseModel = require("./BaseModel");

class JobQuestion extends BaseModel {
    static get tableName() {
        return "job_questions";
    }
}

module.exports = JobQuestion;
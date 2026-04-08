const BaseModel = require('./BaseModel');

class ApplicationCustomAnswer extends BaseModel {
  static get tableName() {
    return 'application_custom_answers';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['application_id', 'requirement_id'],
      properties: {
        id: { type: 'integer' },
        application_id: { type: 'integer' },
        requirement_id: { type: 'integer' },
        answer: { type: ['string', 'null'] },
      },
    };
  }

  static get relationMappings() {
    const Application = require('./Application');
    const JobCustomRequirement = require('./CustomRequestRequirement');

    return {
      application: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Application,
        join: { from: 'application_custom_answers.application_id', to: 'applications.id' },
      },
      requirement: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: JobCustomRequirement,
        join: { from: 'application_custom_answers.requirement_id', to: 'job_custom_requirements.id' },
      },
    };
  }
}

module.exports = ApplicationCustomAnswer;

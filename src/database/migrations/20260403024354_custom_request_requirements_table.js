/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async function (knex) {
    await knex.schema.createTable('custom_request_requirements', (table) => {
        table.bigIncrements('id').primary();

        table
            .bigInteger('custom_request_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('custom_requests')
            .onDelete('CASCADE');

        table.bigInteger('question_id').unsigned().references('id').inTable('job_questions');
        table.string('answer').notNullable();

    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('custom_request_requirements');
};
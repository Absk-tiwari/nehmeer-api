exports.up = function (knex) {
    return knex.schema.createTable('job_application_answers', function (table) {
        table.increments('id').primary();

        table
            .integer('application_id')
            .unsigned()
            .references('id')
            .inTable('job_applications')
            .onDelete('CASCADE');

        table
            .integer('question_id')
            .unsigned()
            .references('id')
            .inTable('job_questions')
            .onDelete('CASCADE');

        table.text('answer').nullable();

        table.unique(['application_id', 'question_id']); // prevent duplicates

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('job_application_answers');
};
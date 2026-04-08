exports.up = function (knex) {
    return knex.schema.createTable('job_answers', function (table) {
        table.increments('id').primary();

        table
            .integer('job_post_id')
            .unsigned()
            .references('id')
            .inTable('job_posts')
            .onDelete('CASCADE');

        table
            .integer('question_id')
            .unsigned()
            .references('id')
            .inTable('job_questions')
            .onDelete('CASCADE');

        table.text('answer').nullable(); // flexible for all types

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('job_answers');
};
exports.up = function (knex) {
    return knex.schema.createTable('job_questions', function (table) {
        table.increments('id').primary();

        table
            .integer('job_role_id')
            .unsigned()
            .references('id')
            .inTable('job_roles')
            .onDelete('CASCADE');

        table.string('question_text').notNullable();

        table.enu('field_type', [
            'text',
            'select',
            'multi_select',
            'checkbox',
            'radio',
            'date'
        ]).notNullable();

        table.json('options_json').nullable(); // for dropdowns

        table.boolean('is_required').defaultTo(false);
        table.integer('order_index').defaultTo(0);

    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('job_questions');
};
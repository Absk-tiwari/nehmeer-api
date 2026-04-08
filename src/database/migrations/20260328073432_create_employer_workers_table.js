exports.up = function (knex) {
    return knex.schema.createTable('employer_workers', (table) => {
        table.increments('id').primary();

        // Relations
        table
            .integer('employer_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('employers')
            .onDelete('CASCADE');

        table
            .integer('worker_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('workers')
            .onDelete('CASCADE');

        // Status of hiring
        table
            .enu('status', ['active', 'completed', 'cancelled'])
            .defaultTo('active');
        // Extra useful fields
        table.decimal('salary', 10, 2).nullable();
        table.string('work_type').nullable(); // full-time, part-time, etc.
        table.boolean('is_favorite').defaultTo(false);
        // When worker joined
        table.timestamp('joined_at').defaultTo(knex.fn.now());
        // Timestamps
        table.timestamps(true, true);
        // Prevent duplicate hiring
        table.unique(['employer_id', 'worker_id']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('employer_workers');
};
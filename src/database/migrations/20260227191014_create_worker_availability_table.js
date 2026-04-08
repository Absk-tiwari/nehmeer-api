exports.up = function (knex) {
    return knex.schema.createTable('worker_availability', table => {
        table.uuid('id').primary();

        table.uuid('worker_profile_id')
            .references('id')
            .inTable('worker_profiles')
            .onDelete('CASCADE');

        table.enu('type', ['part_time', 'full_time']).notNullable();

        table.time('start_time');
        table.time('end_time');

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("worker_availability");
};
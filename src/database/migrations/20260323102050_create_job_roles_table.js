exports.up = function (knex) {
    return knex.schema.createTable('job_roles', function (table) {
        table.increments('id').primary();
        table.string('name').notNullable(); // cook, driver
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('job_roles');
};
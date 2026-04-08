exports.up = function (knex) {
    return knex.schema.createTable('user_roles', table => {
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.integer('role_id').references('id').inTable('roles').onDelete('CASCADE');
        table.primary(['user_id', 'role_id']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("user_roles");
};
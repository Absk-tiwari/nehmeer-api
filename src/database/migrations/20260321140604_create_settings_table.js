/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('settings', function (table) {
        table.bigIncrements('id').primary();
        table.integer('user_id').references("id").inTable("users");
        table.string('key',40).notNullable();
        table.string('value',50).nullable();
        table.index(['key','user_id','value']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
**/

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('settings');
};

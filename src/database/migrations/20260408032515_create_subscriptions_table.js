/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// knex migrate:make create_subscriptions_table

exports.up = function (knex) {
    return knex.schema.createTable("subscriptions", function (table) {
        table.increments("id").primary();

        table.string("name").notNullable(); // Basic, Standard, Premium
        table.integer("price").notNullable(); // 299, 499, 899

        table.integer("custom_posts").defaultTo(0);
        table.integer("custom_requests").defaultTo(0);
        table.integer("hire_requests_per_month").defaultTo(0);

        table.boolean("unlimited_profile_checking").defaultTo(false);

        table.string("razorpay_price_id").nullable();

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("subscriptions");
};
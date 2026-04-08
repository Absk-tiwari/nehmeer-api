/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// knex migrate:make create_user_subscriptions_table

exports.up = function (knex) {
    return knex.schema.createTable("user_subscriptions", function (table) {
        table.increments("id").primary();

        table
            .integer("user_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table
            .integer("plan_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("subscriptions")
            .onDelete("CASCADE");

        table.string("razorpay_subscription_id").nullable();
        table.string("razorpay_customer_id").nullable();

        table.enu("status", [
            "active",
            "cancelled",
            "expired",
            "past_due",
            "trialing",
        ]).defaultTo("active");

        table.timestamp("current_period_start").nullable();
        table.timestamp("current_period_end").nullable();

        table.timestamp("cancelled_at").nullable();
        table.boolean("cancel_at_period_end").defaultTo(false);

        table.timestamps(true, true);
        table.index(["user_id"]);
        table.index(["plan_id"]);
        table.index(["status"]);

    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("user_subscriptions");
};

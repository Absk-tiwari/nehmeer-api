/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("notifications", (table) => {

        table.increments("id").primary();

        // user receiving the notification
        table
            .integer("user_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        // title shown in notification
        table.string("title", 150).notNullable();

        // description/message
        table.text("message");

        // type helps decide icon or UI
        table.enu("type", [
            "job_post",
            "hire_request",
            "application",
            "system",
            "promotion"
        ]).defaultTo("system");

        // deep link for app navigation
        table.string("action_url");

        // optional entity reference
        table.integer("reference_id").unsigned();

        // whether user opened it
        table.boolean("is_read").defaultTo(false);

        // optional icon
        table.string("icon");

        table.timestamps(true, true);

        table.index(["user_id"]);
        table.index(["type"]);

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/
exports.down = function (knex) {
    return knex.schema.dropTable("notifications");
};
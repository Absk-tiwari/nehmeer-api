exports.up = function (knex) {
    return knex.schema.createTable("webhook_events", (table) => {
        table.increments("id").primary();

        table.string("event_id").nullable(); // Razorpay doesn't always send unique id
        table.string("event_type").notNullable();

        table.json("payload").notNullable();

        table.boolean("processed").defaultTo(false);
        table.integer("retry_count").defaultTo(0);

        table.text("error").nullable();

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("webhook_events");
};
exports.up = function (knex) {
    return knex.schema.createTable("hire_requests", (table) => {
        table.increments("id").primary();

        table.integer("job_id").references("id").inTable("job_posts");
        table.integer("employer_id").references("id").inTable("users");
        table.integer("worker_id").references("id").inTable("users");

        table.text("message");

        table
            .enu("status", [
                "pending",
                "accepted",
                "rejected",
                "cancelled",
            ])
            .defaultTo("pending");

        table.timestamp("responded_at");

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("hire_requests");
};
exports.up = function (knex) {
    return knex.schema.createTable("contracts", (table) => {
        table.increments("id").primary();

        table.integer("job_id")
            .references("id")
            .inTable("job_posts");

        table.integer("employer_id")
            .references("id")
            .inTable("users");

        table.integer("worker_id")
            .references("id")
            .inTable("users");

        table.date("start_date");
        table.date("end_date");

        table.enu("status", [
            "active",
            "completed",
            "terminated",
        ]).defaultTo("active");

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("contracts");
};
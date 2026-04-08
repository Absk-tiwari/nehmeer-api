exports.up = function (knex) {
    return knex.schema.createTable("reviews", (table) => {
        table.increments("id").primary();

        table.integer("contract_id");
        table.integer("reviewer_id").references("id").inTable("users");
        table.integer("reviewee_id").references("id").inTable("users");

        table.integer("rating").notNullable();
        table.text("comment");

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("reviews");
};
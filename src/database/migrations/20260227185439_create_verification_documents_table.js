exports.up = function (knex) {
    return knex.schema.createTable("verification_documents", (table) => {
        table.increments("id").primary();

        table.integer("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table.string("doc_type"); // aadhaar, pan
        table.string("doc_url");

        table.enu("status", [
            "pending",
            "approved",
            "rejected",
        ]).defaultTo("pending");

        table.integer("reviewed_by");

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("verification_documents");
};

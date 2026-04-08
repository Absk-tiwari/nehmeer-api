exports.up = function (knex) {
    return knex.schema.createTable("worker_profiles", (table) => {
        table.increments("id").primary();

        table
            .integer("user_id")
            .unsigned()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table.string('role').notNullable();
        table.integer('age');

        table.string('education');
        table.string('language');
        table.string('religion');
        table.string('marital_status');

        table.text("description");
        table.integer("experience");
        table.json("skills");

        table.decimal('rating', 2, 1).defaultTo(0);
        table.integer('total_ratings').defaultTo(0);

        table.integer('part_time_salary');  // monthly
        table.integer('full_time_salary');  // monthly

        table.boolean('is_part_time_available').defaultTo(false);
        table.boolean('is_full_time_available').defaultTo(false);

        table.decimal("hourly_rate", 10, 2);
        table.decimal("monthly_rate", 10, 2);

        table.boolean("is_available").defaultTo(true);
        table.decimal('latitude', 10, 7);
        table.decimal('longitude', 10, 7);
        table.string('city');
        table.integer('service_radius_km');

        table
            .enu("verification_status", [
                "pending",
                "verified",
                "rejected",
            ])
            .defaultTo("pending");

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("worker_profiles");
};
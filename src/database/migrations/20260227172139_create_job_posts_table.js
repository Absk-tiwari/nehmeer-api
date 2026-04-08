exports.up = function (knex) {
    return knex.schema.createTable('job_posts', table => {
        table.uuid('id').primary();

        // Employer who created post
        table.uuid('employer_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');

        // Job category
        table.string('role').notNullable();
        // Cook, Babysitter, Driver, Nurse, Maid

        // Location
        table.string('location_text');
        table.decimal('latitude', 10, 7);
        table.decimal('longitude', 10, 7);

        // Service details
        table.string('service_type');
        // e.g. South Indian Cooking

        table.string('preferences');
        // Breakfast, Lunch, Dinner, Full Day

        table.integer('experience_required_years');

        // Working hours
        table.time('working_hours_start');
        table.time('working_hours_end');

        // Duration
        table.string('duration');
        // daily, weekly, monthly, yearly

        table.text('description');

        table.boolean('police_verification_required')
            .defaultTo(false);

        // Post status
        table.enu('status', [
            'active',
            'closed',
            'hired'
        ]).defaultTo('active');

        // When post closed
        table.timestamp('closed_at');

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("job_posts");
};
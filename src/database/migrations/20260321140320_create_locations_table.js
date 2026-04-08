exports.up = function (knex) {
    return knex.schema.createTable('locations', function (table) {
        table.bigIncrements('id').primary();

        // संबंध (who owns this location)
        table.bigInteger('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

        // Label (e.g., Home, Office, or Name)
        table.string('label').notNullable();

        // Address breakdown
        table.string('address_line').notNullable(); // e.g., "Santiniketan Road"
        table.string('area').nullable();            // e.g., "Bolpur"
        table.string('city').notNullable();         // e.g., "Birbhum"
        table.string('state').notNullable();        // e.g., "West Bengal"
        table.string('pincode', 10).notNullable();  // e.g., "731204"
        table.string('country').defaultTo('India');

        // Geo location (for map pin)
        table.decimal('latitude', 10, 7).notNullable();
        table.decimal('longitude', 10, 7).notNullable();

        // Extra info (optional future use)
        table.text('landmark').nullable();
        table.boolean('is_default').defaultTo(false);

        // timestamps
        table.timestamps(true, true);
        table.index(['user_id']);
        table.index(['latitude', 'longitude']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('locations');
};
exports.up = function (knex) {
    
    return knex.schema.createTable("users", (table) => {

        table.increments("id").primary();
        table.string("name",100).notNullable();
        table.string("phone",20).unique().notNullable();
        table.string("email",150).unique();
        table.string("password").notNullable();

        table.enu("role", ["worker", "employer", "admin"]).notNullable();

        table.boolean("is_verified").defaultTo(false);
        table.boolean("is_phone_verified").defaultTo(false);
        table.boolean("is_active").defaultTo(true);

        table.string("profile_photo", 255);

        table.timestamp('last_login_at');
        
        table.timestamps(true, true);
        
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};
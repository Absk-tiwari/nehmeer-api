const knex = require("knex");
const path = require("path");
const env = require("./env");

const db = knex({
    client: env.DB_CLIENT, // mysql or pg
    connection: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
    },

    pool: {
        min: 2,
        max: 10,
    },

    migrations: {
        tableName: "knex_migrations",
        directory: path.resolve(__dirname, "../database/migrations"),
    },

    seeds: {
        directory: path.resolve(__dirname, "../database/seeds"),
    },
});

module.exports = db;
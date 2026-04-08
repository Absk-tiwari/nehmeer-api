const http = require("http");
const app = require("./app");

const { Model } = require("objection");
const knex = require("./config/knex");
// const { redis } = require("./services/cache.service");

const env = require("./config/env");

const PORT = env.PORT || 5000;

Model.knex(knex);

const server = http.createServer(app);

async function startServer() {
    try {

        await knex.raw("SELECT 1");
        console.log("✅ Database connected");

        // await redis.ping();
        // console.log("✅ Redis ready");

        server.listen(PORT, () => {
            console.log(`🚀 Server running on ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Failed to start server", error);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown
const shutdown = async () => {
    console.log("🛑 Shutting down server...");

    try {
        await knex.destroy();
        // await redis.quit();

        server.close(() => {
            console.log("✅ Server closed");
            process.exit(0);
        });

    } catch (error) {
        console.error("Shutdown error", error);
        process.exit(1);
    }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const cron = require("node-cron");
const knex = require("./../config/knex");
const { processWebhookEvent } = require("../services/webhookProcessor");

cron.schedule("*/5 * * * *", async () => {
    console.log("🔁 Running webhook retry job...");

    const failedEvents = await knex("webhook_events")
    .where("processed", false)
    .where("retry_count", "<", 5)
    .limit(20);

    for (const event of failedEvents) {
        await processWebhookEvent(event.id);
    }
});
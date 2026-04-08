const knex = require("../config/knex");
const UserSubscription = require("../database/models/UserSubscription");

async function processWebhookEvent(eventId) {
    const event = await knex("webhook_events")
        .where({ id: eventId })
        .first();

    if (!event || event.processed) return;

    const payload = JSON.parse(event.payload);
    const type = event.event_type;

    try {
        const subscription = payload.payload?.subscription?.entity;

        switch (type) {

            case "subscription.activated":
            case "subscription.charged":
            case "subscription.completed":
            case "subscription.cancelled":

                if (subscription) {
                    await UserSubscription
                        .where({
                            razorpay_subscription_id: subscription.id,
                        })
                        .update({
                            status: subscription.status,
                        });
                }

                break;

            default:
                console.log("Unhandled event:", type);
        }

        // ✅ mark success
        await knex("webhook_events")
            .where({ id: eventId })
            .update({
                processed: true,
                error: null,
            });

    } catch (err) {
        console.error("Processing failed:", err);

        await knex("webhook_events")
            .where({ id: eventId })
            .update({
                retry_count: event.retry_count + 1,
                error: err.message,
            });
    }
}

module.exports = { processWebhookEvent };
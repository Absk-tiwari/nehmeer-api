const router = require("express").Router();
const crypto = require("crypto");
const { processWebhookEvent } = require("../services/webhookProcessor");
const knex = require("../config/knex");

router.post("/razorpay-webhook", async (req, res) => {

    try 
    {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        // 🔐 Verify signature
        const shasum = crypto.createHmac("sha256", secret);
        shasum.update(req.body);
        const digest = shasum.digest("hex");

        if (digest !== req.headers["x-razorpay-signature"]) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        const body = JSON.parse(req.body.toString());
        // 🧾 Store event
        const [eventId] = await knex("webhook_events")
            .insert({
                event_type: body.event,
                payload: JSON.stringify(body),
            })
            .returning("id");

        // ⚡ Process immediately
        await processWebhookEvent(eventId.id || eventId);

        res.json({ status: "ok" });

    } catch (error) {
        console.error("Webhook error:", err);
        res.status(500).json({ error: err.message });
    }

});

module.exports = router;
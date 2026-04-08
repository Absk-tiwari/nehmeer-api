
const razorpay = require("./../config/razorpay");
const Subscription = require("../database/models/Subscription");
const UserSubscription = require("../database/models/UserSubscription");


exports.createSubscription = async (req, res) => {
    try {
        const user = req.user;
        const { plan_id } = req.body;

        const plan = await Subscription
            .where({ id: plan_id })
            .first();

        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        // 1. Create Razorpay subscription
        const subscription = await razorpay.subscriptions.create({
            plan_id: plan.stripe_price_id, // store razorpay plan id here
            customer_notify: 1,
            total_count: 12, // 12 months billing cycle
        });

        // 2. Save in DB
        
        await UserSubscription.query().insert({
            user_id: user.id,
            plan_id: plan.id,
            razorpay_subscription_id: subscription.id,
            status: subscription.status,
        });

        res.json({
            subscription_id: subscription.id,
            razorpay_key: process.env.RAZORPAY_KEY_ID,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
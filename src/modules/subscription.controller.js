const razorpay = require("../config/razorpay");
const Subscription = require("../database/models/Subscription");
const UserSubscription = require("../database/models/UserSubscription");

class SubscriptionController {
    async createPlan(req, res, next) {
        try {

            const plan = await razorpay.plans.create({
                period: "monthly",
                interval: 1,
                item: {
                    name: "Standard Plan",
                    amount: 49900, // ✅ FIXED
                    currency: "INR",
                },
            });
            console.log(plan);
            res.json(plan);

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    async getPlans(req, res, next) {
        try {
            const result = await Subscription.query().select('*')
            res.json(result);
        } catch (error) {
            next(error)
        }
    }

    async getMySubscription(req, res, next) {
        try {
            const result = await UserSubscription.query().where("user_id", req.user.id);
            res.json(result);
        } catch (error) {
            next(error)
        }
    }

    async createSubscription(req, res, next) {
        try {
            const user = req.user;
            const { plan_id } = req.body;
            // console.log("Ye rhi plan_id: " + plan_id);

            const plan = await Subscription.query()
                .where({ id: plan_id })
                .first();

            if (!plan) {
                return res.status(404).json({ message: "Plan not found" });
            }

            // 1. Create Razorpay subscription
            // const subscription = await razorpay.subscriptions.create({
            //     plan_id: plan.razorpay_price_id,
            //     customer_notify: 1,
            //     total_count: 12, // 12 months billing cycle
            // });

            const subscription = await razorpay.orders.create({
                amount: 49900,
                currency: "INR",
                receipt: "receipt_1",
            });
            console.log("Order created: ", subscription);
            
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
            next(err);
        }
    }

    async verifyPayment(req, res, next) {
        const {
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature,
        } = req.body;
        try {

            const generated_signature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(razorpay_payment_id + "|" + razorpay_subscription_id)
                .digest("hex");

            if (generated_signature !== razorpay_signature) {
                return res.status(400).json({ message: "Invalid signature" });
            }

            // ✅ Activate subscription
            await UserSubscription
                .where({ razorpay_subscription_id })
                .update({
                    status: "active",
                });

            res.json({ success: true });

        } catch (error) {
            next(error)
        }
    }
}

module.exports = new SubscriptionController()
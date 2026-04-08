
const crypto = require("crypto");
const UserSubscription = require("../database/models/UserSubscription");

exports.verifyPayment = async (req, res) => {
    
    const {
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
    } = req.body;

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

};
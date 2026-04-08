const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const SubscriptionPlan = require('../models/SubscriptionPlan');
const UserSubscription = require('../models/UserSubscription');
const User = require('../models/User');
const NotificationService = require('./NotificationService');

class SubscriptionService {
    // ─── List Plans ──────────────────────────────────────────────────────────────
    async getPlans(roleTarget = null) {
        let query = SubscriptionPlan.query().where('is_active', true).orderBy('price', 'asc');
        if (roleTarget) query = query.where('role_target', roleTarget);
        return query;
    }

    async getPlanById(planId) {
        const plan = await SubscriptionPlan.query().findById(planId);
        if (!plan) {
            const err = new Error('Plan not found');
            err.status = 404;
            throw err;
        }
        return plan;
    }

    // ─── Create Checkout Session ─────────────────────────────────────────────────
    async createCheckoutSession(userId, planId) {
        const user = await User.query().findById(userId);
        const plan = await this.getPlanById(planId);

        if (!plan.stripe_price_id) {
            const err = new Error('This plan is not available for online checkout');
            err.status = 400;
            throw err;
        }

        // Get or create Stripe customer
        let stripeCustomerId = await this._getStripeCustomerId(user);

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
            success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
            metadata: { user_id: String(userId), plan_id: String(planId) },
        });

        return { checkout_url: session.url, session_id: session.id };
    }

    // ─── Handle Stripe Webhook ───────────────────────────────────────────────────
    async handleWebhook(rawBody, signature) {
        let event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
        } catch {
            const err = new Error('Invalid webhook signature');
            err.status = 400;
            throw err;
        }

        switch (event.type) {
            case 'checkout.session.completed':
                await this._handleCheckoutCompleted(event.data.object);
                break;
            case 'invoice.payment_succeeded':
                await this._handlePaymentSucceeded(event.data.object);
                break;
            case 'invoice.payment_failed':
                await this._handlePaymentFailed(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await this._handleSubscriptionDeleted(event.data.object);
                break;
            case 'customer.subscription.updated':
                await this._handleSubscriptionUpdated(event.data.object);
                break;
            default:
                break;
        }

        return { received: true };
    }

    // ─── Cancel Subscription ─────────────────────────────────────────────────────
    async cancelSubscription(userId) {
        const subscription = await UserSubscription.query()
            .findOne({ user_id: userId, status: 'active' });

        if (!subscription) {
            const err = new Error('No active subscription found');
            err.status = 404;
            throw err;
        }

        if (subscription.stripe_subscription_id) {
            await stripe.subscriptions.update(subscription.stripe_subscription_id, {
                cancel_at_period_end: true,
            });
        }

        return UserSubscription.query().patchAndFetchById(subscription.id, {
            cancel_at_period_end: true,
        });
    }

    // ─── Get Active Subscription ─────────────────────────────────────────────────
    async getActiveSubscription(userId) {
        return UserSubscription.query()
            .findOne({ user_id: userId })
            .whereIn('status', ['active', 'trialing'])
            .withGraphFetched('plan')
            .orderBy('created_at', 'desc');
    }

    // ─── Private: Webhook Handlers ───────────────────────────────────────────────
    async _handleCheckoutCompleted(session) {
        const { user_id, plan_id } = session.metadata;
        const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription);

        // Cancel any previous active subscription
        await UserSubscription.query()
            .patch({ status: 'cancelled', cancelled_at: new Date() })
            .where({ user_id: parseInt(user_id), status: 'active' });

        const newSub = await UserSubscription.query().insertAndFetch({
            user_id: parseInt(user_id),
            plan_id: parseInt(plan_id),
            stripe_subscription_id: session.subscription,
            stripe_customer_id: session.customer,
            status: 'active',
            current_period_start: new Date(stripeSubscription.current_period_start * 1000),
            current_period_end: new Date(stripeSubscription.current_period_end * 1000),
        });

        const plan = await SubscriptionPlan.query().findById(plan_id);
        await NotificationService.notifySubscriptionActivated(parseInt(user_id), plan.name);
    }

    async _handlePaymentSucceeded(invoice) {
        if (!invoice.subscription) return;
        const stripeSubscription = await stripe.subscriptions.retrieve(invoice.subscription);

        await UserSubscription.query()
            .patch({
                status: 'active',
                current_period_start: new Date(stripeSubscription.current_period_start * 1000),
                current_period_end: new Date(stripeSubscription.current_period_end * 1000),
            })
            .where('stripe_subscription_id', invoice.subscription);
    }

    async _handlePaymentFailed(invoice) {
        if (!invoice.subscription) return;
        await UserSubscription.query()
            .patch({ status: 'past_due' })
            .where('stripe_subscription_id', invoice.subscription);
    }

    async _handleSubscriptionDeleted(stripeSubscription) {
        await UserSubscription.query()
            .patch({ status: 'cancelled', cancelled_at: new Date() })
            .where('stripe_subscription_id', stripeSubscription.id);
    }

    async _handleSubscriptionUpdated(stripeSubscription) {
        await UserSubscription.query()
            .patch({
                status: stripeSubscription.status,
                cancel_at_period_end: stripeSubscription.cancel_at_period_end,
                current_period_end: new Date(stripeSubscription.current_period_end * 1000),
            })
            .where('stripe_subscription_id', stripeSubscription.id);
    }

    async _getStripeCustomerId(user) {
        const existing = await UserSubscription.query()
            .findOne({ user_id: user.id })
            .whereNotNull('stripe_customer_id')
            .orderBy('created_at', 'desc');

        if (existing?.stripe_customer_id) return existing.stripe_customer_id;

        const customer = await stripe.customers.create({
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            metadata: { user_id: String(user.id) },
        });

        return customer.id;
    }
}

module.exports = new SubscriptionService();

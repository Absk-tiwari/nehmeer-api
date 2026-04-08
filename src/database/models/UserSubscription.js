const BaseModel = require('./BaseModel');

class UserSubscription extends BaseModel {
    static get tableName() {
        return 'user_subscriptions';
    }

    static get relationMappings() {
        const User = require('./User');
        const SubscriptionPlan = require('./Subscription');
        return {
            user: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: { from: 'user_subscriptions.user_id', to: 'users.id' },
            },
            plan: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: SubscriptionPlan,
                join: { from: 'user_subscriptions.plan_id', to: 'subscription_plans.id' },
            },
        };
    }

    get isActive() {
        return this.status === 'active' || this.status === 'trialing';
    }

    get isExpired() {
        return (
            this.status === 'expired' ||
            (this.current_period_end && new Date(this.current_period_end) < new Date())
        );
    }
}

module.exports = UserSubscription;

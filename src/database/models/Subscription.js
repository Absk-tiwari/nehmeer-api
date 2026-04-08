const BaseModel = require('./BaseModel');

class Subscription extends BaseModel {
    static get tableName() {
        return 'subscriptions';
    }

    static get relationMappings() {
        const UserSubscription = require('./UserSubscription');
        return {
            subscriptions: {
                relation: BaseModel.HasManyRelation,
                modelClass: UserSubscription,
                join: { from: 'subscription_plans.id', to: 'user_subscriptions.plan_id' },
            },
        };
    }
}

module.exports = Subscription;

const BaseModel = require("./BaseModel");

class User extends BaseModel {
    
    static get tableName() {
        return "users";
    }

    static get hidden() {
        return ['password', 'email_verification_token', 'password_reset_token'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'email', 'password', 'role'],
            properties: {
                id: { type: 'integer' },
                role: { type: 'string', enum: ['admin', 'worker', 'employer'] },
                name: { type: ['string','null'], minLength: 3, maxLength: 100 },
                email: { type: ['string','null'], format: 'email' },
                password: { type: 'string' },
                phone: { type: ['string', 'null'] },
                avatar: { type: ['string', 'null'] },
                is_verified: { type: 'boolean' },
                is_active: { type: 'boolean' },
            },
        };
    }

    static get relationMappings() {

        const WorkerProfile = require("./WorkerProfile");
        const Job = require("./Job");
        const HireRequest = require("./CustomRequest");
        const Review = require("./Review");
        const Role = require("./Role");
        const UserSubscription = require("./UserSubscription");
        const Application = require("./Application");
        const Notification = require("./Notification");

        return {
            subscriptions: {
                relation: BaseModel.HasManyRelation,
                modelClass: UserSubscription,
                join: { from: 'users.id', to: 'user_subscriptions.user_id' },
            },
            activeSubscription: {
                relation: BaseModel.HasOneRelation,
                modelClass: UserSubscription,
                join: { from: 'users.id', to: 'user_subscriptions.user_id' },
                modify: (query) => query.where('status', 'active').orderBy('created_at', 'desc'),
            },
            workerProfile: {
                relation: BaseModel.HasOneRelation,
                modelClass: WorkerProfile,
                join: {
                    from: "users.id",
                    to: "worker_profiles.user_id",
                },
            },
            postedJobs: {
                relation: BaseModel.HasManyRelation,
                modelClass: Job,
                join: {
                    from: "users.id",
                    to: "job_posts.employer_id",
                },
            },
            sentHireRequests: {
                relation: BaseModel.HasManyRelation,
                modelClass: HireRequest,
                join: {
                    from: "users.id",
                    to: "hire_requests.employer_id",
                },
            },
            receivedHireRequests: {
                relation: BaseModel.HasManyRelation,
                modelClass: HireRequest,
                join: {
                    from: "users.id",
                    to: "hire_requests.worker_id",
                },
            },
            reviewsGiven: {
                relation: BaseModel.HasManyRelation,
                modelClass: Review,
                join: {
                    from: "users.id",
                    to: "reviews.reviewer_id",
                },
            },
            applications: {
                relation: BaseModel.HasManyRelation,
                modelClass: Application,
                join: { from: 'users.id', to: 'applications.applicant_id' },
            },
            notifications: {
                relation: BaseModel.HasManyRelation,
                modelClass: Notification,
                join: { from: 'users.id', to: 'notifications.user_id' },
            },
            roles: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: Role,
                join: {
                    from: 'users.id',
                    through: {
                        from: 'user_roles.user_id',
                        to: 'user_roles.role_id'
                    },
                    to: 'roles.id'
                }
            },
            receivedReviews: {
                relation: BaseModel.HasManyRelation,
                modelClass: Review,
                join: { from: 'users.id', to: 'reviews.reviewee_id' },
            },
            hiredWorkers: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: require('./User'),
                join: {
                    from: 'users.id',
                    through: {
                        from: 'employer_workers.employer_id',
                        to: 'employer_workers.worker_id',
                        extra: ['status', 'salary', 'work_type', 'is_favorite', 'joined_at'],
                    },
                    to: 'users.id',
                },
                modify: (query) => {
                    query.where('users.role', 'worker'); // 👈 IMPORTANT
                }
            },
            availability: {
                relation: BaseModel.HasManyRelation,
                modelClass: require('./WorkerAvailability'),
                join: {
                    from : 'users.id',
                    to: "worker_availability.worker_id",
                }
            },
            employers: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: require('./User'),
                join: {
                    from: 'users.id',
                    through: {
                        from: 'employer_workers.worker_id',
                        to: 'employer_workers.employer_id',
                    },
                    to: 'users.id',
                },
            },
        };
    }

    // Strip hidden fields before returning
    $formatJson(json) {
        json = super.$formatJson(json);
        User.hidden.forEach((key) => delete json[key]);
        return json;
    }

}

module.exports = User;
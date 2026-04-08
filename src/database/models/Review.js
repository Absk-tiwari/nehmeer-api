const BaseModel = require("./BaseModel");

class Review extends BaseModel {
    static get tableName() {
        return "reviews";
    }

    static get relationMappings() {
        const User = require("./User");

        return {
            reviewer: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "reviews.reviewer_id",
                    to: "users.id",
                },
            },

            reviewee: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "reviews.reviewee_id",
                    to: "users.id",
                },
            },
        };
    }
}

module.exports = Review;
const User = require('./../database/models/User.js');
const ReviewService = require('../services/ReviewService');
const WorkerProfile = require('../database/models/WorkerProfile');
const { Model, raw } = require('objection');
const Review = require('../database/models/Review.js');
const Location = require('../database/models/Location.js');
const WorkerAvailability = require('../database/models/WorkerAvailability.js');

class ProfileController {

    async workerInfo(req, res, next) {
        try {

            const result = await User.query().where('role', 'worker');
            res.json({
                status: true,
                data: result
            });
        } catch (error) {
            return next(error)
        }
    }

    async getWorkers(req, res, next) {
        try {
            const { search, address } = req.body;
            // console.log("ye rha address: ", address);
            const query = User.query()
                .alias('u')
                .where('u.role', 'worker')
                .andWhere('u.is_active', true)
                .leftJoin('reviews as rr', 'rr.reviewee_id', 'u.id')
                .select('u.*')
                .select(
                    User.relatedQuery('receivedReviews')
                        .avg('rating')
                        .as('avg_rating'),
                    User.relatedQuery('receivedReviews')
                        .count()
                        .as('total_reviews')
                )
                .withGraphFetched('workerProfile');

            if (search) {
                query.where('name', 'like', `%${search}%`);
            }

            if (address && address.city) {
                query
                    .joinRelated('workerProfile') // 🔥 joins worker_profiles
                    .where('workerProfile.city', 'like', `%${address.city}%`);
            }

            // console.log("Final workers Query: ", query.toKnexQuery().toString());
            const workers = await query;
            console.log("Ja rhe workers", workers);
            res.json({ success: true, data: workers });
        } catch (err) { next(err); }
    }
    // ─── Get Own Profile ─────────────────────────────────────────────────────────
    async getMyProfile(req, res, next) {
        try {
            const user = await User.query()
                .findById(req.user.id)
                .withGraphFetched(
                    req.user.role === 'employer'
                        ? '[activeSubscription.[plan]]'
                        : '[activeSubscription.[plan]]'
                );
            res.json({ success: true, data: user });
        } catch (err) { next(err); }
    }
    // ─── Update Job Seeker Profile ───────────────────────────────────────────────
    async updateWorkerProfile(req, res, next) {
        try {
            const profile = await WorkerProfile.query()
                .where('user_id', req.user.id)
                .first();

            const { name, whatsapp, lookingFor, email, gender, availability, ...rest } = req.body
            console.log("ye rhi baki ka : ", rest);
            let updated;
            const user = await User.query().patchAndFetchById(req.user.id, {
                name,
                whatsapp,
                email,
                gender,
            });
            if (profile) {
                updated = await WorkerProfile.query()
                    .patchAndFetchById(profile.id, {
                        ...rest
                    });
            } else {
                updated = await WorkerProfile.query()
                    .insertAndFetch({
                        ...rest,
                        user_id: req.user.id
                    });
            }

            await WorkerAvailability.query().where("worker_id", req.user.id).delete();

            availability.forEach(async av => {
                await WorkerAvailability.query().insert({
                    worker_id: req.user.id,
                    ...av
                });
            })

            res.json({
                success: true,
                data: {
                    user,
                    workerProfile: updated,
                    availability
                }
            });
        } catch (err) { next(err); }
    }
    // ─── Update Employer Profile ─────────────────────────────────────────────────
    async updateEmployerProfile(req, res, next) {
        try {
            let updated;
            if (profile) {
                updated = await User.query().patchAndFetchById(req.user.id, req.body);
            } else {
                updated = await User.query().insertAndFetch({ ...req.body, id: req.user.id });
            }

            res.json({ success: true, data: updated });
        } catch (err) { next(err); }
    }
    // ─── View Public Profile ─────────────────────────────────────────────────────
    async getPublicProfile(req, res, next) {
        try {
            const user = await User.query()
                .findOne({ id: req.params.id, is_active: true })
                .withGraphFetched('[workerProfile, availability]');

            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            const ratingStats = await ReviewService.getAverageRating(user.id);

            res.json({ success: true, data: { ...user, ratingStats } });
        } catch (err) { next(err); }
    }
    // ─── Update Avatar ───────────────────────────────────────────────────────────
    async updateAvatar(req, res, next) {
        try {
            if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

            const avatarUrl = `/uploads/avatars/${req.file.filename}`;
            await User.query().patchAndFetchById(req.user.id, { profile_photo: avatarUrl });

            res.json({ success: true, data: avatarUrl });
        } catch (err) { next(err); }
    }

    async myWorkers(req, res, next) {
        try {
            const employerId = req.user.id;
            const tab = req.query.tab || 'active';
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 10);

            // const employer = await User.query()
            //  .findById(employerId)
            //  .withGraphFetched('hiredWorkers.workerProfile')
            //  .modifyGraph('hiredWorkers', (builder) => {
            //      builder.where('role', 'worker').orderBy('employer_workers.joined_at', 'desc');
            //  });

            const result = await User.relatedQuery('hiredWorkers')
                .for(employerId)
                .withGraphFetched('workerProfile.[roles]')
                .where('employer_workers.status', tab === 'history' ? 'completed' : 'active')
                .leftJoin('reviews', 'users.id', 'reviews.reviewee_id')
                .groupBy('users.id')
                .select(
                    Model.knex().raw('COUNT(reviews.id) as reviews_count'),
                    Model.knex().raw('AVG(reviews.rating) as avg_rating')
                )
                .orderBy("id",'desc')
                .page(page - 1, limit);

            const formatted = result.results.map((user) => ({
                id: user.id.toString(),
                name: user.name,
                exp: `${user.workerProfile?.experience || 0} Years`,
                role: user.role,
                rating: Number(user.avg_rating || 0).toFixed(1),
                reviews: user.reviews_count || 0,
                age: user.workerProfile?.age || '-',
                location: user.workerProfile?.location || '-',
                image: user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg', // fallback
            }));

            res.json({
                // use formatted here
                results: formatted,
                total: result.total,
            });

        } catch (err) {
            next(err);
        }
    }

    async addFeedback(req, res, next) {
        try {
            console.log(req.body);
            const added = await Review.query().insertAndFetch({
                reviewer_id: req.user.id,
                reviewee_id: req.body.worker,
                comment: req.body.review,
                rating: req.body.rating,
                extra: req.body.categoryRatings
            });

            res.json({
                status: true,
                added
            });

        } catch (error) {
            next(error);
        }
    }


    async saveLocation(req, res, next) {
        try {
            const {
                latitude,
                longitude,
                city,
                state,
                ...rest
            } = req.body.address;
            console.log("yahi sab aya hai: ", req.body);

            const result = await Location.query().insertAndFetch({
                latitude,
                longitude,
                city,
                state,
                address: rest.formattedAddress,
                area: rest.region,
                pincode: rest.postalCode,
                user_id: req.user.id
            });

            res.json({
                status: true,
                data: result
            });
            // console.log(req.body)
        } catch (error) {
            next(error);
        }
    }

    async removeLocation(req, res, next) {
        try {
            await Location.query().deleteById(req.params.id)
            res.json({
                success: true,
                message: "Location removed!"
            })
        } catch (error) {
            next(error)
        }
    }

    async getLocations(req, res, next) {
        try {
            const result = await Location.query().where('user_id', req.user.id).orderBy('id', 'desc');
            res.json(result);
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new ProfileController();

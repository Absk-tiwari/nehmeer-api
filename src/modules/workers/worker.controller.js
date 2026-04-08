const WorkerProfile = require("../../database/models/WorkerProfile");

exports.createProfile = async (req, res, next) => {
    try {
        const profile = await WorkerProfile.query().insert({
            ...req.body,
            user_id: req.user.id,
        });

        res.json(profile);
    } catch (err) {
        next(err);
    }
};

exports.updateAvailability = async (req, res, next) => {
    try {
        const { is_available } = req.body;

        const profile = await WorkerProfile.query()
            .patchAndFetchById(req.user.id, { is_available });

        res.json(profile);
    } catch (err) {
        next(err);
    }
};
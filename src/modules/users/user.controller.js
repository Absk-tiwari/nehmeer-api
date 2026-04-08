const User = require("../../database/models/User");

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.query()
            .findById(req.user.id)
            .withGraphFetched("workerProfile");

        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const updated = await User.query()
            .patchAndFetchById(req.user.id, req.body);

        res.json(updated);
    } catch (err) {
        next(err);
    }
};
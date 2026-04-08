const Location = require("../../database/models/Location");

exports.updateLocation = async (req, res, next) => {
    try {
        const location = await Location.query().insert({
            ...req.body,
            user_id: req.user.id,
        });

        res.json(location);
    } catch (err) {
        next(err);
    }
};
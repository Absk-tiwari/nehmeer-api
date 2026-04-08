const HireRequest = require("../../database/models/HireRequest");

exports.sendHireRequest = async (req, res, next) => {
    try {
        const request = await HireRequest.query().insert({
            ...req.body,
            employer_id: req.user.id,
        });

        res.json(request);
    } catch (err) {
        next(err);
    }
};

exports.respondHireRequest = async (req, res, next) => {
    try {
        const { status } = req.body;

        const updated = await HireRequest.query()
            .patchAndFetchById(req.params.id, {
                status,
                responded_at: new Date().toISOString(),
            });

        res.json(updated);
    } catch (err) {
        next(err);
    }
};
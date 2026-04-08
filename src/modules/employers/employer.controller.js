const JobPost = require("../../database/models/JobPost");

exports.createJob = async (req, res, next) => {
    try {
        const job = await JobPost.query().insert({
            ...req.body,
            employer_id: req.user.id,
        });

        res.json(job);
    } catch (err) {
        next(err);
    }
};

exports.myJobs = async (req, res, next) => {
    try {
        const jobs = await JobPost.query()
            .where("employer_id", req.user.id)
            .withGraphFetched("hireRequests");

        res.json(jobs);
    } catch (err) {
        next(err);
    }
};
const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);

        res.json({
            success: true,
            data: result
        });

    } catch (err) {
        next(err);
    }
};

exports.registerWorker = async (req, res, next) => {
    try {

        const result = await authService.registerWorker(req.body);
        res.status(201).json({
            success: true,
            data: result
        });

    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {

        const { mobile: phone, password } = req.body;
        const result = await authService.login(phone, password);
        res.json(result);

    } catch (err) {
        next(err);
    }
};

exports.requestOTP = async (req, res, next) => {
    try {
        // console.log(req.body);
        const { phone } = req.body;
        const result = await authService.requestOTP(phone);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.verifyOTP = async (req, res, next) => {
    try {
        const { phone, otp } = req.body;
        const result = await authService.verifyOTPAndLogin(
            phone,
            otp
        );

        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        await authService.logout(req.user.id, refreshToken);
        res.json({ message: "Logged out successfully" });
    } catch (err) {
        next(err);
    }
};

exports.me = async (req, res) => {
    res.json({ success: true, data: req.user });
}
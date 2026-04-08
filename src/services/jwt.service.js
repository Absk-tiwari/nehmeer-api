const jwt = require("jsonwebtoken");
const env = require("./../config/env");

const ACCESS_SECRET = env.JWT_SECRET;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET;

exports.generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: "15m",
    });
};

exports.generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: "7d",
    });
};

exports.verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};

exports.verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};
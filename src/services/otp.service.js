// const cache = require("./cache.service");
const bcrypt = require("bcrypt");

exports.generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOTP = async (phone) => {
    const otp = exports.generateOTP();
    const hashed = await bcrypt.hash(otp, 10);
    // await cache.set(`otp:${phone}`, hashed, 300);
    console.log(`OTP for ${phone}: ${otp}`);
    return otp;
};

exports.verifyOTP = async (phone, otp) => {
    // const hashed = await cache.get(`otp:${phone}`);

    if (!hashed) return false;

    const valid = await bcrypt.compare(otp, hashed);

    // if (valid) await cache.del(`otp:${phone}`);

    return valid;
};
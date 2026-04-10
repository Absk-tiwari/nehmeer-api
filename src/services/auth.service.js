const User = require("../database/models/User");
const jwtService = require("./jwt.service");
const otpService = require("./otp.service");
// const cache = require("./cache.service");
const bcrypt = require("bcrypt");

exports.register = async ({ name=null, mobile, email = null, password, role }) => {

    // check if user already exists
    const existingUser = await User.query().findOne({ phone: mobile });

    if (existingUser) {
        throw new Error("User already exists with this phone number!");
    }

    if (email) {
        const existingEmail = await User.query().findOne({ email });

        if (existingEmail) {
            throw new Error("Email already in use");
        }
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // create user
    const user = await User.query().insert({
        name,
        phone: mobile,
        email,
        password: passwordHash,
        role: role || "employer",
        is_verified: false,
        is_phone_verified: false
    });

    const payload = {
        id: user.id,
        role: user.role
    };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    // await cache.set(
    //     `refresh:${user.id}:${refreshToken}`,
    //     "valid",
    //     7 * 24 * 60 * 60
    // );

    return {
        user,
        accessToken,
        refreshToken
    };
};

exports.registerWorker = async ({
    name,
    phone,
    password
}) => {

    const existing = await User.query().findOne({ phone });

    if (existing) {
        throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.query().insert({
        name,
        phone,
        password: passwordHash,
        role: "worker",
        is_verified: false,
        is_phone_verified: false
    });

    const payload = { id: user.id, role: user.role };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    // await cache.set(
    //     `refresh:${user.id}:${refreshToken}`,
    //     "valid",
    //     7 * 24 * 60 * 60
    // );

    return { user, accessToken, refreshToken };
};

exports.login = async (phone, password) => {

    const user = await User.query()
        .select("id", "name", "phone", "password", "email", "whatsapp", "gender", "role", "is_verified", "profile_photo")
        .findOne({ phone })
        .withGraphFetched('[availability,workerProfile,activeSubscription]');

    if (!user) {
        throw new Error("User not found");
    }


    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        throw new Error("Invalid credentials");
    }

    const payload = { id: user.id, role: user.role };
    delete user.password;

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    // await cache.set(
    //     `refresh:${user.id}:${refreshToken}`,
    //     "valid",
    //     7 * 24 * 60 * 60
    // );

    return {
        user: {...user, 
            workerProfile: user.workerProfile ?? {},
            availability: user.availability?? []
        },
        token: accessToken,
        refreshToken
    };
};

exports.requestOTP = async (phone) => {
    const otp = await otpService.sendOTP(phone);
    return { message: "OTP sent", otp };
};


exports.verifyOTPAndLogin = async (phone, otp) => {
    const valid = await otpService.verifyOTP(phone, otp);

    if (!valid) throw new Error("Invalid OTP");

    let user = await User.query().findOne({ phone });

    // Create user if not exists
    if (!user) {
        user = await User.query().insert({
            phone,
            role: "worker",
            is_verified: true,
        });
    }

    const payload = { id: user.id, role: user.role };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    // await cache.set(
    //     `refresh:${user.id}:${refreshToken}`,
    //     "valid",
    //     7 * 24 * 60 * 60
    // );

    return { user, accessToken, refreshToken };
};

exports.refreshToken = async (refreshToken) => {

    const decoded = jwtService.verifyRefreshToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    );
    console.log("decoded from refresh token : ", decoded);
    // create new access token
    const payload  = {
        id: decoded.id,
        role: decoded.role
    }

    const newAccessToken = jwtService.generateAccessToken(payload);

    return {
        success: true,
        accessToken: newAccessToken
    }
    
}
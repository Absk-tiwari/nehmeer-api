const router = require("express").Router();
const AuthController = require("./../modules/auth.controller");
const limiter = require("../middleware/rateLimit.middleware");
const { authenticate } = require('../middleware/auth.middleware');

// Worker registration
router.post("/register-worker", AuthController.registerWorker);
// Employer registration
router.post("/register-employer", AuthController.register);

router.post("/login", AuthController.login);

router.post("/request-otp", limiter.otpLimiter, AuthController.requestOTP);
router.post("/verify-otp", AuthController.verifyOTP);

router.get('/me', authenticate, AuthController.me);

router.post('/refresh', AuthController.refreshToken);
router.post('/save-expo-token', authenticate, AuthController.savePushToken);

module.exports = router;
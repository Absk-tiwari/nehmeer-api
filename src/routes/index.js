const router = require("express").Router();

const authRoutes = require("./auth.routes");
const notificationRoutes = require("./notification.routes");
const jobRoutes = require("./job.routes");
const profileRoutes = require("./profile.routes");
const subscriptionRoutes = require("./subscription.routes")

router.use("/auth", authRoutes);
router.use("/notifications", notificationRoutes);
router.use("/jobs", jobRoutes);
router.use("/profile", profileRoutes);
router.use("/subscriptions", subscriptionRoutes);
module.exports = router;
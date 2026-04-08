
const { authenticate } = require('../middleware/auth.middleware');
const SubscriptionController = require('../modules/subscription.controller');

const router = require('express').Router();

router.get('/create-plan', authenticate, SubscriptionController.createPlan);
router.get('/plans', authenticate, SubscriptionController.getPlans);
router.get('/my-subscription', authenticate, SubscriptionController.getMySubscription);
router.post('/create', authenticate, SubscriptionController.createSubscription);
router.post('/verify', authenticate, SubscriptionController.verifyPayment);

module.exports = router;
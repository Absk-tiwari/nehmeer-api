const express = require('express');
const router = express.Router();
const AdminController = require('../modules/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate, authorize('admin'));

router.get('/stats', AdminController.getStats);

// Users
router.get('/users', AdminController.listUsers);
router.patch('/users/:id/toggle-status', AdminController.toggleUserStatus);

// Jobs
router.get('/jobs', AdminController.listJobs);
router.patch('/jobs/:id/toggle-featured', AdminController.toggleJobFeatured);

// Subscription Plans
router.post('/plans', AdminController.createPlan);
router.put('/plans/:id', AdminController.updatePlan);
router.delete('/plans/:id', AdminController.deletePlan);

module.exports = router;

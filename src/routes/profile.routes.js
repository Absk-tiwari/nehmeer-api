const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ProfileController = require('../modules/profile.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {validate} = require('../middleware/validation.middleware');
const { updateWorkerProfileSchema, updateEmployerProfileSchema } = require('../validations/schemas');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/avatars/'),
    filename: (req, file, cb) => cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 3 * 1024 * 1024 } }); // 3MB

router.post('/', authenticate, ProfileController.getWorkers);
router.get('/me', authenticate, ProfileController.getMyProfile);

router.get('/', authenticate, );
router.put(
    '/worker',
    authenticate,
    authorize('worker'),
    validate(updateWorkerProfileSchema),
    ProfileController.updateWorkerProfile
);

router.put(
    '/employer',
    authenticate,
    authorize('employer'),
    validate(updateEmployerProfileSchema),
    ProfileController.updateEmployerProfile
);
router.get('/locations', authenticate, ProfileController.getLocations)
router.get('/my-workers', authenticate, ProfileController.myWorkers)
router.post('/avatar', authenticate, upload.single('avatar'), ProfileController.updateAvatar);
router.post('/rate-review', authenticate, ProfileController.addFeedback);
router.post('/add-location', authenticate, ProfileController.saveLocation);
router.delete('/remove-location/:id', authenticate, ProfileController.removeLocation);
router.get('/:id', ProfileController.getPublicProfile);

module.exports = router;

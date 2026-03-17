const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');
const { uploadProfile } = require('../middleware/upload');

router.use(isAuthenticated);

router.get('/', profileController.getProfile);
router.put('/', uploadProfile.single('profilePicture'), profileController.updateProfile);
router.put('/password', profileController.changePassword);

module.exports = router;

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', requireAuth, profileController.getProfile);
router.put('/', requireAuth, upload.single('profilePicture'), profileController.putProfile);
router.put('/password', requireAuth, profileController.putPassword);

module.exports = router;

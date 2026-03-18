const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const { requireAuth, requireOfficerOrAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', requireAuth, grievanceController.index);
router.get('/create', requireAuth, grievanceController.getCreate);
router.post('/create', requireAuth, upload.single('attachment'), grievanceController.postCreate);
router.get('/:id', requireAuth, grievanceController.show);
router.get('/:id/edit', requireAuth, grievanceController.getEdit);
router.put('/:id', requireAuth, upload.single('attachment'), grievanceController.putEdit);
router.delete('/:id', requireAuth, grievanceController.delete);
router.post('/:id/status', requireAuth, requireOfficerOrAdmin, grievanceController.updateStatus);

module.exports = router;

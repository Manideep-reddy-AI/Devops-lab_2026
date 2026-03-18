const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', requireAuth, requireAdmin, userController.index);
router.get('/:id/edit', requireAuth, requireAdmin, userController.getEdit);
router.put('/:id', requireAuth, requireAdmin, userController.putEdit);
router.delete('/:id', requireAuth, requireAdmin, userController.delete);

module.exports = router;

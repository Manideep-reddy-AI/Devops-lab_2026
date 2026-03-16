const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.use(isAuthenticated, isAdmin);

router.get('/', userController.getAllUsers);
router.get('/:id/edit', userController.getEditUser);
router.put('/:id/role', userController.updateRole);
router.delete('/:id', userController.deleteUser);

module.exports = router;

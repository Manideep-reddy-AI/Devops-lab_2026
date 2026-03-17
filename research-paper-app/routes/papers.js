const express = require('express');
const router = express.Router();
const paperController = require('../controllers/paperController');
const { isAuthenticated } = require('../middleware/auth');
const { uploadPDF } = require('../middleware/upload');

router.use(isAuthenticated);

router.get('/', paperController.getAllPapers);
router.get('/create', paperController.getCreatePaper);
router.post('/', uploadPDF.single('pdfFile'), paperController.createPaper);
router.get('/:id', paperController.getPaper);
router.get('/:id/edit', paperController.getEditPaper);
router.put('/:id', paperController.updatePaper);
router.delete('/:id', paperController.deletePaper);

module.exports = router;

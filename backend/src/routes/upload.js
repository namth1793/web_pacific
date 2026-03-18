const express = require('express');
const router = express.Router();
const { uploadImage, uploadImages, handleUploadError } = require('../controllers/uploadController');
const { authMiddleware } = require('../middleware/auth');

router.post('/image', authMiddleware, ...uploadImage, handleUploadError);
router.post('/images', authMiddleware, ...uploadImages, handleUploadError);

module.exports = router;

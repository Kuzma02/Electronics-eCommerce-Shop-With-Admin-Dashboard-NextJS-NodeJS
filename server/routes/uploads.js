const express = require('express');
const router = express.Router();
const uploadsController = require('../controllers/uploads');

// Upload a new file
router.post('/', uploadsController.uploadFile);

// Get all uploaded files
router.get('/', uploadsController.getUploadedFiles);

module.exports = router;
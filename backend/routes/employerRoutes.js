const express = require('express');
const router = express.Router();
const multer = require('multer');
const employerController = require('../controllers/employerController');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB per file
  }
});

// All routes require authentication
router.use(authMiddleware);

// Profile routes
router.post('/profile', employerController.createOrUpdateProfile);
router.get('/profile', employerController.getOwnProfile);

// Verification routes
router.post('/verify', upload.array('documents', 5), employerController.submitVerification);
router.get('/verification', employerController.getVerificationStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

// All routes require authentication
router.use(authMiddleware);

// Profile routes
router.post('/profile', candidateController.createOrUpdateProfile);
router.get('/profile', candidateController.getOwnProfile);
router.get('/profile/:id', candidateController.getProfileById);

// Resume routes
router.post('/resume', upload.single('resume'), candidateController.uploadResume);
router.get('/resume', candidateController.getResumeUrl);
router.delete('/resume', candidateController.deleteResume);

// Matching and applications
router.get('/matches', candidateController.getMatchedJobs);
router.get('/applications', candidateController.getApplications);
router.get('/invitations', candidateController.getInvitations);

module.exports = router;

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.post('/', applicationController.applyForJob);
router.get('/:id', applicationController.getApplicationById);
router.put('/:id/status', applicationController.updateApplicationStatus);
router.delete('/:id', applicationController.withdrawApplication);

module.exports = router;

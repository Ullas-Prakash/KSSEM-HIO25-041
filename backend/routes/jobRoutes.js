const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const requireVerifiedEmployer = require('../middleware/employerVerificationMiddleware');

// Public routes
router.get('/', jobController.searchJobs);
router.get('/:id', jobController.getJobById);

// Protected routes - require authentication
router.use(authMiddleware);

// Employer-only routes - require verified employer
router.post('/', requireVerifiedEmployer, jobController.createJob);
router.put('/:id', requireVerifiedEmployer, jobController.updateJob);
router.delete('/:id', requireVerifiedEmployer, jobController.deleteJob);
router.get('/:id/matches', requireVerifiedEmployer, jobController.getMatchedCandidates);
router.get('/:id/applications', requireVerifiedEmployer, jobController.getJobApplications);
router.post('/:id/invite', requireVerifiedEmployer, jobController.inviteCandidate);

// Get employer's own jobs
router.get('/employer/my-jobs', requireVerifiedEmployer, jobController.getEmployerJobs);

module.exports = router;

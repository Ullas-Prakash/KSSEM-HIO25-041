const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getAllStories,
  deleteStory,
  getAllBusinesses,
  deleteBusiness,
  getStats,
  getPendingVerifications,
  approveEmployer,
  rejectEmployer,
  getAllJobs,
  deactivateJob,
  getAllCandidates,
  suspendCandidate,
  getJobStats
} = require('../controllers/adminController');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stories', getAllStories);
router.delete('/stories/:id', deleteStory);
router.get('/businesses', getAllBusinesses);
router.delete('/businesses/:id', deleteBusiness);
router.get('/stats', getStats);

// Job platform admin routes
router.get('/employers/pending', getPendingVerifications);
router.put('/employers/:id/verify', approveEmployer);
router.put('/employers/:id/reject', rejectEmployer);
router.get('/jobs', getAllJobs);
router.put('/jobs/:id/deactivate', deactivateJob);
router.get('/candidates', getAllCandidates);
router.put('/candidates/:id/suspend', suspendCandidate);
router.get('/stats/jobs', getJobStats);

module.exports = router;

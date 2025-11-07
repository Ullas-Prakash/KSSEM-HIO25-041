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
} = require('../controllers/adminController');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stories', getAllStories);
router.delete('/stories/:id', deleteStory);
router.get('/businesses', getAllBusinesses);
router.delete('/businesses/:id', deleteBusiness);
router.get('/stats', getStats);

module.exports = router;

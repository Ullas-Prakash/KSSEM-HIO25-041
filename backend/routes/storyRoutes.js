const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getStories,
  createStory,
  likeStory,
  addComment,
  getComments,
} = require('../controllers/storyController');

router.get('/', getStories);
router.post('/', authMiddleware, createStory);
router.put('/:id/like', authMiddleware, likeStory);
router.post('/:id/comments', authMiddleware, addComment);
router.get('/:id/comments', getComments);

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getBusinesses,
  createBusiness,
  getBusinessById,
} = require('../controllers/businessController');

router.get('/', getBusinesses);
router.post('/', authMiddleware, createBusiness);
router.get('/:id', getBusinessById);

module.exports = router;

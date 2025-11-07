const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/businessController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', ctrl.getBusinesses);
router.get('/:id', ctrl.getBusinessById);
router.post('/', authMiddleware, ctrl.createBusiness);

module.exports = router;

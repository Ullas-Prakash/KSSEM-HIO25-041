const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/:id', invitationController.getInvitationById);
router.put('/:id/accept', invitationController.acceptInvitation);
router.put('/:id/decline', invitationController.declineInvitation);

module.exports = router;

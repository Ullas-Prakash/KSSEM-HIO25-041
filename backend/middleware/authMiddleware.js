const admin = require('../config/firebase');
const User = require('../models/User');
const mongoose = require('mongoose');

const authMiddleware = async (req, res, next) => {
  try {
    // TEMP DEV MODE: Check for x-user-id header for testing without Firebase
    // Remove this block when Firebase is fully integrated
    if (process.env.NODE_ENV === 'development' && req.header('x-user-id')) {
      const userId = req.header('x-user-id');
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(401).json({ error: 'Invalid x-user-id format' });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found with provided x-user-id' });
      }
      req.user = user;
      return next();
    }

    // Production Firebase authentication
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;

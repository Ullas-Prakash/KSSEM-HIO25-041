const admin = require('../config/firebase');
const User = require('../models/User');

exports.verifyToken = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email: email || '',
        displayName: name || '',
        photoURL: picture || '',
      });
    } else {
      user.updatedAt = Date.now();
      await user.save();
    }

    res.json({ user });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

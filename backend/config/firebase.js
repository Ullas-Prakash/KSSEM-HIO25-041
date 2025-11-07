const admin = require('firebase-admin');

// Check if Firebase credentials are configured
const hasFirebaseConfig = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_PRIVATE_KEY && 
  process.env.FIREBASE_CLIENT_EMAIL;

if (hasFirebaseConfig) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  console.log('✅ Firebase Admin initialized');
} else {
  console.warn('⚠️  Firebase credentials not configured. Using development mode only.');
  console.warn('   Set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL in .env');
}

module.exports = admin;

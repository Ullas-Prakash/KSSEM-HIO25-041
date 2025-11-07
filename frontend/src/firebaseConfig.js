import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Check if Firebase is configured
const hasFirebaseConfig = 
  process.env.REACT_APP_FIREBASE_API_KEY && 
  process.env.REACT_APP_FIREBASE_PROJECT_ID;

let app = null;
let auth = null;

if (hasFirebaseConfig) {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('✅ Firebase initialized');
} else {
  console.warn('⚠️ Firebase not configured. Authentication features will be disabled.');
  console.warn('   Set REACT_APP_FIREBASE_API_KEY and other Firebase env variables to enable auth.');
}

export { auth };
export default app;

import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    if (!auth) {
      throw new Error('Firebase not configured. Please set up Firebase credentials.');
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    if (!auth) {
      throw new Error('Firebase not configured. Please set up Firebase credentials.');
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase not configured. Please set up Firebase credentials.');
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const loginAnonymously = () => {
    if (!auth) {
      throw new Error('Firebase not configured. Please set up Firebase credentials.');
    }
    return signInAnonymously(auth);
  };

  const logout = () => {
    if (!auth) {
      throw new Error('Firebase not configured. Please set up Firebase credentials.');
    }
    return signOut(auth);
  };

  useEffect(() => {
    if (!auth) {
      // Firebase not configured, skip auth state listener
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/auth/verify`,
            { idToken }
          );
          setCurrentUser({ ...user, dbUser: response.data.user });
        } catch (error) {
          console.error('Error verifying user:', error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    loginAnonymously,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock user for development without valid Firebase Config
  const [useMockAuth, setUseMockAuth] = useState(false);

  useEffect(() => {
    // Check if Firebase config is placeholder
    if (auth.app.options.apiKey === "PLACEHOLDER_API_KEY") {
      console.warn("Using placeholder Firebase config. Mock auth enabled.");
      setUseMockAuth(true);
      setCurrentUser({ uid: "mock-user-123", email: "test@example.com", displayName: "Test User" });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = () => {
    if (useMockAuth) return Promise.resolve();
    return signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = (email, password) => {
    if (useMockAuth) return Promise.resolve();
    return signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = (email, password) => {
    if (useMockAuth) return Promise.resolve();
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (useMockAuth) {
      setCurrentUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  const value = {
    currentUser,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
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

  const registerWithEmail = async (email, password, name) => {
    if (useMockAuth) return Promise.resolve();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
      // Force update currentUser state so UI reflects the name immediately
      setCurrentUser({ ...userCredential.user, displayName: name });
    }
    return userCredential;
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

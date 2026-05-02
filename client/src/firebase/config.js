import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase config
// You can get this from your Firebase Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyB9GG9ScYWN2Fp4B4X4TUn_N5QuiPPfHXY",
  authDomain: "preptrack-c7d42.firebaseapp.com",
  projectId: "preptrack-c7d42",
  storageBucket: "preptrack-c7d42.firebasestorage.app",
  messagingSenderId: "745912488689",
  appId: "1:745912488689:web:07cc8dfca1781a77c64f50",
  measurementId: "G-QR6M7N4L7L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore DB
export const db = getFirestore(app);

export default app;

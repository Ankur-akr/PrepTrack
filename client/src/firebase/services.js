import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  setDoc,
  query, 
  where, 
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db } from "./config";

// --- User Preferences Services ---

export const getUserPreferences = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user preferences: ", error);
    return null;
  }
};

export const updateUserPreferences = async (userId, preferences) => {
  try {
    const userRef = doc(db, "users", userId);
    // Use { merge: true } to create the document if it doesn't exist
    await setDoc(userRef, {
      ...preferences,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating user preferences: ", error);
    throw error;
  }
};

// --- Problem Services ---

export const addProblem = async (userId, problemData) => {
  try {
    const problemsRef = collection(db, "users", userId, "problems");
    
    // Check for duplicates
    const q = query(
      problemsRef, 
      where("title", "==", problemData.title),
      where("platform", "==", problemData.platform)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error("This problem already exists in your tracker.");
    }

    const docRef = await addDoc(problemsRef, {
      ...problemData,
      isFavourite: false,
      createdAt: serverTimestamp(),
      lastRevised: serverTimestamp(),
      revisionCount: 0
    });
    return { id: docRef.id, isFavourite: false, ...problemData };
  } catch (error) {
    console.error("Error adding problem: ", error);
    throw error;
  }
};

export const getUserProblems = async (userId) => {
  try {
    const problemsRef = collection(db, "users", userId, "problems");
    const q = query(problemsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting problems: ", error);
    // Return empty array on error (especially useful if running with placeholder config)
    return [];
  }
};

export const updateProblemStatus = async (userId, problemId, updates) => {
  try {
    const problemRef = doc(db, "users", userId, "problems", problemId);
    await updateDoc(problemRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating problem: ", error);
    throw error;
  }
};

export const deleteProblem = async (userId, problemId) => {
  try {
    const problemRef = doc(db, "users", userId, "problems", problemId);
    await deleteDoc(problemRef);
    return true;
  } catch (error) {
    console.error("Error deleting problem: ", error);
    throw error;
  }
};

export const markRevision = async (userId, problemId, currentCount) => {
  try {
    const problemRef = doc(db, "users", userId, "problems", problemId);
    await updateDoc(problemRef, {
      revisionCount: currentCount + 1,
      lastRevised: serverTimestamp(),
      status: "Solved"
    });
    return true;
  } catch (error) {
    console.error("Error updating revision: ", error);
    throw error;
  }
};

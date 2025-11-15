// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDocs, collection, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9mipoo8TnXhUQsMFm8UDGfj1e3PTWLvc",
  authDomain: "oracle-8eebf.firebaseapp.com",
  projectId: "oracle-8eebf",
  storageBucket: "oracle-8eebf.firebasestorage.app",
  messagingSenderId: "309480069747",
  appId: "1:309480069747:web:e33cc5e72115a9cc5c2806",
  measurementId: "G-4XD6DGZBZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize a secondary app for user creation (to avoid session conflicts)
const secondaryApp = initializeApp(firebaseConfig, 'secondary');

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Secondary auth for user creation
const secondaryAuth = getAuth(secondaryApp);

// User Management Functions
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'disabled';
  createdAt: Date;
  updatedAt: Date;
}

// Create new user account
export const createUserAccount = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<UserAccount> => {
  try {
    // Store current admin user credentials to re-authenticate later
    const currentUser = auth.currentUser;
    const currentUserEmail = currentUser?.email;
    
    if (!currentUser || !currentUserEmail) {
      throw new Error('Admin must be logged in to create users');
    }

    console.log('👤 Current admin:', currentUserEmail);
    console.log('🔨 Creating new user:', userData.email);

    // Use secondary auth instance to create user without affecting admin session
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth,
      userData.email,
      userData.password
    );

    const firebaseUser = userCredential.user;
    const now = new Date();

    // Create user document in Firestore
    const newUser: UserAccount = {
      id: firebaseUser.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: 'active',
      createdAt: now,
      updatedAt: now
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    
    // Sign out from secondary auth to clean up
    await signOut(secondaryAuth);
    
    console.log('✅ New user account created:', userData.email);
    console.log('💾 User data saved to Firestore');
    console.log('🔒 Admin session preserved:', currentUserEmail);
    console.log('🧹 Secondary auth session cleaned up');

    return newUser;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    // Clean up secondary auth session on error
    try {
      await signOut(secondaryAuth);
    } catch (signOutError) {
      console.warn('⚠️ Could not clean up secondary auth session:', signOutError);
    }
    throw error;
  }
};

// Get all users
export const getAllUsers = async (): Promise<UserAccount[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as UserAccount[];
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

// Update user
export const updateUserAccount = async (userId: string, updates: Partial<UserAccount>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user
export const deleteUserAccount = async (userId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export default app;
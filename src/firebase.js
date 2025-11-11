// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration (loaded from environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "ludico-9433b.firebasestorage.app", // Public identifier (safe to hardcode)
  messagingSenderId: "750254650132", // Public identifier (safe to hardcode)
  appId: "1:750254650132:web:1be5c493f781e43f448801", // Public identifier (safe to hardcode)
  measurementId: "G-54N3FQMT4E", // Public identifier (safe to hardcode)
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

// Export Firebase services
export { auth };
export const db = getFirestore(app);

// Secure sign-in function using Firebase SDK
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  }
}

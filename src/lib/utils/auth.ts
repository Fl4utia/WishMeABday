/**
 * Authentication utility functions
 */
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  User 
} from "firebase/auth";
import { auth } from "@/app/db/firebase/config";

/**
 * Sign in with Google using Firebase Authentication
 * @returns Promise with the authenticated user or null on error
 */
export async function signInWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);
    
    if (result && result.user) {
      // Store authentication state in sessionStorage
      sessionStorage.setItem("user", "true");
      return result.user;
    }
    
    return null;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw new Error("An error occurred during Google login");
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
    sessionStorage.removeItem("user");
  } catch (error) {
    console.error("Sign-out error:", error);
    throw new Error("An error occurred during sign-out");
  }
}

/**
 * Check if user is authenticated (client-side check)
 */
export function isUserAuthenticated(): boolean {
  return sessionStorage.getItem("user") === "true";
}

import { defineStore } from "pinia";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

const firebaseErrorMessages = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/invalid-credential": "Invalid email or password.",
};

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const error = ref(null);
  const loading = ref(false);

  // Restore auth state on app load
  if (import.meta.client) {
    onAuthStateChanged(getAuth(), (firebaseUser) => {
      user.value = firebaseUser;
    });
  }

  const handleAuthentication = async (authFn, email, password) => {
    loading.value = true;
    error.value = null;
    try {
      const userCredential = await authFn(getAuth(), email, password);
      user.value = userCredential.user;
    } catch (err) {
      error.value = firebaseErrorMessages[err.code] || "An unexpected error occurred.";
    } finally {
      loading.value = false;
    }
  };

  const login = (email, password) =>
    handleAuthentication(signInWithEmailAndPassword, email, password);

  const signUp = (email, password) =>
    handleAuthentication(createUserWithEmailAndPassword, email, password);

  const logout = async () => {
    await signOut(getAuth());
    user.value = null;
  };

  const resetPassword = async (email) => {
    loading.value = true;
    error.value = null;
    try {
      await sendPasswordResetEmail(getAuth(), email);
      return true;
    } catch (err) {
      error.value = firebaseErrorMessages[err.code] || "Could not send reset email.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { user, error, loading, login, signUp, logout, resetPassword };
});

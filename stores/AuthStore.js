import { defineStore } from "pinia";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

const firebaseErrorMessages = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/missing-email": "Please enter your email address.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/invalid-credential": "Invalid email or password.",
};

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const error = ref(null);
  const loading = ref(false);

  // Only the chef's account may use Back of House (NUXT_PUBLIC_CHEF_UID).
  const chefUid = useRuntimeConfig().public.chefUid;
  const isChef = computed(() => !!user.value && !!chefUid && user.value.uid === chefUid);

  // Resolves once Firebase has restored (or ruled out) a session, so route
  // guards don't redirect a signed-in chef before auth state is known.
  let resolveReady;
  const authReady = new Promise((resolve) => (resolveReady = resolve));

  if (import.meta.client) {
    onAuthStateChanged(getAuth(), (firebaseUser) => {
      user.value = firebaseUser;
      resolveReady();
    });
  } else {
    resolveReady();
  }

  const waitForAuth = () => authReady;

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

  return { user, isChef, error, loading, waitForAuth, login, logout, resetPassword };
});

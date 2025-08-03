import { defineStore } from "pinia";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

//Get the Firebase Auth instance
const auth = getAuth();

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const error = ref(null);

  const handleAuthentication = async (authFn, email, password) => {
    try {
      const userCredential = await authFn(auth, email, password);
      user.value = userCredential.user;
      error.value = null;
      console.log("User logged in:", user.value.uid);
    } catch (err) {
      console.error("Auth error:", err.code, err.message);
      error.value = err.message || "An unknown error occurred";
    }
  };
  const login = (email, password) =>
    handleAuthentication(signInWithEmailAndPassword, email, password);

  const signUp = (email, password) =>
    handleAuthentication(createUserWithEmailAndPassword, email, password);

  return {
    user,
    error,
    login,
    signUp,
  };
});

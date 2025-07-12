import { defineStore } from "pinia";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const error = ref(null);

  const login = async (email, password) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      user.value = userCredential.user.uid;
      error.value = null;
      console.log("User logged in:", user.value);
    } catch (err) {
      console.error("Login error:", err.code, err.message);
      error.value = err.message;
    }
  };

  return {
    user,
    error,
    login,
  };
});

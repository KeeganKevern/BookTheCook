// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.NUXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "bookthecook-87067.firebaseapp.com",
  projectId: "bookthecook-87067",
  storageBucket: "bookthecook-87067.firebasestorage.app",
  messagingSenderId: "269650157328",
  appId: "1:269650157328:web:d7087b61259c056ec04f95",
  measurementId: "G-NJGNCLT4YE",
};

// Initialize Firebase (Checks to see if the app has already been initialized)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);

export const auth = getAuth(app);

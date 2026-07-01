import { initializeApp, getApps } from "firebase/app";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const firebaseApiKey = config.public.firebaseApiKey;

  if (!getApps().length) {
    initializeApp({
      apiKey: firebaseApiKey,
      authDomain: "bookthecook-87067.firebaseapp.com",
      projectId: "bookthecook-87067",
      storageBucket: "bookthecook-87067.firebasestorage.app",
      messagingSenderId: "269650157328",
      appId: "1:269650157328:web:d7087b61259c056ec04f95",
      measurementId: "G-NJGNCLT4YE",
    });
  }
});

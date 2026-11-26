import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Server-only Firestore access. The admin SDK bypasses security rules, which is
// what lets the browser be locked out of writing while this route still saves.
// Credentials come from a service account for bookthecook-87067 (see .env.example).
export function adminDb() {
  if (!getApps().length) {
    const config = useRuntimeConfig();
    if (!config.firebaseClientEmail || !config.firebasePrivateKey) {
      throw new Error("Firebase admin credentials are not set");
    }
    initializeApp({
      credential: cert({
        projectId: "bookthecook-87067",
        clientEmail: config.firebaseClientEmail,
        // Env vars store the key's line breaks as literal \n
        privateKey: config.firebasePrivateKey.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

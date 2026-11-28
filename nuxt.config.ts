// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
  ],

  // Chef-only pages depend on Firebase login, which only exists in the browser.
  // Rendering them there avoids hydration mismatches; they don't need SEO.
  routeRules: {
    "/BackOfHouse": { ssr: false },
    "/UserProfile": { ssr: false },
  },

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  runtimeConfig: {
    // Server-only secrets (never sent to the browser). Set via NUXT_* env vars; see .env.example.
    firebaseClientEmail: "",
    firebasePrivateKey: "",
    resendApiKey: "",
    notifyEmail: "",
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      // Firebase UID of the chef's account; the only account allowed into Back of House.
      // Set NUXT_PUBLIC_CHEF_UID in .env (local) and in Netlify's environment variables.
      chefUid: "",
    },
  },

});

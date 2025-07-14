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
    "nuxt-vuefire",
  ],

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  // runtimeConfig: {
  //   firebaseApiKey: process.env.FIREBASE_API_KEY,
  // },

  vuefire: {
    auth: {
      enabled: true,
    },
    admin: {
      serviceAccount: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    },
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: "bookthecook-87067.firebaseapp.com",
      projectId: "bookthecook-87067",
      storageBucket: "bookthecook-87067.firebasestorage.app",
      messagingSenderId: "269650157328",
      appId: "1:269650157328:web:d7087b61259c056ec04f95",
      measurementId: "G-NJGNCLT4YE",
    },
  },
});

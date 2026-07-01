<template>
  <div class="max-w-sm mx-auto px-4 py-8">

    <!-- Logged in -->
    <div v-if="authStore.user" class="space-y-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">Signed in as <strong>{{ authStore.user.email }}</strong></p>
      <button
        class="w-full border-2 border-black dark:border-white p-2 rounded-sm hover:bg-red-100 dark:hover:bg-red-900"
        @click="authStore.logout"
      >
        Log out
      </button>
    </div>

    <!-- Logged out -->
    <div v-else class="space-y-8">
      <form class="space-y-3" @submit.prevent="handleLogin">
        <h2 class="font-semibold text-lg">Log in</h2>
        <input
          class="w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black"
          type="email"
          placeholder="Email"
          v-model="email"
          required
        />
        <input
          class="w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black"
          type="password"
          placeholder="Password"
          v-model="password"
          required
        />
        <p v-if="authStore.error" class="text-red-600 text-sm">{{ authStore.error }}</p>
        <button
          class="w-full border-2 border-teal-700 p-2 rounded-sm hover:bg-emerald-600 bg-teal-600 text-white disabled:opacity-50"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Logging in…' : 'Log in' }}
        </button>
      </form>

      <form class="space-y-3" @submit.prevent="handleSignUp">
        <h2 class="font-semibold text-lg">Create account</h2>
        <input
          class="w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black"
          type="email"
          placeholder="Email"
          v-model="signUpEmail"
          required
        />
        <input
          class="w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black"
          type="password"
          placeholder="Password (min 6 characters)"
          v-model="signUpPassword"
          minlength="6"
          required
        />
        <p v-if="authStore.error" class="text-red-600 text-sm">{{ authStore.error }}</p>
        <button
          class="w-full border-2 border-teal-700 p-2 rounded-sm hover:bg-emerald-600 bg-teal-600 text-white disabled:opacity-50"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Creating account…' : 'Sign up' }}
        </button>
      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ headerTitle: "The Customer Zone" });

import { useAuthStore } from "@/stores/AuthStore";

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const signUpEmail = ref("");
const signUpPassword = ref("");

const handleLogin = async () => {
  authStore.error = null;
  await authStore.login(email.value, password.value);
};

const handleSignUp = async () => {
  authStore.error = null;
  await authStore.signUp(signUpEmail.value, signUpPassword.value);
};
</script>

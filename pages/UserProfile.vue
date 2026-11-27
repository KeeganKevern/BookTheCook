<template>
  <div class="max-w-sm mx-auto px-4 py-8">

    <!-- Logged in -->
    <div v-if="authStore.user" class="space-y-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Signed in as <strong>{{ currentUser?.email }}</strong>
      </p>
      <NuxtLink
        v-if="authStore.isChef"
        to="/BackOfHouse"
        class="block w-full text-center border-2 border-teal-700 p-2 rounded-sm hover:bg-emerald-600 bg-teal-600 text-white"
      >
        Go to Back of House
      </NuxtLink>
      <p v-else class="text-sm text-red-600">This account doesn't have access to Back of House.</p>
      <button
        class="w-full border-2 border-black dark:border-white p-2 rounded-sm hover:bg-red-100 dark:hover:bg-red-900"
        @click="authStore.logout"
      >
        Log out
      </button>
    </div>

    <!-- Logged out: chef login only. Customers don't have accounts. -->
    <div v-else class="space-y-6">
      <h2 class="text-xl font-semibold">Chef login</h2>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div class="space-y-1">
          <label class="text-sm font-medium" for="login-email">Email</label>
          <input
            id="login-email"
            class="w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black"
            type="email"
            v-model="loginEmail"
            required
          />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium" for="login-password">Password</label>
          <input
            id="login-password"
            class="w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black"
            type="password"
            v-model="loginPassword"
            required
          />
          <button
            type="button"
            class="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            @click="showReset = !showReset"
          >
            Forgot password?
          </button>
        </div>

        <!-- Forgot password inline -->
        <div v-if="showReset" class="space-y-2 p-3 border border-gray-200 dark:border-gray-700 rounded-sm">
          <p class="text-xs text-gray-500 dark:text-gray-400">Enter your email and we'll send a reset link.</p>
          <input
            class="w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black text-sm"
            type="email"
            placeholder="Email"
            v-model="resetEmail"
          />
          <p v-if="resetSuccess" class="text-green-600 text-xs">Reset email sent — check your inbox.</p>
          <p v-if="resetError" class="text-red-600 text-xs">{{ resetError }}</p>
          <button
            type="button"
            class="w-full border-2 border-gray-300 dark:border-gray-600 p-1.5 rounded-sm text-sm hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50"
            :disabled="authStore.loading"
            @click="handleReset"
          >
            Send reset link
          </button>
        </div>

        <p v-if="loginError" class="text-red-600 text-sm">{{ loginError }}</p>
        <button
          class="w-full border-2 border-teal-700 p-2 rounded-sm hover:bg-emerald-600 bg-teal-600 text-white disabled:opacity-50"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Logging in…' : 'Log in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ headerTitle: "Chef Login" });

import { useAuthStore } from "@/stores/AuthStore";

const authStore = useAuthStore();
const router = useRouter();
const currentUser = computed(() => authStore.user as any);

const loginEmail = ref("");
const loginPassword = ref("");
const resetEmail = ref("");
const showReset = ref(false);
const loginError = ref<string | null>(null);
const resetError = ref<string | null>(null);
const resetSuccess = ref(false);

const handleLogin = async () => {
  loginError.value = null;
  authStore.error = null;
  await authStore.login(loginEmail.value, loginPassword.value);
  if (authStore.error) {
    loginError.value = authStore.error;
  } else if (authStore.isChef) {
    router.push("/BackOfHouse");
  }
};

const handleReset = async () => {
  resetError.value = null;
  resetSuccess.value = false;
  const ok = await authStore.resetPassword(resetEmail.value);
  if (ok) {
    resetSuccess.value = true;
  } else {
    resetError.value = authStore.error;
  }
};
</script>

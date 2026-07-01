<template>
  <div class="max-w-sm mx-auto px-4 py-8">

    <!-- Logged in -->
    <div v-if="authStore.user" class="space-y-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Signed in as <strong>{{ currentUser?.email }}</strong>
      </p>
      <button
        class="w-full border-2 border-black dark:border-white p-2 rounded-sm hover:bg-red-100 dark:hover:bg-red-900"
        @click="authStore.logout"
      >
        Log out
      </button>
    </div>

    <!-- Logged out -->
    <div v-else class="space-y-6">

      <!-- Tab toggle -->
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button
          class="flex-1 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'login'
            ? 'border-b-2 border-black dark:border-white'
            : 'text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'"
          @click="switchTab('login')"
        >
          Log in
        </button>
        <button
          class="flex-1 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'signup'
            ? 'border-b-2 border-black dark:border-white'
            : 'text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'"
          @click="switchTab('signup')"
        >
          Create account
        </button>
      </div>

      <!-- Login form -->
      <form v-if="activeTab === 'login'" class="space-y-4" @submit.prevent="handleLogin">
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

      <!-- Sign up form -->
      <form v-if="activeTab === 'signup'" class="space-y-4" @submit.prevent="handleSignUp">
        <div class="space-y-1">
          <label class="text-sm font-medium" for="signup-email">Email</label>
          <input
            id="signup-email"
            class="w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black"
            type="email"
            v-model="signUpEmail"
            required
          />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium" for="signup-password">Password</label>
          <input
            id="signup-password"
            class="w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black"
            type="password"
            placeholder="Min 6 characters"
            v-model="signUpPassword"
            minlength="6"
            required
          />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium" for="signup-confirm">Confirm password</label>
          <input
            id="signup-confirm"
            class="w-full border-2 p-2 rounded-sm bg-white dark:bg-black"
            :class="confirmMismatch ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'"
            type="password"
            placeholder="Repeat password"
            v-model="signUpConfirm"
            required
          />
          <p v-if="confirmMismatch" class="text-red-500 text-xs">Passwords do not match.</p>
        </div>

        <p v-if="signUpError" class="text-red-600 text-sm">{{ signUpError }}</p>
        <button
          class="w-full border-2 border-teal-700 p-2 rounded-sm hover:bg-emerald-600 bg-teal-600 text-white disabled:opacity-50"
          :disabled="authStore.loading || confirmMismatch"
        >
          {{ authStore.loading ? 'Creating account…' : 'Create account' }}
        </button>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ headerTitle: "My Account" });

import { useAuthStore } from "@/stores/AuthStore";

const authStore = useAuthStore();
const router = useRouter();
const currentUser = computed(() => authStore.user as any);

const activeTab = ref<'login' | 'signup'>('login');
const loginEmail = ref("");
const loginPassword = ref("");
const signUpEmail = ref("");
const signUpPassword = ref("");
const signUpConfirm = ref("");
const resetEmail = ref("");
const showReset = ref(false);
const loginError = ref<string | null>(null);
const signUpError = ref<string | null>(null);
const resetError = ref<string | null>(null);
const resetSuccess = ref(false);

const confirmMismatch = computed(() =>
  signUpConfirm.value.length > 0 && signUpPassword.value !== signUpConfirm.value
);

const switchTab = (tab: 'login' | 'signup') => {
  activeTab.value = tab;
  loginError.value = null;
  signUpError.value = null;
  showReset.value = false;
  authStore.error = null;
};

const handleLogin = async () => {
  loginError.value = null;
  authStore.error = null;
  await authStore.login(loginEmail.value, loginPassword.value);
  if (authStore.error) {
    loginError.value = authStore.error;
  } else {
    router.push("/");
  }
};

const handleSignUp = async () => {
  if (confirmMismatch.value) return;
  signUpError.value = null;
  authStore.error = null;
  await authStore.signUp(signUpEmail.value, signUpPassword.value);
  if (authStore.error) {
    signUpError.value = authStore.error;
  } else {
    router.push("/");
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

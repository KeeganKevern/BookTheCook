<template>
  <section class="bg-red-200 mt-40 !max-w-80">
    <form class="p-4 flex-col items-center" @submit.prevent="handleLogin">
      <h1>simple firebase auth check</h1>
      <input
        class="border-2 m-2"
        type="email"
        name="userEmail"
        id="userEmail"
        placeholder="someone@domain.com"
        v-model="email"
      />
      <input
        class="border-2 m-2"
        type="password"
        name="userPassword"
        id="userPassword"
        placeholder="**********"
        v-model="password"
      />
      <button class="border-2 p-2 rounded-sm hover:bg-emerald-600 bg-teal-600">
        Log in
      </button>
    </form>
    <p class="bg-green-200 h-40 overflow-scroll">{{ logInStatus }}</p>
  </section>

  <section class="bg-red-200 m-20 !max-w-80">
    <form class="p-4 flex-col items-center" @submit.prevent="handleSignUp">
      <h1>simple firebase auth check</h1>
      <input
        class="border-2 m-2"
        type="email"
        name="userSignUpEmail"
        id="userSignUpEmail"
        placeholder="someone@domain.com"
        v-model="signUpEmail"
      />
      <input
        class="border-2 m-2"
        type="password"
        name="userSignUpPassword"
        id="userSignUpPassword"
        placeholder="**********"
        v-model="signUpPassword"
      />
      <button class="border-2 p-2 rounded-sm hover:bg-emerald-600 bg-teal-600">
        Sign Up
      </button>
    </form>
    <p class="bg-green-200 h-40 overflow-scroll">{{ logInStatus }}</p>
  </section>
</template>
<script setup lang="ts">
definePageMeta({
  headerTitle: "The Customer Zone",
});

import { ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";

const logInStatus = ref("not logged in");

const email = ref("");
const password = ref("");
const signUpEmail = ref("");
const signUpPassword = ref("");
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);

    if (!authStore.user) {
      logInStatus.value = "error";
    } else {
      logInStatus.value = authStore.user;
    }
  } catch (err: any) {
    console.error(err.message);
    logInStatus.value = "error";
  }
};

const handleSignUp = async () => {
  try {
    await authStore.signUp(signUpEmail.value, signUpPassword.value);
    if (!authStore.user) {
      logInStatus.value = "error";
    } else {
      logInStatus.value = authStore.user;
    }
  } catch (err: any) {
    console.error(err.message);
  }
};
</script>

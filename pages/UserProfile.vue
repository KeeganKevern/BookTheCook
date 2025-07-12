<template>
  <section class="bg-red-200 m-40 !max-w-80">
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
    <p class="bg-green-200 h-80 overflow-scroll">{{ logInStatus }}</p>
  </section>
</template>
<script setup>
definePageMeta({
  headerTitle: "The Customer Zone",
});

import { ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";

const logInStatus = ref("not logged in");

const email = ref("");
const password = ref("");
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
    // await authStore.login;
  } catch (err) {
    console.error(err.message);
  }
  logInStatus.value = authStore.user;

  if (!authStore.user) {
    logInStatus.value = "error";
  } else {
    logInStatus.value = authStore.user;
  }
};
</script>

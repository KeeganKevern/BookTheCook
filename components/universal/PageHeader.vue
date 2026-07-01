<template>
  <header class="fixed top-8 z-10 w-11/12 mx-auto">
    <div class="flex p-4 justify-between items-center rounded bg-white dark:bg-black text-black dark:text-white border border-gray-200 dark:border-gray-800">
      <div class="relative" ref="menuRef">
        <TheButton @click="menuOpen = !menuOpen" />

        <!-- User menu dropdown -->
        <div
          v-if="menuOpen"
          class="absolute left-0 top-10 w-52 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded shadow-lg py-2 z-20"
        >
          <div v-if="authStore.user" class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 truncate">
            {{ authStore.user.email }}
          </div>
          <NuxtLink
            to="/UserProfile"
            class="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-900"
            @click="menuOpen = false"
          >
            My Account
          </NuxtLink>
          <button
            v-if="authStore.user"
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-900"
            @click="handleLogout"
          >
            Log out
          </button>
        </div>
      </div>

      <h1>{{ headerTitle }}</h1>

      <NavButton navRoute="/Contact" iconName="typcn:phone" />
    </div>
  </header>
</template>

<script setup lang="ts">
import TheButton from "@/components/universal/TheButton.vue";
import NavButton from "@/components/universal/NavButton.vue";
import { useAuthStore } from "@/stores/AuthStore";

const route = useRoute();
const authStore = useAuthStore();

const headerTitle = computed(() => route.meta.headerTitle || "Book The Cook");
const menuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);

const handleLogout = async () => {
  await authStore.logout();
  menuOpen.value = false;
};

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
      menuOpen.value = false;
    }
  });
});
</script>

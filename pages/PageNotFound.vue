<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-6">
    <p class="text-7xl font-bold text-gray-200 dark:text-gray-700">404</p>
    <h2 class="text-2xl font-semibold">Page not found</h2>
    <p class="text-gray-500 dark:text-gray-400">The page you're looking for doesn't exist.</p>
    <NuxtLink
      to="/"
      class="px-6 py-2 rounded border-2 border-current hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
    >
      Go home
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ headerTitle: "Not Found" });
</script>

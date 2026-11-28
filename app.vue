<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
const { isDark, migrateFromLocalStorage } = useColorMode();

// Tailwind's dark mode keys off the "dark" class on <html>; set it during the
// server render so the page arrives in the visitor's chosen mode.
useHead({
  htmlAttrs: { class: computed(() => (isDark.value ? "dark" : "")) },
});

onMounted(migrateFromLocalStorage);
</script>

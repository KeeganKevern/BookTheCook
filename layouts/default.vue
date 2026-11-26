<template>
  <div class="flex flex-col items-center min-h-screen bg-white dark:bg-gray-950 text-black dark:text-white">
    <PageHeader />
    <main class="w-full pt-20 pb-16">
      <slot />
      <p class="text-center text-xs text-gray-400 dark:text-gray-500 pt-6 pb-4">
        <NuxtLink to="/Privacy" class="hover:underline">Privacy notice</NuxtLink>
      </p>
    </main>
    <NavFooter />
  </div>
</template>
<script setup>
import PageHeader from "@/components/universal/PageHeader.vue";
import NavFooter from "~/components/layout/footer/NavFooter.vue";
</script>

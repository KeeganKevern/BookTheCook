<template>
  <div class="flex flex-col items-center min-h-screen bg-white dark:bg-gray-950 text-black dark:text-white">
    <PageHeader />
    <main class="w-full pt-20 pb-16">
      <slot />
    </main>
    <NavFooter />
  </div>
</template>
<script setup>
import PageHeader from "@/components/universal/PageHeader.vue";
import NavFooter from "~/components/layout/footer/NavFooter.vue";
</script>

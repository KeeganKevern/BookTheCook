<template>
  <header class="fixed top-8 z-10 w-11/12 mx-auto">
    <div
      class="flex p-4 justify-between items-center rounded dark:bg-black dark:text-white"
    >
      <TheButton />
      <h1>{{ headerTitle }}</h1>
      <NavButton navRoute="/contact" iconName="typcn:phone" />
    </div>
  </header>
</template>
<script setup lang="ts">
import TheButton from "@/components/universal/TheButton.vue";
import NavButton from "@/components/universal/NavButton.vue";

import { useRoute } from "vue-router";

const route = useRoute();
const headerTitle = computed(() => route.meta.headerTitle || "Default Title");
</script>

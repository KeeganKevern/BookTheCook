<template>
  <div class="flex flex-col items-center">
    <PageHeader />
    <slot />
    <NavFooter />
  </div>
</template>
<script setup>
import PageHeader from "@/components/universal/PageHeader.vue";
import NavFooter from "@/components/layout/NavFooter.vue";
</script>

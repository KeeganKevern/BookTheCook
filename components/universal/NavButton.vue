<template>
  <NuxtLink :to="props.navRoute">
    <Icon class="mt-2" :name="props.iconName" :size="props.size" />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    navRoute: string;
    iconName: string;
    size?: string;
  }>(),
  {
    size: "24",
  }
);
</script>

<template>
  <NuxtLink :to="props.navRoute" :aria-label="props.navRoute">
    <Icon
      class="mt-2 transition-opacity"
      :class="isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'"
      :name="props.iconName"
      :size="props.size"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    navRoute: string;
    iconName: string;
    size?: string;
  }>(),
  { size: "24" }
);

const route = useRoute();
const isActive = computed(() => route.path === props.navRoute);
</script>

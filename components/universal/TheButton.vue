<template>
  <button @click="$emit('click')" aria-label="User menu">
    <Icon name="quill:hamburger-sidebar" size="24" />
  </button>
</template>

<script setup lang="ts">
defineEmits(["click"]);
</script>

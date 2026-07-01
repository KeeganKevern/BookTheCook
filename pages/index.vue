<template>
  <div>
    <!-- Hero -->
    <section class="flex flex-col items-center text-center px-6 py-20 gap-6">
      <h2 class="text-4xl font-bold leading-tight">
        A private chef,<br />in your own home.
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-md">
        Restaurant quality dining without leaving your front door. Book a personal chef for any occasion.
      </p>
      <div class="flex gap-4 flex-wrap justify-center">
        <NuxtLink
          to="/Booking"
          class="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded font-semibold hover:opacity-80 transition-opacity"
        >
          Book Now
        </NuxtLink>
        <NuxtLink
          to="/HowItWorks"
          class="px-8 py-3 border-2 border-black dark:border-white rounded font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          How it works
        </NuxtLink>
      </div>
    </section>

    <!-- Value props -->
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-8 px-6 py-12 max-w-3xl mx-auto text-center">
      <div class="flex flex-col items-center gap-3">
        <Icon name="mdi:silverware-fork-knife" size="36" />
        <h3 class="font-semibold">Tailored menus</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Every dish crafted around your tastes, dietary needs, and the occasion.</p>
      </div>
      <div class="flex flex-col items-center gap-3">
        <Icon name="mdi:home-heart" size="36" />
        <h3 class="font-semibold">In your home</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Relax and enjoy — your chef handles everything from prep to clean-up.</p>
      </div>
      <div class="flex flex-col items-center gap-3">
        <Icon name="mdi:star-circle-outline" size="36" />
        <h3 class="font-semibold">Any occasion</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Date nights, dinner parties, celebrations, or a quiet meal for one.</p>
      </div>
    </section>

    <!-- Meet the chef CTA -->
    <section class="flex flex-col items-center text-center px-6 py-12 gap-4 border-t border-gray-100 dark:border-gray-800">
      <h3 class="text-xl font-semibold">Meet the chef behind the food</h3>
      <p class="text-gray-500 dark:text-gray-400 max-w-sm">
        Experienced, passionate, and dedicated to making your table unforgettable.
      </p>
      <NuxtLink
        to="/MeetTheChef"
        class="px-6 py-2 border-2 border-current rounded hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      >
        Meet the chef
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ headerTitle: "Book The Cook" });
</script>

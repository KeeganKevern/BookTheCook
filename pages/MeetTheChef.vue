<template>
  <div class="max-w-2xl mx-auto px-6 py-10 space-y-12">

    <!-- Bio -->
    <section class="flex flex-col items-center text-center gap-4">
   <img
  src="/chef-kevern.png"
  alt="Chef Kevern"
  class="w-32 h-32 rounded-full object-cover"
/>

      <div class="space-y-3">
        <h2 class="text-2xl font-bold">Chef Kevern</h2>
        <p class="text-gray-600 dark:text-gray-400">
          With over 15 years of professional kitchen experience, I've cooked everywhere from quiet village pubs to city-centre chains to al a carte wine bars and bistros. Now I bring that same passion and skill directly to your table.
        </p>
        <p class="text-gray-600 dark:text-gray-400">
          Food is more than fuel - it's the centrepiece of every great gathering. My goal is to make your meal memorable, relaxed, and entirely personal to you.
        </p>
      </div>
    </section>

    <!-- Specialties -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold">Specialties</h3>
      <ul class="grid grid-cols-2 gap-3">
        <li v-for="specialty in specialties" :key="specialty" class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Icon name="mdi:check-circle-outline" size="18" class="text-black dark:text-white flex-shrink-0" />
          {{ specialty }}
        </li>
      </ul>
    </section>

    <!-- Testimonials -->
    <section class="space-y-4">
      <h3 class="text-xl font-semibold">What clients say</h3>
      <div class="space-y-4">
        <blockquote
          v-for="t in testimonials"
          :key="t.name"
          class="border-l-4 border-gray-200 dark:border-gray-700 pl-4 space-y-1"
        >
          <p class="text-gray-600 dark:text-gray-400 italic">"{{ t.quote }}"</p>
          <footer class="text-sm font-medium">— {{ t.name }}</footer>
        </blockquote>
      </div>
    </section>

    <!-- CTA -->
    <section class="text-center pt-4">
      <NuxtLink
        to="/Booking"
        class="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded font-semibold hover:opacity-80 transition-opacity"
      >
        Book a session
      </NuxtLink>
    </section>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ headerTitle: "Meet The Chef" });

const specialties = [
  "British and International Cuisine",
  "Seasonal produce menus",
  "Dietary accommodations",
  "Canapés & small plate catering",
  "Group gatherings & Private dining",
  "Wine pairing suggestions",
];

const testimonials = [
  {
    name: "Sarah & James",
    quote: "This was our valentines day treat. The chef was subtle and we barely noticed he was there. Food was amazing.",
  },
  {
    name: "The Hendersons",
    quote: "We booked a birthday dinner for 6 people and it was the highlight of the year. Every course was perfect.",
  },
];
</script>

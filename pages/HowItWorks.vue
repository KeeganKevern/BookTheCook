<template>
  <div class="max-w-2xl mx-auto px-6 py-10 space-y-14">

    <!-- Steps -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold">How it works</h2>
      <ol class="space-y-8">
        <li v-for="(step, index) in steps" :key="step.title" class="flex gap-5">
          <div class="flex-shrink-0 w-10 h-10 rounded-full border-2 border-black dark:border-white flex items-center justify-center font-bold">
            {{ index + 1 }}
          </div>
          <div class="space-y-1 pt-1">
            <h3 class="font-semibold text-lg">{{ step.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ step.description }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- FAQ -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold">Frequently asked questions</h2>
      <div class="space-y-2">
        <details
          v-for="faq in faqs"
          :key="faq.question"
          class="border border-gray-200 dark:border-gray-700 rounded px-4 py-3 group"
        >
          <summary class="font-medium cursor-pointer list-none flex justify-between items-center">
            {{ faq.question }}
            <Icon name="mdi:chevron-down" size="20" class="transition-transform group-open:rotate-180" />
          </summary>
          <p class="mt-3 text-gray-600 dark:text-gray-400 text-sm">{{ faq.answer }}</p>
        </details>
      </div>
    </section>

    <!-- CTA -->
    <section class="text-center pt-2">
      <NuxtLink
        to="/Booking"
        class="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded font-semibold hover:opacity-80 transition-opacity"
      >
        Book your chef
      </NuxtLink>
    </section>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ headerTitle: "How It Works" });

const steps = [
  {
    title: "Get in touch",
    description: "Fill out the contact form or send a message. Tell us about your occasion, how many guests, and any dietary requirements.",
  },
  {
    title: "Plan your menu",
    description: "We'll discuss your tastes and preferences and design a menu entirely around you — from canapés to dessert.",
  },
  {
    title: "Your chef arrives",
    description: "On the day, your chef arrives with everything needed to prepare and cook in your kitchen.",
  },
  {
    title: "Sit back and enjoy",
    description: "Relax with your guests. Your chef handles all the cooking and leaves your kitchen spotless before they go.",
  },
];

const faqs = [
  {
    question: "What areas do you cover?",
    answer: "We currently cover [your area]. Get in touch if you're unsure — we're often flexible.",
  },
  {
    question: "How far in advance do I need to book?",
    answer: "We recommend at least one week's notice to allow time for menu planning and sourcing ingredients, though we'll always try to accommodate last-minute requests.",
  },
  {
    question: "Do you cater for dietary requirements?",
    answer: "Absolutely. Whether it's vegan, gluten-free, allergies, or personal preferences — just let us know and the menu will be designed around you.",
  },
  {
    question: "What's included in the price?",
    answer: "Ingredients, preparation, cooking, and clean-up. A tailored quote is provided after your initial enquiry.",
  },
  {
    question: "Do I need any special equipment?",
    answer: "No — your chef brings everything required. A standard home kitchen is all that's needed.",
  },
];
</script>

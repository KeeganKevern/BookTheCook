<template>
  <div class="max-w-lg mx-auto px-6 py-10 space-y-10">

    <section class="space-y-2">
      <h2 class="text-2xl font-bold">Get in touch</h2>
      <p class="text-gray-600 dark:text-gray-400">
        Have a question or ready to book? Send a message and we'll get back to you within 24 hours.
      </p>
    </section>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div class="space-y-1">
        <label class="text-sm font-medium" for="name">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Your name"
          class="w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black"
        />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium" for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="your@email.com"
          class="w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black"
        />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium" for="message">Message</label>
        <textarea
          id="message"
          v-model="form.message"
          required
          rows="5"
          placeholder="Tell us about your occasion, number of guests, dietary needs..."
          class="w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black resize-none"
        />
      </div>

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
      <p v-if="submitted" class="text-green-600 text-sm">Message sent! We'll be in touch soon.</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3 bg-black text-white dark:bg-white dark:text-black rounded font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {{ loading ? 'Sending…' : 'Send message' }}
      </button>
    </form>

  </div>
</template>

<script setup lang="ts">
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

definePageMeta({ headerTitle: "Get in Touch" });

const form = reactive({ name: "", email: "", message: "" });
const loading = ref(false);
const submitted = ref(false);
const error = ref<string | null>(null);

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  try {
    const db = getFirestore();
    await addDoc(collection(db, "contacts"), {
      ...form,
      createdAt: serverTimestamp(),
    });
    submitted.value = true;
    form.name = "";
    form.email = "";
    form.message = "";
  } catch (err) {
    error.value = "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

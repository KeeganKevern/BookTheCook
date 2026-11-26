<template>
  <div class="max-w-lg mx-auto px-6 py-10 space-y-10">

    <section class="space-y-2">
      <h2 class="text-2xl font-bold">Request a booking</h2>
      <p class="text-gray-600 dark:text-gray-400">
        Tell us about your occasion. We'll reply within 48 hours with a tailored menu and quote.
        Nothing is booked or paid until you've agreed the quote.
      </p>
    </section>

    <div v-if="submitted" class="border border-green-600 rounded p-6 space-y-3 text-center" role="status">
      <Icon name="mdi:check-circle-outline" size="40" class="text-green-600" />
      <p class="font-semibold">Thanks, your request has been sent.</p>
      <p class="text-sm text-gray-600 dark:text-gray-400">We'll be in touch within 48 hours at the email address you gave.</p>
      <button type="button" class="text-sm underline" @click="reset">Send another request</button>
    </div>

    <form v-else class="space-y-5" novalidate @submit.prevent="handleSubmit">
      <!-- Honeypot: hidden from people, filled in by bots -->
      <div class="hidden" aria-hidden="true">
        <label for="website">Website</label>
        <input id="website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
      </div>

      <fieldset class="space-y-4">
        <legend class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Your details</legend>
        <div class="space-y-1">
          <label class="text-sm font-medium" for="name">Name</label>
          <input id="name" v-model="form.name" type="text" required autocomplete="name" maxlength="200" :class="inputClass" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium" for="email">Email</label>
          <input id="email" v-model="form.email" type="email" required autocomplete="email" maxlength="320" :class="inputClass" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium" for="phone">Phone <span class="font-normal text-gray-400">(optional)</span></label>
          <input id="phone" v-model="form.phone" type="tel" autocomplete="tel" maxlength="20" :class="inputClass" />
        </div>
      </fieldset>

      <fieldset class="space-y-4">
        <legend class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Your event</legend>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-sm font-medium" for="eventDate">Date</label>
            <input id="eventDate" v-model="form.eventDate" type="date" required :min="today" :class="inputClass" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium" for="guests">Guests</label>
            <input id="guests" v-model.number="form.guests" type="number" required min="1" :max="MAX_GUESTS" inputmode="numeric" :class="inputClass" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-sm font-medium" for="town">Town</label>
            <input id="town" v-model="form.town" type="text" required autocomplete="address-level2" maxlength="100" :class="inputClass" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium" for="postcode">Postcode</label>
            <input id="postcode" v-model="form.postcode" type="text" required autocomplete="postal-code" maxlength="10" :class="inputClass" />
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium" for="occasion">Occasion <span class="font-normal text-gray-400">(optional)</span></label>
          <select id="occasion" v-model="form.occasion" :class="inputClass">
            <option value="">Choose…</option>
            <option v-for="o in OCCASIONS" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium" for="budget">Budget per head <span class="font-normal text-gray-400">(optional)</span></label>
          <select id="budget" v-model="form.budget" :class="inputClass">
            <option value="">Choose…</option>
            <option v-for="b in BUDGETS" :key="b" :value="b">{{ b }}</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium" for="dietary">Dietary requirements or allergies <span class="font-normal text-gray-400">(optional)</span></label>
          <textarea id="dietary" v-model="form.dietary" rows="2" maxlength="2000" :class="[inputClass, 'resize-none']" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium" for="message">Anything else <span class="font-normal text-gray-400">(optional)</span></label>
          <textarea id="message" v-model="form.message" rows="4" maxlength="5000" placeholder="Favourite cuisines, kitchen set-up, timings…" :class="[inputClass, 'resize-none']" />
        </div>
      </fieldset>

      <label class="flex items-start gap-3 text-sm">
        <input v-model="form.privacyAccepted" type="checkbox" required class="mt-1" />
        <span>I've read the <NuxtLink to="/Privacy" class="underline">privacy notice</NuxtLink> and agree to my details being used to reply to this request.</span>
      </label>

      <p v-if="error" class="text-red-600 text-sm" role="alert">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3 bg-black text-white dark:bg-white dark:text-black rounded font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {{ loading ? 'Sending…' : 'Send booking request' }}
      </button>
    </form>

  </div>
</template>

<script setup lang="ts">
import { BUDGETS, MAX_GUESTS, OCCASIONS } from "@/utils/enquiryOptions";

definePageMeta({ headerTitle: "Book Your Chef" });

const inputClass = "w-full border-2 border-gray-300 dark:border-gray-600 p-2 rounded-sm bg-white dark:bg-black";
const today = new Date().toISOString().slice(0, 10);

const blank = () => ({
  name: "", email: "", phone: "",
  eventDate: "", guests: null as number | null, town: "", postcode: "",
  occasion: "", budget: "", dietary: "", message: "",
  privacyAccepted: false,
  website: "",
});

const form = reactive(blank());
const loading = ref(false);
const submitted = ref(false);
const error = ref<string | null>(null);

// Quick checks in the browser for a friendly message; the server checks everything again.
const checkForm = (): string | null => {
  if (!form.name.trim()) return "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) return "Please enter a valid email address.";
  if (!form.eventDate) return "Please choose a date.";
  if (form.eventDate < today) return "The event date can't be in the past.";
  if (!form.guests || form.guests < 1 || form.guests > MAX_GUESTS) return `Number of guests must be between 1 and ${MAX_GUESTS}.`;
  if (!form.town.trim()) return "Please enter your town.";
  if (!form.postcode.trim()) return "Please enter your postcode.";
  if (!form.privacyAccepted) return "Please confirm you've read the privacy notice.";
  return null;
};

const handleSubmit = async () => {
  error.value = checkForm();
  if (error.value) return;

  loading.value = true;
  try {
    await $fetch("/api/enquiry", { method: "POST", body: { type: "booking", ...form } });
    submitted.value = true;
  } catch (err: any) {
    error.value = err?.data?.data?.message || "Something went wrong. Please try again, or use the contact page.";
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  Object.assign(form, blank());
  submitted.value = false;
};
</script>

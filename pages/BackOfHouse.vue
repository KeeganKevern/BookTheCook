<template>
  <div class="max-w-2xl mx-auto px-6 py-10 space-y-10">

    <section class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">Back of House</h2>
      <span class="text-sm text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</span>
    </section>

    <!-- Booking requests and contact messages, newest first -->
    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Enquiries</h3>

      <div v-if="loadingContacts" class="text-gray-400 text-sm">Loading…</div>

      <div v-else-if="loadError" class="text-red-600 text-sm">{{ loadError }}</div>

      <div v-else-if="contacts.length === 0" class="text-gray-400 text-sm">No enquiries yet.</div>

      <ul v-else class="space-y-4">
        <li
          v-for="contact in contacts"
          :key="contact.id"
          class="border border-gray-200 dark:border-gray-700 rounded p-4 space-y-1"
        >
          <div class="flex justify-between items-start gap-2">
            <p class="font-medium">
              <span
                class="text-xs font-semibold uppercase tracking-wide mr-2 px-1.5 py-0.5 rounded"
                :class="contact.type === 'booking' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'"
              >{{ contact.type === 'booking' ? 'Booking' : 'Contact' }}</span>
              {{ contact.name }}
            </p>
            <span class="text-xs text-gray-400 whitespace-nowrap">{{ formatDate(contact.createdAt) }}</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <a :href="`mailto:${contact.email}`" class="underline">{{ contact.email }}</a>
            <span v-if="contact.phone"> · {{ contact.phone }}</span>
          </p>
          <dl v-if="contact.type === 'booking'" class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm mt-2">
            <dt class="text-gray-500">Date</dt><dd>{{ formatEventDate(contact.eventDate) }}</dd>
            <dt class="text-gray-500">Guests</dt><dd>{{ contact.guests }}</dd>
            <dt class="text-gray-500">Where</dt><dd>{{ contact.town }}, {{ contact.postcode }}</dd>
            <template v-if="contact.occasion"><dt class="text-gray-500">Occasion</dt><dd>{{ contact.occasion }}</dd></template>
            <template v-if="contact.budget"><dt class="text-gray-500">Budget</dt><dd>{{ contact.budget }} per head</dd></template>
            <template v-if="contact.dietary"><dt class="text-gray-500">Dietary</dt><dd class="whitespace-pre-wrap">{{ contact.dietary }}</dd></template>
          </dl>
          <p v-if="contact.message" class="text-sm mt-2 whitespace-pre-wrap">{{ contact.message }}</p>
        </li>
      </ul>
    </section>

  </div>
</template>

<script setup lang="ts">
import { getFirestore, collection, getDocs, orderBy, query } from "firebase/firestore";
import { useAuthStore } from "@/stores/AuthStore";

definePageMeta({
  headerTitle: "Back of House",
  middleware: "auth",
});

const authStore = useAuthStore();

// One document per website submission (see server/api/enquiry.post.ts).
interface ContactDoc {
  id: string;
  type: "booking" | "contact";
  status: string;
  name: string;
  email: string;
  phone?: string | null;
  eventDate?: string;
  guests?: number;
  town?: string;
  postcode?: string;
  occasion?: string | null;
  budget?: string | null;
  dietary?: string | null;
  message?: string | null;
  createdAt: any;
}

const contacts = ref<ContactDoc[]>([]);
const loadingContacts = ref(true);
const loadError = ref<string | null>(null);

const formatEventDate = (isoDate?: string) =>
  isoDate
    ? new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : "";

const formatDate = (timestamp: any) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

onMounted(async () => {
  try {
    const db = getFirestore();
    const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    contacts.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ContactDoc));
  } catch (err) {
    console.error("[Back of House] could not load enquiries", err);
    loadError.value = "Couldn't load enquiries. Check you're signed in as the chef and try refreshing.";
  } finally {
    loadingContacts.value = false;
  }
});
</script>

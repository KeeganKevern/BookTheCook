<template>
  <div class="max-w-2xl mx-auto px-6 py-10 space-y-10">

    <section class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">Back of House</h2>
      <span class="text-sm text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</span>
    </section>

    <!-- Contact submissions -->
    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Contact enquiries</h3>

      <div v-if="loadingContacts" class="text-gray-400 text-sm">Loading…</div>

      <div v-else-if="contacts.length === 0" class="text-gray-400 text-sm">No enquiries yet.</div>

      <ul v-else class="space-y-4">
        <li
          v-for="contact in contacts"
          :key="contact.id"
          class="border border-gray-200 dark:border-gray-700 rounded p-4 space-y-1"
        >
          <div class="flex justify-between items-start">
            <p class="font-medium">{{ contact.name }}</p>
            <span class="text-xs text-gray-400">{{ formatDate(contact.createdAt) }}</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ contact.email }}</p>
          <p class="text-sm mt-2">{{ contact.message }}</p>
        </li>
      </ul>
    </section>

    <!-- Upcoming bookings placeholder -->
    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Upcoming bookings</h3>
      <div class="border border-dashed border-gray-300 dark:border-gray-700 rounded p-6 text-center text-gray-400 text-sm">
        Booking functionality coming soon.
      </div>
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

interface ContactDoc {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}

const contacts = ref<ContactDoc[]>([]);
const loadingContacts = ref(true);

const formatDate = (timestamp: any) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

onMounted(async () => {
  try {
    const db = getFirestore();
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    contacts.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ContactDoc));
  } catch {
    // Firestore may not have data yet
  } finally {
    loadingContacts.value = false;
  }
});
</script>

<template>
  <div class="max-w-2xl mx-auto px-6 py-10 space-y-8">

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

      <template v-else>
        <!-- Retention reminder (privacy notice: kept 12 months, then deleted) -->
        <div
          v-if="overdueCount > 0"
          class="border border-amber-400 bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-100 rounded p-3 text-sm"
          role="status"
        >
          {{ overdueCount }} {{ overdueCount === 1 ? 'enquiry is' : 'enquiries are' }} over {{ RETENTION_MONTHS }} months old.
          The privacy notice says we delete them after that, unless they're still needed for a booking.
        </div>

        <!-- Type filter -->
        <div class="flex gap-2 text-sm" role="group" aria-label="Filter by type">
          <button
            v-for="f in filters"
            :key="f.value"
            type="button"
            class="px-3 py-1 rounded-full border transition-colors"
            :class="typeFilter === f.value
              ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900'"
            :aria-pressed="typeFilter === f.value"
            @click="typeFilter = f.value"
          >
            {{ f.label }} ({{ f.count }})
          </button>
        </div>

        <p v-if="actionError" class="text-red-600 text-sm" role="alert">{{ actionError }}</p>

        <div v-if="visible.length === 0" class="text-gray-400 text-sm">Nothing to show for this filter.</div>

        <ul class="space-y-4">
          <li
            v-for="contact in visible"
            :key="contact.id"
            class="border rounded p-4 space-y-1"
            :class="isOverdue(contact) ? 'border-amber-400' : 'border-gray-200 dark:border-gray-700'"
          >
            <div class="flex justify-between items-start gap-2">
              <p class="font-medium">
                <span
                  class="text-xs font-semibold uppercase tracking-wide mr-2 px-1.5 py-0.5 rounded"
                  :class="contact.type === 'booking' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'"
                >{{ contact.type === 'booking' ? 'Booking' : 'Contact' }}</span>
                {{ contact.name }}
              </p>
              <span class="text-xs text-gray-400 whitespace-nowrap text-right">
                {{ formatDate(contact.createdAt) }}
                <span v-if="isOverdue(contact)" class="block text-amber-600 dark:text-amber-400 font-semibold">Over {{ RETENTION_MONTHS }} months</span>
              </span>
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

            <!-- Status and delete -->
            <div class="flex flex-wrap items-center justify-between gap-2 pt-3 mt-2 border-t border-gray-100 dark:border-gray-800">
              <div class="flex flex-wrap gap-1" role="group" :aria-label="`Status for ${contact.name}`">
                <button
                  v-for="s in STATUSES"
                  :key="s"
                  type="button"
                  class="px-2 py-0.5 text-xs rounded border transition-colors disabled:opacity-50"
                  :class="contact.status === s ? statusClass[s] : 'border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'"
                  :aria-pressed="contact.status === s"
                  :disabled="busyId === contact.id"
                  @click="setStatus(contact, s)"
                >
                  {{ s }}
                </button>
              </div>
              <button
                type="button"
                class="text-xs text-red-600 hover:underline disabled:opacity-50"
                :disabled="busyId === contact.id"
                @click="remove(contact)"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>
      </template>
    </section>

  </div>
</template>

<script setup lang="ts">
import { getFirestore, collection, getDocs, orderBy, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuthStore } from "@/stores/AuthStore";
import { STATUSES, RETENTION_MONTHS } from "@/utils/enquiryOptions";

definePageMeta({
  headerTitle: "Back of House",
  middleware: "auth",
});

const authStore = useAuthStore();

type Status = (typeof STATUSES)[number];

// One document per website submission (see server/api/enquiry.post.ts).
interface ContactDoc {
  id: string;
  type: "booking" | "contact";
  status: Status;
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
const actionError = ref<string | null>(null);
const busyId = ref<string | null>(null);

// --- Type filter ---
const typeFilter = ref<"all" | "booking" | "contact">("all");
const filters = computed(() => [
  { value: "all" as const, label: "All", count: contacts.value.length },
  { value: "booking" as const, label: "Bookings", count: contacts.value.filter((c) => c.type === "booking").length },
  { value: "contact" as const, label: "Contact", count: contacts.value.filter((c) => c.type === "contact").length },
]);
const visible = computed(() =>
  typeFilter.value === "all" ? contacts.value : contacts.value.filter((c) => c.type === typeFilter.value)
);

// --- Status ---
const statusClass: Record<Status, string> = {
  New: "bg-blue-600 border-blue-600 text-white",
  Quoted: "bg-amber-500 border-amber-500 text-white",
  Confirmed: "bg-green-600 border-green-600 text-white",
  Declined: "bg-gray-500 border-gray-500 text-white",
};

const setStatus = async (contact: ContactDoc, status: Status) => {
  if (contact.status === status) return;
  const previous = contact.status;
  contact.status = status; // show it straight away; put it back if the save fails
  busyId.value = contact.id;
  actionError.value = null;
  try {
    await updateDoc(doc(getFirestore(), "enquiries", contact.id), { status });
  } catch (err) {
    console.error("[Back of House] status update failed", err);
    contact.status = previous;
    actionError.value = `Couldn't change ${contact.name}'s status. Please try again.`;
  } finally {
    busyId.value = null;
  }
};

// --- Delete ---
const remove = async (contact: ContactDoc) => {
  const what = contact.type === "booking" ? "booking request" : "message";
  if (!confirm(`Delete the ${what} from ${contact.name}? This can't be undone.`)) return;
  busyId.value = contact.id;
  actionError.value = null;
  try {
    await deleteDoc(doc(getFirestore(), "enquiries", contact.id));
    contacts.value = contacts.value.filter((c) => c.id !== contact.id);
  } catch (err) {
    console.error("[Back of House] delete failed", err);
    actionError.value = `Couldn't delete ${contact.name}'s ${what}. Please try again.`;
  } finally {
    busyId.value = null;
  }
};

// --- 12-month retention flag ---
const toDate = (timestamp: any): Date | null =>
  !timestamp ? null : timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

const cutoff = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() - RETENTION_MONTHS);
  return d;
})();

const isOverdue = (contact: ContactDoc) => {
  const created = toDate(contact.createdAt);
  return !!created && created < cutoff;
};
const overdueCount = computed(() => contacts.value.filter(isOverdue).length);

// --- Formatting ---
const formatEventDate = (isoDate?: string) =>
  isoDate
    ? new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : "";

const formatDate = (timestamp: any) => {
  const date = toDate(timestamp);
  return date ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
};

onMounted(async () => {
  try {
    const db = getFirestore();
    const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    contacts.value = snapshot.docs.map((d) => ({ id: d.id, status: "New", ...d.data() } as ContactDoc));
  } catch (err) {
    console.error("[Back of House] could not load enquiries", err);
    loadError.value = "Couldn't load enquiries. Check you're signed in as the chef and try refreshing.";
  } finally {
    loadingContacts.value = false;
  }
});
</script>

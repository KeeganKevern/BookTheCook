<template>
  <nav
    class="dark:bg-black dark:text-white fixed bottom-0 w-full h-14 flex justify-evenly items-center"
  >
    <ul class="w-full flex justify-evenly items-center">
      <li class="flex">
        <label class="relative inline-block w-6 h-4">
          <input type="checkbox" class="opacity-0 w-0 h-0 peer" />
          <span
            class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 border-2 border-black dark:border-white bg-white dark:bg-black rounded-full transition e"
          ></span>
          <span
            class="absolute content-[''] h-3 w-3 left-0.5 bottom-0.5 bg-black dark:bg-white rounded-full transition peer-checked:translate-x-2"
          ></span>
        </label>
      </li>
      <li v-for="nav in navFooterData">
        <NavButton :navRoute="nav.navRoute" :iconName="nav.iconName" />
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import NavButton from "@/components/universal/NavButton.vue";

const navFooterData = [
  { navRoute: "/MeetTheChef", iconName: "icon-park-solid:chef-hat-one" },
  { navRoute: "/", iconName: "dashicons:admin-home" },
  { navRoute: "/Booking", iconName: "mdi:calendar-month-outline" },
  { navRoute: "/UserProfile", iconName: "mdi:account" },
];
</script>

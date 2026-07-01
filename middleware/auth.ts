import { useAuthStore } from "@/stores/AuthStore";

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  if (!authStore.user) {
    return navigateTo("/UserProfile");
  }
});

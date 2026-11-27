import { useAuthStore } from "@/stores/AuthStore";

// Guards Back of House. Auth state only exists in the browser, so the check
// runs client-side after Firebase has restored the session (a page refresh no
// longer bounces a signed-in chef to the login page).
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return;

  const authStore = useAuthStore();
  await authStore.waitForAuth();

  if (!authStore.user) {
    return navigateTo("/UserProfile");
  }
  if (!authStore.isChef) {
    return navigateTo("/");
  }
});

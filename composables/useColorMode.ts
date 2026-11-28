// Light/dark mode, remembered in a "colorMode" cookie so the server can render
// the page in the right mode. Reading it on the server and the browser alike
// avoids a hydration mismatch on the toggle and a light flash for dark-mode users.
type Mode = "light" | "dark";

export function useColorMode() {
  const cookie = useCookie<Mode | undefined>("colorMode", {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
  });

  // Shared across components and carried from the server render to the browser.
  const isDark = useState<boolean>("colorMode:isDark", () => cookie.value === "dark");

  const set = (dark: boolean) => {
    isDark.value = dark;
    cookie.value = dark ? "dark" : "light";
  };

  const toggle = () => set(!isDark.value);

  // One-off move from the old localStorage setting, for visitors who chose dark
  // mode before the cookie existed. Call from onMounted only.
  const migrateFromLocalStorage = () => {
    if (cookie.value) return;
    try {
      if (localStorage.getItem("colorMode") === "dark") set(true);
      localStorage.removeItem("colorMode");
    } catch {
      // Storage blocked: nothing to move.
    }
  };

  return { isDark, toggle, migrateFromLocalStorage };
}

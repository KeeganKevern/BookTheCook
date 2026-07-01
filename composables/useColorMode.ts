const isDark = ref(false);

export function useColorMode() {
  const init = () => {
    if (!import.meta.client) return;
    isDark.value = localStorage.getItem('colorMode') === 'dark';
    applyClass();
  };

  const applyClass = () => {
    document.documentElement.classList.toggle('dark', isDark.value);
  };

  const toggle = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('colorMode', isDark.value ? 'dark' : 'light');
    applyClass();
  };

  return { isDark, toggle, init };
}

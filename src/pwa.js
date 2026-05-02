export function registerPWA() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;

    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.warn("PWA service worker registration failed:", error);
    });
  });
}

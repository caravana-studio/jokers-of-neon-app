export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered successfully:",
            registration.scope
          );
        })
        .catch((error) => {
          console.warn("Service Worker registration failed:", error);
        });
    });
  }
}

import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

let appUrlListenerRegistered = false;

const getCavosAuthData = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hashParams = new URLSearchParams(parsedUrl.hash.replace(/^#/, ""));
    return (
      parsedUrl.searchParams.get("auth_data") ||
      parsedUrl.searchParams.get("zk_auth_data") ||
      hashParams.get("auth_data") ||
      hashParams.get("zk_auth_data")
    );
  } catch (_error) {
    return null;
  }
};

export const registerAppUrlOpenListener = () => {
  if (appUrlListenerRegistered) return;
  appUrlListenerRegistered = true;

  if (Capacitor.getPlatform() === "web") return;

  App.addListener("appUrlOpen", ({ url }) => {
    if (
      url.startsWith("jokers://open") ||
      url.startsWith("https://jokersofneon.com/open")
    ) {
      const authData = getCavosAuthData(url);
      if (authData) {
        localStorage.setItem("cavos_auth_result", authData);
      }
      Browser.close().catch(() => {});
    }
  });
};

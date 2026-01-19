import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

let appUrlListenerRegistered = false;

export const registerAppUrlOpenListener = () => {
  if (appUrlListenerRegistered) return;
  appUrlListenerRegistered = true;

  if (Capacitor.getPlatform() === "web") return;

  App.addListener("appUrlOpen", ({ url }) => {
    if (
      url.startsWith("jokers://open") ||
      url.startsWith("https://jokersofneon.com/open")
    ) {
      Browser.close().catch(() => {});
    }
  });
};

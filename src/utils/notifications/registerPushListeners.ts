import { Capacitor } from "@capacitor/core";
import {
    ActionPerformed,
    PushNotifications,
} from "@capacitor/push-notifications";
import { NavigateFunction } from "react-router-dom";
import { logEvent } from "../analytics";

let listenersRegistered = false;

export const registerPushListeners = (navigate: NavigateFunction) => {
  if (!Capacitor.isNativePlatform()) return;
  if (!Capacitor.isPluginAvailable("PushNotifications")) return;
  if (listenersRegistered) return;

  listenersRegistered = true;

  PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (event: ActionPerformed) => {
      const route = event.notification.data?.route;

      logEvent("push_opened", {
        type: event.notification.data?.type,
        route: event.notification.data?.route,
      });

      if (typeof route === "string" && route.length > 0) {
        console.log("[push] navigate to", route);
        navigate(route);
      }
    }
  ).catch((error) =>
    console.warn("[push] Failed to register action listener", error)
  );
};

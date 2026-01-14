import { Capacitor, PluginListenerHandle } from "@capacitor/core";
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
  PermissionStatus,
} from "@capacitor/push-notifications";
import { logEvent } from "../analytics";

let registrationPromise: Promise<void> | null = null;

// Keep listener handles so we don't double-register listeners (hot reload / remounts)
let listenerHandles: PluginListenerHandle[] = [];

// Optional: store last token in-memory for debugging / UI access
let lastPushToken: string | null = null;

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

const removeAllListenersSafe = async () => {
  const handles = listenerHandles;
  listenerHandles = [];
  await Promise.allSettled(handles.map((h) => h.remove()));
};

const ensurePermission = async (): Promise<PermissionStatus> => {
  let permission = await PushNotifications.checkPermissions();
  if (permission.receive === "prompt") {
    permission = await PushNotifications.requestPermissions();
  }
  return permission;
};

// Initializes the PushNotifications plugin once; safe to call multiple times.
export const registerPushNotifications = (): Promise<void> => {
  if (registrationPromise) return registrationPromise;

  registrationPromise = (async () => {
    const platform = Capacitor.getPlatform();
    if (platform === "web") return;

    if (!Capacitor.isPluginAvailable("PushNotifications")) {
      console.warn(
        "[push] Capacitor PushNotifications plugin is not available. Did you install it and run npx cap sync?"
      );
      logEvent("push_plugin_unavailable", { platform });
      return;
    }

    // Clean up any previous listeners (dev hot reload / edge cases)
    await removeAllListenersSafe();

    const permission = await ensurePermission();
    if (permission.receive !== "granted") {
      console.warn("[push] Push notification permission not granted.");
      logEvent("push_permission_denied", {
        platform,
        status: permission.receive,
      });
      return;
    }

    // ✅ IMPORTANT: listeners FIRST, register() AFTER — prevents missing the token event.
    listenerHandles.push(
      await PushNotifications.addListener("registration", (token: Token) => {
        lastPushToken = token.value;

        console.log("[push] Registration token", token.value);
        logEvent("push_registration_success", {
          platform,
          tokenLength: token.value?.length ?? 0,
        });

        // Token registration is handled in getFirebasePushToken (FirebaseMessaging).
      })
    );

    listenerHandles.push(
      await PushNotifications.addListener("registrationError", (error) => {
        console.error("[push] Registration error", error);
        logEvent("push_registration_error", {
          platform,
          message: getErrorMessage(error),
        });
      })
    );

    listenerHandles.push(
      await PushNotifications.addListener(
        "pushNotificationReceived",
        (notification: PushNotificationSchema) => {
          console.log("[push] Notification received", notification);
          logEvent("push_notification_received", {
            platform,
            id: notification.id ?? (notification.data as any)?.id ?? null,
            title: notification.title ?? null,
          });
        }
      )
    );

    listenerHandles.push(
      await PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification: ActionPerformed) => {
          console.log("[push] Notification action", notification);
          logEvent("push_notification_action", {
            platform,
            actionId: notification.actionId ?? null,
            id:
              notification.notification.id ??
              (notification.notification.data as any)?.id ??
              null,
            title: notification.notification.title ?? null,
          });
        }
      )
    );

    // Now register for push
    await PushNotifications.register();
    console.log("[push] register() called");
  })().catch((error) => {
    console.error("[push] Failed to initialize push notifications", error);
    logEvent("push_init_error", {
      platform: Capacitor.getPlatform(),
      message: getErrorMessage(error),
    });
    throw error;
  });

  return registrationPromise;
};

/**
 * Optional: for UI/debug
 */
export const getLastPushToken = () => lastPushToken;

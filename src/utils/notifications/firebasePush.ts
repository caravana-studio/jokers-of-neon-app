import { Capacitor } from "@capacitor/core";
import { logEvent } from "../analytics";
import {
  PushLanguage,
  PushPlatform,
  registerPushDevice,
} from "../../api/registerPushDevice";

const getPlatform = (): PushPlatform | null => {
  const platform = Capacitor.getPlatform();
  return platform === "ios" || platform === "android" ? platform : null;
};

const getTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

const normalizeLanguage = (value?: string | null): PushLanguage => {
  const normalized = (value ?? "").toLowerCase();
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("pt")) return "pt";
  return "en";
};

const getLanguage = (): PushLanguage => {
  if (typeof navigator === "undefined") return "en";
  return normalizeLanguage(navigator.language);
};

export const getFirebasePushToken = async (
  walletAddress?: string
): Promise<string | null> => {
  if (!Capacitor.isNativePlatform()) return null;

  try {
    const { FirebaseMessaging } = await import(
      "@capacitor-firebase/messaging"
    );

    const { token } = await FirebaseMessaging.getToken();

    console.log("[push][firebase] FCM token", token);
    logEvent("push_firebase_token_received", {
      tokenLength: token?.length ?? 0,
    });

    if (token && walletAddress) {
      const platform = getPlatform();
      if (platform) {
        try {
          await registerPushDevice({
            wallet: walletAddress,
            fcmToken: token,
            platform,
            timezone: getTimezone(),
            language: getLanguage(),
          });
          logEvent("push_device_registered", { platform });
        } catch (error) {
          console.warn("[push][firebase] register device failed", error);
          logEvent("push_device_register_error", {
            platform,
            message: String(error),
          });
        }
      }
    } else if (!walletAddress) {
      console.warn("[push][firebase] Missing wallet address for registration");
    }
    return token;
  } catch (error) {
    console.error("[push][firebase] getToken failed", error);
    logEvent("push_firebase_token_error", {
      message: String(error),
    });
    return null;
  }
};

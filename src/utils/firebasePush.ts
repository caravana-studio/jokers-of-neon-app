import { Capacitor } from "@capacitor/core";
import { logEvent } from "./analytics";

export const getFirebasePushToken = async (): Promise<string | null> => {
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

    // TODO: enviar el token al backend
    return token;
  } catch (error) {
    console.error("[push][firebase] getToken failed", error);
    logEvent("push_firebase_token_error", {
      message: String(error),
    });
    return null;
  }
};

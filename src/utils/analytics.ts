import { Capacitor } from "@capacitor/core";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

type EventParams = Record<string, unknown>;

const isNative = (): boolean => {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

const logWeb = (action: string, params: EventParams): void => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
};

const logNative = async (action: string, params: EventParams): Promise<void> => {
  try {
    const { FirebaseAnalytics } = await import(
      "@capacitor-firebase/analytics"
    );
    await FirebaseAnalytics.logEvent({ name: action, params });
  } catch (error) {
    console.warn("[analytics] native logEvent failed", action, error);
  }
};

export const logEvent = (action: string, params: EventParams = {}): void => {
  if (isNative()) {
    void logNative(action, params);
    return;
  }
  logWeb(action, params);
};

export const setAnalyticsUserId = async (userId: string | null): Promise<void> => {
  if (isNative()) {
    try {
      const { FirebaseAnalytics } = await import(
        "@capacitor-firebase/analytics"
      );
      await FirebaseAnalytics.setUserId({ userId: userId ?? "" });
    } catch (error) {
      console.warn("[analytics] native setUserId failed", error);
    }
    return;
  }
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("set", { user_id: userId ?? undefined });
  }
};

export const setAnalyticsUserProperty = async (
  name: string,
  value: string | number | boolean | null
): Promise<void> => {
  const stringValue = value === null ? "" : String(value);
  if (isNative()) {
    try {
      const { FirebaseAnalytics } = await import(
        "@capacitor-firebase/analytics"
      );
      await FirebaseAnalytics.setUserProperty({ key: name, value: stringValue });
    } catch (error) {
      console.warn("[analytics] native setUserProperty failed", error);
    }
    return;
  }
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("set", "user_properties", { [name]: stringValue });
  }
};

export const setAnalyticsCollectionEnabled = async (
  enabled: boolean
): Promise<void> => {
  if (!isNative()) return;
  try {
    const { FirebaseAnalytics } = await import(
      "@capacitor-firebase/analytics"
    );
    await FirebaseAnalytics.setEnabled({ enabled });
  } catch (error) {
    console.warn("[analytics] setEnabled failed", error);
  }
};

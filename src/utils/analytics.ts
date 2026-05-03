import { Capacitor } from "@capacitor/core";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

type EventParams = Record<string, unknown>;
type NativeParamValue =
  | string
  | number
  | boolean
  | NativeParamValue[]
  | { [key: string]: NativeParamValue };

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

const sanitizeNativeValue = (value: unknown): NativeParamValue | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    const sanitizedItems = value
      .map((item) => sanitizeNativeValue(item))
      .filter((item): item is NativeParamValue => item !== undefined);
    return sanitizedItems;
  }

  if (typeof value === "object") {
    const sanitizedObject = Object.entries(value).reduce<
      Record<string, NativeParamValue>
    >((accumulator, [key, item]) => {
      const sanitizedItem = sanitizeNativeValue(item);
      if (sanitizedItem !== undefined) {
        accumulator[key] = sanitizedItem;
      }
      return accumulator;
    }, {});

    return sanitizedObject;
  }

  return String(value);
};

const sanitizeNativeParams = (params: EventParams): Record<string, NativeParamValue> =>
  Object.entries(params).reduce<Record<string, NativeParamValue>>(
    (accumulator, [key, value]) => {
      const sanitizedValue = sanitizeNativeValue(value);
      if (sanitizedValue !== undefined) {
        accumulator[key] = sanitizedValue;
      }
      return accumulator;
    },
    {}
  );

const logNative = async (action: string, params: EventParams): Promise<void> => {
  try {
    const { FirebaseAnalytics } = await import(
      "@capacitor-firebase/analytics"
    );
    await FirebaseAnalytics.logEvent({
      name: action,
      params: sanitizeNativeParams(params),
    });
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

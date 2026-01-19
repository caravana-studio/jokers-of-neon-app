import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";

export const platform = Capacitor.getPlatform();
export const isNative = platform === "ios" || platform === "android";
export const isNativeAndroid = platform === "android";
export const isNativeIOS = platform === "ios";
export const nativePaddingTop = isNativeIOS ? "50px" : isNativeAndroid ? "25px" : "0px";

export const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.jokersofneon.play";
export const IOS_URL = "https://apps.apple.com/es/app/jokers-of-neon/id6749147020";

export const APP_URL = isNativeAndroid
  ? ANDROID_URL
  : IOS_URL;

const parseAndroidVersionFromString = (version?: string | number | null) => {
  if (version === undefined || version === null) return null;
  const normalized = typeof version === "number" ? `${version}` : version;
  const major = Number.parseInt(normalized.split(".")[0] ?? "", 10);
  return Number.isFinite(major) ? major : null;
};

const parseAndroidVersionFromUA = () => {
  if (typeof navigator === "undefined") return null;
  const match = navigator.userAgent.match(/Android\s([0-9]+)/i);
  if (!match) return null;
  const major = Number.parseInt(match[1], 10);
  return Number.isFinite(major) ? major : null;
};

/**
 * Determines if the current device is Android at or below the provided major version.
 * Uses Capacitor's Device plugin first, then falls back to UA sniffing on web.
 */
export const isLegacyAndroid = async (maxMajorVersion = 12): Promise<boolean> => {
  try {
    const info = await Device.getInfo();
    console.log('info', info);
    if (info.operatingSystem !== "android") return false;
    const major =
      parseAndroidVersionFromString(info.osVersion) ??
      parseAndroidVersionFromString((info as { osVersionCode?: number }).osVersionCode);
    console.log('parsed major version', major);
      if (major !== null) {
      return major <= maxMajorVersion;
    }
  } catch (_err) {
    // Swallow and fallback to UA below.
  }

  const uaMajor = parseAndroidVersionFromUA();
  return uaMajor !== null ? uaMajor <= maxMajorVersion : false;
};

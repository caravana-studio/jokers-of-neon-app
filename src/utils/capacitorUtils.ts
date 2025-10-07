import { Capacitor } from "@capacitor/core";

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
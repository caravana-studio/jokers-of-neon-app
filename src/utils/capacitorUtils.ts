import { Capacitor } from "@capacitor/core";

export const platform = Capacitor.getPlatform();
export const isNative = platform === "ios" || platform === "android";
export const isNativeAndroid = platform === "android";
export const isNativeIOS = platform === "ios";
export const nativePaddingTop = isNativeIOS ? "50px" : isNativeAndroid ? "25px" : "0px";

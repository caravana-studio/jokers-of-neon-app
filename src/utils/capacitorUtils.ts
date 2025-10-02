import { Capacitor } from "@capacitor/core";

export const platform = Capacitor.getPlatform();
export const needsPadding = platform === "ios";
export const isNative = platform === "ios" || platform === "android";
export const isNativeAndroid = platform === "android";
export const isNativeIOS = platform === "ios";
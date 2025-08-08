import { Capacitor } from "@capacitor/core";

export const platform = Capacitor.getPlatform();
export const needsPadding = platform === "ios";
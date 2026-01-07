import { Plugin } from "@capacitor/core";

export interface AppsFlyerPlugin extends Plugin {
  setCustomerUserId(options: { customerUserId: string }): Promise<void>;
  logEvent(options: { eventName: string; eventValues?: Record<string, any> }): Promise<void>;
  generateInviteLink(options: { userAddress: string }): Promise<{ inviteLink?: string; deepLinkValue?: string; conversionData?: any }>;
  getAppsFlyerUID(): Promise<{ uid: string }>;
}

declare const AppsFlyer: AppsFlyerPlugin;

export { AppsFlyer };

/**
 * Web implementation of AppsFlyerBridge (no-op for web)
 */
export class AppsFlyerBridgeWeb {
  async addListener() {
    return { remove: () => {} };
  }
  
  async setCustomerUserId() {
    // No-op on web
  }
  
  async logEvent() {
    // No-op on web
  }
  
  async getAppsFlyerUID() {
    return { uid: '' };
  }
}

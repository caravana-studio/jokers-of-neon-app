#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(AppsFlyerBridge, "AppsFlyerBridge",
    CAP_PLUGIN_METHOD(setCustomerUserId, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(logEvent, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(getAppsFlyerUID, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(getDeviceId, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(generateInviteUrl, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(logInvite, CAPPluginReturnPromise);
)

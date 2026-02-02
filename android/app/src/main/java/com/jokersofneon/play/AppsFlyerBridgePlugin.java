package com.jokersofneon.play;

import android.content.Context;
import android.provider.Settings;
import android.util.Log;

import com.appsflyer.AFInAppEventParameterName;
import com.appsflyer.AFInAppEventType;
import com.appsflyer.AppsFlyerConversionListener;
import com.appsflyer.AppsFlyerLib;
import com.appsflyer.deeplink.DeepLink;
import com.appsflyer.deeplink.DeepLinkListener;
import com.appsflyer.deeplink.DeepLinkResult;
import com.appsflyer.share.LinkGenerator;
import com.appsflyer.share.ShareInviteHelper;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * AppsFlyer Bridge Plugin for Capacitor
 * Provides communication between Java and JavaScript for AppsFlyer SDK
 * Mirrors the iOS AppsFlyerBridge.swift implementation
 */
@CapacitorPlugin(name = "AppsFlyerBridge")
public class AppsFlyerBridgePlugin extends Plugin {

    private static final String TAG = "AppsFlyerBridge";
    private static final String APPSFLYER_DEV_KEY = "GXf8msjiYkKjdxMjgsb6LU";
    private static final String ONELINK_ID = "2BD9";

    @Override
    public void load() {
        super.load();
        Log.i(TAG, "Plugin loaded, initializing AppsFlyer SDK...");
        initAppsFlyer();
    }

    /**
     * Initialize the AppsFlyer SDK with conversion listener and deep link handling
     */
    private void initAppsFlyer() {
        Context context = getContext();
        AppsFlyerLib appsFlyer = AppsFlyerLib.getInstance();

        // Set up conversion listener for install attribution
        AppsFlyerConversionListener conversionListener = new AppsFlyerConversionListener() {
            @Override
            public void onConversionDataSuccess(Map<String, Object> conversionData) {
                Log.i(TAG, "Conversion data received");

                try {
                    JSONObject jsonData = new JSONObject(conversionData);
                    String jsonString = jsonData.toString();

                    // Send to JavaScript
                    JSObject data = new JSObject();
                    data.put("data", jsonString);
                    notifyListeners("conversionData", data);

                    // Log attribution info
                    String status = (String) conversionData.get("af_status");
                    if ("Non-organic".equals(status)) {
                        String source = (String) conversionData.get("media_source");
                        String campaign = (String) conversionData.get("campaign");
                        Log.i(TAG, "Non-organic install - Source: " + source + ", Campaign: " + campaign);
                    } else {
                        Log.i(TAG, "Organic install");
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Failed to serialize conversion data", e);
                }
            }

            @Override
            public void onConversionDataFail(String errorMessage) {
                Log.e(TAG, "Conversion data error: " + errorMessage);

                // Notify JavaScript of error
                JSObject data = new JSObject();
                data.put("error", errorMessage);
                notifyListeners("conversionData", data);
            }

            @Override
            public void onAppOpenAttribution(Map<String, String> attributionData) {
                Log.i(TAG, "App open attribution received");
            }

            @Override
            public void onAttributionFailure(String errorMessage) {
                Log.e(TAG, "Attribution failure: " + errorMessage);
            }
        };

        // Set up deep link listener
        DeepLinkListener deepLinkListener = new DeepLinkListener() {
            @Override
            public void onDeepLinking(DeepLinkResult deepLinkResult) {
                DeepLinkResult.Status status = deepLinkResult.getStatus();

                switch (status) {
                    case NOT_FOUND:
                        Log.i(TAG, "Deep link not found");
                        return;
                    case ERROR:
                        DeepLinkResult.Error error = deepLinkResult.getError();
                        if (error != null) {
                            Log.e(TAG, "Deep link error: " + error.toString());
                        }
                        return;
                    case FOUND:
                        Log.i(TAG, "Deep link found");
                        break;
                }

                DeepLink deepLink = deepLinkResult.getDeepLink();
                if (deepLink == null) {
                    Log.e(TAG, "Could not extract deep link object");
                    return;
                }

                // Extract deep link data
                String deepLinkValue = deepLink.getDeepLinkValue();
                boolean isDeferred = deepLink.isDeferred();

                Log.i(TAG, "Deep link value: " + deepLinkValue + ", isDeferred: " + isDeferred);

                // Build data object to send to JavaScript
                JSONObject data = new JSONObject();
                try {
                    data.put("deepLinkValue", deepLinkValue != null ? deepLinkValue : "");
                    data.put("isDeferred", isDeferred);

                    // Check if this is a referral link
                    if ("referral".equals(deepLinkValue) || "ref".equals(deepLinkValue)) {
                        Log.i(TAG, "Detected referral deep link");
                        data.put("type", "referral");

                        // Extract referral code - try 'ref' param first, then fallbacks
                        String referralCode = deepLink.getStringValue("ref");
                        if (referralCode == null || referralCode.isEmpty()) {
                            referralCode = deepLink.getStringValue("deep_link_sub1");
                        }
                        if (referralCode == null || referralCode.isEmpty()) {
                            referralCode = deepLink.getStringValue("af_sub1");
                        }
                        if (referralCode != null && !referralCode.isEmpty()) {
                            data.put("referralCode", referralCode);
                            Log.i(TAG, "Referral code: " + referralCode);
                        }

                        // Referrer address (legacy support)
                        String referrerAddress = deepLink.getStringValue("deep_link_sub2");
                        if (referrerAddress == null || referrerAddress.isEmpty()) {
                            referrerAddress = deepLink.getStringValue("af_sub2");
                        }
                        if (referrerAddress != null && !referrerAddress.isEmpty()) {
                            data.put("referrerAddress", referrerAddress);
                            Log.i(TAG, "Referrer address: " + referrerAddress);
                        }

                        // Also check media source and campaign
                        String mediaSource = deepLink.getStringValue("media_source");
                        String campaign = deepLink.getStringValue("campaign");
                        if (mediaSource != null && !mediaSource.isEmpty()) {
                            data.put("mediaSource", mediaSource);
                        }
                        if (campaign != null && !campaign.isEmpty()) {
                            data.put("campaign", campaign);
                        }
                    } else {
                        // Non-referral deep link
                        data.put("type", "deep_link");
                    }

                    // Send to JavaScript
                    JSObject jsData = new JSObject();
                    jsData.put("data", data.toString());
                    notifyListeners("deepLink", jsData);
                    Log.i(TAG, "Deep link data sent to JavaScript");

                } catch (JSONException e) {
                    Log.e(TAG, "Failed to build deep link data", e);
                }
            }
        };

        // Initialize SDK
        appsFlyer.init(APPSFLYER_DEV_KEY, conversionListener, context);

        // Set OneLink ID for user invite feature
        appsFlyer.setAppInviteOneLink(ONELINK_ID);

        // Subscribe to deep links
        appsFlyer.subscribeForDeepLink(deepLinkListener);

        // Enable debug mode in debug builds
        appsFlyer.setDebugLog(true);

        // Start the SDK
        appsFlyer.start(getActivity());

        Log.i(TAG, "AppsFlyer SDK initialized - DevKey: " + APPSFLYER_DEV_KEY + ", OneLinkID: " + ONELINK_ID);
    }

    // ========================================================================
    // PLUGIN METHODS
    // ========================================================================

    /**
     * Set Customer User ID for attribution
     */
    @PluginMethod
    public void setCustomerUserId(PluginCall call) {
        String customerUserId = call.getString("customerUserId");
        if (customerUserId == null || customerUserId.isEmpty()) {
            call.reject("customerUserId is required");
            return;
        }

        AppsFlyerLib.getInstance().setCustomerUserId(customerUserId);
        Log.i(TAG, "Customer User ID set: " + customerUserId);
        call.resolve();
    }

    /**
     * Log a custom event to AppsFlyer
     */
    @PluginMethod
    public void logEvent(PluginCall call) {
        String eventName = call.getString("eventName");
        if (eventName == null || eventName.isEmpty()) {
            call.reject("eventName is required");
            return;
        }

        JSObject eventValues = call.getObject("eventValues");
        Map<String, Object> eventMap = new HashMap<>();

        if (eventValues != null) {
            Iterator<String> keys = eventValues.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                try {
                    eventMap.put(key, eventValues.get(key));
                } catch (JSONException e) {
                    Log.w(TAG, "Failed to parse event value for key: " + key);
                }
            }
        }

        AppsFlyerLib.getInstance().logEvent(getContext(), eventName, eventMap);
        Log.i(TAG, "Event logged: " + eventName);
        call.resolve();
    }

    /**
     * Get AppsFlyer unique device ID
     */
    @PluginMethod
    public void getAppsFlyerUID(PluginCall call) {
        String uid = AppsFlyerLib.getInstance().getAppsFlyerUID(getContext());
        Log.i(TAG, "AppsFlyer UID: " + uid);

        JSObject ret = new JSObject();
        ret.put("uid", uid != null ? uid : "");
        call.resolve(ret);
    }

    /**
     * Get device identifier (Android ID)
     */
    @PluginMethod
    public void getDeviceId(PluginCall call) {
        String deviceId = Settings.Secure.getString(
            getContext().getContentResolver(),
            Settings.Secure.ANDROID_ID
        );
        Log.i(TAG, "Device ID (Android ID): " + deviceId);

        JSObject ret = new JSObject();
        ret.put("deviceId", deviceId != null ? deviceId : "");
        call.resolve(ret);
    }

    // ========================================================================
    // USER INVITE / REFERRAL LINK GENERATION
    // ========================================================================

    /**
     * Generate a referral invite URL using AppsFlyer SDK
     * Creates a simple OneLink with just the referral code (username)
     */
    @PluginMethod
    public void generateInviteUrl(PluginCall call) {
        String referralCode = call.getString("referralCode", "");

        Log.i(TAG, "Generating invite URL - code: " + referralCode);

        LinkGenerator linkGenerator = ShareInviteHelper.generateInviteUrl(getContext());

        // Set the referral code parameter
        linkGenerator.addParameter("ref", referralCode);

        // Generate the link
        linkGenerator.generateLink(getContext(), new LinkGenerator.ResponseListener() {
            @Override
            public void onResponse(String link) {
                Log.i(TAG, "Invite URL generated: " + link);
                JSObject ret = new JSObject();
                ret.put("url", link);
                call.resolve(ret);
            }

            @Override
            public void onResponseError(String errorMessage) {
                Log.e(TAG, "Failed to generate invite URL: " + errorMessage);
                call.reject("Failed to generate invite URL: " + errorMessage);
            }
        });
    }

    /**
     * Log an invite event when user shares their referral link
     */
    @PluginMethod
    public void logInvite(PluginCall call) {
        String channel = call.getString("channel", "mobile_share");
        String referralCode = call.getString("referralCode", "");

        Log.i(TAG, "Logging invite - channel: " + channel + ", code: " + referralCode);

        Map<String, String> params = new HashMap<>();
        params.put("referral_code", referralCode);

        ShareInviteHelper.logInvite(getContext(), channel, params);

        Log.i(TAG, "Invite logged successfully");
        call.resolve();
    }
}

package com.jokersofneon.play;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.community.audio.NativeAudio;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.google.firebase.analytics.FirebaseAnalytics;
import com.revenuecat.purchases.capacitor.PurchasesPlugin;
import com.jokersofneon.play.AppsFlyerBridgePlugin;
import com.jokersofneon.play.AgeSignalsBridgePlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Ensure the NativeAudio plugin is registered so Capacitor can resolve it on Android
        registerPlugin(NativeAudio.class);
        FacebookSdk.sdkInitialize(getApplicationContext());
        AppEventsLogger.activateApp(getApplication());
        registerPlugin(PurchasesPlugin.class);
        // AppsFlyer SDK for attribution and deep linking
        registerPlugin(AppsFlyerBridgePlugin.class);
        // Play Age Signals for age range compliance in supported regions
        registerPlugin(AgeSignalsBridgePlugin.class);
        super.onCreate(savedInstanceState);

        // Firebase Analytics — explicit enable (mirrors iOS AppDelegate)
        FirebaseAnalytics fa = FirebaseAnalytics.getInstance(this);
        fa.setAnalyticsCollectionEnabled(true);
        Log.i("Firebase", "Analytics enabled. App instance ID requested.");
        fa.getAppInstanceId().addOnSuccessListener(id ->
            Log.i("Firebase", "App instance ID: " + id)
        );
    }
}

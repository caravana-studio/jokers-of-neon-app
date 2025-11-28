package com.jokersofneon.play;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.revenuecat.purchases.capacitor.PurchasesPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        FacebookSdk.sdkInitialize(getApplicationContext());
        AppEventsLogger.activateApp(getApplication());
        registerPlugin(PurchasesPlugin.class);
        super.onCreate(savedInstanceState);
    }
}

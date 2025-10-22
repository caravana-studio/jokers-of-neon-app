package com.jokersofneon.play;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        FacebookSdk.sdkInitialize(getApplicationContext());
        AppEventsLogger.activateApp(getApplication());
        super.onCreate(savedInstanceState);
    }
}

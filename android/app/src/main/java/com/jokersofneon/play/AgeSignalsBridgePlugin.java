package com.jokersofneon.play;

import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.play.agesignals.AgeSignalsException;
import com.google.android.play.agesignals.AgeSignalsManager;
import com.google.android.play.agesignals.AgeSignalsManagerFactory;
import com.google.android.play.agesignals.AgeSignalsRequest;
import com.google.android.play.agesignals.AgeSignalsResult;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

@CapacitorPlugin(name = "AgeSignalsBridge")
public class AgeSignalsBridgePlugin extends Plugin {

    private static final String TAG = "AgeSignalsBridge";

    private static final int STATUS_VERIFIED = 0;
    private static final int STATUS_SUPERVISED = 1;
    private static final int STATUS_SUPERVISED_APPROVAL_PENDING = 2;
    private static final int STATUS_SUPERVISED_APPROVAL_DENIED = 3;
    private static final int STATUS_UNKNOWN = 4;
    private static final int STATUS_DECLARED = 5;

    private static final int ERROR_API_NOT_AVAILABLE = -1;
    private static final int ERROR_PLAY_STORE_NOT_FOUND = -2;
    private static final int ERROR_NETWORK_ERROR = -3;
    private static final int ERROR_PLAY_SERVICES_NOT_FOUND = -4;
    private static final int ERROR_CANNOT_BIND_TO_SERVICE = -5;
    private static final int ERROR_PLAY_STORE_VERSION_OUTDATED = -6;
    private static final int ERROR_PLAY_SERVICES_VERSION_OUTDATED = -7;
    private static final int ERROR_CLIENT_TRANSIENT_ERROR = -8;
    private static final int ERROR_APP_NOT_OWNED = -9;
    private static final int ERROR_SDK_VERSION_OUTDATED = -10;
    private static final int ERROR_INTERNAL_ERROR = -100;

    @PluginMethod
    public void getAgeSignals(PluginCall call) {
        AgeSignalsManager ageSignalsManager = AgeSignalsManagerFactory.create(getContext());
        AgeSignalsRequest request = AgeSignalsRequest.builder().build();

        ageSignalsManager
            .checkAgeSignals(request)
            .addOnSuccessListener(result -> {
                try {
                    call.resolve(buildSuccessResponse(result));
                } catch (Exception exception) {
                    Log.e(TAG, "Age signals success response parsing failed", exception);
                    call.resolve(buildErrorResponse(exception));
                }
            })
            .addOnFailureListener(error -> call.resolve(buildErrorResponse(error)));
    }

    private JSObject buildSuccessResponse(AgeSignalsResult result) {
        JSObject payload = new JSObject();
        payload.put("success", true);
        payload.put("available", true);
        payload.put("checkedAt", toIso8601(new Date()));

        Integer rawUserStatus = result.userStatus();
        if (rawUserStatus != null) {
            payload.put("rawUserStatus", rawUserStatus);
        }
        payload.put("userStatus", mapVerificationStatus(rawUserStatus));

        Integer ageLower = result.ageLower();
        if (ageLower != null) {
            payload.put("ageLower", ageLower);
        }

        Integer ageUpper = result.ageUpper();
        if (ageUpper != null) {
            payload.put("ageUpper", ageUpper);
        }

        String installId = result.installId();
        if (installId != null && !installId.isEmpty()) {
            payload.put("installId", installId);
        }

        Date mostRecentApprovalDate = result.mostRecentApprovalDate();
        if (mostRecentApprovalDate != null) {
            payload.put("mostRecentApprovalDate", toIso8601(mostRecentApprovalDate));
            payload.put("mostRecentApprovalDateMs", mostRecentApprovalDate.getTime());
        }

        return payload;
    }

    private JSObject buildErrorResponse(Exception error) {
        JSObject payload = new JSObject();
        payload.put("success", false);
        payload.put("available", false);
        payload.put("checkedAt", toIso8601(new Date()));
        payload.put("errorName", "UNKNOWN_ERROR");
        payload.put("retryable", false);

        if (error != null) {
            payload.put("errorMessage", error.getMessage());
        }

        if (error instanceof AgeSignalsException) {
            AgeSignalsException ageSignalsException = (AgeSignalsException) error;
            int errorCode = ageSignalsException.getErrorCode();
            payload.put("errorCode", errorCode);
            payload.put("errorName", mapErrorCode(errorCode));
            payload.put("retryable", isRetryable(errorCode));
            Log.w(TAG, "Age signals check failed with code: " + errorCode, error);
            return payload;
        }

        Log.e(TAG, "Age signals check failed with unexpected error", error);
        return payload;
    }

    private String mapVerificationStatus(Integer status) {
        if (status == null) {
            return "UNSPECIFIED";
        }
        switch (status) {
            case STATUS_VERIFIED:
                return "VERIFIED";
            case STATUS_SUPERVISED:
                return "SUPERVISED";
            case STATUS_SUPERVISED_APPROVAL_PENDING:
                return "SUPERVISED_APPROVAL_PENDING";
            case STATUS_SUPERVISED_APPROVAL_DENIED:
                return "SUPERVISED_APPROVAL_DENIED";
            case STATUS_UNKNOWN:
                return "UNKNOWN";
            case STATUS_DECLARED:
                return "DECLARED";
            default:
                return "UNSPECIFIED";
        }
    }

    private String mapErrorCode(int errorCode) {
        switch (errorCode) {
            case ERROR_API_NOT_AVAILABLE:
                return "API_NOT_AVAILABLE";
            case ERROR_PLAY_STORE_NOT_FOUND:
                return "PLAY_STORE_NOT_FOUND";
            case ERROR_NETWORK_ERROR:
                return "NETWORK_ERROR";
            case ERROR_PLAY_SERVICES_NOT_FOUND:
                return "PLAY_SERVICES_NOT_FOUND";
            case ERROR_CANNOT_BIND_TO_SERVICE:
                return "CANNOT_BIND_TO_SERVICE";
            case ERROR_PLAY_STORE_VERSION_OUTDATED:
                return "PLAY_STORE_VERSION_OUTDATED";
            case ERROR_PLAY_SERVICES_VERSION_OUTDATED:
                return "PLAY_SERVICES_VERSION_OUTDATED";
            case ERROR_CLIENT_TRANSIENT_ERROR:
                return "CLIENT_TRANSIENT_ERROR";
            case ERROR_APP_NOT_OWNED:
                return "APP_NOT_OWNED";
            case ERROR_SDK_VERSION_OUTDATED:
                return "SDK_VERSION_OUTDATED";
            case ERROR_INTERNAL_ERROR:
                return "INTERNAL_ERROR";
            default:
                return "UNKNOWN_ERROR_CODE";
        }
    }

    private boolean isRetryable(int errorCode) {
        return errorCode == ERROR_NETWORK_ERROR
            || errorCode == ERROR_CANNOT_BIND_TO_SERVICE
            || errorCode == ERROR_CLIENT_TRANSIENT_ERROR
            || errorCode == ERROR_INTERNAL_ERROR;
    }

    private String toIso8601(Date date) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        return formatter.format(date);
    }
}

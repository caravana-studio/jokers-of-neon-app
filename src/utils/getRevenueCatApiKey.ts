import { isNativeAndroid, isNativeIOS } from "./capacitorUtils";

const TEST_REVENUECAT_API_KEY = "test_ChdaKGZICMKdxjtXizbjgcCHfkf";

export const getRevenueCatApiKey = () => {
    if (isNativeAndroid) {
        return import.meta.env.VITE_REVENUECAT_ANDROID_API_KEY || TEST_REVENUECAT_API_KEY;
    } else if (isNativeIOS) {
        return import.meta.env.VITE_REVENUECAT_IOS_API_KEY || TEST_REVENUECAT_API_KEY;
    }
    return import.meta.env.VITE_REVENUECAT_WEB_API_KEY || TEST_REVENUECAT_API_KEY;
}
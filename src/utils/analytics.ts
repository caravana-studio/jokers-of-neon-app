import { getAnalytics, logEvent as firebaseLogEvent, setUserId, setUserProperties, isSupported } from "firebase/analytics";
import { firebaseApp } from "./firebaseApp";

let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;

const getAnalyticsInstance = async () => {
  if (analyticsInstance) return analyticsInstance;

  const supported = await isSupported();
  if (!supported) return null;

  analyticsInstance = getAnalytics(firebaseApp);
  return analyticsInstance;
};

// Initialize eagerly so it's ready when needed
void getAnalyticsInstance();

export const logEvent = (action: string, params: Record<string, unknown> = {}) => {
  void getAnalyticsInstance().then((analytics) => {
    if (analytics) {
      firebaseLogEvent(analytics, action, params);
    }
  });
};

export const setAnalyticsUserId = (userId: string) => {
  void getAnalyticsInstance().then((analytics) => {
    if (analytics) {
      setUserId(analytics, userId);
    }
  });
};

export const setAnalyticsUserProperties = (properties: Record<string, string>) => {
  void getAnalyticsInstance().then((analytics) => {
    if (analytics) {
      setUserProperties(analytics, properties);
    }
  });
};

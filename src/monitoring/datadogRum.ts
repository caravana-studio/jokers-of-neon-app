import { datadogRum } from "@datadog/browser-rum";
import { DefaultPrivacyLevel } from "@datadog/browser-core";

import { APP_VERSION } from "../constants/version";

const DATADOG_SERVICE = "jokers-of-neon-frontend";

let isInitialized = false;

export const initDatadogRum = () => {
  if (isInitialized) return;

  const clientToken = import.meta.env.VITE_DATADOG_CLIENT_TOKEN;
  const applicationId = import.meta.env.VITE_DATADOG_APPLICATION_ID;

  if (!clientToken || !applicationId) {
    console.warn(
      "Datadog RUM not initialized: missing client token or application id"
    );
    return;
  }

  const site = import.meta.env.VITE_DATADOG_SITE || "datadoghq.com";
  const env = import.meta.env.VITE_DATADOG_ENV || import.meta.env.MODE || "dev";
  const isProd = env === "prod";
  const allowedEnvs = ["dev", "prod"];
  if (!allowedEnvs.includes(env)) {
    console.warn(`Datadog RUM not initialized: unsupported env '${env}'`);
    return;
  }

  datadogRum.init({
    applicationId,
    clientToken,
    site,
    service: DATADOG_SERVICE,
    env,
    version: APP_VERSION,
    sessionSampleRate: 100,
    sessionReplaySampleRate: isProd ? 15 : 100,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: DefaultPrivacyLevel.MASK_USER_INPUT,
    silentMultipleInit: true,
  });

  datadogRum.startSessionReplayRecording();
  isInitialized = true;
};

export { datadogRum };

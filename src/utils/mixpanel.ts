import mixpanel from "mixpanel-browser";

import { APP_VERSION } from "../constants/version";
import { platform } from "./capacitorUtils";

type AppFlavor = "full-game" | "shop";

type IdentifyMixpanelUserParams = {
  distinctId: string;
  username?: string | null;
  accountDisplay?: string | null;
  accountType?: string | null;
};

const MIXPANEL_TOKEN =
  import.meta.env.VITE_MIXPANEL_PROJECT_TOKEN?.trim() || "";
const MIXPANEL_API_HOST =
  import.meta.env.VITE_MIXPANEL_API_HOST?.trim() || undefined;

let initialized = false;
let baseSuperProperties: Record<string, string> = {};

const isEnabled = () => Boolean(MIXPANEL_TOKEN);

const registerBaseSuperProperties = () => {
  if (!initialized) {
    return;
  }

  mixpanel.register(baseSuperProperties);
};

export const initMixpanel = (appFlavor: AppFlavor) => {
  if (initialized || !isEnabled()) {
    return;
  }

  baseSuperProperties = {
    platform,
    app_type: appFlavor,
    app_version: APP_VERSION,
  };

  mixpanel.init(MIXPANEL_TOKEN, {
    api_host: MIXPANEL_API_HOST,
    autocapture: false,
    track_pageview: false,
    persistence: "localStorage",
    persistence_name: `jon_mixpanel_${appFlavor}`,
  });

  initialized = true;
  registerBaseSuperProperties();
};

export const identifyMixpanelUser = ({
  distinctId,
  username,
  accountDisplay,
  accountType,
}: IdentifyMixpanelUserParams) => {
  if (!initialized || !distinctId) {
    return;
  }

  mixpanel.identify(distinctId);
  mixpanel.register({
    account_type: accountType ?? "unknown",
    is_guest: accountType === "burner",
    ...(username ? { username } : {}),
    ...(accountDisplay ? { account_display: accountDisplay } : {}),
  });
};

export const resetMixpanelUser = () => {
  if (!initialized) {
    return;
  }

  mixpanel.reset();
  registerBaseSuperProperties();
};

export const trackMixpanelEvent = (
  eventName: string,
  properties: Record<string, unknown> = {}
) => {
  if (!initialized) {
    return;
  }

  mixpanel.track(eventName, properties);
};

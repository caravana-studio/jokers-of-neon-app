import { useEffect } from "react";

import { useDojo } from "../dojo/DojoContext";
import { useUsername } from "../dojo/utils/useUsername";
import { datadogRum } from "./datadogRum";
import { identifyMixpanelUser, resetMixpanelUser } from "../utils/mixpanel";

export const DatadogUserContext = () => {
  const username = useUsername();
  const { setup } = useDojo();

  const accountAddress = setup?.account?.account?.address;
  const accountDisplay = setup?.account?.accountDisplay;
  const accountType = setup?.accountType;

  useEffect(() => {
    if (!accountAddress) {
      datadogRum.clearUser();
      resetMixpanelUser();
      return;
    }

    datadogRum.setUser({
      id: accountAddress,
      name: username || undefined,
      accountDisplay: accountDisplay || undefined,
      accountType: accountType || undefined,
    });

    identifyMixpanelUser({
      distinctId: accountAddress,
      username,
      accountDisplay,
      accountType,
    });
  }, [accountAddress, accountDisplay, accountType, username]);

  return null;
};

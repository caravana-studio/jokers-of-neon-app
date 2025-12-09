import { useEffect } from "react";

import { useDojo } from "../dojo/DojoContext";
import { useUsername } from "../dojo/utils/useUsername";
import { datadogRum } from "./datadogRum";

export const DatadogUserContext = () => {
  const username = useUsername();
  const { setup } = useDojo();

  const accountAddress = setup?.account?.account?.address;
  const accountDisplay = setup?.account?.accountDisplay;
  const accountType = setup?.accountType;

  useEffect(() => {
    if (!accountAddress) {
      datadogRum.clearUser();
      return;
    }

    datadogRum.setUser({
      id: accountAddress,
      name: username || undefined,
      accountDisplay: accountDisplay || undefined,
      accountType: accountType || undefined,
    });
  }, [accountAddress, accountDisplay, accountType, username]);

  return null;
};

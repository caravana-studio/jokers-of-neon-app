import { useEffect, useContext, useState } from "react";
import { LOGGED_USER } from "../../constants/localStorage";
import { useUsernameStore } from "../../state/useUsernameStore";
import { DojoContext } from "../DojoContext";

export const useUsername = () => {
  const dojoCtx = useContext(DojoContext);
  const accountAddress = dojoCtx?.account?.account?.address;
  const isBurnerAccount = dojoCtx?.accountType === "burner";
  const username = useUsernameStore((store) => store.username);
  const status = useUsernameStore((store) => store.status);
  const loadUsername = useUsernameStore((store) => store.loadUsername);
  const reset = useUsernameStore((store) => store.reset);

  const [guestUsername, setGuestUsername] = useState<string | null>(() =>
    typeof window === "undefined" ? null : window.localStorage.getItem(LOGGED_USER)
  );

  useEffect(() => {
    if (!accountAddress) {
      reset();
      return;
    }

    void loadUsername(accountAddress);
  }, [accountAddress, loadUsername, reset]);

  useEffect(() => {
    if (!isBurnerAccount) {
      setGuestUsername(null);
      return;
    }

    setGuestUsername(window.localStorage.getItem(LOGGED_USER));
  }, [isBurnerAccount, status]);

  return username ?? (isBurnerAccount ? guestUsername : null);
};

import { useEffect, useState, useContext } from "react";
import { LOGGED_USER } from "../../constants/localStorage";
import { controller } from "../controller/controller";
import { DojoContext } from "../DojoContext";
import { useCavosSafe } from "../cavos/CavosConfig";

export const useUsername = () => {
  const [username, setUsername] = useState<string | null>(null);
  const dojoCtx = useContext(DojoContext);
  const isUsingBurner = dojoCtx?.useBurnerAcc;
  const isCavos = dojoCtx?.accountType === "cavos";

  const cavos = useCavosSafe();

  useEffect(() => {
    if (isCavos && cavos?.user?.email) {
      setUsername(cavos.user.email);
    } else if (!isUsingBurner && !isCavos && controller) {
      controller.username()?.then((username) => {
        if (username) {
          setUsername(username);
        }
      });
    }
  }, [controller, dojoCtx?.useBurnerAcc, dojoCtx?.accountType, isCavos, cavos?.user?.email]);

  if (isUsingBurner) return window.localStorage.getItem(LOGGED_USER);
  if (isCavos) return cavos?.user?.email ?? cavos?.user?.name ?? null;
  return username;
};

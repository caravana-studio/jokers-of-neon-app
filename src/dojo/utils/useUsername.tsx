import { useEffect, useState, useContext } from "react";
import { LOGGED_USER } from "../../constants/localStorage";
import { controller } from "../controller/controller";
import { DojoContext } from "../DojoContext";

export const useUsername = () => {
  const [username, setUsername] = useState<string | null>(null);
  const dojoCtx = useContext(DojoContext);
  const isUsingBurner = dojoCtx?.useBurnerAcc;

  useEffect(() => {
    if (!isUsingBurner && controller) {
      controller.username()?.then((username) => {
        if (username) {
          setUsername(username);
        }
      });
    }
  }, [controller, dojoCtx?.useBurnerAcc, dojoCtx?.accountType]);

  return isUsingBurner ? window.localStorage.getItem(LOGGED_USER) : username;
};

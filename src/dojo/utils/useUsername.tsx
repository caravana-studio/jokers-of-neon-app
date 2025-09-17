import { useEffect, useState } from "react";
import { LOGGED_USER } from "../../constants/localStorage";
import { controller } from "../controller/controller";
import { useDojo } from "../DojoContext";

export const useUsername = () => {
  const [username, setUsername] = useState<string | null>(null);
  const { setup } = useDojo();
  const isUsingBurner = setup?.useBurnerAcc;

  useEffect(() => {
    if (!isUsingBurner && controller) {
      controller.username()?.then((username) => {
        if (username) {
          setUsername(username);
        }
      });
    }
  }, [controller, setup?.useBurnerAcc, setup.accountType]);

  return isUsingBurner ? window.localStorage.getItem(LOGGED_USER) : username;
};

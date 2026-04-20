import { useEffect, useState, useContext } from "react";
import { LOGGED_USER } from "../../constants/localStorage";
import { controller } from "../controller/controller";
import { DojoContext } from "../DojoContext";

export const useUsername = () => {
  const [username, setUsername] = useState<string | null>(null);
  const dojoCtx = useContext(DojoContext);
  const isBurnerAccount = dojoCtx?.accountType === "burner";

  useEffect(() => {
    if (!isBurnerAccount && controller) {
      controller.username()?.then((username) => {
        if (username) {
          setUsername(username);
        }
      });
    }
  }, [controller, dojoCtx?.accountType]);

  return isBurnerAccount ? window.localStorage.getItem(LOGGED_USER) : username;
};

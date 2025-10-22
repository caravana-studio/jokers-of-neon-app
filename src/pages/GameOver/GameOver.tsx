import { useEffect } from "react";
import { useDojo } from "../../dojo/DojoContext";
import { GameOverGuest } from "./GameOverGuest";
import { GameOverLoggedIn } from "./GameOverLoggedIN";
import { logEvent } from "../../utils/analytics";

export const GameOver = () => {
  const { setup } = useDojo();

  useEffect(() => {
    logEvent("open_game_over_page", {player_type: setup.useBurnerAcc ? "guest" : "logged_in"})
  }, [])

  return setup.useBurnerAcc ? <GameOverGuest /> : <GameOverLoggedIn />;
};

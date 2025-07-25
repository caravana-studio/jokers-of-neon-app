import { useDojo } from "../../dojo/DojoContext";
import { GameOverGuest } from "./GameOverGuest";
import { GameOverLoggedIn } from "./GameOverLoggedIN";

export const GameOver = () => {
  const { setup } = useDojo();

  return setup.useBurnerAcc ? <GameOverGuest /> : <GameOverLoggedIn />;
};

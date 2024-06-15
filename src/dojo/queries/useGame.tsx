import { IGame } from "../../types/Game";
import { useDojo } from "../useDojo";
import { getGame } from "../utils/getGame";
import { getLSGameId } from "../utils/getLSGameId";

export const useGame = () => {
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();
  const gameId = getLSGameId();
  return getGame(gameId, Game) as IGame;
};

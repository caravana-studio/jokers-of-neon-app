import { IGame } from "../../types/Game";
import { IRound } from "../../types/Round";
import { useDojo } from "../useDojo";
import { getGame } from "../utils/getGame";
import { getLSGameId } from "../utils/getLSGameId";

export const useRound = () => {
  const {
    setup: {
      clientComponents: { Round },
    },
  } = useDojo();
  const gameId = getLSGameId();
  return getGame(gameId, Round) as IRound;
};

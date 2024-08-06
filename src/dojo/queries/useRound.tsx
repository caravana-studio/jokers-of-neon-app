import { Round } from "../../types/Round";
import { useDojo } from "../useDojo";
import { getLSGameId } from "../utils/getLSGameId";
import { getRound } from "../utils/getRound";

export const useRound = () => {
  const {
    setup: {
      clientComponents: { Round },
    },
  } = useDojo();
  const gameId = getLSGameId();
  return getRound(gameId, Round) as Round;
};

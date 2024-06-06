import { useDojo } from "../useDojo";
import { decodeString } from "./decodeString";
import { getGame } from "./getGame";
import { getLSGameId } from "./getLSGameId";

export const useUsername = () => {
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();
  const gameId = getLSGameId();
  const game = getGame(gameId, Game);
  return decodeString(game?.player_name ?? "");
};

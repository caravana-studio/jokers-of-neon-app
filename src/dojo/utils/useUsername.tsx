import { GAME_ID } from "../../constants/localStorage";
import { useDojo } from "../useDojo";
import { decodeString } from "./decodeString";
import { getGame } from "./getGame";

export const useUsername = () => {
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();
  const gameId = Number(localStorage.getItem(GAME_ID)) ?? 0;
  const game = getGame(gameId, Game);
  return decodeString(game?.player_name ?? "");
};

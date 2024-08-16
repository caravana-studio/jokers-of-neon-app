import { useGame } from "../queries/useGame";
import { decodeString } from "./decodeString";

export const useUsername = () => {
  const game = useGame();
  return decodeString(game?.player_name ?? "");
};

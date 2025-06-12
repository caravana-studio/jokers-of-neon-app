import { useGameView } from "./useGameView";

export const useGame = () => {
  const { gameView } = useGameView();
  return gameView.game;
};

import { useGameView } from "./useGameView";

export const useRound = () => {
  const { gameView } = useGameView();
  return gameView.round;
};

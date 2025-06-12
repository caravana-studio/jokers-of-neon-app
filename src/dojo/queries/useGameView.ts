import { useEffect, useState } from "react";
import { useDojo } from "../useDojo";
import { getLSGameId } from "../utils/getLSGameId";
import { DEFAULT_GAME_VIEW, GameView, getGameView } from "./getGameView";

export const useGameView = () => {
  const {
    setup: { client },
  } = useDojo();
  const [gameView, setGameView] = useState<GameView>(DEFAULT_GAME_VIEW);
  const gameId = getLSGameId();

  const refetchGameView = () => {
    console.log("refetching game view");
    getGameView(client, gameId).then((response) => {
      setGameView(response);
    });
  }

  useEffect(() => {
    if (gameId) {
      refetchGameView();
    }
  }, [gameId]);

  return { gameView, refetchGameView };
};

import { useEffect, useState } from "react";
import {
  getStoredGameLoopBurnerSession,
  subscribeToGameLoopBurnerSession,
  type GameLoopBurnerSession,
} from "../utils/gameLoopBurner";

export const useGameLoopBurnerSession = () => {
  const [session, setSession] = useState<GameLoopBurnerSession | null>(() =>
    getStoredGameLoopBurnerSession()
  );

  useEffect(() => {
    return subscribeToGameLoopBurnerSession(() => {
      setSession(getStoredGameLoopBurnerSession());
    });
  }, []);

  return session;
};

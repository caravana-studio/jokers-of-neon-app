import { PropsWithChildren, useEffect, useState } from "react";
import { useDojo } from "../dojo/useDojo";
import { LoadingScreen } from "../pages/LoadingScreen/LoadingScreen";
import { useDeckStore } from "../state/useDeckStore";
import { useGameStore } from "../state/useGameStore";
import { useCardData } from "../providers/CardDataProvider";

export const GameStoreLoader = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    setup: { client },
  } = useDojo();
  const { refetchGameStore, id: gameId } = useGameStore();

  const { fetchDeck } = useDeckStore();
  const { getCardData } = useCardData();

  useEffect(() => {
    if (client && gameId) {
      console.log("loader refetching");
      refetchGameStore(client, gameId).then(() => {
        console.log("loader refetched");
        setIsLoading(false);
      });
      fetchDeck(client, gameId, getCardData);
    }
  }, [client, gameId]);

  return isLoading ? <LoadingScreen /> : <>{children}</>;
};

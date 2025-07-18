import { PropsWithChildren, useEffect, useState } from "react";
import { useDojo } from "../dojo/useDojo";
import { LoadingScreen } from "../pages/LoadingScreen/LoadingScreen";
import { useGameStore } from "../state/useGameStore";

export const GameStoreLoader = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    setup: { client },
  } = useDojo();
  const { refetchGameStore, id: gameId } = useGameStore();

  useEffect(() => {
    if (client && gameId) {
        console.log('loader refetching')
      refetchGameStore(client, gameId).then(() => {
        console.log('loader refetched')
        setIsLoading(false)
    });
    }
  }, [client, gameId]);

  return isLoading ? <LoadingScreen /> : <>{children}</>;
};

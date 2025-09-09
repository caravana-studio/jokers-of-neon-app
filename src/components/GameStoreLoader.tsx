import { Flex, Spinner } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useDojo } from "../dojo/useDojo";
import { useCardData } from "../providers/CardDataProvider";
import { useCurrentHandStore } from "../state/useCurrentHandStore";
import { useDeckStore } from "../state/useDeckStore";
import { useGameStore } from "../state/useGameStore";

export const GameStoreLoader = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    setup: { client },
  } = useDojo();
  const { refetchGameStore, id: gameId, state } = useGameStore();
  const { refetchCurrentHandStore } = useCurrentHandStore();
  const { fetchDeck } = useDeckStore();
  const { getCardData } = useCardData();

  useEffect(() => {
    if (client && gameId) {
      if (state === GameStateEnum.NotSet) {
        const allPromises = [
          refetchCurrentHandStore(client, gameId),
          refetchGameStore(client, gameId),
        ];

        Promise.all(allPromises).then(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
      fetchDeck(client, gameId, getCardData);
    }
  }, [client, gameId]);

  return (
    <>
      {isLoading ? (
        <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
          <Spinner size="xl" color="white" />
        </Flex>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

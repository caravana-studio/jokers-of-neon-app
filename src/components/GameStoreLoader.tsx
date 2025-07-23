import { Flex, Spinner } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { useDojo } from "../dojo/useDojo";
import { useGameStore } from "../state/useGameStore";
import { GameStateEnum } from "../dojo/typescript/custom";

export const GameStoreLoader = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    setup: { client },
  } = useDojo();
  const { refetchGameStore, id: gameId, state } = useGameStore();

  useEffect(() => {
    if (client && gameId) {
      if (state === GameStateEnum.NotSet) {
        refetchGameStore(client, gameId).then(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
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

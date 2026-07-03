import { Flex, Spinner } from "@chakra-ui/react";
import { PropsWithChildren, useEffect } from "react";
import { useDojo } from "../dojo/useDojo";
import { useGameStore } from "../state/useGameStore";
import { useShopStore } from "../state/useShopStore";

export const ShopStoreLoader = ({ children }: PropsWithChildren) => {
  const {
    setup: { client },
  } = useDojo();
  const { id: gameId } = useGameStore();
  const {
    loading,
    isLeavingShop,
    setLoading,
    refetchShopStore,
    loadedGameId,
    reset,
  } =
    useShopStore();

  useEffect(() => {
    if (!client || !gameId) {
      return;
    }

    if (isLeavingShop) {
      return;
    }

    if (loadedGameId !== gameId) {
      reset();
      setLoading(true);
      void refetchShopStore(client, gameId).finally(() => {
        setLoading(false);
      });
      return;
    }

    setLoading(false);
  }, [client, gameId, loadedGameId, refetchShopStore, reset, setLoading, isLeavingShop]);

  return (
    <>
      {loading || isLeavingShop ? (
        <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
          <Spinner size="xl" color="white" />
        </Flex>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

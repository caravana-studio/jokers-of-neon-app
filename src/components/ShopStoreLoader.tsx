import { Flex, Spinner } from "@chakra-ui/react";
import { PropsWithChildren, useEffect } from "react";
import { useDojo } from "../dojo/useDojo";
import { useGameStore } from "../state/useGameStore";
import { useShopStore } from "../state/useShopStore";

export const ShopStoreLoader = ({ children }: PropsWithChildren) => {
  const {
    setup: { client },
  } = useDojo();
  const { id: gameId} = useGameStore();
  const { loading, setLoading, refetchShopStore, loadedItems } = useShopStore();

  useEffect(() => {
    if (client && gameId) {
      console.log('loadedItems', loadedItems)
      if (!loadedItems) {
        refetchShopStore(client, gameId).then(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, [client, gameId]);

  return (
    <>
      {loading ? (
        <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
          <Spinner size="xl" color="white" />
        </Flex>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

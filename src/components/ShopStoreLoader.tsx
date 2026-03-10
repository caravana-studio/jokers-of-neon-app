import { Flex, Spinner } from "@chakra-ui/react";
import { PropsWithChildren, useEffect } from "react";
import { isMockGameApiMode } from "../config/gameMode";
import { useDojo } from "../dojo/useDojo";
import { useGameStore } from "../state/useGameStore";
import { useRunStore } from "../state/roguelike/useRunStore";
import { buildMockDynamicShopState } from "../state/roguelike/mockDynamicStore";
import { useProgressStore } from "../state/roguelike/useProgressStore";
import { useShopStore } from "../state/useShopStore";

export const ShopStoreLoader = ({ children }: PropsWithChildren) => {
  const {
    setup: { client },
  } = useDojo();
  const { id: gameId, shopId } = useGameStore();
  const activeRun = useRunStore((state) => state.activeRun);
  const profile = useProgressStore((state) => state.profile);
  const { loading, setLoading, refetchShopStore, loadedItems } = useShopStore();

  useEffect(() => {
    if (isMockGameApiMode) {
      const runId = activeRun?.runId ?? `mock-run-${gameId || 0}`;
      const runNumber = activeRun?.runNumber ?? 1;
      const safeShopId = shopId > 0 ? shopId : 1;

      const mockState = buildMockDynamicShopState({
        gameId: gameId || runNumber,
        runId,
        shopId: safeShopId,
        unlockedSystems: profile?.unlockedSystems ?? [],
      });

      useShopStore.setState({
        ...mockState,
        loadedItems: true,
        loading: false,
        rerolling: false,
        locked: false,
      });

      setLoading(false);
      return;
    }

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
  }, [
    client,
    gameId,
    shopId,
    activeRun?.runId,
    activeRun?.runNumber,
    profile?.unlockedSystems,
  ]);

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

import { useEffect, useMemo } from "react";
import { useDojo } from "../dojo/useDojo";
import { useGameStore } from "../state/useGameStore";
import { usePlaysStore } from "../state/usePlaysStore";

export const usePlayerPlaysData = () => {
  const {
    setup: { client },
    account: { account },
  } = useDojo();
  const { id: rawGameId } = useGameStore();
  const gameId = rawGameId > 0 ? rawGameId : 0;

  const {
    plays,
    tracker,
    loading,
    loaded,
    lastLoadedUserAddress,
    lastLoadedGameId,
    refetch,
    reset,
  } = usePlaysStore();

  useEffect(() => {
    if (!account?.address) {
      reset();
      return;
    }

    void refetch({
      client,
      userAddress: account.address,
      gameId,
    });
  }, [account?.address, client, gameId, refetch, reset]);

  const hasCachedData = Boolean(
    account?.address &&
      loaded &&
      lastLoadedUserAddress === account.address &&
      lastLoadedGameId === gameId,
  );

  return useMemo(
    () => ({
      plays: hasCachedData ? plays : [],
      tracker: hasCachedData ? tracker : undefined,
      loading: loading && !hasCachedData,
      hasCachedData,
    }),
    [hasCachedData, loading, plays, tracker],
  );
};

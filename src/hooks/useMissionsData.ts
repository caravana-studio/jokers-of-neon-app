import { useEffect, useMemo } from "react";
import { useDojo } from "../dojo/useDojo";
import { useGameStore } from "../state/useGameStore";
import { useMissionsStore } from "../state/useMissionsStore";

interface UseMissionsDataProps {
  inGame?: boolean;
}

export const useMissionsData = ({
  inGame = false,
}: UseMissionsDataProps = {}) => {
  const {
    setup: { client },
    account: { account },
  } = useDojo();
  const { id: rawGameId } = useGameStore();
  const gameId = inGame && rawGameId > 0 ? rawGameId : 0;

  const {
    dailyMissions,
    weeklyMissions,
    loading,
    loaded,
    lastLoadedUserAddress,
    lastLoadedGameId,
    refetch,
    reset,
  } = useMissionsStore();

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
      dailyMissions: hasCachedData ? dailyMissions : [],
      weeklyMissions: hasCachedData ? weeklyMissions : [],
      loading: loading && !hasCachedData,
      hasCachedData,
    }),
    [dailyMissions, hasCachedData, loading, weeklyMissions],
  );
};

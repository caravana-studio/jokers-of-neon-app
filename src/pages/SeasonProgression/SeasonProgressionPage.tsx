import { useCallback, useEffect, useState } from "react";
import { fetchStreakStatus } from "../../api/profile";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useDojo } from "../../dojo/DojoContext";
import { useSeasonProgressStore } from "../../state/useSeasonProgressStore";
import { SeasonProgressionContent } from "./SeasonProgressionContent";
import { SeasonProgressionHeader } from "./SeasonProgressionHeader";

const MAX_STREAK_PROTECTORS = 2;

export const SeasonProgressionPage = () => {
  const {
    account: { account },
  } = useDojo();
  const steps = useSeasonProgressStore((store) => store.steps);
  const playerProgress = useSeasonProgressStore((store) => store.playerProgress);
  const loading = useSeasonProgressStore((store) => store.loading);
  const lastUserAddress = useSeasonProgressStore(
    (store) => store.lastUserAddress
  );
  const refetchSeasonProgress = useSeasonProgressStore(
    (store) => store.refetch
  );
  const resetSeasonProgress = useSeasonProgressStore((store) => store.reset);
  const [streakProtectorsAvailable, setStreakProtectorsAvailable] =
    useState<number | null>(null);

  const refreshStreakStatus = useCallback(async () => {
    if (!account?.address) {
      setStreakProtectorsAvailable(null);
      return;
    }

    try {
      const streakStatus = await fetchStreakStatus(account.address);
      setStreakProtectorsAvailable(streakStatus.protectorsAvailable);
    } catch (error) {
      console.warn("SeasonProgressionPage: failed to fetch streak status", error);
      setStreakProtectorsAvailable(null);
    }
  }, [account?.address]);

  const fetchSeasonProgress = useCallback(
    async (forceSeasonPassUnlocked = false) => {
      if (!account?.address) {
        return;
      }

      await Promise.all([
        refetchSeasonProgress({
          userAddress: account.address,
          forceSeasonPassUnlocked,
        }),
        refreshStreakStatus(),
      ]);
    },
    [account?.address, refetchSeasonProgress, refreshStreakStatus]
  );

  useEffect(() => {
    if (!account?.address) {
      setStreakProtectorsAvailable(null);
      if (lastUserAddress) {
        resetSeasonProgress();
      }
      return;
    }

    if (lastUserAddress !== account.address) {
      void fetchSeasonProgress();
    } else if (streakProtectorsAvailable === null) {
      void refreshStreakStatus();
    }
  }, [
    account?.address,
    fetchSeasonProgress,
    lastUserAddress,
    refreshStreakStatus,
    resetSeasonProgress,
    streakProtectorsAvailable,
  ]);

  return (
    <DelayedLoading ms={200} loading={loading}>
      <MobileDecoration fadeToBlack />
      <SeasonProgressionHeader
        onSeasonPassPurchased={() => {
          void fetchSeasonProgress(true);
        }}
      />
      <SeasonProgressionContent
        steps={steps}
        playerProgress={playerProgress}
        streakProtectorsAvailable={streakProtectorsAvailable}
        maxStreakProtectors={MAX_STREAK_PROTECTORS}
        refetch={() => {
          void fetchSeasonProgress();
        }}
      />
    </DelayedLoading>
  );
};

import { useCallback, useEffect } from "react";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useDojo } from "../../dojo/DojoContext";
import { useSeasonProgressStore } from "../../state/useSeasonProgressStore";
import { SeasonProgressionContent } from "./SeasonProgressionContent";
import { SeasonProgressionHeader } from "./SeasonProgressionHeader";

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

  const fetchSeasonProgress = useCallback(
    async (forceSeasonPassUnlocked = false) => {
      if (!account?.address) {
        return;
      }

      await refetchSeasonProgress({
        userAddress: account.address,
        forceSeasonPassUnlocked,
      });
    },
    [account?.address, refetchSeasonProgress]
  );

  useEffect(() => {
    if (!account?.address) {
      if (lastUserAddress) {
        resetSeasonProgress();
      }
      return;
    }

    if (lastUserAddress !== account.address) {
      void refetchSeasonProgress({ userAddress: account.address });
    }
  }, [
    account?.address,
    lastUserAddress,
    refetchSeasonProgress,
    resetSeasonProgress,
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
        refetch={() => {
          void fetchSeasonProgress();
        }}
      />
    </DelayedLoading>
  );
};

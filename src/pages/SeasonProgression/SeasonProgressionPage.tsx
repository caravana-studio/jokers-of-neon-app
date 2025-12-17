import { useEffect, useState } from "react";
import { getSeasonProgress } from "../../api/getSeasonProgress";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useDojo } from "../../dojo/DojoContext";
import { SeasonProgressionContent } from "./SeasonProgressionContent";
import { SeasonProgressionHeader } from "./SeasonProgressionHeader";
import { IStep } from "./types";

export const SeasonProgressionPage = () => {
  const [steps, setSteps] = useState<IStep[]>([]);
  const [playerProgress, setPlayerProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const {
    account: { account },
  } = useDojo();

  const fetchSeasonProgress = (forceSeasonPassUnlocked = false) => {
    setIsLoading(true);
    getSeasonProgress({
      userAddress: account?.address,
      forceSeasonPassUnlocked,
    }).then((data) => {
      setIsLoading(false);
      setSteps(data.steps);
      setPlayerProgress(data.playerProgress);
    });
  };

  useEffect(() => {
    if (account?.address) {
      fetchSeasonProgress();
    }
  }, [account.address]);

  return (
    <DelayedLoading ms={200} loading={isLoading}>
      <MobileDecoration fadeToBlack />
      <SeasonProgressionHeader
        onSeasonPassPurchased={() => {
          fetchSeasonProgress(true);
        }}
      />
      <SeasonProgressionContent
        steps={steps}
        playerProgress={playerProgress}
        refetch={fetchSeasonProgress}
      />
    </DelayedLoading>
  );
};

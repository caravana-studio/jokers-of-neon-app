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
  const [seasonPassUnlocked, setSeasonPassUnlocked] = useState<boolean>(false);
  const [playerProgress, setPlayerProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const {
    account: { account },
  } = useDojo();

  useEffect(() => {
    if (account?.address) {
      getSeasonProgress({ userAddress: account.address }).then((data) => {
        setIsLoading(false);
        setSteps(data.steps);
        setSeasonPassUnlocked(data.seasonPassUnlocked);
        setPlayerProgress(data.playerProgress);
      });
    }
  }, [account.address]);

  return (
    <DelayedLoading ms={200} loading={isLoading}>
      <MobileDecoration fadeToBlack />
      <SeasonProgressionHeader seasonPassUnlocked={seasonPassUnlocked} />
      <SeasonProgressionContent steps={steps} playerProgress={playerProgress} />
    </DelayedLoading>
  );
};

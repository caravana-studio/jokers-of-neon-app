import { useCallback, useEffect, useMemo, useState } from "react";
import { CallBackProps, STATUS, Step } from "react-joyride";
import { useTranslation } from "react-i18next";
import { JOYRIDE_LOCALES } from "../constants/gameTutorial";
import {
  PROGRESSIVE_TUTORIAL_IDS,
  getProgressiveTutorialState,
  setProgressiveTutorialCompleted,
} from "../utils/progressiveTutorialStorage";

export const useProgressiveRewardsTutorial = () => {
  const { t } = useTranslation("tutorials");
  const [run, setRun] = useState(false);

  useEffect(() => {
    const completed = getProgressiveTutorialState();
    if (!completed[PROGRESSIVE_TUTORIAL_IDS.REWARDS_FIRST_ENTRY]) {
      setRun(true);
    }
  }, []);

  const completeTutorial = useCallback(() => {
    setProgressiveTutorialCompleted(PROGRESSIVE_TUTORIAL_IDS.REWARDS_FIRST_ENTRY);
    setRun(false);
  }, []);

  const handleCallback = useCallback(
    (data: CallBackProps) => {
      if (
        data.status === STATUS.FINISHED ||
        data.status === STATUS.SKIPPED ||
        data.type === "error:target_not_found"
      ) {
        completeTutorial();
      }
    },
    [completeTutorial]
  );

  const steps = useMemo<Step[]>(
    () => [
      {
        target: ".rewards-tutorial-root",
        placement: "center",
        disableBeacon: true,
        title: t("progressiveRewards.firstEntry.title"),
        content: t("progressiveRewards.firstEntry.overview"),
      },
      {
        target: ".rewards-tutorial-efficiency",
        disableBeacon: true,
        title: t("progressiveRewards.firstEntry.efficiencyTitle"),
        content: t("progressiveRewards.firstEntry.efficiencyContent"),
      },
      {
        target: ".rewards-tutorial-total",
        disableBeacon: true,
        title: t("progressiveRewards.firstEntry.totalTitle"),
        content: t("progressiveRewards.firstEntry.totalContent"),
      },
    ],
    [t]
  );

  return {
    run,
    steps,
    locale: JOYRIDE_LOCALES,
    handleCallback,
  };
};


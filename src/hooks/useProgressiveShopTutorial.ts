import { useCallback, useEffect, useMemo, useState } from "react";
import { CallBackProps, STATUS, Step } from "react-joyride";
import { JOYRIDE_LOCALES } from "../constants/gameTutorial";
import { useTranslation } from "react-i18next";
import {
  PROGRESSIVE_TUTORIAL_IDS,
  getProgressiveTutorialState,
  setProgressiveTutorialCompleted,
} from "../utils/progressiveTutorialStorage";

interface UseProgressiveShopTutorialProps {
  canStart: boolean;
}

export const useProgressiveShopTutorial = ({
  canStart,
}: UseProgressiveShopTutorialProps) => {
  const { t } = useTranslation("tutorials");
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!canStart) return;

    const completed = getProgressiveTutorialState();
    if (!completed[PROGRESSIVE_TUTORIAL_IDS.SHOP_FIRST_ENTRY]) {
      setRun(true);
    }
  }, [canStart]);

  const completeTutorial = useCallback(() => {
    setProgressiveTutorialCompleted(PROGRESSIVE_TUTORIAL_IDS.SHOP_FIRST_ENTRY);
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
        target: ".shop-tutorial-root",
        placement: "center",
        disableBeacon: true,
        title: t("progressiveShop.firstEntry.title"),
        content: t("progressiveShop.firstEntry.welcome"),
      },
      {
        target: ".game-tutorial-step-6",
        placement: "bottom",
        disableBeacon: true,
        title: t("progressiveShop.firstEntry.rerollTitle"),
        content: t("progressiveShop.firstEntry.rerollContent"),
      },
      {
        target: ".progressive-shop-next-button",
        placement: "top",
        disableBeacon: true,
        title: t("progressiveShop.firstEntry.nextTitle"),
        content: t("progressiveShop.firstEntry.nextContent"),
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

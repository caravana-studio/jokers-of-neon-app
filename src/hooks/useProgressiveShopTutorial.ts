import { useCallback, useEffect, useMemo, useState } from "react";
import { CallBackProps, STATUS, Step } from "react-joyride";
import { JOYRIDE_LOCALES } from "../constants/gameTutorial";
import { useTranslation } from "react-i18next";
import {
  PROGRESSIVE_TUTORIAL_IDS,
} from "../utils/progressiveTutorialStorage";
import { useSettings } from "../providers/SettingsProvider";
import { useTutorialStore } from "../state/useTutorialStore";

interface UseProgressiveShopTutorialProps {
  canStart: boolean;
}

export const useProgressiveShopTutorial = ({
  canStart,
}: UseProgressiveShopTutorialProps) => {
  const { t } = useTranslation("tutorials");
  const { skipAllTutorials, preferencesLoaded } = useSettings();
  const completed = useTutorialStore((state) => state.completed);
  const tutorialsLoaded = useTutorialStore((state) => state.loaded);
  const markTutorialCompleted = useTutorialStore(
    (state) => state.markTutorialCompleted
  );
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!canStart || !tutorialsLoaded || !preferencesLoaded || skipAllTutorials) {
      setRun(false);
      return;
    }

    if (!completed[PROGRESSIVE_TUTORIAL_IDS.SHOP_FIRST_ENTRY]) {
      setRun(true);
    }
  }, [canStart, completed, preferencesLoaded, skipAllTutorials, tutorialsLoaded]);

  const completeTutorial = useCallback(() => {
    void markTutorialCompleted(PROGRESSIVE_TUTORIAL_IDS.SHOP_FIRST_ENTRY);
    setRun(false);
  }, [markTutorialCompleted]);

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

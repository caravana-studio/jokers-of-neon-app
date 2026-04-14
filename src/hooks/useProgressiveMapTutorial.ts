import { useCallback, useEffect, useMemo, useState } from "react";
import { CallBackProps, STATUS, Step } from "react-joyride";
import { useTranslation } from "react-i18next";
import { JOYRIDE_LOCALES } from "../constants/gameTutorial";
import {
  PROGRESSIVE_TUTORIAL_IDS,
} from "../utils/progressiveTutorialStorage";
import { useSettings } from "../providers/SettingsProvider";
import { useTutorialStore } from "../state/useTutorialStore";

interface UseProgressiveMapTutorialProps {
  canStart: boolean;
}

export const useProgressiveMapTutorial = ({
  canStart,
}: UseProgressiveMapTutorialProps) => {
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

    if (!completed[PROGRESSIVE_TUTORIAL_IDS.MAP_FIRST_ENTRY]) {
      setRun(true);
    }
  }, [canStart, completed, preferencesLoaded, skipAllTutorials, tutorialsLoaded]);

  const completeTutorial = useCallback(() => {
    void markTutorialCompleted(PROGRESSIVE_TUTORIAL_IDS.MAP_FIRST_ENTRY);
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
        target: ".map-tutorial-graph",
        placement: "center",
        disableBeacon: true,
        title: t("progressiveMap.firstEntry.title"),
        content: `${t("progressiveMap.firstEntry.welcome")} ${t("progressiveMap.firstEntry.pathsContent")}`,
      },
      {
        target: ".map-tutorial-store-node",
        disableBeacon: true,
        title: t("progressiveMap.firstEntry.shopTitle"),
        content: t("progressiveMap.firstEntry.shopContent"),
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

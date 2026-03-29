import { useCallback, useEffect, useMemo, useState } from "react";
import { CallBackProps, STATUS, Step } from "react-joyride";
import { useTranslation } from "react-i18next";
import { JOYRIDE_LOCALES } from "../constants/gameTutorial";
import {
  PROGRESSIVE_TUTORIAL_IDS,
  getProgressiveTutorialState,
  setProgressiveTutorialCompleted,
} from "../utils/progressiveTutorialStorage";

interface UseProgressiveMapTutorialProps {
  canStart: boolean;
}

export const useProgressiveMapTutorial = ({
  canStart,
}: UseProgressiveMapTutorialProps) => {
  const { t } = useTranslation("tutorials");
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!canStart) return;

    const completed = getProgressiveTutorialState();
    if (!completed[PROGRESSIVE_TUTORIAL_IDS.MAP_FIRST_ENTRY]) {
      setRun(true);
    }
  }, [canStart]);

  const completeTutorial = useCallback(() => {
    setProgressiveTutorialCompleted(PROGRESSIVE_TUTORIAL_IDS.MAP_FIRST_ENTRY);
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
        target: ".map-tutorial-level",
        disableBeacon: true,
        title: t("progressiveMap.firstEntry.title"),
        content: t("progressiveMap.firstEntry.welcome"),
      },
      {
        target: ".map-tutorial-graph",
        placement: "center",
        disableBeacon: true,
        title: t("progressiveMap.firstEntry.pathsTitle"),
        content: t("progressiveMap.firstEntry.pathsContent"),
      },
      {
        target: ".map-tutorial-store-node",
        disableBeacon: true,
        title: t("progressiveMap.firstEntry.shopTitle"),
        content: t("progressiveMap.firstEntry.shopContent"),
      },
      {
        target: ".map-tutorial-store-node",
        disableBeacon: true,
        title: t("progressiveMap.firstEntry.shopTypesTitle"),
        content: t("progressiveMap.firstEntry.shopTypesContent"),
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


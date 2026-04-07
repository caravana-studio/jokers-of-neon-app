import { useCallback, useEffect, useMemo, useState } from "react";
import { CallBackProps, STATUS, Step } from "react-joyride";
import { useTranslation } from "react-i18next";
import { JOYRIDE_LOCALES } from "../constants/gameTutorial";
import {
  PROGRESSIVE_TUTORIAL_IDS,
  ProgressiveTutorialId,
  ProgressiveTutorialState,
  getProgressiveTutorialState,
  setProgressiveTutorialCompleted,
} from "../utils/progressiveTutorialStorage";

interface UseProgressiveGameTutorialProps {
  preSelectedCardsCount: number;
  currentScore: number;
  targetScore: number;
}

const getNextTutorialId = (
  completed: ProgressiveTutorialState,
  preSelectedCardsCount: number,
  currentScore: number
): ProgressiveTutorialId | null => {
  if (!completed[PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_ENTRY]) {
    return PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_ENTRY;
  }

  if (
    !completed[PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_TWO_SELECTED] &&
    preSelectedCardsCount >= 2
  ) {
    return PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_TWO_SELECTED;
  }

  if (
    !completed[PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_SCORE] &&
    currentScore > 0
  ) {
    return PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_SCORE;
  }

  return null;
};

export const useProgressiveGameTutorial = ({
  preSelectedCardsCount,
  currentScore,
  targetScore,
}: UseProgressiveGameTutorialProps) => {
  const { t } = useTranslation("tutorials");
  const [completed, setCompleted] = useState<ProgressiveTutorialState>(() =>
    getProgressiveTutorialState()
  );
  const [activeTutorialId, setActiveTutorialId] =
    useState<ProgressiveTutorialId | null>(null);
  const [run, setRun] = useState(false);

  const completeActiveTutorial = useCallback(() => {
    if (!activeTutorialId) {
      return;
    }

    setProgressiveTutorialCompleted(activeTutorialId, true);
    setCompleted((prev) => ({
      ...prev,
      [activeTutorialId]: true,
    }));
    setRun(false);
    setActiveTutorialId(null);
  }, [activeTutorialId]);

  useEffect(() => {
    if (run || activeTutorialId) {
      return;
    }

    const nextTutorial = getNextTutorialId(
      completed,
      preSelectedCardsCount,
      currentScore
    );

    if (!nextTutorial) {
      return;
    }

    setActiveTutorialId(nextTutorial);
    setRun(true);
  }, [activeTutorialId, completed, currentScore, preSelectedCardsCount, run]);

  const steps = useMemo<Step[]>(() => {
    if (activeTutorialId === PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_ENTRY) {
      return [
        {
          target: ".game-tutorial-intro",
          placement: "center",
          disableBeacon: true,
          title: t("progressiveGame.firstEntry.title"),
          content: t("progressiveGame.firstEntry.objective"),
        },
        {
          target: ".game-tutorial-step-2",
          disableBeacon: true,
          title: t("progressiveGame.firstEntry.selectTitle"),
          content: t("progressiveGame.firstEntry.selectContent"),
        },
        {
          target: ".game-tutorial-step-btn-plays",
          disableBeacon: true,
          title: t("progressiveGame.firstEntry.playsTitle"),
          content: t("progressiveGame.firstEntry.playsContent"),
        },
      ];
    }

    if (activeTutorialId === PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_TWO_SELECTED) {
      return [
        {
          target: ".game-tutorial-step-4",
          placement: "left",
          disableBeacon: true,
          title: t("progressiveGame.firstTwoSelected.playTitle"),
          content: t("progressiveGame.firstTwoSelected.playContent"),
        },
        {
          target: ".game-tutorial-step-3",
          placement: "right",
          disableBeacon: true,
          title: t("progressiveGame.firstTwoSelected.discardTitle"),
          content: t("progressiveGame.firstTwoSelected.discardContent"),
        },
      ];
    }

    if (activeTutorialId === PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_SCORE) {
      return [
        {
          target: ".game-tutorial-step-score-panel",
          disableBeacon: true,
          title: t("progressiveGame.firstScore.title"),
          content: t("progressiveGame.firstScore.content", {
            score: currentScore,
            targetScore,
          }),
        },
      ];
    }

    return [];
  }, [activeTutorialId, currentScore, t, targetScore]);

  const handleCallback = useCallback(
    (data: CallBackProps) => {
      if (
        data.status === STATUS.FINISHED ||
        data.status === STATUS.SKIPPED ||
        data.type === "error:target_not_found"
      ) {
        completeActiveTutorial();
      }
    },
    [completeActiveTutorial]
  );

  return {
    run,
    steps,
    locale: JOYRIDE_LOCALES,
    handleCallback,
  };
};

import { useCallback, useEffect, useMemo, useState } from "react";
import { CallBackProps, STATUS, Step } from "react-joyride";
import { useTranslation } from "react-i18next";
import { ModifiersId } from "../enums/modifiersId";
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
  clearedRoundOnFirstPlay: boolean;
  firstModifierCardId?: number;
}

const getNextTutorialId = (
  completed: ProgressiveTutorialState,
  preSelectedCardsCount: number,
  currentScore: number,
  firstModifierCardId?: number
): ProgressiveTutorialId | null => {
  if (!completed[PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_ENTRY]) {
    return PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_ENTRY;
  }

  if (
    !completed[PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_MODIFIER] &&
    firstModifierCardId !== undefined
  ) {
    return PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_MODIFIER;
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
  clearedRoundOnFirstPlay,
  firstModifierCardId,
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
      currentScore,
      firstModifierCardId
    );

    if (!nextTutorial) {
      return;
    }

    setActiveTutorialId(nextTutorial);
    setRun(true);
  }, [
    activeTutorialId,
    completed,
    currentScore,
    firstModifierCardId,
    preSelectedCardsCount,
    run,
  ]);

  const modifierEffectLabel = useMemo(() => {
    switch (firstModifierCardId) {
      case ModifiersId.SUIT_CLUB_MODIFIER:
        return t("progressiveGame.firstModifier.effects.club");
      case ModifiersId.SUIT_DIAMONDS_MODIFIER:
        return t("progressiveGame.firstModifier.effects.diamonds");
      case ModifiersId.SUIT_HEARTS_MODIFIER:
        return t("progressiveGame.firstModifier.effects.hearts");
      case ModifiersId.SUIT_SPADES_MODIFIER:
        return t("progressiveGame.firstModifier.effects.spades");
      case ModifiersId.NEON_MODIFIER:
        return t("progressiveGame.firstModifier.effects.neon");
      case ModifiersId.WILDCARD_MODIFIER:
        return t("progressiveGame.firstModifier.effects.wildcard");
      default:
        return t("progressiveGame.firstModifier.effects.card");
    }
  }, [firstModifierCardId, t]);

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

    if (activeTutorialId === PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_MODIFIER) {
      return [
        {
          target: ".tutorial-modifiers-step-2",
          disableBeacon: true,
          title: t("progressiveGame.firstModifier.title"),
          content: t("progressiveGame.firstModifier.content"),
        },
        {
          target: ".tutorial-modifiers-step-2",
          disableBeacon: true,
          title: t("progressiveGame.firstModifier.howToUseTitle"),
          content: t("progressiveGame.firstModifier.howToUseContent", {
            effect: modifierEffectLabel,
          }),
        },
      ];
    }

    if (activeTutorialId === PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_SCORE) {
      return [
        {
          target: ".game-tutorial-step-score-panel",
          disableBeacon: true,
          title: t("progressiveGame.firstScore.title"),
          content: t(
            clearedRoundOnFirstPlay
              ? "progressiveGame.firstScore.contentFirstPlayClear"
              : "progressiveGame.firstScore.content",
            {
              score: currentScore,
              targetScore,
            }
          ),
        },
      ];
    }

    return [];
  }, [
    activeTutorialId,
    clearedRoundOnFirstPlay,
    currentScore,
    modifierEffectLabel,
    t,
    targetScore,
  ]);

  const handleCallback = useCallback(
    (data: CallBackProps) => {
      if (
        data.type === "error:target_not_found" &&
        activeTutorialId === PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_MODIFIER
      ) {
        // Modifier cards can mount a frame later due layout/animation timing.
        // Keep it pending so it can retry when the target exists.
        setRun(false);
        setActiveTutorialId(null);
        return;
      }

      if (
        data.status === STATUS.FINISHED ||
        data.status === STATUS.SKIPPED ||
        data.type === "error:target_not_found"
      ) {
        completeActiveTutorial();
      }
    },
    [activeTutorialId, completeActiveTutorial]
  );

  return {
    run,
    steps,
    locale: JOYRIDE_LOCALES,
    handleCallback,
    activeTutorialId,
  };
};

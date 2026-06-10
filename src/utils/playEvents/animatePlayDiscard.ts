import { postLevelXP } from "../../api/postLevelXP";
import { CHANGE_LEVEL_ANIMATION_DURATION_MS } from "../../constants/animationDurations";
import { BOSS_LEVEL } from "../../constants/general";
import { EventTypeEnum } from "../../dojo/typescript/custom";
import { Suits } from "../../enums/suits";
import { Card } from "../../types/Card";
import { CardPlayEvent, PlayEvents } from "../../types/ScoreData";
import { eventTypeToSuit } from "./eventTypeToSuit";
import { resolvePostActionKind } from "./postAction";
import type { PostActionKind } from "./postAction";

// Number of pitch variants available (points_0.mp3 to points_17.mp3)
const PITCH_VARIANTS = 18;
export const GAME_OVER_REDIRECT_DELAY_MS = 3000;
const POST_ACTION_SPECIAL_DURATION_EXTRA_MS = 200;
const POST_ACTION_BULLET_EXTRA_MS = 140;

interface AnimatePlayConfig {
  playEvents: PlayEvents;
  playAnimationDuration: number;
  pitchState?: {
    index: number;
  };
  setPlayIsNeon: (isNeon: boolean) => void;
  setAnimatedCard: (card: any) => void;
  setAnimatedPowerUp: (powerUp: any) => void;
  setLevelUpHand?: (event: PlayEvents["levelUpPlayEvent"]) => void;
  pointsSound: (pitchIndex?: number) => void;
  acumSound: () => void;
  negativeMultiSound: () => void;
  setPoints: (points: number) => void;
  setMulti: (multi: number) => void;
  addPoints: (points: number) => void;
  addMulti: (multi: number) => void;
  changeCardsSuit: (cardIndexes: number[], suit: Suits) => void;
  changeCardsNeon: (cardIndexes: number[]) => void;
  changeCardsRank?: (cardChanges: CardPlayEvent["hand"]) => void;
  setAnimation: (playing: boolean) => void;
  setPreSelectionLocked: (locked: boolean) => void;
  clearPreSelection: () => void;
  refetchPowerUps: () => void;
  preSelectedPowerUps: number[];
  navigate: (path: string) => void;
  setRoundRewards: (rewards: any) => void;
  replaceCards: (cards: Card[]) => void;
  remainingPlays: number;
  setAnimateSecondChanceCard: (animate: boolean) => void;
  setCardTransformationLock: (locked: boolean) => void;
  specialCards: Card[];
  setAnimateSpecialCardDefault: (animateSpecialCardDefault: any) => void;
  addCash: (cash: number) => void;
  setCurrentScore: (score: number) => void;
  resetRage: () => void;
  unPreSelectAllPowerUps: () => void;
  address: string;
  clearRoundSound: () => void;
  clearLevelSound: () => void;
  popSound?: () => void;
  deferRewardsNavigation?: boolean;
  actionContext?: PostActionKind;
  onPostActionAnimationStart?: (
    actionType: PostActionKind,
    pulseDurationMs: number
  ) => void;
}

export const animatePlayDiscard = (config: AnimatePlayConfig): number => {
  const {
    playEvents,
    playAnimationDuration,
    setPlayIsNeon,
    setAnimatedCard,
    setAnimatedPowerUp,
    pointsSound,
    acumSound,
    negativeMultiSound,
    setPoints,
    setMulti,
    changeCardsNeon,
    changeCardsSuit,
    changeCardsRank,
    setAnimation,
    setPreSelectionLocked,
    clearPreSelection,
    refetchPowerUps,
    navigate,
    setRoundRewards,
    replaceCards,
    remainingPlays,
    setAnimateSecondChanceCard,
    setCardTransformationLock,
    specialCards,
    setAnimateSpecialCardDefault,
    addCash,
    setCurrentScore,
    addMulti,
    addPoints,
    resetRage,
    unPreSelectAllPowerUps,
    address,
    clearRoundSound,
    clearLevelSound,
    deferRewardsNavigation,
  } = config;

  if (!playEvents) return 0;
  const levelUpPlayEvent = playEvents.levelUpPlayEvent;

  const sharedPitchState = config.pitchState ?? { index: 0 };
  const getNextPitchIndex = () => {
    const index = Math.min(sharedPitchState.index, PITCH_VARIANTS - 1);
    sharedPitchState.index++;
    return index;
  };

  const groupCardPlayChangeEvents = (events?: CardPlayEvent[]) => {
    if (!events?.length) return [];

    const groups: {
      key: string;
      suit?: Suits;
      isNeon: boolean;
      isRank: boolean;
      handIndexes: number[];
      rankChanges: CardPlayEvent["hand"];
      special_idx?: number;
    }[] = [];
    const groupMap = new Map<string, (typeof groups)[number]>();

    events.forEach((event, eventIndex) => {
      const isNeon = event.eventType === EventTypeEnum.Neon;
      const isRank = event.eventType === EventTypeEnum.Rank;
      const suit = eventTypeToSuit(event.eventType);
      const specialIndexes = Array.from(
        new Set(event.specials.map((special) => special.idx))
      ).sort((a, b) => a - b);
      const special_idx =
        specialIndexes.length === 1 ? specialIndexes[0] : undefined;
      const converterKey = isNeon ? "neon" : isRank ? "rank" : `suit:${suit}`;
      // Group by converter special first so each special animates independently.
      const specialKey =
        specialIndexes.length
          ? `special:${specialIndexes.join("|")}`
          : `special:none:${eventIndex}`;
      const key = `${specialKey}:${converterKey}`;
      const handIndexes = event.hand.map((card) => card.idx);

      let group = groupMap.get(key);
      if (!group) {
        group = {
          key,
          suit,
          isNeon,
          isRank,
          handIndexes: [],
          rankChanges: [],
          special_idx,
        };
        groupMap.set(key, group);
        groups.push(group);
      }

      group.handIndexes.push(...handIndexes);
      if (isRank) {
        group.rankChanges.push(...event.hand);
      }
      if (group.special_idx === undefined && special_idx !== undefined) {
        group.special_idx = special_idx;
      }
    });

    groups.forEach((group) => {
      group.handIndexes = Array.from(new Set(group.handIndexes));
      if (group.isRank) {
        const latestRankByIndex = new Map<number, number>();
        group.rankChanges.forEach((rankChange) => {
          latestRankByIndex.set(rankChange.idx, rankChange.quantity);
        });
        group.rankChanges = Array.from(latestRankByIndex.entries()).map(
          ([idx, quantity]) => ({ idx, quantity })
        );
      }
    });

    return groups;
  };

  // Calculate durations more concisely
  const calculateDuration = (
    events?: any[],
    baseDuration = playAnimationDuration,
    multiplier = 1
  ) => (events?.length ?? 0) * baseDuration * multiplier;

  const cardPlayChangeGroups = groupCardPlayChangeEvents(
    playEvents.cardPlayChangeEvents
  );

  const durations = {
    neonPlay: playEvents.neonPlayEvent ? playAnimationDuration : 0,
    powerUps: calculateDuration(playEvents.powerUpEvents),
    cardPlayChange: calculateDuration(cardPlayChangeGroups),
    cardPlayEvents: calculateDuration(playEvents.cardPlayEvents),
    accumDuration: playEvents.acumulativeEvents
      ? playEvents.acumulativeEvents.length * 500
      : 0,
  };

  const playDuration = 500;
  const isRoundTransition = Boolean(
    playEvents.levelPassed && playEvents.detailEarned
  );
  const shouldDelayGameEndForLevelUp =
    Boolean(levelUpPlayEvent) && isRoundTransition;
  const levelUpGameEndDelay = shouldDelayGameEndForLevelUp
    ? CHANGE_LEVEL_ANIMATION_DURATION_MS
    : 0;
  const isGameOver = Boolean(playEvents.gameOver);
  const postActionDuration = playEvents.postActionEvent
    ? playAnimationDuration + POST_ACTION_SPECIAL_DURATION_EXTRA_MS
    : 0;
  const postActionKind = resolvePostActionKind(
    playEvents.postActionEvent?.action_type,
    config.actionContext
  );
  const postActionSpecialCard = playEvents.postActionEvent
    ? specialCards.find(
        (card) => card.card_id === playEvents.postActionEvent?.effect_card_id
      )
    : undefined;
  const shouldKeepCardsOutOfHand = isRoundTransition || isGameOver;

  const ALL_CARDS_DURATION = Object.values(durations).reduce(
    (a, b) => a + b,
    500
  );

  const handleNeonPlay = () => {
    if (!playEvents.neonPlayEvent) return;

    setPlayIsNeon(true);
    setAnimatedCard({
      animationIndex: -1,
      suit: 5,
      idx: playEvents.neonPlayEvent.neon_cards_idx,
    });

    pointsSound(getNextPitchIndex());
    playEvents.neonPlayEvent.points &&
      setPoints(playEvents.neonPlayEvent.points);
    pointsSound(getNextPitchIndex());
    playEvents.neonPlayEvent.multi && setMulti(playEvents.neonPlayEvent.multi);
  };

  const handleCardPlayChangeEvents = () => {
    return new Promise<void>((resolve) => {
      cardPlayChangeGroups.forEach((group, index) => {
        setTimeout(() => {
          pointsSound(getNextPitchIndex());

          setCardTransformationLock(true);

          if (group.isNeon) {
            setAnimatedCard({
              isNeon: true,
              special_idx: group.special_idx,
              idx: group.handIndexes,
              animationIndex: 200 + index,
            });
            changeCardsNeon(group.handIndexes);
          } else if (group.isRank) {
            setAnimatedCard({
              suit: 5,
              special_idx: group.special_idx,
              idx: group.handIndexes,
              animationIndex: 200 + index,
            });
            changeCardsRank?.(group.rankChanges);
          } else {
            setAnimatedCard({
              suit: group.suit,
              special_idx: group.special_idx,
              idx: group.handIndexes,
              animationIndex: 200 + index,
            });
            group.suit && changeCardsSuit(group.handIndexes, group.suit);
          }
        }, playAnimationDuration * index);
      });
    });
  };

  const handleCardPlayEvents = () => {
    playEvents.cardPlayEvents?.forEach((event, index) => {
      const isPoints = event.eventType === EventTypeEnum.Point;
      const isMulti = event.eventType === EventTypeEnum.Multi;
      const isCash = event.eventType === EventTypeEnum.Cash;
      const special_idx = event.specials[0]?.idx;
      const quantity = event.specials[0]?.quantity ?? 0;

      if (event.hand.length > 0) {
        setTimeout(() => {
          event.hand.forEach((card, innerIndex) => {
            const { idx, quantity } = card;
            setTimeout(() => {
              if (isPoints) {
                pointsSound(getNextPitchIndex());
                setAnimatedCard({
                  special_idx,
                  idx: [idx],
                  points: quantity,
                  animationIndex: 400 + index,
                });
                addPoints(quantity);
              } else if (isMulti) {
                quantity > 0 ? pointsSound(getNextPitchIndex()) : negativeMultiSound();
                setAnimatedCard({
                  special_idx,
                  idx: [idx],
                  multi: quantity,
                  animationIndex: 400 + index,
                });
                addMulti(quantity);
              } else if (isCash) {
                pointsSound(getNextPitchIndex());
                addCash(quantity);
                setAnimatedCard({
                  special_idx,
                  idx: [idx],
                  cash: quantity,
                  animationIndex: 400 + index,
                });
              }
            }, playAnimationDuration * innerIndex);
          });
        }, playAnimationDuration * index);
      } else {
        const highlightColor = isMulti
          ? "neonPink"
          : isCash
            ? "DIAMONDS"
            : "neonGreen";

        setTimeout(() => {
          if (isPoints) {
            pointsSound(getNextPitchIndex());
            setAnimatedCard({
              special_idx,
              idx: [],
              highlightOnly: true,
              highlightColor,
              animationIndex: 300 + index,
            });
            addPoints(quantity);
          } else if (isMulti) {
            pointsSound(getNextPitchIndex());
            setAnimatedCard({
              special_idx,
              idx: [],
              highlightOnly: true,
              highlightColor,
              animationIndex: 300 + index,
            });
            addMulti(quantity);
          } else if (isCash) {
            pointsSound(getNextPitchIndex());
            addCash(quantity);
            setAnimatedCard({
              special_idx,
              idx: [],
              highlightOnly: true,
              highlightColor,
              animationIndex: 300 + index,
            });
          }
        }, playAnimationDuration * index);
      }
    });
  };

  const handlePowerUps = () => {
    playEvents.powerUpEvents?.forEach((event, index) => {
      setTimeout(() => {
        const { idx, points, multi } = event;

        setAnimatedPowerUp({
          idx,
          points,
          multi,
          animationIndex: 500 + index,
        });

        setAnimatedCard({
          points,
          multi,
          animationIndex: 600 + index,
        });

        if (points) {
          pointsSound(getNextPitchIndex());
          addPoints(points);
        }

        if (multi) {
          pointsSound(getNextPitchIndex());
          addMulti(multi);
        }
      }, playAnimationDuration * index);
    });
  };

  const handleAccumulativeCards = () => {
    playEvents.acumulativeEvents?.forEach((event, index) => {
      const isPoints = event.eventType === EventTypeEnum.AcumPoint;
      const isMulti = event.eventType === EventTypeEnum.AcumMulti;
      const special_idx = event.specials[0]?.idx;
      const quantity = event.specials[0]?.quantity ?? 0;

      setTimeout(() => {
        if (isPoints) {
          acumSound();
          setAnimatedCard({
            special_idx,
            idx: [],
            points: quantity,
            isAccumulative: true,
            animationIndex: 700 + index,
          });
          addPoints(quantity);
        } else if (isMulti) {
          acumSound();
          setAnimatedCard({
            special_idx,
            idx: [],
            multi: quantity,
            isAccumulative: true,
            animationIndex: 800 + index,
          });
          addMulti(quantity);
        }
      }, playAnimationDuration * index);
    });
  };

  const handleGameEnd = () => {
    if (playEvents.cardActivateEvent) {
      const specialCardInHand = specialCards.find(
        (card) => card.card_id == playEvents.cardActivateEvent?.special_id
      );
      if (specialCardInHand) {
        if (specialCardInHand?.card_id == 10023) {
          setAnimateSecondChanceCard(true);
        } else {
          setAnimateSpecialCardDefault({
            specialId: specialCardInHand.card_id,
            bgPath: `Cards/3d/${specialCardInHand.card_id}-l0.png`,
            animatedImgPath: `Cards/3d/${specialCardInHand.card_id}-l1.png`,
          });
        }
      }
    } else if (playEvents.gameOver) {
      setTimeout(() => {
        navigate(`/loose`);
      }, GAME_OVER_REDIRECT_DELAY_MS);
    } else if (playEvents.levelPassed && playEvents.detailEarned) {
      resetRage();
      setTimeout(() => {
        setRoundRewards({
          ...playEvents.detailEarned!,
          roundNumber: playEvents.levelPassed?.round,
          level_passed: playEvents.levelPassed?.level_passed
            ? playEvents.levelPassed?.level
            : 0,
        });
        playEvents.levelPassed?.level_passed
          ? clearLevelSound()
          : clearRoundSound();
        const destinationPath =
          playEvents.levelPassed?.level_passed === BOSS_LEVEL
            ? "/win"
            : "/rewards";

        if (!(deferRewardsNavigation && destinationPath === "/rewards")) {
          navigate(destinationPath);
        }
      }, 1000);
      playEvents.levelPassed?.level_passed &&
        playEvents.levelPassed?.level &&
        postLevelXP({ address, level: playEvents.levelPassed?.level }).catch(
          (e) => console.error("Error posting level XP", e)
        );
      setPreSelectionLocked(true);
    } else {
      playEvents.cards && replaceCards(playEvents.cards);
      setRoundRewards(undefined);
    }
  };

  const handlePostActionEvent = () => {
    if (!playEvents.postActionEvent) {
      return;
    }

    config.popSound?.();

    if (postActionSpecialCard) {
      setAnimatedCard({
        special_idx: postActionSpecialCard.idx,
        highlightOnly: true,
        highlightColor: postActionKind === "discard" ? "blue" : "violet",
        animationIndex: 900,
      });
    }

    if (postActionKind) {
      config.onPostActionAnimationStart?.(
        postActionKind,
        postActionDuration + POST_ACTION_BULLET_EXTRA_MS
      );
    }
  };

  // Main execution flow
  setPreSelectionLocked(true);

  // Chained timeouts with clear, sequential execution
  handleCardPlayChangeEvents().then(() => {
    setTimeout(() => {
      handleNeonPlay();
    }, durations.cardPlayChange);
  });

  setTimeout(
    () => handleCardPlayEvents(),
    durations.neonPlay + durations.cardPlayChange
  );

  setTimeout(
    () => {
      handlePowerUps();
    },
    durations.neonPlay + durations.cardPlayChange + durations.cardPlayEvents
  );

  setTimeout(() => {
    setAnimation(true);
    setAnimatedCard(undefined);
  }, ALL_CARDS_DURATION - durations.accumDuration);

  setTimeout(
    () => handleAccumulativeCards(),
    ALL_CARDS_DURATION -
      durations.accumDuration +
      (durations.accumDuration > 0 ? playDuration : 0)
  );

  const finalizeAnimation = () => {
    // Reset state
    setAnimatedPowerUp(undefined);
    unPreSelectAllPowerUps();
    refetchPowerUps();

    setAnimation(false);
    if (!shouldKeepCardsOutOfHand) {
      clearPreSelection();
      remainingPlays > 0 && setPreSelectionLocked(false);
    }
    setPlayIsNeon(false);

    setCurrentScore(playEvents.score);
    if (playEvents.levelPassed && playEvents.detailEarned) {
      addCash(playEvents.detailEarned.total);
    }

    if (levelUpPlayEvent && config.setLevelUpHand) {
      config.setLevelUpHand(levelUpPlayEvent);
    }

    const executeGameEnd = () => {
      handleGameEnd();
      setCardTransformationLock(false);
    };

    if (levelUpGameEndDelay > 0) {
      setTimeout(() => {
        executeGameEnd();
      }, levelUpGameEndDelay);
      return;
    }

    executeGameEnd();
  };

  setTimeout(() => {
    handlePostActionEvent();

    if (postActionDuration > 0) {
      setTimeout(() => {
        setAnimatedCard(undefined);
        finalizeAnimation();
      }, postActionDuration);
      return;
    }

    finalizeAnimation();
  }, ALL_CARDS_DURATION + playDuration);

  return (
    ALL_CARDS_DURATION +
    playDuration +
    postActionDuration +
    levelUpGameEndDelay
  );
};

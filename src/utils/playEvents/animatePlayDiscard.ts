import { postLevelXP } from "../../api/postLevelXP";
import { BOSS_LEVEL } from "../../constants/general";
import { EventTypeEnum } from "../../dojo/typescript/custom";
import { Suits } from "../../enums/suits";
import { Card } from "../../types/Card";
import { PlayEvents } from "../../types/ScoreData";
import { eventTypeToSuit } from "./eventTypeToSuit";

// Number of pitch variants available (points_0.mp3 to points_17.mp3)
const PITCH_VARIANTS = 18;

interface AnimatePlayConfig {
  playEvents: PlayEvents;
  playAnimationDuration: number;
  setPlayIsNeon: (isNeon: boolean) => void;
  setAnimatedCard: (card: any) => void;
  setAnimatedPowerUp: (powerUp: any) => void;
  pointsSound: (pitchIndex?: number) => void;
  acumSound: () => void;
  negativeMultiSound: () => void;
  setPoints: (points: number) => void;
  setMulti: (multi: number) => void;
  addPoints: (points: number) => void;
  addMulti: (multi: number) => void;
  changeCardsSuit: (cardIndexes: number[], suit: Suits) => void;
  changeCardsNeon: (cardIndexes: number[]) => void;
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
}

export const animatePlayDiscard = (config: AnimatePlayConfig) => {
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
  } = config;

  if (!playEvents) return;

  // Pitch counter for incremental pitch effect on scoring sounds
  let pitchIndex = 0;
  const getNextPitchIndex = () => {
    const index = Math.min(pitchIndex, PITCH_VARIANTS - 1);
    pitchIndex++;
    return index;
  };

  // Calculate durations more concisely
  const calculateDuration = (
    events?: any[],
    baseDuration = playAnimationDuration,
    multiplier = 1
  ) => (events?.length ?? 0) * baseDuration * multiplier;

  const durations = {
    neonPlay: playEvents.neonPlayEvent ? playAnimationDuration : 0,
    powerUps: calculateDuration(playEvents.powerUpEvents),
    cardPlayChange: calculateDuration(playEvents.cardPlayChangeEvents),
    cardPlayEvents: calculateDuration(playEvents.cardPlayEvents),
    accumDuration: playEvents.acumulativeEvents
      ? playEvents.acumulativeEvents.length * 500
      : 0,
  };

  const playDuration = 500;

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
      playEvents.cardPlayChangeEvents?.forEach((event, index) => {
        setTimeout(() => {
          pointsSound(getNextPitchIndex());

          const suit = eventTypeToSuit(event.eventType);
          const handIndexes = event.hand.map((card) => card.idx);
          const special_idx = event.specials[0]?.idx;
          const isNeon = event.eventType === EventTypeEnum.Neon;

          setCardTransformationLock(true);

          if (isNeon) {
            setAnimatedCard({
              isNeon: true,
              special_idx,
              idx: handIndexes,
              animationIndex: 200 + index,
            });
            changeCardsNeon(handIndexes);
          } else {
            setAnimatedCard({
              suit,
              special_idx,
              idx: handIndexes,
              animationIndex: 200 + index,
            });
            suit && changeCardsSuit(handIndexes, suit);
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
        const quantity = event.specials[0]?.quantity;

        setTimeout(() => {
          if (isPoints) {
            pointsSound(getNextPitchIndex());
            setAnimatedCard({
              special_idx,
              idx: [],
              points: quantity,
              animationIndex: 300 + index,
            });
            addPoints(quantity);
          } else if (isMulti) {
            pointsSound(getNextPitchIndex());
            setAnimatedCard({
              special_idx,
              idx: [],
              multi: quantity,
              animationIndex: 300 + index,
            });
            addMulti(quantity);
          } else if (isCash) {
            pointsSound(getNextPitchIndex());
            addCash(quantity);
            setAnimatedCard({
              special_idx,
              idx: [],
              cash: quantity,
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
      }, 1000);
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
        navigate(
          playEvents.levelPassed?.level_passed === BOSS_LEVEL
            ? "/win"
            : "/rewards"
        );
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

  setTimeout(() => {
    // Reset state
    setAnimatedPowerUp(undefined);
    unPreSelectAllPowerUps();
    refetchPowerUps();

    setAnimation(false);
    clearPreSelection();
    remainingPlays > 0 && setPreSelectionLocked(false);
    setPlayIsNeon(false);

    setCurrentScore(playEvents.score);
    if (playEvents.levelPassed && playEvents.detailEarned) {
      addCash(playEvents.detailEarned.total);
    }

    handleGameEnd();
    setCardTransformationLock(false);
  }, ALL_CARDS_DURATION + playDuration);
};

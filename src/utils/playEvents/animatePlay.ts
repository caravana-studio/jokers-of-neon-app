import { EventTypeEnum } from "../../dojo/typescript/models.gen";
import { Suits } from "../../enums/suits";
import { Card } from "../../types/Card";
import { PlayEvents } from "../../types/ScoreData";
import { changeCardNeon } from "../cardTransformation/changeCardNeon";
import { changeCardSuit } from "../cardTransformation/changeCardSuit";
import { handleAchievementPush } from "../pushAchievements";
import { eventTypeToSuit } from "./eventTypeToSuit";

interface AnimatePlayConfig {
  playEvents: PlayEvents;
  playAnimationDuration: number;
  setPlayIsNeon: (isNeon: boolean) => void;
  setAnimatedCard: (card: any) => void;
  setAnimatedPowerUp: (powerUp: any) => void;
  pointsSound: () => void;
  multiSound: () => void;
  negativeMultiSound: () => void;
  cashSound: () => void;
  setPoints: (points: number | ((prev: number) => number)) => void;
  setMulti: (multi: number | ((prev: number) => number)) => void;
  setHand: (hand: Card[] | ((prev: Card[]) => Card[])) => void;
  setPlayAnimation: (playing: boolean) => void;
  setPreSelectionLocked: (locked: boolean) => void;
  setLockedScore: (score: number | undefined) => void;
  setLockedPlayerScore: (playerScore: number | undefined) => void;
  setLockedSpecialCards: (cards: Card[]) => void;
  setLockedCash: (cash: number | undefined) => void;
  clearPreSelection: () => void;
  removePowerUp: (idx: number) => void;
  preselectedPowerUps: number[];
  navigate: (path: string) => void;
  gameId: number;
  setLockRedirection: (locked: boolean) => void;
  setRoundRewards: (rewards: any) => void;
  replaceCards: (cards: Card[]) => void;
  handsLeft: number;
  setAnimateSecondChanceCard: (animate: boolean) => void;
  setCardTransformationLock: (locked: boolean) => void;
  setIsRageRound: (isRageRound: boolean) => void;
}

export const animatePlay = (config: AnimatePlayConfig) => {
  const {
    playEvents,
    playAnimationDuration,
    setPlayIsNeon,
    setAnimatedCard,
    setAnimatedPowerUp,
    pointsSound,
    multiSound,
    negativeMultiSound,
    cashSound,
    setPoints,
    setMulti,
    setHand,
    setPlayAnimation,
    setPreSelectionLocked,
    setLockedScore,
    setLockedPlayerScore,
    setLockedSpecialCards,
    setLockedCash,
    clearPreSelection,
    removePowerUp,
    preselectedPowerUps,
    navigate,
    gameId,
    setLockRedirection,
    setRoundRewards,
    replaceCards,
    handsLeft,
    setAnimateSecondChanceCard,
    setCardTransformationLock,
    setIsRageRound,
  } = config;

  if (!playEvents) return;

  console.log(playEvents);

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
    cardPlayScore: calculateDuration(
      playEvents.cardPlayScoreEvents?.map((item) => item.hand).flat() ?? []
    ),
    specialCardPlayScore: calculateDuration(
      playEvents.specialCardPlayScoreEvents
    ),
  };

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

    pointsSound();
    playEvents.neonPlayEvent.points &&
      setPoints(playEvents.neonPlayEvent.points);
    multiSound();
    playEvents.neonPlayEvent.multi && setMulti(playEvents.neonPlayEvent.multi);
  };

  const handleCardPlayChangeEvents = () => {
    return new Promise<void>((resolve) => {
      playEvents.cardPlayChangeEvents?.forEach((event, index) => {
        setTimeout(() => {
          pointsSound();

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
            setHand((prev) => {
              const updatedHand = prev?.map((card) =>
                handIndexes.includes(card.idx)
                  ? {
                      ...card,
                      card_id: changeCardNeon(card.card_id!),
                      img: `${changeCardNeon(card.card_id!)}.png`,
                      isNeon: true,
                    }
                  : card
              );
              resolve();
              return updatedHand;
            });
          } else {
            setAnimatedCard({
              suit,
              special_idx,
              idx: handIndexes,
              animationIndex: 200 + index,
            });
            suit &&
              setHand((prev) => {
                const updatedHand = prev?.map((card) =>
                  handIndexes.includes(card.idx) && card.suit !== Suits.WILDCARD
                    ? {
                        ...card,
                        card_id: changeCardSuit(card.card_id!, suit),
                        img: `${changeCardSuit(card.card_id!, suit)}.png`,
                        suit,
                      }
                    : card
                );
                resolve();
                return updatedHand;
              });
          }
        }, playAnimationDuration * index);
      });
    });
  };

  const handleSpecialCardPlayScoreEvents = () => {
    playEvents.specialCardPlayScoreEvents?.forEach((event, index) => {
      const isPoints = event.eventType === EventTypeEnum.Point;
      const isMulti = event.eventType === EventTypeEnum.Multi;
      const isCash = event.eventType === EventTypeEnum.Cash;
      const special_idx = event.specials[0]?.idx;
      const quantity = event.specials[0]?.quantity;

      setTimeout(() => {
        if (isPoints) {
          pointsSound();
          setAnimatedCard({
            special_idx,
            idx: [],
            points: quantity,
            animationIndex: 300 + index,
          });
          setPoints((prev) => prev + quantity);
        } else if (isMulti) {
          multiSound();
          setAnimatedCard({
            special_idx,
            idx: [],
            multi: quantity,
            animationIndex: 300 + index,
          });
          setMulti((prev) => prev + quantity);
        } else if (isCash) {
          cashSound();
          setAnimatedCard({
            special_idx,
            idx: [],
            cash: quantity,
            animationIndex: 300 + index,
          });
        }
      }, playAnimationDuration * index);
    });
  };

  const handleCardPlayScoreEvents = () => {
    playEvents.cardPlayScoreEvents?.forEach((event, index) => {
      const isPoints = event.eventType === EventTypeEnum.Point;
      const isMulti = event.eventType === EventTypeEnum.Multi;
      const isCash = event.eventType === EventTypeEnum.Cash;
      const special_idx = event.specials[0]?.idx;

      setTimeout(() => {
        event.hand.forEach((card, innerIndex) => {
          const { idx, quantity } = card;
          setTimeout(() => {
            if (isPoints) {
              pointsSound();
              setAnimatedCard({
                special_idx,
                idx: [idx],
                points: quantity,
                animationIndex: 400 + index,
              });
              setPoints((prev) => prev + quantity);
            } else if (isMulti) {
              quantity > 0 ? multiSound() : negativeMultiSound();
              setAnimatedCard({
                special_idx,
                idx: [idx],
                multi: quantity,
                animationIndex: 400 + index,
              });
              setMulti((prev) => prev + quantity);
            } else if (isCash) {
              cashSound();
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
          pointsSound();
          setPoints((prev) => prev + points);
        }

        if (multi) {
          multiSound();
          setMulti((prev) => prev + multi);
        }
      }, playAnimationDuration * index);
    });
  };

  const handleGameEnd = async () => {
    if (playEvents.achievementCompleted) {
      await handleAchievementPush(playEvents.achievementCompleted);
    }

    if (playEvents.gameOver) {
      setTimeout(() => {
        navigate(`/gameover/${gameId}`);
        setLockRedirection(false);
      }, 1000);
    } else if (playEvents.levelPassed && playEvents.detailEarned) {
      const { level } = playEvents.levelPassed;
      setTimeout(() => {
        setRoundRewards({
          ...playEvents.detailEarned!,
          level: level,
        });
        setIsRageRound(false);
        navigate("/rewards");
      }, 1000);
      setPreSelectionLocked(true);
    } else if (playEvents.secondChanceEvent) {
      setAnimateSecondChanceCard(true);
    } else {
      setLockedCash(undefined);
      playEvents.cards && replaceCards(playEvents.cards);
      setRoundRewards(undefined);
      setLockRedirection(false);
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
    () => handleSpecialCardPlayScoreEvents(),
    durations.neonPlay + durations.cardPlayChange
  );

  setTimeout(
    () => {
      handleCardPlayScoreEvents();
    },
    durations.neonPlay +
      durations.cardPlayChange +
      durations.specialCardPlayScore
  );

  setTimeout(
    () => {
      handlePowerUps();
    },
    durations.neonPlay +
      durations.cardPlayChange +
      durations.specialCardPlayScore +
      durations.cardPlayScore
  );

  setTimeout(() => {
    setPlayAnimation(true);
  }, ALL_CARDS_DURATION);

  setTimeout(() => {
    // Reset state
    setAnimatedCard(undefined);
    setAnimatedPowerUp(undefined);
    setLockedScore(undefined);
    setLockedPlayerScore(undefined);
    setPlayAnimation(false);
    preselectedPowerUps.forEach((idx) => removePowerUp(idx));
    clearPreSelection();
    handsLeft > 0 && setPreSelectionLocked(false);
    setPlayIsNeon(false);
    setLockedSpecialCards([]);

    handleGameEnd();
    setCardTransformationLock(false);
  }, ALL_CARDS_DURATION + 500);
};

import { EventTypeEnum } from "../../dojo/typescript/custom";
import { Suits } from "../../enums/suits";
import { Card } from "../../types/Card";
import { PlayEvents } from "../../types/ScoreData";
import { eventTypeToSuit } from "./eventTypeToSuit";

interface AnimatePlayConfig {
  playEvents: PlayEvents;
  playAnimationDuration: number;
  setPlayIsNeon: (isNeon: boolean) => void;
  setAnimatedCard: (card: any) => void;
  setAnimatedPowerUp: (powerUp: any) => void;
  pointsSound: () => void;
  multiSound: () => void;
  acumSound: () => void;
  negativeMultiSound: () => void;
  cashSound: () => void;
  setPoints: (points: number) => void;
  setMulti: (multi: number) => void;
  addPoints: (points: number) => void;
  addMulti: (multi: number) => void;
  changeCardsSuit: (cardIndexes: number[], suit: Suits) => void;
  changeCardsNeon: (cardIndexes: number[]) => void;
  setPlayAnimation: (playing: boolean) => void;
  setPreSelectionLocked: (locked: boolean) => void;
  clearPreSelection: () => void;
  refetchPowerUps: () => void;
  preSelectedPowerUps: number[];
  navigate: (path: string) => void;
  gameId: number;
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
    acumSound,
    negativeMultiSound,
    cashSound,
    setPoints,
    setMulti,
    changeCardsNeon,
    changeCardsSuit,
    setPlayAnimation,
    setPreSelectionLocked,
    clearPreSelection,
    refetchPowerUps,
    navigate,
    gameId,
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
  } = config;

  if (!playEvents) return;

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
    accumDuration: playEvents.acumulativeEvents? playEvents.acumulativeEvents.length * 500 : 0,
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
            changeCardsNeon(handIndexes);
          } else {
            setAnimatedCard({
              suit,
              special_idx,
              idx: handIndexes,
              animationIndex: 200 + index,
            });
            suit &&
              changeCardsSuit(handIndexes, suit);
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
          addPoints(quantity);
        } else if (isMulti) {
          multiSound();
          setAnimatedCard({
            special_idx,
            idx: [],
            multi: quantity,
            animationIndex: 300 + index,
          });
          addMulti(quantity);
        } else if (isCash) {
          cashSound();
          addCash(quantity);
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
              addPoints(quantity);
            } else if (isMulti) {
              quantity > 0 ? multiSound() : negativeMultiSound();
              setAnimatedCard({
                special_idx,
                idx: [idx],
                multi: quantity,
                animationIndex: 400 + index,
              });
              addMulti(quantity);
            } else if (isCash) {
              cashSound();
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
          addPoints(points);
        }

        if (multi) {
          multiSound();
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
      const specialCardInHand =
        specialCards.find(card =>  card.card_id == playEvents.cardActivateEvent?.special_id);
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
        navigate(`/gameover/${gameId}`);
      }, 1000);
    } else if (playEvents.levelPassed && playEvents.detailEarned) {
      resetRage();
      setTimeout(() => {
        setRoundRewards({
          ...playEvents.detailEarned!,
          roundNumber: playEvents.levelPassed?.round,
        });
        navigate("/rewards");
      }, 1000);
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
    setAnimatedCard(undefined);
  }, ALL_CARDS_DURATION - durations.accumDuration);

  setTimeout(
    () => handleAccumulativeCards(),
    ALL_CARDS_DURATION - durations.accumDuration + (durations.accumDuration > 0 ? playDuration : 0)
  );

  setTimeout(() => {
    // Reset state
    setAnimatedPowerUp(undefined);
    unPreSelectAllPowerUps();
    refetchPowerUps();

    setPlayAnimation(false);
    clearPreSelection();
    remainingPlays > 0 && setPreSelectionLocked(false);
    setPlayIsNeon(false);

    setCurrentScore(playEvents.score);

    handleGameEnd();
    setCardTransformationLock(false);

  }, ALL_CARDS_DURATION + playDuration);

};

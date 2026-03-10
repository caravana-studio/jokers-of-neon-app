import { EventTypeEnum } from "../../dojo/typescript/custom";
import { Suits } from "../../enums/suits";
import { CardPlayEvent, PowerUpScore } from "../../types/ScoreData";
import { eventTypeToSuit } from "./eventTypeToSuit";

const PITCH_VARIANTS = 18;

interface AnimateOptimisticCardPlayConfig {
  changeEvents?: CardPlayEvent[];
  events: CardPlayEvent[];
  powerUpEvents?: PowerUpScore[];
  playAnimationDuration: number;
  pitchState?: {
    index: number;
  };
  setAnimatedCard: (card: any) => void;
  setAnimatedPowerUp?: (powerUp: any) => void;
  pointsSound: (pitchIndex?: number) => void;
  negativeMultiSound: () => void;
  addPoints: (points: number) => void;
  addMulti: (multi: number) => void;
  changeCardsSuit?: (cardIndexes: number[], suit: Suits) => void;
  changeCardsNeon?: (cardIndexes: number[]) => void;
  changeCardsRank?: (cardChanges: CardPlayEvent["hand"]) => void;
  setCardTransformationLock?: (locked: boolean) => void;
}

export interface OptimisticAnimationController {
  done: Promise<void>;
  cancel: () => void;
  totalDuration: number;
}

export const animateOptimisticCardPlay = ({
  changeEvents = [],
  events,
  powerUpEvents = [],
  playAnimationDuration,
  pitchState,
  setAnimatedCard,
  setAnimatedPowerUp,
  pointsSound,
  negativeMultiSound,
  addPoints,
  addMulti,
  changeCardsSuit,
  changeCardsNeon,
  changeCardsRank,
  setCardTransformationLock,
}: AnimateOptimisticCardPlayConfig): OptimisticAnimationController => {
  const totalEventsLength = changeEvents.length + events.length + powerUpEvents.length;

  if (!totalEventsLength) {
    return {
      done: Promise.resolve(),
      cancel: () => undefined,
      totalDuration: 0,
    };
  }

  const timeouts = new Set<ReturnType<typeof setTimeout>>();
  // Keep the same spacing contract as resolved play animations:
  // each event consumes one animation slot.
  const totalDuration = Math.max(0, totalEventsLength * playAnimationDuration);
  let isCompleted = false;
  let resolveDone: () => void = () => undefined;

  const sharedPitchState = pitchState ?? { index: 0 };
  const getNextPitchIndex = () => {
    const current = Math.min(sharedPitchState.index, PITCH_VARIANTS - 1);
    sharedPitchState.index += 1;
    return current;
  };

  const done = new Promise<void>((resolve) => {
    resolveDone = resolve;
  });

  const complete = (clearAnimatedState: boolean) => {
    if (isCompleted) {
      return;
    }

    isCompleted = true;
    timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    timeouts.clear();
    setCardTransformationLock?.(false);
    if (clearAnimatedState) {
      setAnimatedCard(undefined);
      setAnimatedPowerUp?.(undefined);
    }
    resolveDone();
  };

  changeEvents.forEach((event, index) => {
    const timeoutId = setTimeout(() => {
      if (isCompleted) {
        return;
      }

      const handIndexes = event.hand.map((handEvent) => handEvent.idx);
      if (handIndexes.length === 0) {
        return;
      }

      const specialIndexes = Array.from(
        new Set(event.specials.map((special) => special.idx))
      ).sort((a, b) => a - b);
      const special_idx =
        specialIndexes.length === 1 ? specialIndexes[0] : undefined;

      const isNeon = event.eventType === EventTypeEnum.Neon;
      const isRank = event.eventType === EventTypeEnum.Rank;
      const suit = eventTypeToSuit(event.eventType);

      if (!isNeon && !isRank && suit === undefined) {
        return;
      }

      pointsSound(getNextPitchIndex());
      setCardTransformationLock?.(true);

      if (isNeon) {
        setAnimatedCard({
          isNeon: true,
          special_idx,
          idx: handIndexes,
          animationIndex: 200 + index,
        });
        changeCardsNeon?.(handIndexes);
      } else if (isRank) {
        setAnimatedCard({
          suit: 5,
          special_idx,
          idx: handIndexes,
          animationIndex: 200 + index,
        });
        changeCardsRank?.(event.hand);
      } else {
        setAnimatedCard({
          suit,
          special_idx,
          idx: handIndexes,
          animationIndex: 200 + index,
        });
        if (suit !== undefined) {
          changeCardsSuit?.(handIndexes, suit);
        }
      }
    }, playAnimationDuration * index);

    timeouts.add(timeoutId);
  });

  events.forEach((event, index) => {
    const timeoutId = setTimeout(() => {
      if (isCompleted) {
        return;
      }

      const cardEvent = event.hand[0];
      if (!cardEvent) {
        return;
      }

      const { idx, quantity } = cardEvent;

      if (event.eventType === EventTypeEnum.Point) {
        pointsSound(getNextPitchIndex());
        setAnimatedCard({
          idx: [idx],
          points: quantity,
          animationIndex: 900 + index,
        });
        addPoints(quantity);
      } else if (event.eventType === EventTypeEnum.Multi) {
        if (quantity > 0) {
          pointsSound(getNextPitchIndex());
        } else {
          negativeMultiSound();
        }

        setAnimatedCard({
          idx: [idx],
          multi: quantity,
          animationIndex: 1000 + index,
        });
        addMulti(quantity);
      }
    }, playAnimationDuration * (changeEvents.length + index));

    timeouts.add(timeoutId);
  });

  powerUpEvents.forEach((event, index) => {
    const timeoutId = setTimeout(() => {
      if (isCompleted) {
        return;
      }

      const { idx, points, multi } = event;

      setAnimatedPowerUp?.({
        idx,
        points,
        multi,
        animationIndex: 1200 + index,
      });

      setAnimatedCard({
        points,
        multi,
        animationIndex: 1300 + index,
      });

      if (points) {
        pointsSound(getNextPitchIndex());
        addPoints(points);
      }

      if (multi) {
        pointsSound(getNextPitchIndex());
        addMulti(multi);
      }
    }, (changeEvents.length + events.length + index) * playAnimationDuration);

    timeouts.add(timeoutId);
  });

  const completionTimeout = setTimeout(() => {
    // Do not clear here to avoid a blank frame between optimistic and resolved queues.
    complete(false);
  }, totalDuration);
  timeouts.add(completionTimeout);

  return {
    done,
    totalDuration,
    cancel: () => complete(true),
  };
};

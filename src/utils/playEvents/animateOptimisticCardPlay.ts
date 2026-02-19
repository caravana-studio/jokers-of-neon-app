import { EventTypeEnum } from "../../dojo/typescript/custom";
import { CardPlayEvent, PowerUpScore } from "../../types/ScoreData";

const PITCH_VARIANTS = 18;

interface AnimateOptimisticCardPlayConfig {
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
}

export interface OptimisticAnimationController {
  done: Promise<void>;
  cancel: () => void;
  totalDuration: number;
}

export const animateOptimisticCardPlay = ({
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
}: AnimateOptimisticCardPlayConfig): OptimisticAnimationController => {
  const totalEventsLength = events.length + powerUpEvents.length;

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
    if (clearAnimatedState) {
      setAnimatedCard(undefined);
      setAnimatedPowerUp?.(undefined);
    }
    resolveDone();
  };

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
    }, playAnimationDuration * index);

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
    }, (events.length + index) * playAnimationDuration);

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

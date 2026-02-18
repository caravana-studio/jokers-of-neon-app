import { EventTypeEnum } from "../../dojo/typescript/custom";
import { CardPlayEvent, PlayEvents, PowerUpScore } from "../../types/ScoreData";

const getOptimisticDedupKey = (event: CardPlayEvent): string | undefined => {
  if (
    event.hand.length !== 1 ||
    event.specials.length > 0 ||
    (event.eventType !== EventTypeEnum.Point &&
      event.eventType !== EventTypeEnum.Multi)
  ) {
    return undefined;
  }

  const handItem = event.hand[0];
  return `${event.eventType}:${handItem.idx}:${handItem.quantity}`;
};

export const filterOptimisticEventsFromPlayEvents = (
  playEvents: PlayEvents,
  optimisticCardPlayEvents: CardPlayEvent[],
  optimisticPowerUpEvents: PowerUpScore[] = []
): PlayEvents => {
  const hasCardEventsToFilter =
    (playEvents.cardPlayEvents?.length ?? 0) > 0 &&
    optimisticCardPlayEvents.length > 0;
  const hasPowerUpEventsToFilter =
    (playEvents.powerUpEvents?.length ?? 0) > 0 &&
    optimisticPowerUpEvents.length > 0;

  if (!hasCardEventsToFilter && !hasPowerUpEventsToFilter) {
    return playEvents;
  }

  const optimisticEventsCounter = new Map<string, number>();

  const countOptimisticEvent = (dedupKey: string | undefined) => {
    if (!dedupKey) return;

    optimisticEventsCounter.set(
      dedupKey,
      (optimisticEventsCounter.get(dedupKey) ?? 0) + 1
    );
  };

  optimisticCardPlayEvents.forEach((event) => {
    countOptimisticEvent(getOptimisticDedupKey(event));
  });

  optimisticPowerUpEvents.forEach((event) => {
    countOptimisticEvent(`power-up:${event.idx}:${event.points ?? 0}:${event.multi ?? 0}`);
  });

  const filteredCardPlayEvents = playEvents.cardPlayEvents?.filter((event) => {
    const dedupKey = getOptimisticDedupKey(event);
    if (!dedupKey) {
      return true;
    }

    const currentCount = optimisticEventsCounter.get(dedupKey) ?? 0;
    if (currentCount <= 0) {
      return true;
    }

    optimisticEventsCounter.set(dedupKey, currentCount - 1);
    return false;
  });

  const filteredPowerUpEvents = playEvents.powerUpEvents?.filter((event) => {
    const dedupKey = `power-up:${event.idx}:${event.points ?? 0}:${event.multi ?? 0}`;
    const currentCount = optimisticEventsCounter.get(dedupKey) ?? 0;

    if (currentCount <= 0) {
      return true;
    }

    optimisticEventsCounter.set(dedupKey, currentCount - 1);
    return false;
  });

  return {
    ...playEvents,
    cardPlayEvents: filteredCardPlayEvents,
    powerUpEvents: filteredPowerUpEvents,
  };
};

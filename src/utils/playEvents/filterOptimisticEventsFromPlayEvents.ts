import { EventTypeEnum } from "../../dojo/typescript/custom";
import { CardPlayEvent, PlayEvents, PowerUpScore } from "../../types/ScoreData";

const isConverterEventType = (eventType: EventTypeEnum): boolean =>
  eventType === EventTypeEnum.Club ||
  eventType === EventTypeEnum.Spade ||
  eventType === EventTypeEnum.Heart ||
  eventType === EventTypeEnum.Diamond ||
  eventType === EventTypeEnum.Neon ||
  eventType === EventTypeEnum.Rank;

const getOptimisticScoreDedupKey = (
  event: CardPlayEvent
): string | undefined => {
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

const getOptimisticConverterDedupKeys = (event: CardPlayEvent): string[] => {
  if (!isConverterEventType(event.eventType) || event.hand.length === 0) {
    return [];
  }

  const specialSignature = event.specials
    .map((special) => special.idx)
    .sort((a, b) => a - b)
    .join("|");

  return event.hand.map((handItem) => {
    const quantitySignature =
      event.eventType === EventTypeEnum.Rank ? `:${handItem.quantity}` : "";
    return `converter:${event.eventType}:${specialSignature}:${handItem.idx}${quantitySignature}`;
  });
};

const consumeCounterKey = (counter: Map<string, number>, key: string): boolean => {
  const currentCount = counter.get(key) ?? 0;
  if (currentCount <= 0) {
    return false;
  }

  counter.set(key, currentCount - 1);
  return true;
};

const consumeCounterKeys = (
  counter: Map<string, number>,
  keys: string[]
): boolean => {
  if (keys.length === 0) {
    return false;
  }

  const canConsume = keys.every((key) => (counter.get(key) ?? 0) > 0);
  if (!canConsume) {
    return false;
  }

  keys.forEach((key) => {
    consumeCounterKey(counter, key);
  });

  return true;
};

export const filterOptimisticEventsFromPlayEvents = (
  playEvents: PlayEvents,
  optimisticCardPlayEvents: CardPlayEvent[],
  optimisticPowerUpEvents: PowerUpScore[] = [],
  optimisticCardPlayChangeEvents: CardPlayEvent[] = []
): PlayEvents => {
  const hasCardEventsToFilter =
    (playEvents.cardPlayEvents?.length ?? 0) > 0 &&
    optimisticCardPlayEvents.length > 0;
  const hasPowerUpEventsToFilter =
    (playEvents.powerUpEvents?.length ?? 0) > 0 &&
    optimisticPowerUpEvents.length > 0;
  const hasCardChangeEventsToFilter =
    (playEvents.cardPlayChangeEvents?.length ?? 0) > 0 &&
    optimisticCardPlayChangeEvents.length > 0;

  if (
    !hasCardEventsToFilter &&
    !hasPowerUpEventsToFilter &&
    !hasCardChangeEventsToFilter
  ) {
    return playEvents;
  }

  const optimisticEventsCounter = new Map<string, number>();

  const countOptimisticEvent = (dedupKey: string | undefined) => {
    if (!dedupKey) {
      return;
    }

    optimisticEventsCounter.set(
      dedupKey,
      (optimisticEventsCounter.get(dedupKey) ?? 0) + 1
    );
  };

  const countOptimisticEvents = (dedupKeys: string[]) => {
    dedupKeys.forEach((dedupKey) => countOptimisticEvent(dedupKey));
  };

  optimisticCardPlayEvents.forEach((event) => {
    countOptimisticEvent(getOptimisticScoreDedupKey(event));
  });

  optimisticPowerUpEvents.forEach((event) => {
    countOptimisticEvent(
      `power-up:${event.idx}:${event.points ?? 0}:${event.multi ?? 0}`
    );
  });

  optimisticCardPlayChangeEvents.forEach((event) => {
    countOptimisticEvents(getOptimisticConverterDedupKeys(event));
  });

  const filteredCardPlayEvents = playEvents.cardPlayEvents?.filter((event) => {
    const dedupKey = getOptimisticScoreDedupKey(event);
    if (!dedupKey) {
      return true;
    }

    return !consumeCounterKey(optimisticEventsCounter, dedupKey);
  });

  const filteredPowerUpEvents = playEvents.powerUpEvents?.filter((event) => {
    const dedupKey = `power-up:${event.idx}:${event.points ?? 0}:${event.multi ?? 0}`;
    return !consumeCounterKey(optimisticEventsCounter, dedupKey);
  });

  const filteredCardPlayChangeEvents = playEvents.cardPlayChangeEvents?.filter(
    (event) => {
      const dedupKeys = getOptimisticConverterDedupKeys(event);
      if (dedupKeys.length === 0) {
        return true;
      }

      return !consumeCounterKeys(optimisticEventsCounter, dedupKeys);
    }
  );

  return {
    ...playEvents,
    cardPlayEvents: filteredCardPlayEvents,
    powerUpEvents: filteredPowerUpEvents,
    cardPlayChangeEvents: filteredCardPlayChangeEvents,
  };
};

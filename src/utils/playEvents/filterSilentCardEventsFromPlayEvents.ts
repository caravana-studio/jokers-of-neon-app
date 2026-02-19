import { PlayEvents } from "../../types/ScoreData";

export const filterSilentCardEventsFromPlayEvents = (
  playEvents: PlayEvents,
  silentCardIndexes: Set<number>
): PlayEvents => {
  if (silentCardIndexes.size === 0) {
    return playEvents;
  }

  const cardPlayEvents = playEvents.cardPlayEvents
    ?.map((event) => ({
      ...event,
      hand: event.hand.filter((handEvent) => !silentCardIndexes.has(handEvent.idx)),
    }))
    .filter((event) => event.hand.length > 0 || event.specials.length > 0);

  const cardPlayChangeEvents = playEvents.cardPlayChangeEvents
    ?.map((event) => ({
      ...event,
      hand: event.hand.filter((handEvent) => !silentCardIndexes.has(handEvent.idx)),
    }))
    .filter((event) => event.hand.length > 0);

  const neonPlayEvent = playEvents.neonPlayEvent
    ? {
        ...playEvents.neonPlayEvent,
        neon_cards_idx: playEvents.neonPlayEvent.neon_cards_idx.filter(
          (idx) => !silentCardIndexes.has(idx)
        ),
      }
    : undefined;

  return {
    ...playEvents,
    cardPlayEvents,
    cardPlayChangeEvents,
    neonPlayEvent:
      neonPlayEvent && neonPlayEvent.neon_cards_idx.length > 0
        ? neonPlayEvent
        : undefined,
  };
};


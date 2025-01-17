import { EventType } from "../dojo/typescript/models.gen";
import { CardPlayEvent } from "../types/ScoreData";

export const scoreEventFilter = (event: CardPlayEvent) =>
  event.eventType === EventType.Cash ||
  event.eventType === EventType.Point ||
  event.eventType === EventType.Multi;

  export const cardScoreEventFilter = (event: CardPlayEvent) =>
    event.hand.length > 0;

  export const specialScoreEventFilter = (event: CardPlayEvent) =>
    event.hand.length === 0 && event.specials.length > 0;
import { EventTypeEnum } from "../dojo/typescript/models.gen";
import { CardPlayEvent } from "../types/ScoreData";

export const scoreEventFilter = (event: CardPlayEvent) =>
  event.eventType === EventTypeEnum.Cash ||
  event.eventType === EventTypeEnum.Point ||
  event.eventType === EventTypeEnum.Multi;

  export const cardScoreEventFilter = (event: CardPlayEvent) =>
    event.hand.length > 0;

  export const specialScoreEventFilter = (event: CardPlayEvent) =>
    event.hand.length === 0 && event.specials.length > 0;
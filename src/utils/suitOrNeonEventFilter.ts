import { EventTypeEnum } from "../dojo/typescript/custom";
import { CardPlayEvent } from "../types/ScoreData";

export const suitOrNeonEventFilter = (event: CardPlayEvent) =>
  event.eventType === EventTypeEnum.Club ||
  event.eventType === EventTypeEnum.Spade ||
  event.eventType === EventTypeEnum.Heart ||
  event.eventType === EventTypeEnum.Diamond ||
  event.eventType === EventTypeEnum.Neon;

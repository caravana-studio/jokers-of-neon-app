import { EventType } from "../dojo/typescript/models.gen";
import { CardPlayEvent } from "../types/ScoreData";

export const suitOrNeonEventFilter = (event: CardPlayEvent) =>
  event.eventType === EventType.Club ||
  event.eventType === EventType.Spade ||
  event.eventType === EventType.Heart ||
  event.eventType === EventType.Diamond ||
  event.eventType === EventType.Neon;

import { EventTypeEnum } from "../dojo/typescript/custom";
import { CardPlayEvent } from "../types/ScoreData";

const EVENT_TYPE_PRIORITY: Record<EventTypeEnum, number> = {
  [EventTypeEnum.Club]: 0,
  [EventTypeEnum.Spade]: 1,
  [EventTypeEnum.Heart]: 2,
  [EventTypeEnum.Diamond]: 3,
  [EventTypeEnum.Neon]: 4,
  [EventTypeEnum.Joker]: 5,
  [EventTypeEnum.Wild]: 6,
  [EventTypeEnum.Point]: 7,
  [EventTypeEnum.AcumPoint]: 8,
  [EventTypeEnum.Multi]: 9,
  [EventTypeEnum.AcumMulti]: 10,
  [EventTypeEnum.Cash]: 11,
  [EventTypeEnum.AcumCash]: 12,
};

const getEventPriority = (event: CardPlayEvent) =>
  EVENT_TYPE_PRIORITY[event.eventType as EventTypeEnum] ??
  Number.MAX_SAFE_INTEGER;

export const sortCardPlayEvents = (a: CardPlayEvent, b: CardPlayEvent) =>
  getEventPriority(a) - getEventPriority(b);

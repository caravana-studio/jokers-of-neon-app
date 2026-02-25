import { EventTypeEnum } from "../dojo/typescript/custom";
import { CardPlayEvent } from "../types/ScoreData";

const EVENT_TYPE_PRIORITY: Record<EventTypeEnum, number> = {
  [EventTypeEnum.Club]: 0,
  [EventTypeEnum.Spade]: 1,
  [EventTypeEnum.Heart]: 2,
  [EventTypeEnum.Diamond]: 3,
  [EventTypeEnum.Neon]: 4,
  [EventTypeEnum.Rank]: 5,
  [EventTypeEnum.Joker]: 6,
  [EventTypeEnum.Wild]: 7,
  [EventTypeEnum.Point]: 8,
  [EventTypeEnum.AcumPoint]: 9,
  [EventTypeEnum.Multi]: 10,
  [EventTypeEnum.AcumMulti]: 11,
  [EventTypeEnum.Cash]: 12,
  [EventTypeEnum.AcumCash]: 13,
};

const getEventPriority = (event: CardPlayEvent) =>
  EVENT_TYPE_PRIORITY[event.eventType as EventTypeEnum] ??
  Number.MAX_SAFE_INTEGER;

export const sortCardPlayEvents = (a: CardPlayEvent, b: CardPlayEvent) =>
  getEventPriority(a) - getEventPriority(b);

import { EventTypeEnum } from "../dojo/typescript/custom";
import { CardPlayEvent } from "../types/ScoreData";

export const acumEventFilter = (event: CardPlayEvent) =>
  event.eventType === EventTypeEnum.AcumCash ||
  event.eventType === EventTypeEnum.AcumPoint ||
  event.eventType === EventTypeEnum.AcumMulti;
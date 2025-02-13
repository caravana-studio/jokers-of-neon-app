import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { CashEvent } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const SPECIAL_CASH_EVENT_KEY = getEventKey(DojoEvents.SPECIAL_CASH);

const parseCashEvent = (
  event: DojoEvent,
  cashIndex: number,
  idxIndex: number,
  specialIdxIndex: number
): CashEvent => {
  const cash = getNumberValueFromEvent(event, cashIndex) ?? 0;
  const idx = getNumberValueFromEvent(event, idxIndex) ?? 0;
  const special_idx = getNumberValueFromEvent(event, specialIdxIndex) ?? 0;
  return {
    idx,
    cash,
    special_idx,
  };
};

export const getCashEvents = (events: DojoEvent[]): CashEvent[] => {
  const cashEvents = events.filter(
    (event) => event.keys[1] === SPECIAL_CASH_EVENT_KEY
  );

  return cashEvents.map((event) => parseCashEvent(event, 3, 4, 5));
};

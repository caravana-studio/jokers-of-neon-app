import { SPECIAL_CASH_EVENT } from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { CashEvent } from "../../types/ScoreData";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

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
    (event) => event.keys[1] === SPECIAL_CASH_EVENT
  );

  return cashEvents.map((event) => parseCashEvent(event, 3, 4, 5));
};

export const getCashEvent = (events: DojoEvent[]): CashEvent => {
  const cashEvent = events.find(
    (event) => event.keys[0] === SPECIAL_CASH_EVENT
  );

  return cashEvent
    ? parseCashEvent(cashEvent, 0, 1, 2)
    : { idx: 999, cash: 0, special_idx: 999 };
};

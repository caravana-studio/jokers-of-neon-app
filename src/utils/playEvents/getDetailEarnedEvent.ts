import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { DetailEarned } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const DETAIL_EARNED_EVENT_KEY = getEventKey(DojoEvents.DETAIL_EARNED);

export const getDetailEarnedEvent = (
  events: DojoEvent[]
): DetailEarned | undefined => {
  const detailEarnedEvent = events.find(
    (event) => event.keys[1] === DETAIL_EARNED_EVENT_KEY
  );
  if (!detailEarnedEvent) return undefined;
  const round_defeat = getNumberValueFromEvent(detailEarnedEvent, 4) ?? 0;
  const level_bonus = getNumberValueFromEvent(detailEarnedEvent, 5) ?? 0;
  const hands_left = getNumberValueFromEvent(detailEarnedEvent, 6) ?? 0;
  const hands_left_cash = getNumberValueFromEvent(detailEarnedEvent, 7) ?? 0;
  const discard_left = getNumberValueFromEvent(detailEarnedEvent, 8) ?? 0;
  const discard_left_cash = getNumberValueFromEvent(detailEarnedEvent, 9) ?? 0;
  const rage_card_defeated =
    getNumberValueFromEvent(detailEarnedEvent, 10) ?? 0;
  const rage_card_defeated_cash =
    getNumberValueFromEvent(detailEarnedEvent, 11) ?? 0;
  const total = getNumberValueFromEvent(detailEarnedEvent, 12) ?? 0;

  return {
    round_defeat,
    level_bonus,
    hands_left,
    hands_left_cash,
    discard_left,
    discard_left_cash,
    rage_card_defeated,
    rage_card_defeated_cash,
    total,
  };
};

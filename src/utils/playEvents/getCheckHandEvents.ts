import { DojoEvent } from "../../types/DojoEvent";
import { CheckHandEvents } from "../../types/ScoreData";
import { getCheckHandEvent } from "./getCheckHandEvent";
import { getHandEvent } from "./getHandEvent";
import { getModifierSuitEvents } from "./getModifierSuitEvents";
import { getMultiPointEvents } from "./getMultiPointEvents";
import { getSpecialLevelEvent } from "./getSpecialLevelEvent";
import { getSpecialSuitEvents } from "./getSpecialSuitEvents";
import { getTraditionalCardsEvents } from "./getTraditionalCardsEvents";

export const getCheckHandEvents = (events: DojoEvent[]): CheckHandEvents => {
  const checkHandEvents: CheckHandEvents = {
    checkHand: getCheckHandEvent(events),
    play: getHandEvent(events),
    cards: getTraditionalCardsEvents(events),
    specialCards: getMultiPointEvents(events),
    levelEvent: getSpecialLevelEvent(events),
    specialSuitEvents: getSpecialSuitEvents(events),
    modifierSuitEvents: getModifierSuitEvents(events),
  };

  return checkHandEvents;
};

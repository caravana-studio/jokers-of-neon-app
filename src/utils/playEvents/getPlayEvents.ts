import {
  GAME_OVER_EVENT
} from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { PlayEvents } from "../../types/ScoreData";
import { getDetailEarnedEvent } from "./getDetailEarnedEvent";
import { getHandEvent } from "./getHandEvent";
import { getLevelPassedEvent } from "./getLevelPassedEvent";
import { getMultiPointEvents } from "./getMultiPointEvents";
import { getSpecialLevelEvent } from "./getSpecialLevelEvent";
import { getSuitEvents } from "./getSuitEvents";
import { getTraditionalCardsEvents } from "./getTraditionalCardsEvents";

export const getPlayEvents = (events: DojoEvent[]): PlayEvents => {
  const playEvents: PlayEvents = {
    play: getHandEvent(events),
    cards: getTraditionalCardsEvents(events),
    specialCards: getMultiPointEvents(events),
    gameOver: !!events.find((event) => event.keys[0] === GAME_OVER_EVENT),
    levelPassed: getLevelPassedEvent(events),
    detailEarned: getDetailEarnedEvent(events),
    levelEvent: getSpecialLevelEvent(events),
    suitEvents: getSuitEvents(events)
  };

  return playEvents;
};

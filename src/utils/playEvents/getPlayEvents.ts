import { GAME_OVER_EVENT } from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { PlayEvents } from "../../types/ScoreData";
import { getCardsFromEvents } from "../getCardsFromEvents";
import { getDetailEarnedEvent } from "./getDetailEarnedEvent";
import { getLevelPassedEvent } from "./getLevelPassedEvent";

export const getPlayEvents = (events: DojoEvent[]): PlayEvents => {
  const playEvents: PlayEvents = {
    gameOver: !!events.find((event) => event.keys[0] === GAME_OVER_EVENT),
    levelPassed: getLevelPassedEvent(events),
    detailEarned: getDetailEarnedEvent(events),
    cards: getCardsFromEvents(events),
  };

  return playEvents;
};

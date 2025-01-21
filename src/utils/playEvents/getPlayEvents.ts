import {
  PLAY_GAME_OVER_EVENT,
  SECOND_CHANCE_EVENT,
} from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { PlayEvents } from "../../types/ScoreData";
import { getCardsFromEvents } from "../getCardsFromEvents";
import { cardScoreEventFilter, scoreEventFilter, specialScoreEventFilter } from "../scoreEventFilter";
import { suitOrNeonEventFilter } from "../suitOrNeonEventFilter";
import { getCardPlayEvents } from "./getCardPlayEvents";
import { getDetailEarnedEvent } from "./getDetailEarnedEvent";
import { getHandEvent } from "./getHandEvent";
import { getLevelPassedEvent } from "./getLevelPassedEvent";
import { getNeonPlayEvent } from "./getNeonPlayEvent";
import { getPowerUpEvents } from "./getPowerUpEvents";
import { getScoreEvent } from "./getScoreEvent";

export const getPlayEvents = (events: DojoEvent[]): PlayEvents => {
  const cardPlayEvents = getCardPlayEvents(events);
  const playEvents: PlayEvents = {
    play: getHandEvent(events),
    gameOver: !!events.find((event) => event.keys[1] === PLAY_GAME_OVER_EVENT),
    levelPassed: getLevelPassedEvent(events),
    detailEarned: getDetailEarnedEvent(events),
    neonPlayEvent: getNeonPlayEvent(events), 
    cards: getCardsFromEvents(events),
    score: getScoreEvent(events),
    secondChanceEvent: !!events.find(
      (event) => event.keys[1] === SECOND_CHANCE_EVENT
    ),
    powerUpEvents: getPowerUpEvents(events),
    cardPlayChangeEvents: cardPlayEvents.filter(suitOrNeonEventFilter),
    cardPlayScoreEvents: cardPlayEvents.filter(scoreEventFilter).filter(cardScoreEventFilter),
    specialCardPlayScoreEvents: cardPlayEvents.filter(scoreEventFilter).filter(specialScoreEventFilter), 
  };

  console.log(playEvents);

  return playEvents;
};

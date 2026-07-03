import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { PlayEvents } from "../../types/ScoreData";
import { acumEventFilter } from "../acumEventFilter";
import { getCardsFromEvents } from "../getCardsFromEvents";
import { getEventKey } from "../getEventKey";
import {
  cardScoreEventFilter,
  scoreEventFilter,
  specialScoreEventFilter,
} from "../scoreEventFilter";
import { getLevelUpPlayEvent } from "../discardEvents/getLevelUpPlayEvent";
import { sortCardPlayEvents } from "../sortCardPlayEvents";
import { converterEventFilter } from "../converterEventFilter";
import { getCardActivateEvent } from "./getCardActivateEvent";
import { getCardPlayEvents } from "./getCardPlayEvents";
import { getDetailEarnedEvent } from "./getDetailEarnedEvent";
import { getForcedHandDiscardEvent } from "./getForcedHandDiscardEvent";
import { getHandEvent } from "./getHandEvent";
import { getLevelPassedEvent } from "./getLevelPassedEvent";
import { getNeonPlayEvent } from "./getNeonPlayEvent";
import { getPostActionEvent } from "./getPostActionEvent";
import { getPowerUpEvents } from "./getPowerUpEvents";
import { getScoreEvent } from "./getScoreEvent";
import {
  getShopTierUnlockedEvents,
} from "./getShopTierUnlockedEvent";

const PLAY_GAME_OVER_EVENT_KEY = getEventKey(DojoEvents.PLAY_GAME_OVER);
const SECOND_CHANCE_EVENT_KEY = getEventKey(DojoEvents.SECOND_CHANCE);

export const getPlayEvents = (events: DojoEvent[]): PlayEvents => {
  const shopTierUnlockedEvents = getShopTierUnlockedEvents(events);
  const cardPlayEvents = getCardPlayEvents(events);
  const cardPlayChangeEvents = cardPlayEvents
    .filter(converterEventFilter)
    .sort(sortCardPlayEvents);

  const playEvents: PlayEvents = {
    play: getHandEvent(events),
    gameOver: !!events.find(
      (event) => event.keys[1] === PLAY_GAME_OVER_EVENT_KEY
    ),
    shopTierUnlockedEvent: shopTierUnlockedEvents[0],
    shopTierUnlockedEvents,
    levelPassed: getLevelPassedEvent(events),
    levelUpPlayEvent: getLevelUpPlayEvent(events),
    detailEarned: getDetailEarnedEvent(events),
    neonPlayEvent: getNeonPlayEvent(events),
    cards: getCardsFromEvents(events),
    score: getScoreEvent(events),
    secondChanceEvent: !!events.find(
      (event) => event.keys[1] === SECOND_CHANCE_EVENT_KEY
    ),
    powerUpEvents: getPowerUpEvents(events),
    acumulativeEvents: cardPlayEvents.filter(acumEventFilter),
    cardPlayChangeEvents,
    cardPlayEvents: [
      ...cardPlayEvents.filter(scoreEventFilter).filter(cardScoreEventFilter),
      ...cardPlayEvents
        .filter(scoreEventFilter)
        .filter(specialScoreEventFilter),
    ].sort(sortCardPlayEvents),
    cardActivateEvent: getCardActivateEvent(events),
    postActionEvent: getPostActionEvent(events),
    forcedHandDiscardEvent: getForcedHandDiscardEvent(events),
  };

  if (playEvents.gameOver) {
    console.log("[unlock-debug] game over detected in play response", {
      hasShopTierUnlockedEvent: shopTierUnlockedEvents.length > 0,
      parsedShopTierUnlockedEvent: playEvents.shopTierUnlockedEvent,
      parsedShopTierUnlockedEvents: shopTierUnlockedEvents,
      allEventKeys: events.map((event) => event.keys),
      eventDataLengths: events.map((event) => event.data.length),
    });
  }

  return playEvents;
};

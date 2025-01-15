import { EventType } from "../../enums/eventType";
import { Suits } from "../../enums/suits";

export const eventTypeToSuit = (eventType: EventType) => {
  switch (eventType) {
    case EventType.Club:
      return Suits.CLUBS;
    case EventType.Diamond:
      return Suits.DIAMONDS;
    case EventType.Heart:
      return Suits.HEARTS;
    case EventType.Spade:
      return Suits.SPADES;
    default:
      return undefined;
  }
};

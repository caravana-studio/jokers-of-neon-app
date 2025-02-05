import { EventTypeEnum } from "../../dojo/typescript/models.gen";
import { Suits } from "../../enums/suits";

export const eventTypeToSuit = (eventType: EventTypeEnum) => {
  switch (eventType) {
    case EventTypeEnum.Club:
      return Suits.CLUBS;
    case EventTypeEnum.Diamond:
      return Suits.DIAMONDS;
    case EventTypeEnum.Heart:
      return Suits.HEARTS;
    case EventTypeEnum.Spade:
      return Suits.SPADES;
    default:
      return undefined;
  }
};

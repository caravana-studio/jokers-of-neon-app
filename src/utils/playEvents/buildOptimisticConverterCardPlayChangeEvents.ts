import {
  CONVERTER_SPECIAL_CARD_IDS_SET,
  specialCardIds,
} from "../../constants/specialCardIds";
import { Card } from "../../types/Card";
import { CardPlayEvent } from "../../types/ScoreData";
import { allToHeartsOptimisticConverter } from "./converters/allToHeartsConverter";
import { neonSynergyOptimisticConverter } from "./converters/neonSynergyConverter";
import { straightToHighStraightOptimisticConverter } from "./converters/straightToHighStraightConverter";
import { wildDeucesOptimisticConverter } from "./converters/wildDeucesConverter";
import { OptimisticConverterBehavior } from "./converters/types";
import { sortCardPlayEvents } from "../sortCardPlayEvents";

interface BuildOptimisticConverterCardPlayChangeEventsParams {
  hand: Card[];
  preSelectedCards: number[];
  specialCards: Card[];
  preSelectedModifiers: { [key: number]: number[] };
}

const OPTIMISTIC_CONVERTER_BEHAVIORS: Partial<
  Record<number, OptimisticConverterBehavior>
> = {
  [specialCardIds.ALL_TO_HEARTS]: allToHeartsOptimisticConverter,
  [specialCardIds.NEON_SYNERGY]: neonSynergyOptimisticConverter,
  [specialCardIds.STRAIGHT_TO_HIGH_STRAIGHT]:
    straightToHighStraightOptimisticConverter,
  [specialCardIds.WILD_DEUCES]: wildDeucesOptimisticConverter,
};

export const getActiveConverterSpecialCards = (specialCards: Card[]): Card[] => {
  return specialCards.filter((specialCard) => {
    const cardId = specialCard.card_id;
    return (
      cardId !== undefined &&
      CONVERTER_SPECIAL_CARD_IDS_SET.has(cardId) &&
      specialCard.silenced !== true
    );
  });
};

export const canOptimisticallyBuildConverterEvents = (
  activeConverterSpecialCards: Card[]
): boolean => {
  return activeConverterSpecialCards.every((specialCard) => {
    const cardId = specialCard.card_id;
    if (cardId === undefined) {
      return false;
    }

    const behavior = OPTIMISTIC_CONVERTER_BEHAVIORS[cardId];
    return behavior?.deterministic === true;
  });
};

export const buildOptimisticConverterCardPlayChangeEvents = ({
  hand,
  preSelectedCards,
  specialCards,
  preSelectedModifiers,
}: BuildOptimisticConverterCardPlayChangeEventsParams): CardPlayEvent[] => {
  const activeConverterSpecialCards = getActiveConverterSpecialCards(specialCards);

  if (!canOptimisticallyBuildConverterEvents(activeConverterSpecialCards)) {
    return [];
  }

  const optimisticConverterEvents = activeConverterSpecialCards.flatMap(
    (specialCard) => {
      const cardId = specialCard.card_id;
      if (cardId === undefined) {
        return [];
      }

      const behavior = OPTIMISTIC_CONVERTER_BEHAVIORS[cardId];
      if (!behavior) {
        return [];
      }

      return behavior.buildEvents({
        hand,
        preSelectedCards,
        specialCards,
        preSelectedModifiers,
        specialCard,
      });
    }
  );

  return optimisticConverterEvents.sort(sortCardPlayEvents);
};

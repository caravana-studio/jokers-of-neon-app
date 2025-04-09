import { MODIFIERS_SUIT_CHANGING } from "../../data/modifiers";
import { SPECIAL_CARDS_BLOCKS_SUIT_CHANGE } from "../../data/specialCards";
import { useCardData } from "../../providers/CardDataProvider";
import { useGameContext } from "../../providers/GameProvider";
import { Card } from "../../types/Card";
import { transformCardByModifierId } from "./modifierTransformation";

export const useTransformedCard = (card: Card): Card => {
  const { specialCards, cardTransformationLock } = useGameContext();
  const { getCardData } = useCardData();

  if ((card.modifiers?.length ?? 0) > 0) {
    const modifierCard = card.modifiers![0];

    const isBlocked =
      specialCards.some((specialCard) =>
        SPECIAL_CARDS_BLOCKS_SUIT_CHANGE.includes(specialCard.card_id ?? -1)
      ) &&
      MODIFIERS_SUIT_CHANGING.includes(modifierCard.card_id ?? -1) &&
      cardTransformationLock;

    if (isBlocked) {
      return card;
    }

    const transformedCardId = transformCardByModifierId(
      modifierCard?.card_id!,
      card?.card_id!
    );

    if (transformedCardId !== -1) {
      return {
        ...card,
        card_id: transformedCardId,
        img: `${transformedCardId}.png`,
        suit: getCardData(transformedCardId.card_id ?? 0).suit,
      };
    }
  }

  return card;
};

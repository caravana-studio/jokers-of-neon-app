import { CARDS_SUIT_DATA } from "../../data/traditionalCards";
import { EventTypeEnum } from "../../dojo/typescript/custom";
import { Suits } from "../../enums/suits";
import { Card } from "../../types/Card";
import { isCardSilent } from "../isCardSilent";
import { changeCardNeon } from "../cardTransformation/changeCardNeon";
import { changeCardSuit } from "../cardTransformation/changeCardSuit";
import { transformCardByModifierId } from "../cardTransformation/modifierTransformation";
import { CardPlayEvent } from "../../types/ScoreData";
import { eventTypeToSuit } from "./eventTypeToSuit";

interface GetSilentCardIndexesForOptimisticPlayParams {
  hand: Card[];
  preSelectedCards: number[];
  rageCards: Card[];
  preSelectedModifiers: { [key: number]: number[] };
  changeEvents?: CardPlayEvent[];
}

const applyCardId = (card: Card, nextCardId: number): Card => {
  const normalizedCardData =
    CARDS_SUIT_DATA[nextCardId] ?? CARDS_SUIT_DATA[nextCardId % 200];

  return {
    ...card,
    card_id: nextCardId,
    img: `${nextCardId}.png`,
    suit: normalizedCardData?.suit ?? card.suit,
    value: normalizedCardData?.card ?? card.value,
    card: normalizedCardData?.card ?? card.card,
    isNeon: nextCardId >= 200 && nextCardId < 300,
  };
};

const applySelectedModifiers = ({
  card,
  cardsByIdx,
  modifierIndexes,
}: {
  card: Card;
  cardsByIdx: Map<number, Card>;
  modifierIndexes: number[];
}): Card => {
  return modifierIndexes.reduce((currentCard, modifierIdx) => {
    const modifierCard = cardsByIdx.get(modifierIdx);
    if (!modifierCard?.card_id || currentCard.card_id === undefined) {
      return currentCard;
    }

    if (currentCard.suit === Suits.JOKER) {
      return currentCard;
    }

    const transformedCardId = transformCardByModifierId(
      modifierCard.card_id,
      currentCard.card_id
    );

    if (transformedCardId === -1) {
      return currentCard;
    }

    return applyCardId(currentCard, transformedCardId);
  }, card);
};

const applyChangeEvent = (card: Card, event: CardPlayEvent): Card => {
  if (!event.hand.some((handEvent) => handEvent.idx === card.idx)) {
    return card;
  }

  if (card.card_id === undefined) {
    return card;
  }

  if (event.eventType === EventTypeEnum.Neon) {
    return applyCardId(card, changeCardNeon(card.card_id));
  }

  if (event.eventType === EventTypeEnum.Rank) {
    const rankChange = event.hand.find((handEvent) => handEvent.idx === card.idx);
    return rankChange ? applyCardId(card, rankChange.quantity) : card;
  }

  const suit = eventTypeToSuit(event.eventType);
  if (suit === undefined || card.suit === Suits.WILDCARD) {
    return card;
  }

  return applyCardId(card, changeCardSuit(card.card_id, suit));
};

export const getSilentCardIndexesForOptimisticPlay = ({
  hand,
  preSelectedCards,
  rageCards,
  preSelectedModifiers,
  changeEvents = [],
}: GetSilentCardIndexesForOptimisticPlayParams): Set<number> => {
  const cardsByIdx = new Map(hand.map((card) => [card.idx, card]));

  return new Set(
    preSelectedCards.filter((cardIdx) => {
      const card = cardsByIdx.get(cardIdx);
      if (!card) {
        return false;
      }

      const cardWithModifiers = applySelectedModifiers({
        card,
        cardsByIdx,
        modifierIndexes: preSelectedModifiers[cardIdx] ?? [],
      });
      const transformedCard = changeEvents.reduce(
        (currentCard, event) => applyChangeEvent(currentCard, event),
        cardWithModifiers
      );

      return isCardSilent(transformedCard, rageCards);
    })
  );
};

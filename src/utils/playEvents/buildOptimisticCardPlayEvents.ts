import { EventTypeEnum } from "../../dojo/typescript/custom";
import { CARDS_SUIT_DATA } from "../../data/traditionalCards";
import { Cards } from "../../enums/cards";
import { ModifiersId } from "../../enums/modifiersId";
import { Suits } from "../../enums/suits";
import { Card } from "../../types/Card";
import { CardPlayEvent } from "../../types/ScoreData";
import { changeCardNeon } from "../cardTransformation/changeCardNeon";
import { changeCardSuit } from "../cardTransformation/changeCardSuit";
import { transformCardByModifierId } from "../cardTransformation/modifierTransformation";
import { checkHand } from "../checkHand";
import { isCardSilent } from "../isCardSilent";
import { eventTypeToSuit } from "./eventTypeToSuit";

interface BuildOptimisticCardPlayEventsParams {
  hand: Card[];
  preSelectedCards: number[];
  specialCards: Card[];
  preSelectedModifiers: { [key: number]: number[] };
  rageCards?: Card[];
  silentCardIndexes?: Set<number>;
  changeEvents?: CardPlayEvent[];
}

const getCardValue = (card: Card): Cards | undefined => {
  if (card.value !== undefined) {
    return card.value;
  }

  if (card.card !== undefined) {
    return card.card;
  }

  if (card.card_id === undefined) {
    return undefined;
  }

  return (
    CARDS_SUIT_DATA[card.card_id]?.card ??
    CARDS_SUIT_DATA[card.card_id % 200]?.card
  );
};

const getCardValueFromCardId = (cardId: number): Cards | undefined => {
  return CARDS_SUIT_DATA[cardId]?.card ?? CARDS_SUIT_DATA[cardId % 200]?.card;
};

const getCardBasePoints = (cardValue?: Cards): number => {
  if (cardValue === undefined) {
    return 0;
  }

  if (cardValue >= Cards.TWO && cardValue <= Cards.TEN) {
    return cardValue;
  }

  if (
    cardValue === Cards.JACK ||
    cardValue === Cards.QUEEN ||
    cardValue === Cards.KING
  ) {
    return 10;
  }

  if (cardValue === Cards.ACE) {
    return 11;
  }

  if (cardValue === Cards.JOKER) {
    return 100;
  }

  return 0;
};

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

const cardIsNeon = (
  card: Card,
  cardIdx: number,
  rankConvertedCardId: number | undefined,
  neonConvertedCardIndexes: Set<number>,
  preSelectedModifiers: { [key: number]: number[] },
  cardsByIdx: Map<number, Card>
) => {
  if (neonConvertedCardIndexes.has(cardIdx)) {
    return true;
  }

  if (
    rankConvertedCardId !== undefined &&
    rankConvertedCardId >= 200 &&
    rankConvertedCardId < 300
  ) {
    return true;
  }

  if (card.isNeon) {
    return true;
  }

  if (
    card.card_id !== undefined &&
    card.card_id >= 200 &&
    card.card_id < 300
  ) {
    return true;
  }

  const modifiers = preSelectedModifiers[card.idx] ?? [];
  return modifiers.some((modifierIdx) => {
    const modifierCard = cardsByIdx.get(modifierIdx);
    return modifierCard?.card_id === ModifiersId.NEON_MODIFIER;
  });
};

const cardHasWildcardModifier = (
  card: Card,
  preSelectedModifiers: { [key: number]: number[] },
  cardsByIdx: Map<number, Card>
) => {
  const modifiers = preSelectedModifiers[card.idx] ?? [];
  return modifiers.some((modifierIdx) => {
    const modifierCard = cardsByIdx.get(modifierIdx);
    return modifierCard?.card_id === ModifiersId.WILDCARD_MODIFIER;
  });
};

export const buildOptimisticCardPlayEvents = ({
  hand,
  preSelectedCards,
  specialCards,
  preSelectedModifiers,
  rageCards = [],
  silentCardIndexes,
  changeEvents = [],
}: BuildOptimisticCardPlayEventsParams): CardPlayEvent[] => {
  if (preSelectedCards.length === 0) {
    return [];
  }

  const handResult = checkHand(
    hand,
    preSelectedCards,
    specialCards,
    preSelectedModifiers
  );
  const cardsByIdx = new Map(hand.map((card) => [card.idx, card]));
  const rankConvertedCardIdsByIdx = new Map<number, number>();
  const neonConvertedCardIndexes = new Set<number>();

  changeEvents.forEach((event) => {
    if (event.eventType === EventTypeEnum.Rank) {
      event.hand.forEach((item) => {
        rankConvertedCardIdsByIdx.set(item.idx, item.quantity);
      });
      return;
    }

    if (event.eventType === EventTypeEnum.Neon) {
      event.hand.forEach((item) => {
        neonConvertedCardIndexes.add(item.idx);
      });
    }
  });

  const preselectedOrderByIdx = new Map(
    preSelectedCards.map((cardIdx, position) => [cardIdx, position])
  );

  const pointEvents: CardPlayEvent[] = [];
  const multiEvents: CardPlayEvent[] = [];

  const orderedCardsComposingPlay = [...handResult.cardsComposingPlay].sort(
    (a, b) =>
      (preselectedOrderByIdx.get(a) ?? Number.MAX_SAFE_INTEGER) -
      (preselectedOrderByIdx.get(b) ?? Number.MAX_SAFE_INTEGER)
  );

  orderedCardsComposingPlay.forEach((cardIdx) => {
    const card = cardsByIdx.get(cardIdx);
    if (!card) {
      return;
    }

    const isSilent = silentCardIndexes?.has(cardIdx) ?? false;
    const hasSilentFlag =
      (card as Card & { isSilent?: boolean }).isSilent === true;
    const transformedCard = changeEvents.reduce(
      (currentCard, event) => applyChangeEvent(currentCard, event),
      applySelectedModifiers({
        card,
        cardsByIdx,
        modifierIndexes: preSelectedModifiers[cardIdx] ?? [],
      })
    );
    const isSilencedAfterConversion = isCardSilent(transformedCard, rageCards);

    if (isSilent || hasSilentFlag || isSilencedAfterConversion) {
      return;
    }

    if (cardHasWildcardModifier(card, preSelectedModifiers, cardsByIdx)) {
      return;
    }

    const rankConvertedCardId = rankConvertedCardIdsByIdx.get(cardIdx);
    const isNeon = cardIsNeon(
      card,
      cardIdx,
      rankConvertedCardId,
      neonConvertedCardIndexes,
      preSelectedModifiers,
      cardsByIdx
    );
    const cardValue =
      rankConvertedCardId !== undefined
        ? getCardValueFromCardId(rankConvertedCardId)
        : getCardValue(card);
    const basePoints = getCardBasePoints(cardValue);
    const points = isNeon ? basePoints * 2 : basePoints;

    let multi = 0;
    if (cardValue === Cards.JOKER) {
      multi = isNeon ? 2 : 1;
    } else if (isNeon && basePoints > 0) {
      multi = 1;
    }

    if (points > 0) {
      pointEvents.push({
        hand: [{ idx: cardIdx, quantity: points }],
        specials: [],
        eventType: EventTypeEnum.Point,
      });
    }

    if (multi !== 0) {
      multiEvents.push({
        hand: [{ idx: cardIdx, quantity: multi }],
        specials: [],
        eventType: EventTypeEnum.Multi,
      });
    }
  });

  return [...pointEvents, ...multiEvents];
};

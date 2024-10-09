import { Deck } from "../../types/Deck";
import { useDojo } from "../useDojo";
import { useGame } from "./useGame";
import { useRound } from "./useRound";
import { getCard } from "./useCurrentHand";
import { getCardFromCardId } from "../utils/getCardFromCardId";
import { getCardData } from "../../utils/getCardData";
import { Models } from "../typescript/bindings";
import { useModels } from "./useModel";

export const useCurrentDeck = (): Deck | undefined => {
  const round = useModels(Models.Round)?.[0];
  const deck = useModels(Models.DeckCard);
  const deckSize = round?.current_len_deck ?? 0;
  const cards = [];

  if (deck == undefined) return undefined;

  for (let i = 0; i < deckSize; i++) {
    const deckCardId = deck[i]?.card_id;
    const card = getCardFromCardId(deckCardId, i);
    const cardData = {...getCardData(card)};

    cards.push({
        ...card,
        ...cardData,
        isNeon: deckCardId === 53 || (deckCardId >= 200 && deckCardId <= 251),
      });
  }

  return {
    size: deckSize,
    currentLength: round?.current_len_deck ?? 0,
    cards: cards
  };
};


export const useFullDeck = (): Deck | undefined => {
  const game = useGame();
  const round = useModels(Models.Round)?.[0];
  console.log("round: " + useModels(Models.Round));
  
  const commonCards = [];
  const effectCards = [];

  const {
    setup: {
      clientComponents: { PlayerCommonCards, PlayerEffectCards },
    },
  } = useDojo();

  if (!game) return undefined;

  for (let i = 0; i < game.len_common_cards; i++) {
    const deckCard = getCard(game.id ?? 0, i, PlayerCommonCards);

    if (deckCard == undefined) return;

    const card = getCardFromCardId(deckCard?.common_card_id, i);
    const cardData = {...getCardData(card)};
    
    commonCards.push({
        ...card,
        ...cardData,
        isNeon: deckCard?.card_id === 53 || (deckCard?.common_card_id >= 200 && deckCard?.common_card_id <= 251),
      });
  }

  for (let i = 0; i < game.len_effect_cards; i++) {
    const deckCard = getCard(game.id ?? 0, i, PlayerEffectCards);
    const card = getCardFromCardId(deckCard?.effect_card_id, i);
    const cardData = {...getCardData(card)};

    effectCards.push({
        ...card,
        ...cardData,
        isNeon: false,
      });
  }

  return {
    size: game.len_common_cards + game.len_effect_cards,
    currentLength: round?.current_len_deck ?? 0,
    cards: [...commonCards, ...effectCards]
  };
};

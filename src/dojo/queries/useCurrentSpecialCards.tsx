import { useState, useEffect, useCallback } from 'react';
import { useGame } from './useGame.tsx'
import { getComponentValue } from "@dojoengine/recs";
import { useDojo } from '../useDojo.tsx'
import { Card } from '../../types/Card.ts'
import { getEntityIdFromKeys } from '@dojoengine/utils'
import { Entity } from '@dojoengine/recs/src/types.ts'

const getSpecialCard = (
  gameId: number,
  index: number,
  CurrentSpecialCards: any
) => {
  const entityId = getEntityIdFromKeys([
    BigInt(gameId),
    BigInt(index),
  ]) as Entity;
  const specialCard = getComponentValue(CurrentSpecialCards, entityId);
  const card_id = specialCard?.effect_card_id;
  if (!card_id || !specialCard) return;
  return {
    card_id,
    isSpecial: true,
    id: card_id.toString(),
    idx: index,
    img: `effect/${card_id}.png`,
    temporary: specialCard.is_temporary,
    remaining: specialCard.remaining,
  };
};

export const useCurrentSpecialCards = () => {
  const [specialCards, setSpecialCards] = useState<Card[]>([]);
  const game = useGame();
  const { setup: { clientComponents: { CurrentSpecialCards } } } = useDojo();

  const fetchSpecialCards = useCallback(async () => {
    if (!game) return;
    const gameId = game.id ?? 0;
    const length = game.len_current_special_cards ?? 0;
    let cards: Card[] = [];
    for (let i = 0; i < length; i++) {
      const card = getSpecialCard(gameId, i, CurrentSpecialCards);
      card && cards.push(card);
    }
    setSpecialCards(cards);
  }, [game, CurrentSpecialCards]);

  useEffect(() => {
    fetchSpecialCards();
  }, []);

  return { specialCards, refetch: fetchSpecialCards };
};
import { useComponentValue } from "@dojoengine/react";
import { Component, Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "../useDojo.tsx";
import { useGame } from "./useGame.tsx";

const useSpecialCard = (
  gameId: number,
  index: number,
  component: Component
) => {
  const entityId = getEntityIdFromKeys([
    BigInt(gameId),
    BigInt(index),
  ]) as Entity;
  const specialCard = useComponentValue(component, entityId);
  const card_id = specialCard?.effect_card_id;

  return (
    card_id && {
      card_id,
      isSpecial: true,
      id: card_id?.toString(),
      idx: index ?? 0,
      img: `${card_id}.png`,
      temporary: specialCard?.is_temporary,
      remaining: specialCard?.remaining,
    }
  );
};

export const useCurrentSpecialCards = () => {
  const {
    setup: {
      clientComponents: { CurrentSpecialCards },
    },
  } = useDojo();
  const game = useGame();

  const gameId = game?.id ?? 0;

  const specialCardsMaxLength = 7;
  const len_current_special_cards = game?.current_specials_len ?? 0;

  const specialCardsIds = Array.from(
    { length: specialCardsMaxLength },
    (_, index) => index
  );
  return specialCardsIds
    .map((index) => useSpecialCard(gameId, index, CurrentSpecialCards))
    .filter((card) => !!card)
    .slice(0, len_current_special_cards);
};

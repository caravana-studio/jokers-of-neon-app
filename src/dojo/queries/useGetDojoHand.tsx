import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs/src/types";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Card } from "../../types/Card";
import { useDojo } from "../useDojo";

interface DojoHand {
  game_id: number;
  idx: number;
  type_player_card: string;
  player_card_id: number;
  card_id: number;
}

export const useGetDojoHand = (gameId: number): Card[] => {
  const {
    setup: {
      clientComponents: { CurrentHandCard },
    },
  } = useDojo();
  /*   let dojoHand: DojoHand[] = [];
  for (let i = 0; i < 8; i++) {
    const entityId = getEntityIdFromKeys([BigInt(gameId), BigInt(i)]) as Entity;
    const card: DojoHand = getComponentValue(
      CurrentHandCard,
      entityId
    ) as DojoHand;
    card && dojoHand.push(card);
  } */

  const card0 = useComponentValue(
    CurrentHandCard,
    getEntityIdFromKeys([BigInt(gameId), BigInt(0)]) as Entity
  );

  const card1 = useComponentValue(
    CurrentHandCard,
    getEntityIdFromKeys([BigInt(gameId), BigInt(1)]) as Entity
  );

  const card2 = useComponentValue(
    CurrentHandCard,
    getEntityIdFromKeys([BigInt(gameId), BigInt(2)]) as Entity
  );

  const card3 = useComponentValue(
    CurrentHandCard,
    getEntityIdFromKeys([BigInt(gameId), BigInt(3)]) as Entity
  );

  const card4 = useComponentValue(
    CurrentHandCard,
    getEntityIdFromKeys([BigInt(gameId), BigInt(4)]) as Entity
  );

  const card5 = useComponentValue(
    CurrentHandCard,
    getEntityIdFromKeys([BigInt(gameId), BigInt(5)]) as Entity
  );

  const card6 = useComponentValue(
    CurrentHandCard,
    getEntityIdFromKeys([BigInt(gameId), BigInt(6)]) as Entity
  );

  const card7 = useComponentValue(
    CurrentHandCard,
    getEntityIdFromKeys([BigInt(gameId), BigInt(7)]) as Entity
  );

  let dojoCards = [];
  card0?.card_id && dojoCards.push(card0);
  card1?.card_id && dojoCards.push(card1);
  card2?.card_id && dojoCards.push(card2);
  card3?.card_id && dojoCards.push(card3);
  card4?.card_id && dojoCards.push(card4);
  card5?.card_id && dojoCards.push(card5);
  card6?.card_id && dojoCards.push(card6);
  card7?.card_id && dojoCards.push(card7);
  console.log(dojoCards);

  const cards = dojoCards.map((dojoCard) => {
    return {
      ...dojoCard,
      img: `${dojoCard.type_player_card === "Effect" ? "effect/" : ""}${dojoCard.card_id}.png`,
      isModifier: dojoCard.type_player_card === "Effect",
      idx: dojoCard.idx,
      id: dojoCard.idx.toString(),
    };
  });

  return cards;
};

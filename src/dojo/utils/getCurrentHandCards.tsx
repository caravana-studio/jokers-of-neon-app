import { getComponentValue } from "@dojoengine/recs";
import { Entity, OverridableComponent } from "@dojoengine/recs/src/types";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Cards } from "../../enums/cards";
import { Suits } from "../../enums/suits";
import { Card } from "../../types/Card";
import { zeroPad } from "../../utils/zeroPad";

export const getCurrentHandCards = (gameId: number, CurrentHandCard: OverridableComponent): Card[] => {
    const handSize = 8;
    let currentHand = []
    for (let i = 0; i < handSize; i++) {
      const entityId = getEntityIdFromKeys([
        BigInt(gameId),
        BigInt(i),
      ]) as Entity; 
      const card = getComponentValue(CurrentHandCard, entityId);
      currentHand.push(card)
    }
    return currentHand.filter(dojoCard => dojoCard !== undefined).map(dojoCard => {
      const value = Cards[dojoCard!.value.toUpperCase() as keyof typeof Cards]
      const suit = Suits[dojoCard!.suit.toUpperCase() as keyof typeof Suits]
      const img = `${dojoCard!.suit.charAt(0)}${zeroPad(value, 2)}.png`
      return {
        id: dojoCard!.idx.toString(),
        value,
        idx: dojoCard!.idx,
        suit,
        img
      }
    })
  }
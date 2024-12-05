import { CardTypes } from "../../enums/cardTypes";
import { Card } from "../../types/Card";
import {
  CardItemType,
  PokerHand,
  SlotSpecialCardsItem,
  BurnItem,
} from "../typescript/models.gen";

export const EMPTY_SPECIAL_SLOT_ITEM: SlotSpecialCardsItem = {
  game_id: 0,
  cost: 0,
  purchased: true,
};

export const EMPTY_BURN_ITEM: BurnItem = {
  game_id: 0,
  cost: 0,
  purchased: true,
};

const getCard = (txCard: any, forcedCardType?: CardItemType) => {
  const cardType =
    forcedCardType ??
    ({
      type: Object.entries(txCard.item_type.variant).find(
        ([key, value]) => value !== undefined && value !== null
      )?.[0],
    } as CardItemType);
  const idx = parseInt(txCard.idx);
  const card_id = parseInt(txCard.card_id);
  return {
    price: parseInt(txCard.cost),
    isModifier: cardType.type === CardTypes.MODIFIER,
    isSpecial: cardType.type === CardTypes.SPECIAL,
    id: idx?.toString() ?? "",
    idx,
    card_id,
    purchased: txCard.purchased,
    img: `${card_id}.png`,
    temporary: txCard.temporary,
    temporary_price: parseInt(txCard.temporary_cost),
  };
};

const getPokerHandItem = (txPokerHand: any) => {
  return {
    game_id: parseInt(txPokerHand.game_id),
    idx: parseInt(txPokerHand.idx),
    poker_hand: (
      {
        type: Object.entries(txPokerHand.poker_hand.variant).find(
          ([key, value]) => value !== undefined && value !== null
        )?.[0],
      } as PokerHand
    ).type,
    level: parseInt(txPokerHand.level),
    cost: parseInt(txPokerHand.cost),
    purchased: txPokerHand.purchased,
  };
};

const getBlisterPack = (txBlisterPack: any) => {
  return {
    blister_pack_id: parseInt(txBlisterPack.blister_pack_id),
    cost: parseInt(txBlisterPack.cost),
    cost_discount: parseInt(txBlisterPack.cost_discount),
    purchased: txBlisterPack.purchased,
    game_id: parseInt(txBlisterPack.game_id),
    idx: parseInt(txBlisterPack.idx),
  };
};

export const getShopItems = async (client: any, gameId: number) => {
  if (gameId != 0) {
    try {
      let tx_result = await client.shop_system.getShopItems(gameId);

      const modifiersAndCommonCards = tx_result[0].map((txCard: any) => {
        return getCard(txCard);
      });

      const modifierCards = modifiersAndCommonCards.filter(
        (card: Card) => card.isModifier
      );
      const commonCards = modifiersAndCommonCards.filter(
        (card: Card) => !card.isModifier && !card.isSpecial
      );

      const specialCards = tx_result[1].map((txCard: any) => {
        return getCard(txCard, { type: CardTypes.SPECIAL });
      });
      const pokerHandItems = tx_result[2].map((txPokerHand: any) => {
        return getPokerHandItem(txPokerHand);
      });
      const packs = tx_result[3].map((txBlisterPack: any) => {
        return getBlisterPack(txBlisterPack);
      });
      const specialSlotItem = {
        game_id: parseInt(tx_result[4].game_id),
        cost: parseInt(tx_result[4].cost),
        purchased: tx_result[4].purchased,
      };

      const burnItem = {
        game_id: parseInt(tx_result[5].game_id),
        cost: parseInt(tx_result[5].cost),
        purchased: tx_result[5].purchased,
      };

      const rerollInformation = {
        rerollCost: parseInt(tx_result[6].reroll_cost),
        rerollExecuted: tx_result[6].reroll_executed,
      };

      return {
        specialCards,
        modifierCards,
        commonCards,
        pokerHandItems,
        packs,
        specialSlotItem,
        rerollInformation,
        cash: parseInt(tx_result[7]),
        burnItem,
      };
    } catch (e) {
      console.log(e);
    }
    return {
      specialCards: [],
      modifierCards: [],
      commonCards: [],
      pokerHandItems: [],
      packs: [],
      specialSlotItem: EMPTY_SPECIAL_SLOT_ITEM,
      rerollInformation: {
        rerollCost: 100,
        rerollExecuted: true,
      },
      cash: 0,
      burnItem: EMPTY_BURN_ITEM,
    };
  }
};

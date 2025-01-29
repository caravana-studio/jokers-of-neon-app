import { Card } from "../../types/Card";
import {
  BurnItem,
  CardItemType,
  SlotSpecialCardsItem,
} from "../typescript/models.gen";

export const EMPTY_SPECIAL_SLOT_ITEM: SlotSpecialCardsItem = {
  game_id: 0,
  cost: 0,
  purchased: true,
  discount_cost: 0,
};

export const EMPTY_BURN_ITEM: BurnItem = {
  game_id: 0,
  cost: 0,
  purchased: true,
  discount_cost: 0,
};

const CARDS_IDX = 0;
const SPECIALS_IDX = 1;
const POKER_HANDS_IDX = 2;
const BLISTER_PACKS_IDX = 3;
const POWERUPS_IDX = 4;
const SLOTS_IDX = 5;
const BURN_IDX = 6;
const REROLL_IDX = 7;
const CASH_IDX = 8;

const getCard = (txCard: any) => {
  const idx = parseInt(txCard.idx);
  const card_id = parseInt(txCard.card_id);
  return {
    price: parseInt(txCard.cost),
    isModifier: txCard.card_id >= 600 && txCard.card_id < 700,
    isSpecial: txCard.card_id >= 300 && txCard.card_id < 400,
    id: idx?.toString() ?? "",
    idx,
    card_id,
    purchased: txCard.purchased,
    img: `${card_id}.png`,
    temporary: txCard.temporary,
    temporary_price: parseInt(txCard.temporary_cost),
    discount_cost: parseInt(txCard.discount_cost),
    temporary_discount_cost: parseInt(txCard.temporary_discount_cost),
  };
};

const getPokerHandItem = (txPokerHand: any) => {
  return {
    game_id: parseInt(txPokerHand.game_id),
    idx: parseInt(txPokerHand.idx),
    poker_hand: Object.entries(txPokerHand.poker_hand.variant).find(
      ([key, value]) => value !== undefined && value !== null
    )?.[0] as unknown as CardItemType,
    level: parseInt(txPokerHand.level),
    cost: parseInt(txPokerHand.cost),
    purchased: txPokerHand.purchased,
    discount_cost: txPokerHand.discount_cost
      ? parseInt(txPokerHand.discount_cost)
      : 0,
    multi: parseInt(txPokerHand.multi),
    points: parseInt(txPokerHand.points),
  };
};

const getBlisterPack = (txBlisterPack: any) => {
  return {
    blister_pack_id: parseInt(txBlisterPack.blister_pack_id),
    cost: parseInt(txBlisterPack.cost),
    purchased: txBlisterPack.purchased,
    game_id: parseInt(txBlisterPack.game_id),
    idx: parseInt(txBlisterPack.idx),
    discount_cost: parseInt(txBlisterPack.discount_cost),
  };
};

const getPowerUp = (txPowerUp: any) => {
  return {
    game_id: parseInt(txPowerUp.game_id),
    idx: parseInt(txPowerUp.idx),
    power_up_id: parseInt(txPowerUp.power_up_id),
    discount_cost: parseInt(txPowerUp.discount_cost),
    cost: parseInt(txPowerUp.cost),
    purchased: txPowerUp.purchased,
    img: `/powerups/${txPowerUp.power_up_id}.png`,
    img_big: `/powerups/big/${txPowerUp.power_up_id}.png`,
  };
};

export const getShopItems = async (client: any, gameId: number) => {
  if (gameId != 0) {
    try {
      let tx_result = await client.shop_system.getShopItems(gameId);
      console.log(tx_result);
      const modifiersAndCommonCards = tx_result[CARDS_IDX].map(
        (txCard: any) => {
          return getCard(txCard);
        }
      );

      const modifierCards = modifiersAndCommonCards.filter(
        (card: Card) => card.isModifier
      );
      const commonCards = modifiersAndCommonCards.filter(
        (card: Card) => !card.isModifier && !card.isSpecial
      );

      const specialCards = tx_result[SPECIALS_IDX].map((txCard: any) => {
        return getCard(txCard);
      });
      const pokerHandItems = tx_result[POKER_HANDS_IDX].map(
        (txPokerHand: any) => {
          return getPokerHandItem(txPokerHand);
        }
      );
      const packs = tx_result[BLISTER_PACKS_IDX].map((txBlisterPack: any) => {
        return getBlisterPack(txBlisterPack);
      });
      const specialSlotItem = {
        game_id: parseInt(tx_result[SLOTS_IDX].game_id),
        cost: parseInt(tx_result[SLOTS_IDX].cost),
        purchased: tx_result[SLOTS_IDX].purchased,
        discount_cost: parseInt(tx_result[SLOTS_IDX].discount_cost),
      };

      const burnItem = {
        game_id: parseInt(tx_result[BURN_IDX].game_id),
        cost: parseInt(tx_result[BURN_IDX].cost),
        purchased: tx_result[BURN_IDX].purchased,
        discount_cost: parseInt(tx_result[BURN_IDX].discount_cost),
      };

      const rerollInformation = {
        rerollCost: parseInt(tx_result[REROLL_IDX].cost),
        rerollExecuted: tx_result[REROLL_IDX].purchased,
      };

      const powerUpItems = tx_result[POWERUPS_IDX].map((txPowerUp: any) => {
        return getPowerUp(txPowerUp);
      });

      return {
        specialCards,
        modifierCards,
        commonCards,
        pokerHandItems,
        packs,
        specialSlotItem,
        rerollInformation,
        cash: parseInt(tx_result[CASH_IDX]),
        burnItem,
        powerUpItems,
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
      powerUpItems: [],
    };
  }
};

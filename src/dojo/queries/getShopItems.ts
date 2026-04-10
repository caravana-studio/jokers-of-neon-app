import { Card } from "../../types/Card";
import {
  BurnItem,
  CardItemType,
  SlotSpecialCardsItem,
} from "../typescript/models.gen";

export const EMPTY_SPECIAL_SLOT_ITEM: SlotSpecialCardsItem = {
  game_id: 0,
  cost: 0,
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
const CASH_IDX = 7;

const toInt = (value: any): number => {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") return parseInt(value);
  return parseInt(value?.toString?.() ?? "0");
};

const hasUnavailableZeroId = (id: any, cost: any): boolean =>
  toInt(id) === 0 && toInt(cost) === 0;

const getVariantKey = (variantContainer: any): string | undefined =>
  Object.entries(variantContainer?.variant ?? {}).find(
    ([, value]) => value !== undefined && value !== null
  )?.[0];

const getCard = (txCard: any) => {
  const idx = toInt(txCard.idx);
  const card_id = toInt(txCard.card_id);
  return {
    price: toInt(txCard.cost),
    isModifier: card_id >= 600 && card_id < 700,
    isSpecial: card_id >= 10000 && card_id < 20000,
    id: idx?.toString() ?? "",
    idx,
    card_id,
    purchased: txCard.purchased,
    img: `${card_id}.png`,
    temporary: txCard.temporary,
    temporary_price: toInt(txCard.temporary_cost),
    discount_cost: toInt(txCard.discount_cost),
    temporary_discount_cost: toInt(txCard.temporary_discount_cost),
  };
};

const getPokerHandItem = (txPokerHand: any) => {
  return {
    game_id: toInt(txPokerHand.game_id),
    idx: toInt(txPokerHand.idx),
    poker_hand: getVariantKey(txPokerHand.poker_hand) as unknown as CardItemType,
    level: toInt(txPokerHand.level),
    cost: toInt(txPokerHand.cost),
    purchased: txPokerHand.purchased,
    discount_cost: txPokerHand.discount_cost ? toInt(txPokerHand.discount_cost) : 0,
    multi: toInt(txPokerHand.multi),
    points: toInt(txPokerHand.points),
  };
};

const getBlisterPack = (txBlisterPack: any) => {
  return {
    blister_pack_id: toInt(txBlisterPack.blister_pack_id),
    cost: toInt(txBlisterPack.cost),
    purchased: txBlisterPack.purchased,
    game_id: toInt(txBlisterPack.game_id),
    idx: toInt(txBlisterPack.idx),
    discount_cost: toInt(txBlisterPack.discount_cost),
  };
};

const getPowerUp = (txPowerUp: any) => {
  return {
    game_id: toInt(txPowerUp.game_id),
    idx: toInt(txPowerUp.idx),
    power_up_id: toInt(txPowerUp.power_up_id),
    discount_cost: toInt(txPowerUp.discount_cost),
    cost: toInt(txPowerUp.cost),
    purchased: txPowerUp.purchased,
    img: `/powerups/${txPowerUp.power_up_id}.png`,
  };
};

export const getShopItems = async (client: any, gameId: number) => {
  if (gameId != 0) {
    try {
      let tx_result = await client.shop_views.getShopItems(gameId);
      const rawPokerHands = tx_result[POKER_HANDS_IDX] ?? [];

      const modifiersAndCommonCards = tx_result[CARDS_IDX]
        .filter((txCard: any) => {
          const itemType = getVariantKey(txCard.item_type);
          if (itemType === "None") return false;
          return !hasUnavailableZeroId(txCard.card_id, txCard.cost);
        })
        .map(
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

      const specialCards = tx_result[SPECIALS_IDX]
        .filter(
          (txCard: any) => toInt(txCard.card_id) > 0
        )
        .map((txCard: any) => {
          return getCard(txCard);
        });
      const pokerHandsFilteredByIdx = rawPokerHands
        .filter((txPokerHand: any) => {
          const pokerHand = getVariantKey(txPokerHand.poker_hand);
          if (pokerHand === "None") return false;
          // Some valid contract responses use idx=0 for the first level-up item.
          return toInt(txPokerHand.idx) >= 0;
        });

      const pokerHandItems = pokerHandsFilteredByIdx.map((txPokerHand: any) => {
          return getPokerHandItem(txPokerHand);
      });

      const packs = tx_result[BLISTER_PACKS_IDX]
        .filter(
          (txBlisterPack: any) =>
            toInt(txBlisterPack.blister_pack_id) > 0
        )
        .map((txBlisterPack: any) => {
          return getBlisterPack(txBlisterPack);
        });
      const specialSlotItem = {
        game_id: toInt(tx_result[SLOTS_IDX].game_id),
        cost: toInt(tx_result[SLOTS_IDX].cost),
        purchased: tx_result[SLOTS_IDX].purchased,
        discount_cost: toInt(tx_result[SLOTS_IDX].discount_cost),
      };

      const burnItem = {
        game_id: toInt(tx_result[BURN_IDX].game_id),
        cost: toInt(tx_result[BURN_IDX].cost),
        purchased: tx_result[BURN_IDX].purchased,
        discount_cost: toInt(tx_result[BURN_IDX].discount_cost),
      };

      const powerUpItems = tx_result[POWERUPS_IDX]
        .filter(
          (txPowerUp: any) =>
            toInt(txPowerUp.power_up_id) > 0
        )
        .map((txPowerUp: any) => {
          return getPowerUp(txPowerUp);
        });

      return {
        specialCards,
        modifierCards,
        commonCards,
        pokerHandItems,
        packs,
        specialSlotItem,
        cash: toInt(tx_result[CASH_IDX]),
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
      cash: 0,
      burnItem: EMPTY_BURN_ITEM,
      powerUpItems: [],
    };
  }
};

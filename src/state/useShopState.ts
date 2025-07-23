import { useEffect, useState } from "react";
import { getNode } from "../dojo/queries/getNode";
import {
  EMPTY_BURN_ITEM,
  EMPTY_SPECIAL_SLOT_ITEM,
  getShopItems,
} from "../dojo/queries/getShopItems";
import {
  BlisterPackItem,
  BurnItem,
  SlotSpecialCardsItem,
} from "../dojo/typescript/models.gen";
import { useDojo } from "../dojo/useDojo";
import { Card } from "../types/Card";
import { PokerHandItem } from "../types/PokerHandItem";
import { PowerUp } from "../types/Powerup/PowerUp";
import { useGameStore } from "./useGameStore";

export interface ShopItems {
  specialCards: Card[];
  modifierCards: Card[];
  commonCards: Card[];
  pokerHandItems: PokerHandItem[];
  packs: BlisterPackItem[];
  specialSlotItem: SlotSpecialCardsItem;
  burnItem: BurnItem;
  powerUps: PowerUp[];
}

const sortByCardId = (a: Card, b: Card) => {
  return (a.card_id ?? 0) - (b.card_id ?? 0);
};
const sortByPackId = (a: BlisterPackItem, b: BlisterPackItem) => {
  return (Number(a.blister_pack_id) ?? 0) - (Number(b.blister_pack_id) ?? 0);
};
const sortByPokerHand = (a: PokerHandItem, b: PokerHandItem) => {
  return a.poker_hand.localeCompare(b.poker_hand);
};

const sortByPowerUpId = (a: PowerUp, b: PowerUp) => {
  return (Number(a.power_up_id) ?? 0) - (Number(b.power_up_id) ?? 0);
};

export const useShopState = () => {
  const {
    setup: { client },
  } = useDojo();

  const [run, setRun] = useState(false);
  const [loading, setLoading] = useState(true);

  const [specialCards, setSpecialCards] = useState<Card[]>([]);
  const [modifierCards, setModifierCards] = useState<Card[]>([]);
  const [commonCards, setCommonCards] = useState<Card[]>([]);
  const [pokerHandItems, setPokerHandItems] = useState<PokerHandItem[]>([]);
  const [blisterPackItems, setBlisterPackItems] = useState<BlisterPackItem[]>(
    []
  );
  const [specialSlotItem, setSpecialSlotItem] = useState<SlotSpecialCardsItem>(
    EMPTY_SPECIAL_SLOT_ITEM
  );
  const [burnItem, setBurnItem] = useState<BurnItem>(EMPTY_BURN_ITEM);

  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);

  const {
    cash,
    addCash,
    removeCash,
    setCash,
    addSpecialSlot,
    removeSpecialSlot,
  } = useGameStore();

  const [rerolling, setRerolling] = useState(false);

  const buyItem = (
    idx: number,
    setFn: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    setFn((prev) =>
      prev.map((item) => {
        /*         if (item.idx === idx) {
          const cost = item.price ?? item.cost_discount ?? item.cost;
          cost && removeCash(cost);
        } */
        return item.idx === idx ? { ...item, purchased: true } : item;
      })
    );
  };

  const rollbackBuyItem = (
    idx: number,
    setFn: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    setFn((prev) =>
      prev.map((item) => {
        if (item.idx === idx && item.purchased) {
          const cost = item.price ?? item.cost_discount ?? item.cost;
          cost && addCash(cost);
          return { ...item, purchased: false };
        }
        return item;
      })
    );
  };

  const buySpecialCard = (idx: number) => {
    buyItem(idx, setSpecialCards);
  };
  const buyModifierCard = (idx: number) => {
    buyItem(idx, setModifierCards);
  };
  const buyCommonCard = (idx: number) => {
    buyItem(idx, setCommonCards);
  };
  const buyPokerHand = (idx: number) => {
    const item = pokerHandItems.find((item) => item.idx === idx);
    if (item) {
      const cost = item.cost ?? item.discount_cost ?? item.cost;
      cost && removeCash(cost);
    }
    buyItem(idx, setPokerHandItems);
  };
  const buyBlisterPack = (idx: number) => {
    buyItem(idx, setBlisterPackItems);
  };
  const buySlotSpecialCard = () => {
    setSpecialSlotItem((prev) => ({ ...prev, purchased: true }));
    addSpecialSlot();
  };

  const buyPowerUp = (idx: number) => {
    buyItem(idx, setPowerUps);
  };

  const rollbackBuyPowerUp = (idx: number) => {
    rollbackBuyItem(idx, setPowerUps);
  };

  const rollbackBuySpecialCard = (idx: number) => {
    rollbackBuyItem(idx, setSpecialCards);
  };
  const rollbackBuyModifierCard = (idx: number) => {
    rollbackBuyItem(idx, setModifierCards);
  };
  const rollbackBuyCommonCard = (idx: number) => {
    rollbackBuyItem(idx, setCommonCards);
  };
  const rollbackBuyPokerHand = (idx: number) => {
    rollbackBuyItem(idx, setPokerHandItems);
  };
  const rollbackBuyBlisterPack = (idx: number) => {
    rollbackBuyItem(idx, setBlisterPackItems);
  };
  const rollbackBuySlotSpecialCard = () => {
    setSpecialSlotItem((prev) => ({ ...prev, purchased: false }));
    removeSpecialSlot();
  };

  const { id: gameId, round: currentNodeId } = useGameStore();

  const [shopId, setShopId] = useState<number>(0);

  useEffect(() => {
    if (currentNodeId) {
      getNode(client, gameId, currentNodeId).then((shopId) => {
        console.log("shopId", shopId);
        setShopId(shopId);
      });
    }
  }, [currentNodeId]);

  const fetchShopItems = async () => {
    const shopItems = await getShopItems(client, gameId);
    console.log("shopItems", shopItems);
    setLoading(false);
    if (shopItems) {
      setSpecialCards(shopItems.specialCards);
      setModifierCards(shopItems.modifierCards);
      setCommonCards(shopItems.commonCards);
      setPokerHandItems(shopItems.pokerHandItems);
      setBlisterPackItems(shopItems.packs);
      setSpecialSlotItem({ ...shopItems.specialSlotItem });
      Number(shopItems.cash) && setCash(Number(shopItems.cash));
      setBurnItem({ ...shopItems.burnItem });
      setPowerUps(shopItems.powerUpItems);
    }
  };

  const shopItems: ShopItems = {
    specialCards: specialCards.sort(sortByCardId),
    modifierCards: modifierCards.sort(sortByCardId),
    commonCards: commonCards.sort(sortByCardId),
    pokerHandItems: pokerHandItems.sort(sortByPokerHand),
    packs: blisterPackItems.sort(sortByPackId),
    specialSlotItem,
    burnItem,
    powerUps: powerUps.sort(sortByPowerUpId),
  };

  return {
    shopItems,
    fetchShopItems,
    cash,
    buySpecialCard,
    buyModifierCard,
    buyCommonCard,
    buyPokerHand,
    buyBlisterPack,
    buySlotSpecialCard,
    buyPowerUp,
    rollbackBuySpecialCard,
    rollbackBuyModifierCard,
    rollbackBuyCommonCard,
    rollbackBuyPokerHand,
    rollbackBuyBlisterPack,
    rollbackBuySlotSpecialCard,
    rollbackBuyPowerUp,
    run,
    setRun,
    loading,
    setLoading,
    rerolling,
    setRerolling,
    shopId,
  };
};

import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { ShopTierUnlockedEvent } from "../../types/ScoreData";
import { decodeString } from "../../dojo/utils/decodeString";
import {
  getShopUnlockIdFromLegacyTier,
  normalizeShopUnlockableId,
} from "../../constants/shopTierUnlock";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const SHOP_TIER_UNLOCKED_EVENT_KEY = getEventKey(DojoEvents.SHOP_TIER_UNLOCKED);

const getUnlockIdFromEventValue = (
  shopTierUnlockedEvent: DojoEvent
): string => {
  const encodedUnlockId =
    shopTierUnlockedEvent.data.at(4) ?? shopTierUnlockedEvent.data.at(1);

  if (encodedUnlockId) {
    try {
      const decoded = decodeString(encodedUnlockId);
      console.log("[unlock-debug] decoded unlock id from felt", {
        encodedUnlockId,
        decoded,
      });
      return normalizeShopUnlockableId(decoded);
    } catch {
      const legacyTierId = Number.parseInt(encodedUnlockId, 16);
      if (!Number.isNaN(legacyTierId) && legacyTierId > 0) {
        console.log("[unlock-debug] unlock id felt parsed as legacy tier", {
          encodedUnlockId,
          legacyTierId,
        });
        return getShopUnlockIdFromLegacyTier(legacyTierId) ?? "";
      }

      console.log("[unlock-debug] unlock id felt decode fallback", {
        encodedUnlockId,
      });
      return normalizeShopUnlockableId(encodedUnlockId);
    }
  }

  const legacyTierId =
    getNumberValueFromEvent(shopTierUnlockedEvent, 4) ??
    getNumberValueFromEvent(shopTierUnlockedEvent, 1) ??
    0;

  return getShopUnlockIdFromLegacyTier(legacyTierId) ?? "";
};

const parseShopTierUnlockedEvent = (
  shopTierUnlockedEvent: DojoEvent,
  matchingEventsCount: number
): ShopTierUnlockedEvent | undefined => {
  const game_id =
    getNumberValueFromEvent(shopTierUnlockedEvent, 3) ??
    getNumberValueFromEvent(shopTierUnlockedEvent, 0) ??
    0;
  const unlock_id = getUnlockIdFromEventValue(shopTierUnlockedEvent);

  if (!unlock_id) {
    console.warn("[unlock-debug] found TierUnlockedEvent but unlock id is empty", {
      shopTierUnlockedEvent,
      matchingEventsCount,
    });
    return undefined;
  }

  console.log("[unlock-debug] parsed TierUnlockedEvent", {
    game_id,
    unlock_id,
    rawEvent: shopTierUnlockedEvent,
    matchingEventsCount,
  });

  return {
    game_id,
    unlock_id,
  };
};

export const getShopTierUnlockedEvents = (
  events: DojoEvent[]
): ShopTierUnlockedEvent[] =>
  events
    .filter((event) => event.keys.includes(SHOP_TIER_UNLOCKED_EVENT_KEY))
    .map((event, _, matchingEvents) =>
      parseShopTierUnlockedEvent(event, matchingEvents.length)
    )
    .filter((event): event is ShopTierUnlockedEvent => Boolean(event));

export const getShopTierUnlockedEvent = (
  events: DojoEvent[]
): ShopTierUnlockedEvent | undefined => getShopTierUnlockedEvents(events)[0];

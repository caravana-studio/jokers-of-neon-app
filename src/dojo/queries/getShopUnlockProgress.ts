import { normalizeShopUnlockableId } from "../../constants/shopTierUnlock";
import { decodeString } from "../utils/decodeString";

export interface PlayerTierProgress {
  tier: number;
  totalRuns?: number;
  maxLevel?: number;
  maxRound?: number;
  raw: unknown;
}

export interface UnlockEntryView {
  order: number;
  unlockId: string;
  runs?: number;
  maxLevel?: number;
  maxRound?: number;
  shopType?: string;
  raw: unknown;
}

const toNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") {
    if (!value) return undefined;
    if (value.startsWith("0x")) {
      const parsed = Number.parseInt(value, 16);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const readField = (source: any, keys: string[]) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }
  return undefined;
};

const parseVariant = (value: unknown): string | undefined => {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return undefined;

  const variant = (value as any).variant;
  if (variant && typeof variant === "object") {
    const variantKey = Object.entries(variant).find(
      ([, variantValue]) => variantValue !== undefined && variantValue !== null
    )?.[0];
    if (variantKey) return variantKey;
  }

  const firstKey = Object.entries(value as Record<string, unknown>).find(
    ([, variantValue]) => variantValue !== undefined && variantValue !== null
  )?.[0];
  return firstKey;
};

const parseUnlockId = (value: unknown, fallbackOrder: number): string => {
  if (typeof value === "string") {
    if (value.startsWith("0x")) {
      try {
        return normalizeShopUnlockableId(decodeString(value));
      } catch {
        return normalizeShopUnlockableId(value);
      }
    }
    return normalizeShopUnlockableId(value);
  }

  if (typeof value === "number" || typeof value === "bigint") {
    try {
      return normalizeShopUnlockableId(decodeString(value));
    } catch {
      return `unlock_${fallbackOrder}`;
    }
  }

  return `unlock_${fallbackOrder}`;
};

const getArrayFromResponse = (rawResponse: unknown): any[] => {
  if (Array.isArray(rawResponse)) return rawResponse;
  if (!rawResponse || typeof rawResponse !== "object") return [];

  const responseObj = rawResponse as Record<string, unknown>;

  if (Array.isArray(responseObj.items)) return responseObj.items as any[];
  if (Array.isArray(responseObj["0"])) return responseObj["0"] as any[];

  const numericKeys = Object.keys(responseObj)
    .filter((key) => /^\d+$/.test(key))
    .sort((a, b) => Number(a) - Number(b));

  if (!numericKeys.length) return [];

  return numericKeys.map((key) => responseObj[key]);
};

const normalizePlayerTier = (rawResponse: unknown): PlayerTierProgress => {
  const source =
    (rawResponse as any)?.["0"] && typeof (rawResponse as any)?.["0"] === "object"
      ? (rawResponse as any)["0"]
      : rawResponse;

  if (Array.isArray(source)) {
    return {
      tier: toNumber(source[0]) ?? 0,
      totalRuns: toNumber(source[1]),
      maxLevel: toNumber(source[2]),
      maxRound: toNumber(source[3]),
      raw: rawResponse,
    };
  }

  return {
    tier:
      toNumber(readField(source, ["tier", "player_tier", "current_tier"])) ?? 0,
    totalRuns: toNumber(
      readField(source, ["total_runs", "runs", "completed_runs"])
    ),
    maxLevel: toNumber(readField(source, ["max_level", "highest_level"])),
    maxRound: toNumber(readField(source, ["max_round", "highest_round"])),
    raw: rawResponse,
  };
};

const normalizeUnlockEntry = (
  rawEntry: unknown,
  fallbackOrder: number
): UnlockEntryView => {
  if (typeof rawEntry !== "object" || rawEntry === null) {
    return {
      order: fallbackOrder,
      unlockId: parseUnlockId(rawEntry, fallbackOrder),
      raw: rawEntry,
    };
  }

  const entry = rawEntry as Record<string, unknown>;
  const order =
    toNumber(readField(entry, ["order", "tier", "unlock_order"])) ??
    fallbackOrder;
  const unlockId = parseUnlockId(
    readField(entry, ["id", "unlock_id", "unlockId", "tier_id"]),
    order
  );

  return {
    order,
    unlockId,
    runs: toNumber(readField(entry, ["runs", "required_runs", "runs_needed"])),
    maxLevel: toNumber(
      readField(entry, ["max_level", "required_level", "level"])
    ),
    maxRound: toNumber(
      readField(entry, ["max_round", "required_round", "round"])
    ),
    shopType: parseVariant(readField(entry, ["shop_type", "shopType"])),
    raw: rawEntry,
  };
};

export const getPlayerTier = async (
  client: any,
  playerAddress: string
): Promise<PlayerTierProgress> => {
  const rawResponse = await client.shop_views.getPlayerTier(playerAddress);

  return normalizePlayerTier(rawResponse);
};

export const getUnlockList = async (
  client: any
): Promise<UnlockEntryView[]> => {
  const rawResponse = await client.shop_views.getUnlockList();

  const entries = getArrayFromResponse(rawResponse).map((entry, index) =>
    normalizeUnlockEntry(entry, index + 1)
  );

  return entries.sort((a, b) => a.order - b.order);
};

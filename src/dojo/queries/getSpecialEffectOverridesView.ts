export interface SpecialEffectOverrideView {
  idx: number;
  original_effect_card_id: number;
  copied_from_idx: number;
  copied_effect_card_id: number;
}

type SpecialEffectOverrideDojo = {
  idx?: unknown;
  original_effect_card_id?: unknown;
  originalEffectCardId?: unknown;
  copied_from_idx?: unknown;
  copiedFromIdx?: unknown;
  copied_effect_card_id?: unknown;
  copiedEffectCardId?: unknown;
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") {
    if (value.startsWith("0x")) return Number(BigInt(value));
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const mapOverride = (
  override: SpecialEffectOverrideDojo
): SpecialEffectOverrideView => ({
  idx: toNumber(override.idx),
  original_effect_card_id: toNumber(
    override.original_effect_card_id ?? override.originalEffectCardId
  ),
  copied_from_idx: toNumber(override.copied_from_idx ?? override.copiedFromIdx),
  copied_effect_card_id: toNumber(
    override.copied_effect_card_id ?? override.copiedEffectCardId
  ),
});

const normalizeOverrides = (raw: unknown): SpecialEffectOverrideView[] => {
  if (Array.isArray(raw)) {
    return raw.map((override) => mapOverride(override as SpecialEffectOverrideDojo));
  }

  return [];
};

export const getSpecialEffectOverridesView = async (
  client: any,
  gameId: number
): Promise<SpecialEffectOverrideView[]> => {
  try {
    const gameViews = client?.game_views;

    const getOverrides =
      gameViews?.getSpecialEffectOverrides ??
      gameViews?.get_special_effect_overrides;

    if (typeof getOverrides !== "function") {
      console.warn(
        "[special-effect-overrides] game view method not available in client"
      );
      return [];
    }

    const txResult = await getOverrides(gameId);
    return normalizeOverrides(txResult);
  } catch (error) {
    console.error("error getting special effect overrides view", error);
    return [];
  }
};

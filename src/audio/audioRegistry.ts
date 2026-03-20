export interface SfxEntry {
  path: string;
  channels: number;
}

export const SFX_REGISTRY: SfxEntry[] = [
  // Card interactions
  { path: "/music/card-selection.mp3", channels: 3 },
  { path: "/music/card-drag.mp3", channels: 2 },
  { path: "/music/deal.mp3", channels: 6 },

  // Game actions
  { path: "/music/play.mp3", channels: 1 },
  { path: "/music/discard.mp3", channels: 1 },

  // Scoring sounds
  { path: "/music/s-cash.mp3", channels: 2 },
  { path: "/music/s-point.mp3", channels: 2 },
  { path: "/music/s-multi.mp3", channels: 2 },
  { path: "music/s-negative-multi.mp3", channels: 1 },
  { path: "music/acum-card.mp3", channels: 2 },

  // Level/Round progression
  { path: "/music/level-up.mp3", channels: 1 },
  { path: "music/clear_round.mp3", channels: 1 },
  { path: "music/clear_level.mp3", channels: 1 },

  // Shop sounds
  { path: "/music/buy-item.mp3", channels: 1 },
  { path: "/music/reroll-store.mp3", channels: 1 },

  // Pack opening
  { path: "/music/loot.mp3", channels: 1 },
  { path: "/music/pack_cut.mp3", channels: 1 },
  { path: "/music/pack_result.mp3", channels: 1 },

  // Other
  { path: "music/loose.mp3", channels: 1 },
  { path: "music/achievement-sfx.mp3", channels: 1 },

  // Rolling number sounds (different durations)
  { path: "music/points_15_ms.mp3", channels: 1 },
  { path: "music/points_1_seg.mp3", channels: 1 },
  { path: "music/points_2_segs.mp3", channels: 1 },
  { path: "music/points_3_segs.mp3", channels: 1 },
  { path: "music/points_4_segs.mp3", channels: 1 },
  { path: "music/points_5_segs.mp3", channels: 1 },

  // Pitched audio variants (points_0.mp3 to points_17.mp3)
  ...Array.from({ length: 18 }, (_, i) => ({
    path: `/music/sfx/points_${i}.mp3`,
    channels: 1,
  })),
];

export const normalizePath = (path: string): string => {
  return path.replace(/^\/+/, "");
};

const SFX_VOLUME_MULTIPLIERS: Record<string, number> = {
  "music/deal.mp3": 0.3,
};

export const getSfxVolumeMultiplier = (path: string): number => {
  const normalized = normalizePath(path);
  return SFX_VOLUME_MULTIPLIERS[normalized] ?? 1;
};

export const toNativeAssetPath = (path: string): string => {
  const sanitized = normalizePath(path);
  return sanitized.startsWith("public/") ? sanitized : `public/${sanitized}`;
};

export const toWebAssetPath = (path: string): string => {
  const sanitized = normalizePath(path);
  return `${import.meta.env.BASE_URL}${sanitized}`;
};

export const toNativeAssetId = (path: string): string => {
  return `sfx_${normalizePath(path).replace(/[^\w-]/g, "_")}`;
};

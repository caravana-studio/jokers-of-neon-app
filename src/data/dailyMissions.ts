import i18n from "../i18n";
import { DailyMissionDifficulty, MissionPeriodType } from "../types/DailyMissions";

export const MISSION_PERIOD = {
  DAILY: 1,
  WEEKLY: 2,
} as const;

export const MISSION_DIFFICULTY_ID: Record<DailyMissionDifficulty, number> = {
  [DailyMissionDifficulty.EASY]: 1,
  [DailyMissionDifficulty.MEDIUM]: 2,
  [DailyMissionDifficulty.HARD]: 3,
};

export const DAILY_XP_PER_DIFFICULTY: Record<DailyMissionDifficulty, number> = {
  [DailyMissionDifficulty.EASY]: 10,
  [DailyMissionDifficulty.MEDIUM]: 20,
  [DailyMissionDifficulty.HARD]: 30,
};

export const WEEKLY_XP_PER_DIFFICULTY: Record<DailyMissionDifficulty, number> = {
  [DailyMissionDifficulty.EASY]: 100,
  [DailyMissionDifficulty.MEDIUM]: 200,
  [DailyMissionDifficulty.HARD]: 300,
};

export const MISSION_TEMPLATE_IDS = [
  "daily-play-hand",
  "daily-reach-level",
  "daily-buy-neon-joker",
  "daily-add-trad",
  "daily-add-mod",
  "daily-add-neon",
  "daily-flush-suit",
  "daily-deck-size",
  "daily-deck-neon",
  "daily-deck-jokers",
  "daily-deck-neon-jokers",
  "daily-round-no-discards",
  "daily-all-neon-hand",
  "daily-play-hand-count",
  "daily-score-single",
  "daily-deck-suit",
  "daily-deck-neon-suit",
  "daily-deck-wild",
  "daily-add-suit",
  "weekly-start-games",
  "weekly-score",
  "weekly-lootboxes",
  "weekly-specials",
  "weekly-free-packs",
  "weekly-daily-done",
  "weekly-play-hand",
  "weekly-defeat-rages",
  "weekly-burn-cards",
  "weekly-sell-specials",
  "weekly-win-rounds",
  "weekly-win-levels",
  "weekly-round-no-discards",
  "weekly-burn-neon",
  "weekly-burn-modifier",
  "weekly-buy-trad",
  "weekly-buy-neon-joker",
  "weekly-neon-hands",
  "weekly-use-power-ups",
  "weekly-rerolls",
  "weekly-special-slots",
  "weekly-sell-power-ups",
  "weekly-complete-runs",
] as const;

export type MissionTemplateId = (typeof MISSION_TEMPLATE_IDS)[number];

export const LEGACY_DAILY_MISSIONS: Record<string, DailyMissionDifficulty> = {
  "score-1": DailyMissionDifficulty.EASY,
  "burn-1": DailyMissionDifficulty.EASY,
  "buy-special-1": DailyMissionDifficulty.EASY,
  "deck-1": DailyMissionDifficulty.EASY,
  "neon-1": DailyMissionDifficulty.EASY,
  "power-up-1": DailyMissionDifficulty.EASY,
  "sell-1": DailyMissionDifficulty.EASY,
  "round-last-hand-1": DailyMissionDifficulty.EASY,
  "round-only-hand-1": DailyMissionDifficulty.EASY,
  "loot-box-1": DailyMissionDifficulty.EASY,
  "cash-1": DailyMissionDifficulty.MEDIUM,
  "round-without-discards-1": DailyMissionDifficulty.MEDIUM,
  "high-card-1": DailyMissionDifficulty.MEDIUM,
  "score-2": DailyMissionDifficulty.MEDIUM,
  "rage-round-1": DailyMissionDifficulty.MEDIUM,
  "rage-round-2": DailyMissionDifficulty.MEDIUM,
  "level-up-1": DailyMissionDifficulty.MEDIUM,
  "neon-flush-1": DailyMissionDifficulty.MEDIUM,
  "neon-play-1": DailyMissionDifficulty.MEDIUM,
  "one-neon-jokers-in-deck-1": DailyMissionDifficulty.MEDIUM,
  "slot-1": DailyMissionDifficulty.HARD,
  "score-3": DailyMissionDifficulty.HARD,
  "rage-round-3": DailyMissionDifficulty.HARD,
  "five-jokers-in-deck-1": DailyMissionDifficulty.HARD,
  "five-of-a-kind-1": DailyMissionDifficulty.HARD,
  "level-up-2": DailyMissionDifficulty.HARD,
  "play-least-three-joker": DailyMissionDifficulty.HARD,
  "play-least-three-neon-joker": DailyMissionDifficulty.HARD,
  "royal-flush-without-jokers-1": DailyMissionDifficulty.HARD,
  "straight-flush-1": DailyMissionDifficulty.HARD,
};

export const getMissionDifficulty = (difficulty: unknown): DailyMissionDifficulty => {
  const numeric = Number(difficulty);
  if (numeric === MISSION_DIFFICULTY_ID[DailyMissionDifficulty.MEDIUM]) {
    return DailyMissionDifficulty.MEDIUM;
  }
  if (numeric === MISSION_DIFFICULTY_ID[DailyMissionDifficulty.HARD]) {
    return DailyMissionDifficulty.HARD;
  }
  return DailyMissionDifficulty.EASY;
};

export const getMissionPeriodType = (periodType: unknown): MissionPeriodType => {
  return Number(periodType) === MISSION_PERIOD.WEEKLY ? "weekly" : "daily";
};

export const getFallbackMissionXp = (
  periodType: MissionPeriodType,
  difficulty: DailyMissionDifficulty
) => {
  return periodType === "weekly"
    ? WEEKLY_XP_PER_DIFFICULTY[difficulty]
    : DAILY_XP_PER_DIFFICULTY[difficulty];
};

const getPokerHandLabel = (handId?: number) => {
  if (!handId) {
    return i18n.t("missionParams.hand.selected", { ns: "achievements" });
  }
  return i18n.t(`missionParams.hand.${handId}`, { ns: "achievements" });
};

const getSuitLabel = (suitId?: number) => {
  if (!suitId) {
    return i18n.t("missionParams.suit.selected", { ns: "achievements" });
  }
  return i18n.t(`missionParams.suit.${suitId}`, { ns: "achievements" });
};

export const renderMissionDescription = ({
  templateId,
  target,
  param1,
  param2,
}: {
  templateId: string;
  target?: number | string;
  param1?: number;
  param2?: number;
}) => {
  const key = `missionTemplates.${templateId}`;
  const translated = i18n.t(key, {
    ns: "achievements",
    target,
    quantity: target,
    score: typeof target === "number" ? target.toLocaleString() : target,
    level: target,
    hand: getPokerHandLabel(param1),
    suit: getSuitLabel(param1),
    neonVariant: param2 === 1,
  });

  if (translated !== key) {
    return translated;
  }

  return i18n.t(`data.${templateId}`, {
    ns: "achievements",
    defaultValue: i18n.t("missionTemplates.unknown", {
      ns: "achievements",
      target,
    }),
  });
};

const getMissionTemplateTargetPlaceholder = (templateId: string) => {
  if (templateId.includes("score")) {
    return "{score}";
  }
  if (templateId.includes("level")) {
    return "{level}";
  }
  return "{quantity}";
};

export const renderMissionTemplatePlaceholder = (templateId: string) =>
  renderMissionDescription({
    templateId,
    target: getMissionTemplateTargetPlaceholder(templateId),
  });

export const getMissionTemplateExamples = () =>
  MISSION_TEMPLATE_IDS.map((templateId) => ({
    templateId,
    target: templateId.includes("score") ? 10000 : 3,
    param1: templateId.includes("suit") || templateId.includes("flush") ? 4 : templateId.includes("hand") ? 7 : 0,
    param2: templateId === "daily-play-hand" ? 1 : 0,
  }));

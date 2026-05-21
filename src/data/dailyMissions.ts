import i18n from "../i18n";
import {
  DailyMissionDifficulty,
  MissionPeriodType,
} from "../types/DailyMissions";

export const MISSION_PERIOD = {
  DAILY: 1,
  WEEKLY: 2,
} as const;

export const MISSION_DIFFICULTY_ID: Record<DailyMissionDifficulty, number> = {
  [DailyMissionDifficulty.EASY]: 1,
  [DailyMissionDifficulty.MEDIUM]: 2,
  [DailyMissionDifficulty.HARD]: 3,
};

const HAND_BY_ID = {
  1: "RoyalFlush",
  2: "StraightFlush",
  3: "FiveOfAKind",
  4: "FourOfAKind",
  5: "FullHouse",
  6: "Straight",
  7: "Flush",
  8: "ThreeOfAKind",
  9: "TwoPair",
  10: "OnePair",
  11: "HighCard",
} as const;

const SUIT_BY_ID = {
  1: "club",
  2: "diamond",
  3: "heart",
  4: "spade",
} as const;

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

const getPokerHandLabel = (handId?: number) => {
  if (!handId) {
    return i18n.t("hand.selected", { ns: "plays" });
  }

  const handKey = HAND_BY_ID[handId as keyof typeof HAND_BY_ID];
  if (!handKey) {
    return i18n.t("hand.selected", { ns: "plays" });
  }

  return i18n.t(`playsData.${handKey}.name`, { ns: "plays" });
};

const getSuitLabel = (suitId?: number) => {
  if (!suitId) {
    return i18n.t("game.deck.suit.selected", { ns: "game" });
  }

  const suitKey = SUIT_BY_ID[suitId as keyof typeof SUIT_BY_ID];
  if (!suitKey) {
    return i18n.t("game.deck.suit.selected", { ns: "game" });
  }

  return i18n.t(`game.deck.suit.${suitKey}`, { ns: "game" });
};

const getMissionHandLabel = (
  templateId: string,
  param1?: number,
  param2?: number
) => {
  if (templateId === "daily-flush-suit") {
    return getPokerHandLabel(param2 === 0 ? 7 : param2);
  }
  return getPokerHandLabel(param1);
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
    hand: getMissionHandLabel(templateId, param1, param2),
    suit: getSuitLabel(param1),
    neonVariant: templateId === "daily-play-hand" && param2 === 1,
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

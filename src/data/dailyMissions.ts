import { DailyMissionDifficulty } from "../types/DailyMissions";

export const DAILY_MISSIONS: Record<string, DailyMissionDifficulty> = {
    // Easy difficulty missions
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

    // Medium difficulty missions
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

    // Hard difficulty missions
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

export const XP_PER_DIFFICULTY: Record<DailyMissionDifficulty, number> = {
    [DailyMissionDifficulty.EASY]: 10,
    [DailyMissionDifficulty.MEDIUM]: 20,
    [DailyMissionDifficulty.HARD]: 30,
};

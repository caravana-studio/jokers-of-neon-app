import { DailyMissionDifficulty } from "../types/DailyMissions";

export const DAILY_MISSIONS: Record<string, DailyMissionDifficulty> = {
    // Easy difficulty missions
    "burn-1": DailyMissionDifficulty.EASY,
    "buy-special-1": DailyMissionDifficulty.EASY,
    "cash-1": DailyMissionDifficulty.EASY,
    "deck-1": DailyMissionDifficulty.EASY,
    "five-jokers-in-deck-1": DailyMissionDifficulty.EASY,
    "five-of-a-kind-1": DailyMissionDifficulty.EASY,
    "high-card-1": DailyMissionDifficulty.EASY,
    "level-up-1": DailyMissionDifficulty.EASY,
    "level-up-2": DailyMissionDifficulty.EASY,
    "one-neon-jokers-in-deck-1": DailyMissionDifficulty.EASY,

    // Medium difficulty missions
    "loot-box-1": DailyMissionDifficulty.MEDIUM,
    "neon-1": DailyMissionDifficulty.MEDIUM,
    "neon-flush-1": DailyMissionDifficulty.MEDIUM,
    "play-least-three-joker": DailyMissionDifficulty.MEDIUM,
    "play-least-three-neon-joker": DailyMissionDifficulty.MEDIUM,
    "power-up-1": DailyMissionDifficulty.MEDIUM,
    "rage-round-1": DailyMissionDifficulty.MEDIUM,
    "rage-round-2": DailyMissionDifficulty.MEDIUM,
    "rage-round-3": DailyMissionDifficulty.MEDIUM,
    "round-last-hand-1": DailyMissionDifficulty.MEDIUM,
    "round-only-hand-1": DailyMissionDifficulty.MEDIUM,
    "round-without-discards-1": DailyMissionDifficulty.MEDIUM,

    // Hard difficulty missions
    "games-played-1": DailyMissionDifficulty.HARD,
    "games-played-2": DailyMissionDifficulty.HARD,
    "games-played-3": DailyMissionDifficulty.HARD,
    "neon-play-1": DailyMissionDifficulty.HARD,
    "royal-flush-without-jokers-1": DailyMissionDifficulty.HARD,
    "score-1": DailyMissionDifficulty.HARD,
    "score-2": DailyMissionDifficulty.HARD,
    "score-3": DailyMissionDifficulty.HARD,
    "sell-1": DailyMissionDifficulty.HARD,
    "slot-1": DailyMissionDifficulty.HARD,
    "straight-flush-1": DailyMissionDifficulty.HARD
};

export const XP_PER_DIFFICULTY: Record<DailyMissionDifficulty, number> = {
    [DailyMissionDifficulty.EASY]: 10,
    [DailyMissionDifficulty.MEDIUM]: 20,
    [DailyMissionDifficulty.HARD]: 30,
};
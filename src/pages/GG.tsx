import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { AchievementCompleted } from "../types/ScoreData";
import { handleAchievementPush } from "../utils/pushAchievements";

const controllerAccount = "0x0575c38efE0095933453004C46534b83617a436aA88C8c7AFD2EdBca7b3d91aF";
//   "0x010CC45E3ff2203e63797a8E4DeE0b7f1edcd3D2dd9157C9a5aDc642A04cf263";
const achievementIds = [
  "score-1",
  "score-2",
  "score-3",
    "burn-1",
  "buy-special-1",
    "cash-1",
    // "deck-1",
    "five-jokers-in-deck-1",
    // "one-neon-jokers-in-deck-1",
    "five-of-a-kind-1",
    "high-card-1",
    "level-up-1",
    "level-up-2",
    "loot-box-1",
    "neon-flush-1",
    "neon-1",
    "play-least-three-joker",
    // "play-least-three-neon-joker",
    "power-up-1",
  "rage-round-1",
  "rage-round-2",
  "rage-round-3",
    "round-last-hand-1",
  "round-only-hand-1",
  "round-without-discards-1",
    "royal-flush-without-jokers-1",
    "sell-1",
    "slot-1",
    "straight-flush-1",
    "neon-play-1",
];

const achievementEvents: AchievementCompleted[] = achievementIds.map(
  (achievementId) => ({
    player: controllerAccount,
    achievementId,
  })
);
export const GG = () => {
  return (
    <div>
      GG
      <Button
        onClick={() => handleAchievementPush(achievementEvents, () => {})}
      >
        PUSH ACHIEVEMENTS
      </Button>
    </div>
  );
};

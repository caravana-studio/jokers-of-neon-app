import { useLocation } from "react-router-dom";
import { useGameContext } from "../providers/GameProvider";
import { useGame } from "../dojo/queries/useGame";
import { SHOP_CONFIG } from "../constants/shopConfig";

interface Page {
  name: string;
  url: string;
}

let lastPage: Page | null = null;

export const useCurrentPageName = (): Page | null => {
  const location = useLocation();
  const game = useGame();
  const { isRageRound } = useGameContext();
  const level = game?.level ?? 0;
  const shopConfigId = game?.shop_config_id ?? 0;

  const pageMap: Record<string, string | (() => string)> = {
    "/gameover": "Game Over",
    "/open-loot-box": "Open loot box",
    "/store": "Rewards - " + SHOP_CONFIG[shopConfigId],
    "/demo": () => `${isRageRound ? "Rage Round" : "Round"} - ${level}`,
  };

  const pageNameResolver = pageMap[location.pathname];

  const pageName =
    typeof pageNameResolver === "function"
      ? pageNameResolver()
      : pageNameResolver;

  if (pageName) {
    lastPage = { name: pageName, url: location.pathname };
  }

  return lastPage;
};

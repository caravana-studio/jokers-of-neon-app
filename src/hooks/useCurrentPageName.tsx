import { useLocation } from "react-router-dom";
import { useGameContext } from "../providers/GameProvider";
import { useGame } from "../dojo/queries/useGame";
import { SHOP_CONFIG } from "../constants/shopConfig";
import { useEffect, useState } from "react";
import { LAST_PAGE } from "../constants/localStorage";

interface Page {
  name: string;
  url: string;
}

export const useCurrentPageName = (): Page | null => {
  const location = useLocation();
  const game = useGame();
  const { isRageRound } = useGameContext();
  const level = game?.level ?? 0;
  const shopConfigId = game?.shop_config_id ?? 0;

  const [currentPage, setCurrentPage] = useState<Page | null>(() => {
    const storedPage = localStorage.getItem(LAST_PAGE);
    return storedPage ? JSON.parse(storedPage) : null;
  });

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

  useEffect(() => {
    if (pageName && (!currentPage || currentPage.url !== location.pathname)) {
      const newPage = { name: pageName, url: location.pathname };
      setCurrentPage(newPage);
      localStorage.setItem(LAST_PAGE, JSON.stringify(newPage));
    }
  }, [pageName, location.pathname]);

  return currentPage;
};

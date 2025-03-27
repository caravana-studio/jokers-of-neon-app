import { useLocation } from "react-router-dom";
import { useGameContext } from "../providers/GameProvider";
import { useGame } from "../dojo/queries/useGame";
import { useEffect, useState } from "react";
import { LAST_PAGE } from "../constants/localStorage";
import { useTranslation } from "react-i18next";

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
  const { t: tGame } = useTranslation(["game"], { keyPrefix: "game" });
  const { t: tShop } = useTranslation(["store"]);

  const [currentPage, setCurrentPage] = useState<Page | null>(() => {
    const storedPage = localStorage.getItem(LAST_PAGE);
    return storedPage ? JSON.parse(storedPage) : null;
  });

  const pageMap: Record<string, string | (() => string)> = {
    "/gameover": tGame("game-menu.pages.gameover"),
    "/open-loot-box": tGame("game-menu.pages.open-loot-box"),
    "/store": () => {
      const shopName = tShop(`config.${shopConfigId}.name`, {
        defaultValue: "",
      });
      return tGame("game-menu.pages.store", { shopName });
    },
    "/demo": () =>
      tGame("game-menu.pages.demo", {
        roundType: isRageRound
          ? tGame("game-menu.pages.rage-round")
          : tGame("game-menu.pages.round"),
        level,
      }),
  };

  const pageNameResolver = pageMap[location.pathname];

  const pageName =
    typeof pageNameResolver === "function"
      ? pageNameResolver()
      : pageNameResolver;

  useEffect(() => {
    if (
      pageName &&
      (!currentPage ||
        currentPage.url !== location.pathname ||
        currentPage.name !== pageName)
    ) {
      const newPage = { name: pageName, url: location.pathname };
      setCurrentPage(newPage);
      localStorage.setItem(LAST_PAGE, JSON.stringify(newPage));
    }
  }, [pageName, location.pathname, level]);

  return currentPage;
};

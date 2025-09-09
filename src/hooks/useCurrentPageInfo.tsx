import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { LAST_PAGE } from "../constants/localStorage";
import { getPageConfig, PageInfo } from "../constants/pageConfig";
import { useGameContext } from "../providers/GameProvider";
import { useMap } from "../providers/MapProvider";
import { useStore } from "../providers/StoreProvider";
import { useGameStore } from "../state/useGameStore";

export const useCurrentPageInfo = (): PageInfo | null => {
  const location = useLocation();
  const { isRageRound, nodeRound, shopId } = useGameStore();
  const { currentNode } = useMap();
  const { t: tGame } = useTranslation(["game"], { keyPrefix: "game" });
  const { t: tShop } = useTranslation(["store"]);

  const [currentPage, setCurrentPage] = useState<PageInfo | null>(() => {
    const stored = localStorage.getItem(LAST_PAGE);
    return stored ? JSON.parse(stored) : null;
  });

  const pageInfo = getPageConfig(location.pathname, {
    shopId: shopId.toString(),
    isRageRound,
    isNodeLast: currentNode?.data.last,
    nodeRound,
    tGame,
    tShop,
  });

  useEffect(() => {
    if (
      pageInfo &&
      (!currentPage ||
        currentPage.url !== location.pathname ||
        currentPage.name !== pageInfo.name ||
        currentPage.icon !== pageInfo.icon)
    ) {
      setCurrentPage(pageInfo);
      localStorage.setItem(LAST_PAGE, JSON.stringify(pageInfo));
    }
  }, [location.pathname, nodeRound, pageInfo?.name, pageInfo?.icon, shopId]);

  return currentPage;
};

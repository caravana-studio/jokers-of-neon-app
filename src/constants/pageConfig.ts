import { matchPath, PathMatch } from "react-router-dom";
import { TFunction } from "i18next";
import { Icons } from "./icons";
import { FC, SVGProps, ReactSVGElement } from "react";

export interface PageInfo {
  name: string;
  url: string;
  icon: string | FC<SVGProps<ReactSVGElement>>;
}

interface MatchRequiredOptions extends Omit<Parameters<typeof getPageConfig>[1], "match"> {
  match: PathMatch<string>;
}

export const getPageConfig = (
  pathname: string,
  options: {
    shopId: string;
    isRageRound: boolean;
    isNodeLast: boolean;
    nodeRound: number;
    tGame: TFunction;
    tShop: TFunction;
  }
): PageInfo | null => {
  const configs: {
  path: string;
  getPageInfo: (opts: MatchRequiredOptions) => PageInfo;
}[] = [
  {
    path: "/gameover/:gameId",
    getPageInfo: ({ tGame, match }) => ({
      name: tGame("game-menu.pages.gameover"),
      icon: Icons.GAMEOVER,
      url: match.pathname,
    }),
  },
    {
      path: "/gameover/:gameId",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.gameover"),
        icon: Icons.GAMEOVER,
        url: match.pathname,
      }),
    },
    {
      path: "/open-loot-box",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.open-loot-box"),
        icon: Icons.LOOTBOX,
        url: match.pathname,
      }),
    },
    {
      path: "/map",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.map"),
        icon: Icons.MAP,
        url: match.pathname,
      }),
    },
    {
      path: "/store",
      getPageInfo: ({ tGame, tShop, shopId, match }) => ({
        name: tGame("game-menu.pages.store", {
          shopName: tShop(`config.${shopId}.name`, { defaultValue: "" }),
        }),
        icon: getShopIcon(shopId),
        url: match.pathname,
      }),
    },
    {
      path: "/demo",
      getPageInfo: ({ tGame, isRageRound, isNodeLast, nodeRound, match }) => ({
        name: tGame("game-menu.pages.demo", {
          roundType: isRageRound
            ? tGame("game-menu.pages.rage-round")
            : tGame("game-menu.pages.round"),
          level: nodeRound,
        }),
        icon: isRageRound
          ? isNodeLast
            ? Icons.RAGE_FINAL
            : Icons.RAGE_INTERMEDIATE
          : Icons.ROUND,
        url: match.pathname,
      }),
    },
  ];

  for (const config of configs) {
    const match = matchPath({ path: config.path, end: false }, pathname);
    if (match) {
      return config.getPageInfo({
        ...options,
        match,
      });
    }
  }

  return null;
};

const getShopIcon = (shopId: string): string | FC<SVGProps<ReactSVGElement>> => {
  const iconMap: Record<string, string | FC<SVGProps<ReactSVGElement>>> = {
    "1": Icons.STORE_DECK,
    "2": Icons.STORE_GLOBAL,
    "3": Icons.STORE_SPECIALS,
    "4": Icons.STORE_LEVELUPS,
    "5": Icons.STORE_MODIFIERS,
    "6": Icons.STORE_MIX,
  };
  return iconMap[shopId] ?? Icons.CIRCLE;
};

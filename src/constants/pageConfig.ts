import { TFunction } from "i18next";
import { FC, ReactSVGElement, SVGProps } from "react";
import { matchPath, PathMatch } from "react-router-dom";
import { Icons } from "./icons";

export interface PageInfo {
  name: string;
  url: string;
  icon: string | FC<SVGProps<ReactSVGElement>>;
}

interface MatchRequiredOptions
  extends Omit<Parameters<typeof getPageConfig>[1], "match"> {
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
      path: "/open-loot-box",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.open-loot-box"),
        icon: Icons.STORE,
        url: match.pathname,
      }),
    },
    {
      path: "/map",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.map"),
        icon: Icons.MAP_SIMPLE,
        url: match.pathname,
      }),
    },
    {
      path: "/store",
      getPageInfo: ({ tGame, tShop, shopId, match }) => ({
        name: tGame("game-menu.pages.store", {
          shopName: tShop(`config.${shopId}.name`, { defaultValue: "" }),
        }),
        icon: Icons.STORE,
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
        icon: isRageRound ? Icons.RAGE : Icons.ROUND,
        url: match.pathname,
      }),
    },
    {
      path: "/docs",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.docs"),
        icon: Icons.LIST,
        url: match.pathname,
      }),
    },
    {
      path: "/my-games",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.my-games"),
        icon: Icons.JOKER,
        url: match.pathname,
      }),
    },
    {
      path: "/profile",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.profile"),
        icon: Icons.PROFILE,
        url: match.pathname,
      }),
    },
    {
      path: "/settings",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.settings"),
        icon: Icons.SETTINGS,
        url: match.pathname,
      }),
    },
    {
      path: "/settings-game",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.settings"),
        icon: Icons.SETTINGS,
        url: match.pathname,
      }),
    },
    {
      path: "/my-collection",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.collection"),
        icon: Icons.DOCS,
        url: match.pathname,
      }),
    },
    {
      path: "/shop",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.shop"),
        icon: Icons.DOCS,
        url: match.pathname,
      }),
    },
    {
      path: "/season",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.season"),
        icon: Icons.DOCS,
        url: match.pathname,
      }),
    },
    {
      path: "/deck",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.deck"),
        icon: Icons.CLUB,
        url: match.pathname,
      }),
    },
    {
      path: "/plays",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.plays"),
        icon: Icons.CLUB,
        url: match.pathname,
      }),
    },
    {
      path: "/rewards",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.rewards"),
        icon: Icons.CLUB,
        url: match.pathname,
      }),
    },
    {
      path: "/manage",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.manage"),
        icon: Icons.CLUB,
        url: match.pathname,
      }),
    },
    {
      path: "/preview",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.preview"),
        icon: Icons.CLUB,
        url: match.pathname,
      }),
    },
    {
      path: "/open-loot-box",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.loot-box"),
        icon: Icons.CLUB,
        url: match.pathname,
      }),
    },
    {
      path: "/loot-box-cards-selection",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.loot-box"),
        icon: Icons.CLUB,
        url: match.pathname,
      }),
    },{
      path: "/entering-tournament",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.loading-game"),
        icon: Icons.CLUB,
        url: match.pathname,
      }),
    },
    {
      path: "/",
      getPageInfo: ({ tGame, match }) => ({
        name: tGame("game-menu.pages.home"),
        icon: Icons.HOME,
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

import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Icons } from "../../constants/icons";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { useGameStore } from "../../state/useGameStore";

export const mainMenuUrls = [
  "/",
  "/my-collection",
  "/my-games",
  "/profile",
  "/settings",
  "/leaderboard",
];

export const gameUrls = [
  "/demo",
  "/store",
  "/rewards",
  "/redirect",
  "/gameover/:gameId",
  "/open-loot-box",
  "/entering-tournament",
  "/preview/:type",
  "/loot-box-cards-selection",
  "/manage",
];

export const getIcon = (state: GameStateEnum) => {
  switch (state) {
    case GameStateEnum.Rage:
      return Icons.RAGE;
    case GameStateEnum.Round:
      return Icons.ROUND;
    default:
      return Icons.STORE;
  }
};

interface UseBottomMenuItemsProps {
  onMoreClick?: () => void;
}

interface MenuItem {
  icon: any;
  url: string;
  active?: boolean;
  key: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function useContextMenuItems({ onMoreClick }: UseBottomMenuItemsProps) {
  const location = useLocation();
  const url = location.pathname;
  const { state } = useGameStore();
  const mainMenuItems: MenuItem[] = useMemo(
    () => [
      {
        icon: Icons.HOME,
        url: "/",
        active: url === "/",
        key: "home",
      },
      {
        icon: Icons.DOCS,
        url: "/my-collection",
        active: url === "/my-collection",
        key: "docs",
      },
      {
        icon: Icons.JOKER,
        url: "/my-games",
        active: url === "/my-games",
        key: "joker",
      },
      {
        icon: Icons.PROFILE,
        url: "/profile",
        active: url === "/profile",
        key: "profile",
      },
      {
        icon: Icons.SETTINGS,
        url: "/settings",
        active: url === "/settings",
        key: "settings",
      },
    ],
    [url]
  );

  const inGameMenuItems: MenuItem[] = [
    {
      icon: getIcon(state),
      url: "/redirect",
      disabled: state === GameStateEnum.Map,
      active: gameUrls.some((gameUrl) => {
        if (gameUrl.includes(":")) {
          const base = gameUrl.split(":")[0];
          return url.startsWith(base);
        }
        return url === gameUrl;
      }),
      key: "game",
    },
    {
      icon: Icons.MAP,
      url: "/map",
      active: url === "/map",
      key: "map",
    },

    {
      icon: Icons.DECK,
      url: "/deck",
      active: url === "/deck",
      key: "deck",
    },
    {
      icon: Icons.CLUB,
      url: "/plays",
      active: url === "/plays",
      key: "plays",
    },
    {
      icon: Icons.MORE,
      url: "/settings-game",
      active: url === "/settings-game",
      key: "more",
      onClick: () => onMoreClick?.(),
    },
  ];

  return { mainMenuItems, inGameMenuItems };
}

import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Icons } from "../../constants/icons";
import { useDojo } from "../../dojo/DojoContext";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { useGameStore } from "../../state/useGameStore";
import { useSeasonProgressStore } from "../../state/useSeasonProgressStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const mainMenuUrls = [
  "/",
  "/my-collection",
  "/my-games",
  "/profile",
  "/settings",
  "/leaderboard",
  "/gameover/:gameId",
];

export const gameUrls = [
  "/map",
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
  "/docs",
  "/deck",
  "/plays",
  "/settings-game",
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

export const getKey = (state: GameStateEnum) => {
  switch (state) {
    case GameStateEnum.Rage:
      return "rage";
    case GameStateEnum.Round:
      return "round";
    default:
      return "shop";
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
  notificationCount?: number;
}

export function useContextMenuItems({ onMoreClick }: UseBottomMenuItemsProps) {
  const location = useLocation();
  const url = location.pathname;
  const { state } = useGameStore();
  const { isSmallScreen } = useResponsiveValues();
  const {
    account: { account },
  } = useDojo();
  const seasonNotificationCount = useSeasonProgressStore(
    (store) => store.unclaimedRewardsCount
  );
  const lastUserAddress = useSeasonProgressStore(
    (store) => store.lastUserAddress
  );
  const refetchSeasonProgress = useSeasonProgressStore(
    (store) => store.refetch
  );
  const resetSeasonProgress = useSeasonProgressStore((store) => store.reset);

  useEffect(() => {
    if (!account?.address) {
      if (lastUserAddress) {
        resetSeasonProgress();
      }
      return;
    }

    if (lastUserAddress !== account.address) {
      void refetchSeasonProgress({ userAddress: account.address });
    }
  }, [
    account?.address,
    lastUserAddress,
    refetchSeasonProgress,
    resetSeasonProgress,
  ]);

  const mainMenuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
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
        key: "collection",
      } /*       {
        icon: Icons.LEADERBOARD,
        url: "/leaderboard",
        active: url === "/leaderboard",
        key: "leaderboard",
      },*/,
      {
        icon: Icons.JOKER,
        url: "/my-games",
        active: url === "/my-games",
        key: "games",
      },
      {
        icon: Icons.SEASON,
        url: "/season",
        active: url === "/season",
        key: "season",
        notificationCount: seasonNotificationCount,
      },
      {
        icon: Icons.SHOP,
        url: "/shop",
        active: url === "/shop",
        key: "shop",
      },
      /*{
        icon: Icons.PROFILE,
        url: "/profile",
        active: url === "/profile",
        key: "profile",
      },*/
    ];

    if (!isSmallScreen) {
      items.push({
        icon: Icons.SETTINGS,
        url: "/settings",
        active: url === "/settings",
        key: "settings",
      });
    }

    return items;
  }, [isSmallScreen, url, seasonNotificationCount]);

  const inGameMenuItems: MenuItem[] = [
    {
      icon: getIcon(state),
      url: "/redirect",
      disabled: state === GameStateEnum.Map,
      active: gameUrls.slice(1).some((gameUrl) => {
        if (gameUrl.includes(":")) {
          const base = gameUrl.split(":")[0];
          return url.startsWith(base);
        }
        return url === gameUrl;
      }),
      key: getKey(state),
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
  ];

  const allInGameMenuItems: MenuItem[] = isSmallScreen
    ? [
        ...inGameMenuItems,
        {
          icon: Icons.MORE,
          url: "/settings-game",
          active: url === "/settings-game",
          key: "more",
          onClick: () => onMoreClick?.(),
        },
      ]
    : inGameMenuItems;

  const extraMenuItems: MenuItem[] = [
    {
      icon: Icons.HOME,
      url: "/",
      active: false,
      key: "back",
    },
    {
      icon: Icons.LIST,
      url: "/docs",
      active: url === "/docs",
      key: "docs",
    },
    {
      icon: Icons.SETTINGS,
      url: "/settings-game",
      active: url === "/settings-game",
      key: "settings",
    },
    {
      icon: Icons.CHECK,
      url: "#",
      active: false,
      key: "daily-missions",
    },
  ];

  return { mainMenuItems, inGameMenuItems: allInGameMenuItems, extraMenuItems };
}

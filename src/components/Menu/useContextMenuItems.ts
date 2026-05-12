import { useEffect, useMemo, useState } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { Icons } from "../../constants/icons";
import { useDojo } from "../../dojo/DojoContext";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { useGetMyGames } from "../../queries/useGetMyGames";
import { useShopDistribution } from "../../queries/useShopDistribution";
import { useTournamentSettings } from "../../queries/useTournamentSettings";
import { AppType, useAppContext } from "../../providers/AppContextProvider";
import { useGameStore } from "../../state/useGameStore";
import { useSeasonProgressStore } from "../../state/useSeasonProgressStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { isCollectorPackId } from "../../utils/packUtils";

const PLAYS_PULSE_SEEN_KEY = "jn-plays-pulse-seen";

export const mainMenuUrls = [
  "/",
  "/my-collection",
  "/my-games",
  "/tournament",
  "/profile",
  "/docs",
  "/settings",
  "/leaderboard",
  "/gameover/:gameId",
];

export const gameUrls = [
  "/map",
  "/round",
  "/practice",
  "/store",
  "/rewards",
  "/redirect",
  "/gameover/:gameId",
  "/open-loot-box",
  "/entering-tournament",
  "/preview/:type",
  "/loot-box-cards-selection",
  "/manage",
  "/docs-game",
  "/deck",
  "/plays",
  "/settings-game",
];

export const isInGamePath = (pathname: string) =>
  gameUrls.some((path) => Boolean(matchPath({ path, end: true }, pathname)));

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
  pulse?: boolean;
}

export function useContextMenuItems({ onMoreClick }: UseBottomMenuItemsProps) {
  const appType = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const url = location.pathname;
  const { state } = useGameStore();
  const { isSmallScreen } = useResponsiveValues();
  const { data: games } = useGetMyGames();
  const { tournament } = useTournamentSettings();
  const {
    account: { account },
  } = useDojo();
  const { distribution, loading: loadingDistribution } = useShopDistribution();
  const seasonNotificationCount = useSeasonProgressStore(
    (store) => store.unclaimedRewardsCount,
  );
  const tournamentEntries = useSeasonProgressStore(
    (store) => store.tournamentEntries,
  );
  const lastUserAddress = useSeasonProgressStore(
    (store) => store.lastUserAddress,
  );
  const refetchSeasonProgress = useSeasonProgressStore(
    (store) => store.refetch,
  );
  const resetSeasonProgress = useSeasonProgressStore((store) => store.reset);
  const hasCollectorPacks =
    !loadingDistribution &&
    !!distribution?.packs?.some(
      (pack) => isCollectorPackId(pack.packId),
    );
  const collectorNotificationCount = hasCollectorPacks ? 1 : 0;
  const [hasSeenPlays, setHasSeenPlays] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return localStorage.getItem(PLAYS_PULSE_SEEN_KEY) === "1";
  });

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

  useEffect(() => {
    if (url === "/plays" && !hasSeenPlays) {
      localStorage.setItem(PLAYS_PULSE_SEEN_KEY, "1");
      setHasSeenPlays(true);
    }
  }, [hasSeenPlays, url]);

  const gamesCount = games?.length;
  const isTournamentActive = Boolean(
    tournament?.isActive && !tournament?.isFinished,
  );
  const shouldPulsePlays =
    !hasSeenPlays &&
    (state === GameStateEnum.Round || state === GameStateEnum.Rage) &&
    typeof gamesCount === "number" &&
    gamesCount < 5;
  const isMiniApp = appType === AppType.MINIAPP;

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
      },
      {
        icon: Icons.LEADERBOARD,
        url: "/leaderboard",
        active: url === "/leaderboard",
        key: "leaderboard",
      },
      ...(isTournamentActive
        ? [
            {
              icon: Icons.TOURNAMENT,
              url: "/tournament",
              active: url === "/tournament",
              key: "tournament",
              notificationCount:
                tournamentEntries > 0 ? tournamentEntries : undefined,
            },
          ]
        : []),
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
        notificationCount: collectorNotificationCount,
      },
      ...(isMiniApp
        ? [
            {
              icon: Icons.SETTINGS,
              url: "/settings",
              active: url === "/settings",
              key: "settings",
            },
          ]
        : []),
      /*{
        icon: Icons.PROFILE,
        url: "/profile",
        active: url === "/profile",
        key: "profile",
      },*/
    ];

    if (!isSmallScreen) {
      items.push({
        icon: Icons.LIST,
        url: "/docs",
        active: url === "/docs",
        key: "docs",
      });

      items.push({
        icon: Icons.SETTINGS,
        url: "/settings",
        active: url === "/settings",
        key: "settings",
      });
    }

    return isMiniApp
      ? items.filter(
          (item) =>
            item.key !== "collection" &&
            item.key !== "shop" &&
            item.key !== "tournament" &&
            item.key !== "season",
        )
      : items;
  }, [
    collectorNotificationCount,
    isMiniApp,
    isSmallScreen,
    isTournamentActive,
    seasonNotificationCount,
    tournamentEntries,
    url,
  ]);

  const handleGoToCurrentGameState = () => {
    if (state === GameStateEnum.Round || state === GameStateEnum.Rage) {
      navigate("/round", { state: { skipRageAnimation: true } });
      return;
    }

    navigate("/redirect");
  };

  const inGameMenuItems: MenuItem[] = [
    {
      icon: getIcon(state),
      url: "/redirect",
      onClick: handleGoToCurrentGameState,
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
      pulse: shouldPulsePlays,
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
      url: "/docs-game",
      active: url === "/docs-game",
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

  return {
    mainMenuItems,
    inGameMenuItems: allInGameMenuItems,
    extraMenuItems: isMiniApp
      ? extraMenuItems.filter((item) => item.key !== "daily-missions")
      : extraMenuItems,
  };
}

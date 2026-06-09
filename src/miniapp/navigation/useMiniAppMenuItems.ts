import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "../../constants/icons";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import {
  getCurrentGameMenuIcon,
  getCurrentGameMenuKey,
  getMenuIconForGameState,
  isMenuItemHighlightedForGameState,
} from "../../components/Menu/gameStateMenuIcons";
import {
  gameUrls,
  isNavigationLockedPath,
} from "../../components/Menu/useContextMenuItems";

interface MenuItem {
  icon: any;
  url: string;
  active?: boolean;
  key: string;
  onClick?: () => void;
  disabled?: boolean;
  pulse?: boolean;
  labelColor?: string;
}

interface UseMiniAppMenuItemsProps {
  onMoreClick?: () => void;
}

export function useMiniAppMenuItems({
  onMoreClick,
}: UseMiniAppMenuItemsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const url = location.pathname;
  const { state } = useGameStore();
  const { isSmallScreen } = useResponsiveValues();
  const isNavigationLocked = isNavigationLockedPath(url);

  const mainMenuItems: MenuItem[] = useMemo(
    () => [
      {
        icon: Icons.HOME,
        url: "/",
        active: url === "/",
        key: "home",
      },
      {
        icon: Icons.LEADERBOARD,
        url: "/leaderboard",
        active: url === "/leaderboard",
        key: "leaderboard",
      },
      {
        icon: Icons.JOKER,
        url: "/my-games",
        active: url === "/my-games",
        key: "games",
      },
      {
        icon: Icons.SETTINGS,
        url: "/settings",
        active: url === "/settings",
        key: "settings",
      },
      {
        icon: Icons.PROFILE,
        url: "/profile",
        active: url === "/profile",
        key: "profile",
      },
    ],
    [url]
  );

  const handleGoToCurrentGameState = () => {
    if (state === GameStateEnum.Round || state === GameStateEnum.Rage) {
      navigate("/round", { state: { skipRageAnimation: true } });
      return;
    }

    navigate("/redirect");
  };

  const inGameMenuItems: MenuItem[] = useMemo(
    () => [
      {
        icon: getCurrentGameMenuIcon(state),
        url: "/redirect",
        onClick: handleGoToCurrentGameState,
        disabled: isNavigationLocked || state === GameStateEnum.Map,
        active: gameUrls.slice(1).some((gameUrl) => {
          if (gameUrl.includes(":")) {
            const base = gameUrl.split(":")[0];
            return url.startsWith(base);
          }
          return url === gameUrl;
        }),
        key: getCurrentGameMenuKey(state),
        labelColor: isMenuItemHighlightedForGameState(
          state,
          getCurrentGameMenuKey(state),
        )
          ? "lightViolet"
          : undefined,
      },
      {
        icon: getMenuIconForGameState(state, "map", Icons.MAP),
        url: "/map",
        active: url === "/map",
        key: "map",
        disabled: isNavigationLocked,
        labelColor: isMenuItemHighlightedForGameState(state, "map")
          ? "lightViolet"
          : undefined,
      },
      {
        icon: Icons.DECK,
        url: "/deck",
        active: url === "/deck",
        key: "deck",
        disabled: isNavigationLocked,
      },
      {
        icon: Icons.CLUB,
        url: "/plays",
        active: url === "/plays",
        key: "plays",
        disabled: isNavigationLocked,
      },
    ],
    [isNavigationLocked, navigate, state, url]
  );

  return {
    mainMenuItems,
    inGameMenuItems: isSmallScreen
      ? [
          ...inGameMenuItems,
          {
            icon: Icons.MORE,
            url: "/settings-game",
            active: url === "/settings-game",
            key: "more",
            onClick: () => onMoreClick?.(),
            disabled: false,
          },
        ]
      : inGameMenuItems,
  };
}

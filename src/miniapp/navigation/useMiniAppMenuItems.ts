import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "../../constants/icons";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { gameUrls } from "../../components/Menu/useContextMenuItems";

interface MenuItem {
  icon: any;
  url: string;
  active?: boolean;
  key: string;
  onClick?: () => void;
  disabled?: boolean;
  pulse?: boolean;
}

interface UseMiniAppMenuItemsProps {
  onMoreClick?: () => void;
}

const getIcon = (state: GameStateEnum) => {
  switch (state) {
    case GameStateEnum.Rage:
      return Icons.RAGE;
    case GameStateEnum.Round:
      return Icons.ROUND;
    default:
      return Icons.STORE;
  }
};

const getKey = (state: GameStateEnum) => {
  switch (state) {
    case GameStateEnum.Rage:
      return "rage";
    case GameStateEnum.Round:
      return "round";
    default:
      return "shop";
  }
};

export function useMiniAppMenuItems({
  onMoreClick,
}: UseMiniAppMenuItemsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const url = location.pathname;
  const { state } = useGameStore();
  const { isSmallScreen } = useResponsiveValues();

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
      },
    ],
    [navigate, state, url]
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
          },
        ]
      : inGameMenuItems,
  };
}

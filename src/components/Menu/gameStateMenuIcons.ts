import { GameStateEnum } from "../../dojo/typescript/custom";
import { Icons } from "../../constants/icons";

export type InGameMenuKey = "map" | "shop" | "round" | "rage";

const highlightIconByKey: Record<InGameMenuKey, (typeof Icons)[keyof typeof Icons]> = {
  map: Icons.MAP_HIGHLIGHT,
  shop: Icons.SHOP_HIGHLIGHT,
  round: Icons.ROUND_HIGHLIGHT,
  rage: Icons.RAGE_HIGHLIGHT,
};

const getHighlightedMenuKey = (
  state: GameStateEnum
): InGameMenuKey | null => {
  switch (state) {
    case GameStateEnum.Map:
      return "map";
    case GameStateEnum.Store:
    case GameStateEnum.Lootbox:
      return "shop";
    case GameStateEnum.Round:
      return "round";
    case GameStateEnum.Rage:
      return "rage";
    default:
      return null;
  }
};

const getBaseCurrentGameIcon = (state: GameStateEnum) => {
  switch (state) {
    case GameStateEnum.Rage:
      return Icons.RAGE;
    case GameStateEnum.Round:
      return Icons.ROUND;
    default:
      return Icons.STORE;
  }
};

export const getCurrentGameMenuKey = (state: GameStateEnum): InGameMenuKey => {
  switch (state) {
    case GameStateEnum.Rage:
      return "rage";
    case GameStateEnum.Round:
      return "round";
    default:
      return "shop";
  }
};

export const getMenuIconForGameState = (
  state: GameStateEnum,
  itemKey: InGameMenuKey,
  defaultIcon: (typeof Icons)[keyof typeof Icons]
) => {
  const highlightedKey = getHighlightedMenuKey(state);

  if (highlightedKey !== itemKey) {
    return defaultIcon;
  }

  return highlightIconByKey[itemKey] ?? defaultIcon;
};

export const isMenuItemHighlightedForGameState = (
  state: GameStateEnum,
  itemKey: InGameMenuKey
) => getHighlightedMenuKey(state) === itemKey;

export const getCurrentGameMenuIcon = (state: GameStateEnum) =>
  getMenuIconForGameState(
    state,
    getCurrentGameMenuKey(state),
    getBaseCurrentGameIcon(state)
  );

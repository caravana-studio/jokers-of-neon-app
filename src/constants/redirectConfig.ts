import { GameStateEnum } from "../dojo/typescript/custom";

type RedirectTo = string | ((params: Record<string, any>) => string);
type MatchPath = string | string[] | RegExp;

export interface RedirectRule {
  originPaths: MatchPath;
  gameState: GameStateEnum;
  redirectTo: RedirectTo;
}

export const redirectConfig: RedirectRule[] = [
  {
    originPaths: /^\/(?!manage$|open-loot-box$).*$/, // any except /manage and /open-loot-box
    gameState: GameStateEnum.Lootbox,
    redirectTo: "/loot-box-cards-selection",
  },
  {
    originPaths: ["/loot-box-cards-selection", "/demo"],
    gameState: GameStateEnum.Store,
    redirectTo: "/store",
  },
  {
    originPaths: "*",
    gameState: GameStateEnum.GameOver,
    redirectTo: (params) => `/gameover/${params.gameId}`,
  },
  {
    originPaths: /^\/(?!map).*$/,
    gameState: GameStateEnum.Round,
    redirectTo: "/demo",
  },
  {
    originPaths: /^\/(?!map).*$/,
    gameState: GameStateEnum.Rage,
    redirectTo: "/demo",
  },
  {
    originPaths: "*",
    gameState: GameStateEnum.Map,
    redirectTo: "/map",
  },
];

export const stateToPageMap: Record<GameStateEnum, string> = {
  [GameStateEnum.Round]: "/demo",
  [GameStateEnum.Rage]: "/demo",
  [GameStateEnum.Reward]: "/store",
  [GameStateEnum.Challenge]: "/demo",
  [GameStateEnum.Map]: "/map",
  [GameStateEnum.Store]: "/store",
  [GameStateEnum.Lootbox]: "/loot-box-cards-selection",
  [GameStateEnum.GameOver]: "/gameover",
  [GameStateEnum.NotStarted]: "/",
  [GameStateEnum.NotSet]: "/",
};

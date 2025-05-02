import { GameStateEnum } from "../dojo/typescript/custom";

type RedirectTo = string | ((params: Record<string, any>) => string);
type MatchPath = string | string[] | RegExp;

interface RedirectRule {
  matchPath: MatchPath;
  gameState: GameStateEnum;
  redirectTo: RedirectTo;
}

export const redirectConfig: RedirectRule[] = [
  {
    matchPath: /^\/(?!manage$|open-loot-box$|redirect\/open-loot-box$).*$/, // any except /manage and /open-loot-box
    gameState: GameStateEnum.Lootbox,
    redirectTo: "/loot-box-cards-selection",
  },
  {
    matchPath: ["/loot-box-cards-selection", "/demo", "/map", "/^\/redirect\/.+$/"],
    gameState: GameStateEnum.Store,
    redirectTo: "/store",
  },
  {
    matchPath: "*",
    gameState: GameStateEnum.GameOver,
    redirectTo: (params) => `/gameover/${params.gameId}`,
  },
  {
    matchPath: /^\/(?!map).*$/,
    gameState: GameStateEnum.Round,
    redirectTo: "/demo",
  },
  {
    matchPath: /^\/(?!map).*$/,
    gameState: GameStateEnum.Rage,
    redirectTo: "/demo",
  },
  {
    matchPath: "*",
    gameState: GameStateEnum.Map,
    redirectTo: "/map",
  },
  
];

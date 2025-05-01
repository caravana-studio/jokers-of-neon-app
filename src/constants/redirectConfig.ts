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
    matchPath: /^\/(?!manage).*$/, 
    gameState: GameStateEnum.Lootbox,
    redirectTo: "/loot-box-cards-selection",
  },
  {
    matchPath: ["/open-loot-box", "/loot-box-cards-selection"],
    gameState: GameStateEnum.Store,
    redirectTo: "/redirect/store",
  },
  {
    matchPath: "*",
    gameState: GameStateEnum.GameOver,
    redirectTo: (params) => `/gameover/${params.gameId}`,
  },
  {
    matchPath: "*",
    gameState: GameStateEnum.Round,
    redirectTo: "/demo",
  }
];

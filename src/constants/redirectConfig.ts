type RedirectTo = string | ((params: Record<string, any>) => string);
type MatchPath = string | string[] | RegExp;

interface RedirectRule {
  matchPath: MatchPath;
  gameState: string;
  redirectTo: RedirectTo;
}

export const redirectConfig: RedirectRule[] = [
  {
    matchPath: /^\/(?!manage).*$/, 
    gameState: "OPEN_BLISTER_PACK",
    redirectTo: "/loot-box-cards-selection",
  },
  {
    matchPath: ["/open-loot-box", "/loot-box-cards-selection"],
    gameState: "IN_STORE",
    redirectTo: "/store",
  },
  {
    matchPath: "*",
    gameState: "FINISHED",
    redirectTo: (params) => `/gameover/${params.gameId}`,
  },
  {
    matchPath: "*",
    gameState: "IN_GAME",
    redirectTo: "/demo",
  }
];

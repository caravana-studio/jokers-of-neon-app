import { NavigateOptions, useLocation, useNavigate } from "react-router-dom";
import { useGame } from "../dojo/queries/useGame";
import { useEffect } from "react";
import { redirectConfig } from "../constants/redirectConfig";

export const useRedirectByGameState = (lockRedirection: boolean = false, params: Record<string, any> = {}, navigateOptions: NavigateOptions = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const game = useGame();

  useEffect(() => {
    if (lockRedirection) return;

    if (game)
    {
      const currentPath = location.pathname;

      const matchedRule = redirectConfig.find(({ originPaths, gameState: requiredState }) => {
        let pathMatches = false;
      
        if (originPaths instanceof RegExp) {
          pathMatches = originPaths.test(currentPath);
        } else if (Array.isArray(originPaths)) {
          pathMatches = originPaths.includes(currentPath);
        } else {
          pathMatches = originPaths === "*" || originPaths === currentPath;
        }
      
        return pathMatches && requiredState === game?.state;
      });

      if (matchedRule) {
        const { redirectTo } = matchedRule;
        const finalPath = typeof redirectTo === "function" ? redirectTo(params) : redirectTo;
        navigate(finalPath, navigateOptions);
      }
  }
  }, [lockRedirection, game, navigate, location.pathname]);
};
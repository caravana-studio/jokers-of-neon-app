import { useEffect } from "react";
import { NavigateOptions, useLocation, useNavigate } from "react-router-dom";
import { redirectConfig } from "../constants/redirectConfig";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useGameStore } from "../state/useGameStore";

export const useRedirectByGameState = (
  lockRedirection: boolean = false,
  params: Record<string, any> = {},
  navigateOptions: NavigateOptions = {}
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useGameStore();

  useEffect(() => {
    if (lockRedirection) return;

    if (state !== GameStateEnum.NotStarted) {
      const currentPath = location.pathname;

      const matchedRule = redirectConfig.find(
        ({ originPaths, gameState: requiredState }) => {
          let pathMatches = false;

          if (originPaths instanceof RegExp) {
            pathMatches = originPaths.test(currentPath);
          } else if (Array.isArray(originPaths)) {
            pathMatches = originPaths.includes(currentPath);
          } else {
            pathMatches = originPaths === "*" || originPaths === currentPath;
          }

          return pathMatches && requiredState === state;
        }
      );

      if (matchedRule) {
        const { redirectTo } = matchedRule;
        const finalPath =
          typeof redirectTo === "function" ? redirectTo(params) : redirectTo;
        navigate(finalPath, navigateOptions);
      }
    }
  }, [lockRedirection, state, navigate, location.pathname]);
};

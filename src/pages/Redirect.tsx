import {
  NavigateOptions,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { Loading } from "../components/Loading";
import { useGame } from "../dojo/queries/useGame";
import { useEffect } from "react";
import { redirectConfig, stateToPageMap } from "../constants/redirectConfig";

export const Redirect = () => {
  const game = useGame();
  const state = game?.state;
  const navigate = useNavigate();
  const { page, gameId } = useParams();
  const location = useLocation();
  const lastTabIndex = location.state?.lastTabIndex ?? 0;
  const navOptions: NavigateOptions = {
    state: { lastTabIndex },
  };

  useEffect(() => {
    if (!game || !page || !game.state) return;

    let desiredPath;

    if (page === "state") {
      desiredPath = stateToPageMap[state as keyof typeof stateToPageMap] ?? "/";
      navOptions.replace = true;
    } else desiredPath = `/${page}`;

    if (gameId) desiredPath += `/${gameId}`;

    // redirectTo === desiredPath && match game state
    const matchedRule = redirectConfig.find(({ redirectTo, gameState }) => {
      const resolvedPath =
        typeof redirectTo === "function"
          ? redirectTo({ gameId: gameId })
          : redirectTo;

      return resolvedPath === desiredPath && gameState === game.state;
    });

    if (matchedRule) {
      navigate(desiredPath, navOptions);
    }
  }, [game, page, location.state, navigate]);

  return (
    <>
      <Loading />
      <PositionedDiscordLink />
    </>
  );
};

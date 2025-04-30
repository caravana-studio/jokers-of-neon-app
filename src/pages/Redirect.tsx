import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { Loading } from "../components/Loading";
import { useGame } from "../dojo/queries/useGame";
import { GameStateEnum } from "../dojo/typescript/custom";
import { getLSGameId } from "../dojo/utils/getLSGameId";

const stateToPageMap = {
  [GameStateEnum.GameOver]: "/gameover",
  [GameStateEnum.Round]: "/demo",
  [GameStateEnum.Rage]: "/demo",
  [GameStateEnum.Map]: "/map",
  [GameStateEnum.Store]: "/store",
  [GameStateEnum.Lootbox]: "/open-loot-box",
};

export const Redirect = () => {
  const game = useGame();
  const state = game?.state;
  const navigate = useNavigate();
  const { page } = useParams();
  const location = useLocation();
  const lastTabIndex = location.state?.lastTabIndex ?? 0;

  useEffect(() => {
    if (state === "GameOver") {
      navigate(`/gameover/${getLSGameId()}`);
    } else if (
      (state === GameStateEnum.Round || state === GameStateEnum.Rage) &&
      page === "demo"
    ) {
      navigate("/demo");
    } else if (state === GameStateEnum.Map && page === "map") {
      navigate("/map");
    } else if (state === GameStateEnum.Store && page === "store") {
      navigate("/store", { state: { lastTabIndex: lastTabIndex } });
    } else if (state === GameStateEnum.Lootbox && page === "open-loot-box") {
      navigate("/open-loot-box");
    } else if (page === "state" && state) {
      navigate(stateToPageMap[state as keyof typeof stateToPageMap] ?? "/", {
        replace: true,
      });
    }
  }, [state, page, navigate]);

  return (
    <>
      <Loading />
      <PositionedDiscordLink />
    </>
  );
};

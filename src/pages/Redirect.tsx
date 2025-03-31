import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { PositionedGameMenu } from "../components/GameMenu";
import { Loading } from "../components/Loading";
import { useGame } from "../dojo/queries/useGame";
import { getLSGameId } from "../dojo/utils/getLSGameId";

const stateToPageMap = {
  FINISHED: "/gameover",
  IN_GAME: "/demo",
  AT_SHOP: "/store",
  OPEN_BLISTER_PACK: "/open-loot-box",
};

export const Redirect = () => {
  const game = useGame();
  const state = game?.state;
  const navigate = useNavigate();
  const { page } = useParams();
  const location = useLocation();
  const lastTabIndex = location.state?.lastTabIndex ?? 0;

  useEffect(() => {
    if (state === "FINISHED") {
      navigate(`/gameover/${getLSGameId()}`);
    } else if (state === "IN_GAME" && page === "demo") {
      navigate("/demo");
    } else if (state === "AT_SHOP" && page === "store") {
      navigate("/store", { state: { lastTabIndex: lastTabIndex } });
    } else if (state === "OPEN_BLISTER_PACK" && page === "open-loot-box") {
      navigate("/open-loot-box");
    } else if (page === "state" && state) {
      navigate(stateToPageMap[state as keyof typeof stateToPageMap] ?? "/", {replace: true});
    }
  }, [state, page, navigate]);

  return (
    <>
      <Loading />
      <PositionedGameMenu />
      <PositionedDiscordLink />
    </>
  );
};

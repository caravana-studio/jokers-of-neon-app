import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { Loading } from "../components/Loading";
import { useGame } from "../dojo/queries/useGame";
import { getLSGameId } from "../dojo/utils/getLSGameId";

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
    }
  }, [state, page, navigate]);

  return (
    <>
      <Loading />
      <PositionedDiscordLink />
    </>
  );
};

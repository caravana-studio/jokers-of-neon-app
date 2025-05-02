import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { Loading } from "../components/Loading";
import { useGame } from "../dojo/queries/useGame";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { useRedirectByGameState } from "../hooks/useRedirectByGameState";

export const Redirect = () => {
  const location = useLocation();
  const lastTabIndex = location.state?.lastTabIndex ?? 0;

  useRedirectByGameState(
    false,
    { gameId: getLSGameId() },
    { state: { lastTabIndex: lastTabIndex } }
  );

  return (
    <>
      <Loading />
      <PositionedDiscordLink />
    </>
  );
};

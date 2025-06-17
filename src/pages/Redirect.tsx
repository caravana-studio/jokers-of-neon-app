import { useNavigate } from "react-router-dom";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { Loading } from "../components/Loading";
import { stateToPageMap } from "../constants/redirectConfig";
import { useGameStore } from "../state/useGameStore";

export const Redirect = () => {
  const { state } = useGameStore();

  const navigate = useNavigate();

  const desiredPath =
    stateToPageMap[state as keyof typeof stateToPageMap] ?? "/";

  navigate(desiredPath);

  return (
    <>
      <Loading />
      <PositionedDiscordLink />
    </>
  );
};

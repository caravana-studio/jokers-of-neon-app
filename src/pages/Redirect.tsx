import { useNavigate } from "react-router-dom";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { Loading } from "../components/Loading";
import { stateToPageMap } from "../constants/redirectConfig";
import { useGameStore } from "../state/useGameStore";

export const Redirect = () => {
  const { state } = useGameStore();
  const navigate = useNavigate();

  console.log("state", state);

  const desiredPath =
    stateToPageMap[state as keyof typeof stateToPageMap] ?? "/";

    console.log("desiredPath", desiredPath);

  navigate(desiredPath);

  return (
    <>
      <Loading />
      <PositionedDiscordLink />
    </>
  );
};

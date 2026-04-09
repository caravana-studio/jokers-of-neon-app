import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { Loading } from "../components/Loading";
import { stateToPageMap } from "../constants/redirectConfig";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useDojo } from "../dojo/useDojo";
import { useCurrentHandStore } from "../state/useCurrentHandStore";
import { useGameStore } from "../state/useGameStore";

export const Redirect = () => {
  const { state, refetchGameStore, id: gameId } = useGameStore();
  const navigate = useNavigate();
  const { refetchCurrentHandStore } = useCurrentHandStore();

  console.log("state", state);
  const {
    setup: { client },
    account: { account },
  } = useDojo();

  useEffect(() => {
    const desiredPath =
      stateToPageMap[state as keyof typeof stateToPageMap] ?? "/";
  
    console.log("desiredPath", desiredPath);
  
    navigate(desiredPath);
  }, [])

  useEffect(() => {
    if (!state || state === GameStateEnum.NotSet) {
      refetchGameStore(client, gameId, account.address);
      // refetchCurrentHandStore(client, gameId);
    }
  }, [state, account.address, client, gameId, refetchGameStore]);

  return (
    <>
      <Loading />
      <PositionedDiscordLink />
    </>
  );
};

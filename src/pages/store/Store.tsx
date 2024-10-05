import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useGameContext } from "../../providers/GameProvider";
import { useStore } from "../../providers/StoreProvider";
import { Background } from "../../components/Background";
import { StoreContent } from "./StoreContent";
import { StoreContentMobile } from "./StoreContent.mobile";
import { useBreakpointValue } from "@chakra-ui/react";
import useStoreContent from "./UseStoreContent.ts";
import { Loading } from "../../components/Loading.tsx";

export const Store = () => {
  const {
    loading,
  } = useStoreContent();

  const isSmallScreen = useBreakpointValue(
    { base: true, md: false }
  );

  const { gameId, setIsRageRound } = useGameContext();
  const game = useGame();
  const state = game?.state;
  const { lockRedirection } = useStore();
 
  useEffect(() => {
    setIsRageRound(false);
  }, []);

  useEffect(() => {
    if (!lockRedirection) {
      if (game?.state === "FINISHED") {
        navigate(`/gameover/${gameId}`);
      } else if (game?.state === "IN_GAME") {
        navigate("/demo");
      } else if (game?.state === "OPEN_BLISTER_PACK") {
        navigate("/open-pack");
      }
    }
  }, [game?.state, lockRedirection]);

  const navigate = useNavigate();

  useEffect(() => {
    if (state === "FINISHED") {
      navigate(`/gameover/${gameId}`);
    } else if (state === "IN_GAME") {
      navigate("/demo");
    }
  }, [state]);

  useEffect(() => {
    if (!game) {
      navigate("/");
    }
  }, []);

  if (loading) {
    return (
      <Background type="game">
        <Loading />
      </Background>
    );
  }

  return (
    <Background type="store" scrollOnMobile>
      {isSmallScreen ? <StoreContentMobile/> : <StoreContent/>}
    </Background>
  );
};

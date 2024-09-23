import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { RemoveScroll } from "react-remove-scroll";
import { Background } from "../../components/Background";
import { LOGGED_USER } from "../../constants/localStorage";
import { useRageCards, useRageRound } from "../../dojo/queries/useRageRound";
import { useDojo } from "../../dojo/useDojo";
import { useGameContext } from "../../providers/GameProvider";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";
import { RageRoundAnimation } from "./RageRoundAnimation";

export const GamePage = () => {
  const {
    setup: { masterAccount },
    account: { account },
  } = useDojo();
  const username = localStorage.getItem(LOGGED_USER);
  const { checkOrCreateGame, setLockedCash, isRageRound, setIsRageRound, setRageCards } =
    useGameContext();
  const rageRound = useRageRound();
  const rageCards = useRageCards();

  useEffect(() => {
    if (account !== masterAccount && username) {
      checkOrCreateGame();
    }
  }, [account, username]);

  useEffect(() => {
    setLockedCash(undefined);
    setIsRageRound(rageRound?.is_active ?? false);
    setRageCards(rageCards);
  }, []);

  return (
    <Background type={isRageRound ? "rage" : "game"}>
      <RageRoundAnimation />
      {isMobile ? <MobileGameContent /> : <GameContent />}
      <RemoveScroll>
        <></>
      </RemoveScroll>
    </Background>
  );
};

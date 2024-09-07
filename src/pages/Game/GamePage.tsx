import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { RemoveScroll } from "react-remove-scroll";
import { Background } from "../../components/Background";
import { LOGGED_USER } from "../../constants/localStorage";
import { useDojo } from "../../dojo/useDojo";
import { useGameContext } from "../../providers/GameProvider";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";

export const GamePage = () => {
  const {
    setup: { masterAccount },
    account: { account },
  } = useDojo();
  const username = localStorage.getItem(LOGGED_USER);
  const { checkOrCreateGame } = useGameContext();

  useEffect(() => {
    // if masterAccount === account, it means the burner did not get created yet
    if (account !== masterAccount && username) {
      checkOrCreateGame();
    }
  }, [account, username]);

  return (
    <Background type="game">
      {isMobile ? <MobileGameContent /> : <GameContent />}
      <RemoveScroll>
        <></>
      </RemoveScroll>
    </Background>
  );
};

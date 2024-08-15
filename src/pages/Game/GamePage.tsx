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
  return (
    <Background type="game">
      {isMobile ? <MobileGameContent /> : <GameContent />}
      <RemoveScroll>
        <></>
      </RemoveScroll>
    </Background>
  );
};

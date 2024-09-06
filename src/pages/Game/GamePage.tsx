import { isMobile } from "react-device-detect";
import { RemoveScroll } from "react-remove-scroll";
import { Background } from "../../components/Background";
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

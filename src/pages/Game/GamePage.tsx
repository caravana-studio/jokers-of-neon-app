import { isMobile } from "react-device-detect";
import { RemoveScroll } from "react-remove-scroll";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";
import { Background } from "../../components/Background";

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

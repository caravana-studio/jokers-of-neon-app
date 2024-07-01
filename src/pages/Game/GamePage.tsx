import { isMobile } from "react-device-detect";
import { RemoveScroll } from "react-remove-scroll";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";

export const GamePage = () => {
  return (
    <>
      {isMobile ? <MobileGameContent /> : <GameContent />}
      <RemoveScroll>
        <></>
      </RemoveScroll>
    </>
  );
};

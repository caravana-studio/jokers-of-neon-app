import { isMobile } from "react-device-detect";
import { RemoveScroll } from "react-remove-scroll";
import { Background } from "../../components/Background";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";
import { PositionedDiscordLink } from "../../components/DiscordLink";

export const GamePageTutorial = () => {
  return (
    <Background type={"game"}>
      {isMobile ? <MobileGameContent /> : <GameContent />}
      <RemoveScroll>
        <></>
      </RemoveScroll>
      {!isMobile && <PositionedDiscordLink />}
    </Background>
  );
};

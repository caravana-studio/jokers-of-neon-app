import { isMobile } from "react-device-detect";
import { RemoveScroll } from "react-remove-scroll";
import { Background } from "../../components/Background";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { SKIP_IN_GAME_TUTORIAL } from "../../constants/localStorage";
import { useEffect } from "react";

export const GamePageTutorial = () => {
  useEffect(() => {
    window.localStorage.setItem(SKIP_IN_GAME_TUTORIAL, "true");
  });

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

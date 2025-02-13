import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { RemoveScroll } from "react-remove-scroll";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { SKIP_IN_GAME_TUTORIAL } from "../../constants/localStorage";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";

export const GamePageTutorial = () => {
  useEffect(() => {
    window.localStorage.setItem(SKIP_IN_GAME_TUTORIAL, "true");
  }, []);

  return (
    <>
      {isMobile ? <MobileGameContent /> : <GameContent />}
      <RemoveScroll>
        <></>
      </RemoveScroll>
      {!isMobile && <PositionedDiscordLink />}
    </>
  );
};

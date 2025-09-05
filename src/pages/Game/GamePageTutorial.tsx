import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { RemoveScroll } from "react-remove-scroll";
import { SKIP_IN_GAME_TUTORIAL } from "../../constants/localStorage";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";
import { useGameStore } from "../../state/useGameStore";

export const GamePageTutorial = () => {
  useEffect(() => {
    window.localStorage.setItem(SKIP_IN_GAME_TUTORIAL, "true");
  }, []);

  const { setGameLoading, gameLoading } = useGameStore();
  useEffect(() => {
    setGameLoading(false);
  }, [setGameLoading]);

  return (
    <>
      {isMobile ? <MobileGameContent /> : <GameContent />}
      <RemoveScroll>
        <></>
      </RemoveScroll>
    </>
  );
};

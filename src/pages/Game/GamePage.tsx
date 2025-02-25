import { useEffect } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { LevelUpFirstDiscartedHandAnimation } from "../../components/animations/LevelUpFirstDiscartedHandAnimation";
import { SecondChanceCardAnimation } from "../../components/animations/SecondChanceCardAnimation";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { useGame } from "../../dojo/queries/useGame";
import { useRageCards, useRageRound } from "../../dojo/queries/useRageRound";
import { useDojo } from "../../dojo/useDojo";
import { useUsername } from "../../dojo/utils/useUsername";
import { useCardAnimations } from "../../providers/CardAnimationsProvider";
import { CardHighlightProvider } from "../../providers/CardHighlightProvider";
import { useGameContext } from "../../providers/GameProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";
import { RageRoundAnimation } from "./RageRoundAnimation";

export const GamePage = () => {
  const {
    setup: { masterAccount },
    account: { account },
  } = useDojo();
  const username = useUsername();
  const {
    checkOrCreateGame,
    setLockedCash,
    isRageRound,
    setIsRageRound,
    setRageCards,
    roundRewards,
    gameId,
    lockRedirection,
  } = useGameContext();

  const { animateSecondChanceCard } = useCardAnimations();

  const rageRound = useRageRound();
  const rageCards = useRageCards();
  const navigate = useNavigate();
  const game = useGame();
  const { state } = useLocation();

  const skipRageAnimation = state?.skipRageAnimation;
  const { isSmallScreen } = useResponsiveValues();

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

  useEffect(() => {
    const resetZoom = () => {
      let viewport = document.querySelector(
        "meta[name=viewport]"
      ) as HTMLMetaElement | null;

      if (!viewport) {
        viewport = document.createElement("meta") as HTMLMetaElement;
        viewport.name = "viewport";
        document.head.appendChild(viewport);
      }
 
      // Temporarily allow zooming to force a reset
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=10.0"
      );

      // Lock zoom after a short delay
      setTimeout(() => {
        viewport!.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        );
      }, 100);
    };

    resetZoom();
  }, []);

  useEffect(() => {
    // if roundRewards is true, we don't want to redirect user
    if (!roundRewards && !lockRedirection) {
      if (game?.state === "FINISHED") {
        navigate(`/gameover/${gameId}`);
      } else if (game?.state === "AT_SHOP") {
        navigate("/store");
      } else if (game?.state === "OPEN_BLISTER_PACK") {
        navigate("/open-loot-box");
      }
    }
  }, [game?.state, roundRewards]);

  return (
    <>
      {!skipRageAnimation && <RageRoundAnimation />}
      <LevelUpFirstDiscartedHandAnimation />
      {animateSecondChanceCard && <SecondChanceCardAnimation />}
      {isSmallScreen ? (
        <CardHighlightProvider>
          <MobileGameContent />
        </CardHighlightProvider>
      ) : (
        <GameContent />
      )}
      <RemoveScroll>
        <></>
      </RemoveScroll>
      {!isSmallScreen && <PositionedDiscordLink />}
    </>
  );
};

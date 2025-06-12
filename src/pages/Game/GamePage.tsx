import { useEffect } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { useLocation } from "react-router-dom";
import { LevelUpFirstDiscartedHandAnimation } from "../../components/animations/LevelUpFirstDiscartedHandAnimation";
import { SecondChanceCardAnimation } from "../../components/animations/SecondChanceCardAnimation";
import { SpecialCardAnimation } from "../../components/animations/SpecialCardAnimation";
import { getGameView } from "../../dojo/queries/getGameView";
import { getHandCards } from "../../dojo/queries/getHandCards";
import { useRageCards } from "../../dojo/queries/useRageCards";
import { useDojo } from "../../dojo/useDojo";
import { useUsername } from "../../dojo/utils/useUsername";
import { useRedirectByGameState } from "../../hooks/useRedirectByGameState";
import { useCardAnimations } from "../../providers/CardAnimationsProvider";
import { useCardData } from "../../providers/CardDataProvider";
import { CardHighlightProvider } from "../../providers/CardHighlightProvider";
import { useGameContext } from "../../providers/GameProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";
import { RageRoundAnimation } from "./RageRoundAnimation";

export const GamePage = () => {
  const {
    setup: { client },
    setup: { masterAccount },
    account: { account },
  } = useDojo();
  const username = useUsername();
  const {
    checkOrCreateGame,
    setIsRageRound,
    setRageCards,
    roundRewards,
    gameId,
    lockRedirection,
    modId,
  } = useGameContext();

  const { refetchSpecialCardsData } = useCardData();

  const { animateSecondChanceCard, animateSpecialCardDefault } =
    useCardAnimations();

  const rageCards = useRageCards();
  const { state } = useLocation();

  const skipRageAnimation = state?.skipRageAnimation;
  const { isSmallScreen } = useResponsiveValues();

  useEffect(() => {
    if (account !== masterAccount && username) {
      checkOrCreateGame();
    }
  }, [account, username]);

  useEffect(() => {
    setIsRageRound(rageCards && rageCards.length > 0);
    setRageCards(rageCards);
    refetchSpecialCardsData(modId, gameId);

    getHandCards(client, gameId);
  }, []);

  useRedirectByGameState(!(!lockRedirection && !roundRewards), {
    gameId: gameId,
  });

  return (
    <>
      {!skipRageAnimation && <RageRoundAnimation />}
      <LevelUpFirstDiscartedHandAnimation />
      {animateSecondChanceCard && <SecondChanceCardAnimation />}
      {animateSpecialCardDefault && (
        <SpecialCardAnimation
          specialId={animateSpecialCardDefault.specialId}
          bgPath={animateSpecialCardDefault.bgPath}
          animatedImgPath={animateSpecialCardDefault.animatedImgPath}
        />
      )}
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
    </>
  );
};

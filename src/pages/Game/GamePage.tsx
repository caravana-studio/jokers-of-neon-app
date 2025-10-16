import { useEffect, useRef } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { useLocation } from "react-router-dom";
import { LevelUpFirstDiscartedHandAnimation } from "../../components/animations/LevelUpFirstDiscartedHandAnimation";
import { SecondChanceCardAnimation } from "../../components/animations/SecondChanceCardAnimation";
import { SpecialCardAnimation } from "../../components/animations/SpecialCardAnimation";
import { DelayedLoading } from "../../components/DelayedLoading";
import { useDojo } from "../../dojo/useDojo";
import { useUsername } from "../../dojo/utils/useUsername";
import { useRedirectByGameState } from "../../hooks/useRedirectByGameState";
import { useCardAnimations } from "../../providers/CardAnimationsProvider";
import { useCardData } from "../../providers/CardDataProvider";
import { useGameContext } from "../../providers/GameProvider";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";
import { RageRoundAnimation } from "./RageRoundAnimation";
import { CardHighlightProvider } from "../../providers/HighlightProvider/CardHighlightProvider";

export const GamePage = () => {
  const {
    setup: { masterAccount },
    account: { account },
  } = useDojo();
  const username = useUsername();
  const { checkOrCreateGame } = useGameContext();
  const { specialCards, modId, id: gameId } = useGameStore();

  const { refetchSpecialCardsData } = useCardData();

  const { animateSecondChanceCard, animateSpecialCardDefault } =
    useCardAnimations();

  const { state } = useLocation();

  const skipRageAnimationRef = useRef(state?.skipRageAnimation ?? false);

  const { isSmallScreen } = useResponsiveValues();

  useEffect(() => {
    if (account !== masterAccount && username) {
      checkOrCreateGame();
    }
  }, [account, username]);

  useEffect(() => {
    refetchSpecialCardsData(modId, gameId, specialCards);
  }, []);

  useRedirectByGameState();

  return (
    <DelayedLoading ms={200}>
      {!skipRageAnimationRef.current && <RageRoundAnimation />}
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
    </DelayedLoading>
  );
};

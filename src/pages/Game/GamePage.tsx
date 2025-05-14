import { useEffect } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { LevelUpFirstDiscartedHandAnimation } from "../../components/animations/LevelUpFirstDiscartedHandAnimation";
import { SecondChanceCardAnimation } from "../../components/animations/SecondChanceCardAnimation";
import { useGame } from "../../dojo/queries/useGame";
import { useRageCards } from "../../dojo/queries/useRageCards";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { useDojo } from "../../dojo/useDojo";
import { useUsername } from "../../dojo/utils/useUsername";
import { useCardAnimations } from "../../providers/CardAnimationsProvider";
import { CardHighlightProvider } from "../../providers/CardHighlightProvider";
import { useGameContext } from "../../providers/GameProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";
import { RageRoundAnimation } from "./RageRoundAnimation";
import { SpecialCardAnimation } from "../../components/animations/SpecialCardAnimation";
import { useCardData } from "../../providers/CardDataProvider";

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
    modId,
  } = useGameContext();

  const { refetchSpecialCardsData } = useCardData();

  const { animateSecondChanceCard, animateSpecialCardDefault } =
    useCardAnimations();

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
    setIsRageRound(rageCards && rageCards.length > 0);
    setRageCards(rageCards);
    refetchSpecialCardsData(modId, gameId);
  }, []);

  useEffect(() => {
    // if roundRewards is true, we don't want to redirect user
    if (!roundRewards && !lockRedirection) {
      if (game?.state === GameStateEnum.GameOver) {
        navigate(`/gameover/${gameId}`);
      } else if (game?.state === GameStateEnum.Store) {
        navigate("/store");
      } else if (game?.state === GameStateEnum.Lootbox) {
        navigate("/open-loot-box");
      }
    }
  }, [game?.state, roundRewards]);

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

import React, { createContext, useEffect } from "react";
import {
  acumSfx,
  discardSfx,
  multiSfx,
  pointsSfx,
  preselectedCardSfx,
} from "../constants/sfx";
import { getPlayerPokerHands } from "../dojo/getPlayerPokerHands";
import { useDojo } from "../dojo/useDojo";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { useAudio } from "../hooks/useAudio";
import { animatePlay } from "../utils/playEvents/animatePlay.ts";
import { useCardAnimations } from "./CardAnimationsProvider";
import { IGameContext } from "./GameProvider";
import { gameProviderDefaults } from "./gameProviderDefaults.ts";
import { useTutorialGameStore } from "../state/useTutorialGameStore";
import { useCurrentHandStore } from "../state/useCurrentHandStore.ts";
import { useAnimationStore } from "../state/useAnimationStore.ts";

export const TutorialGameContext =
  createContext<IGameContext>(gameProviderDefaults);

const emptyFn = () => {};

const TutorialGameProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    hand,
    discards,
    powerUps,
    specialCards,
    remainingPlaysTutorial,
    preSelectedCards,
    preSelectedPlay,
    preSelectedModifiers,
    preSelectedPowerUps,
    points,
    multi,
    setPlays,
    togglePreselected,
    togglePreselectedPowerUp,
    addModifier,
    getModifiers,
    cardIsPreselected,
    powerUpIsPreselected,
    discard: storeDiscard,
    play: storePlay,
    clearPreSelection,
    setHand,
  } = useTutorialGameStore();

  const { setPlayIsNeon } = useCurrentHandStore();
  const { setPlayAnimation, setDiscardAnimation } = useAnimationStore();
  const { setAnimatedCard, setAnimatedPowerUp } = useCardAnimations();
  const { play: preselectCardSound } = useAudio(preselectedCardSfx);
  const { play: discardSound } = useAudio(discardSfx, 4);
  const { play: pointsSound } = useAudio(pointsSfx);
  const { play: multiSound } = useAudio(multiSfx);
  const { play: acumSound } = useAudio(acumSfx);

  const {
    setup: { client },
  } = useDojo();
  const gameID = getLSGameId();

  useEffect(() => {
    if (client) {
      getPlayerPokerHands(client, gameID).then((plays: any) => {
        if (plays !== undefined) {
          setPlays(plays);
        }
      });
    }
  }, [client, gameID, setPlays]);

  const discard = () => {
    if (discards > 0) {
      discardSound();
      storeDiscard();
    }
  };

  const play = () => {
    const { event } = storePlay();
    const setPointsInStore = (newPoints: number) =>
      useTutorialGameStore.setState({ points: newPoints });
    const setMultiInStore = (newMulti: number) =>
      useTutorialGameStore.setState({ multi: newMulti });
    const addPointsInStore = (pointsToAdd: number) =>
      useTutorialGameStore.setState((state) => ({
        points: state.points + pointsToAdd,
      }));
    const addMultiInStore = (multiToAdd: number) =>
      useTutorialGameStore.setState((state) => ({
        multi: state.multi + multiToAdd,
      }));
    const setCurrentScoreInStore = (newScore: number) =>
      useTutorialGameStore.setState({ score: newScore });
    const addCashInStore = (cashToAdd: number) => {};

    animatePlay({
      playEvents: event,
      playAnimationDuration: 400,
      setPlayIsNeon,
      setAnimatedCard,
      setAnimatedPowerUp,
      pointsSound,
      multiSound,
      acumSound,
      negativeMultiSound: emptyFn,
      cashSound: emptyFn,
      setPoints: setPointsInStore,
      setMulti: setMultiInStore,
      addPoints: addPointsInStore,
      addMulti: addMultiInStore,
      setCurrentScore: setCurrentScoreInStore,
      addCash: addCashInStore,
      changeCardsSuit: emptyFn,
      changeCardsNeon: emptyFn,
      setPlayAnimation,
      setPreSelectionLocked: (locked) =>
        useTutorialGameStore.setState({ preSelectionLocked: locked }),
      clearPreSelection,
      refetchPowerUps: emptyFn,
      preSelectedPowerUps,
      navigate: emptyFn,
      gameId: 0,
      setRoundRewards: emptyFn,
      replaceCards: setHand,
      remainingPlays: remainingPlaysTutorial,
      setAnimateSecondChanceCard: emptyFn,
      setCardTransformationLock: emptyFn,
      specialCards: [],
      setAnimateSpecialCardDefault: emptyFn,
      resetRage: emptyFn,
      unPreSelectAllPowerUps: emptyFn,
    });
  };

  const handleTogglePreselected = (cardIndex: number) => {
    if (togglePreselected(cardIndex)) {
      preselectCardSound();
    }
  };

  const handleTogglePreselectedPowerup = (powerUpIdx: number) => {
    togglePreselectedPowerUp(powerUpIdx);
    preselectCardSound();
  };

  const contextValue = {
    play,
    discard,
    clearPreSelection,
    executeCreateGame: emptyFn,
    changeModifierCard: async () => ({ success: false, cards: [] }),
    onShopSkip: emptyFn,
    sellPowerup: async () => false,
    sellSpecialCard: async () => false,
    checkOrCreateGame: emptyFn,
    resetLevel: emptyFn,
    prepareNewGame: emptyFn,
    surrenderGame: emptyFn,
    initiateTransferFlow: emptyFn,

    hand,
    discards,
    powerUps,
    specialCards,
    remainingPlaysTutorial,
    preSelectedCards,
    preSelectedPlay,
    preSelectedModifiers,
    points,
    multi,

    togglePreselected: handleTogglePreselected,
    togglePreselectedPowerUp: handleTogglePreselectedPowerup,
    addModifier,
    getModifiers,
    cardIsPreselected,
    powerUpIsPreselected,
  };

  return (
    <TutorialGameContext.Provider value={contextValue as any}>
      {children}
    </TutorialGameContext.Provider>
  );
};

export default TutorialGameProvider;

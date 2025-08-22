import React, { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { useCurrentHandStore } from "../state/useCurrentHandStore";
import { useGameStore } from "../state/useGameStore";
import {
  HAND_1,
  HAND_2,
  EVENT_PAIR,
  EVENT_PAIR_POWER_UPS,
  EVENT_FLUSH,
} from "../utils/mocks/tutorialMocks.ts";
import { m5, p25 } from "../utils/mocks/powerUpMocks.ts";
import { MultipliedClubs } from "../utils/mocks/specialCardMocks.ts";
import { checkHand } from "../utils/checkHand.ts";
import { Plays } from "../enums/plays.ts";
import { useAnimationStore } from "../state/useAnimationStore.ts";
import { GameStateEnum } from "../dojo/typescript/custom.ts";

export const TutorialGameContext =
  createContext<IGameContext>(gameProviderDefaults);

const emptyFn = () => {};
const TUTORIAL_EVENTS = [EVENT_PAIR, EVENT_PAIR_POWER_UPS, EVENT_FLUSH];

const TutorialGameProvider = ({ children }: { children: React.ReactNode }) => {
  const [indexEvent, setIndexEvent] = useState(0);

  const { setPlayIsNeon, setPreSelectionLocked } = useCurrentHandStore();
  const {
    setRoundRewards,
    showSpecials,
    resetPowerUps,
    resetSpecials,
    setState,
  } = useGameStore();
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
    useCurrentHandStore.setState({
      hand: HAND_1,
      preSelectedCards: [],
      preSelectedModifiers: {},
      preSelectionLocked: false,
    });
    useGameStore.setState({
      powerUps: [m5, p25],
      specialCards: [MultipliedClubs],
      remainingDiscards: 1,
      remainingPlays: 3,
      gameLoading: false,
      preSelectedPowerUps: [],
      targetScore: 500,
    });

    if (client) {
      getPlayerPokerHands(client, gameID).then((plays: any) => {
        if (plays) useGameStore.setState({ plays });
      });
    }

    return () => {
      useCurrentHandStore.setState({
        hand: [],
        preSelectedCards: [],
        preSelectedModifiers: {},
      });
      useGameStore.setState({
        powerUps: [],
        specialCards: [],
        remainingDiscards: 0,
        remainingPlays: 0,
        gameLoading: true,
      });
    };
  }, [client, gameID]);

  const resetLevel = () => {
    setRoundRewards(undefined);
    setPreSelectionLocked(false);
    showSpecials();
    resetPowerUps();
    resetSpecials();
    setState(GameStateEnum.NotSet);
  };

  const discard = () => {
    const { remainingDiscards } = useGameStore.getState();
    if (remainingDiscards > 0) {
      discardSound();
      useCurrentHandStore.getState().replaceCards(HAND_2);
      useGameStore.setState({ remainingDiscards: remainingDiscards - 1 });
      useCurrentHandStore.getState().clearPreSelection();
      useGameStore.getState().unPreSelectAllPowerUps();
    }
  };

  const play = () => {
    const event = TUTORIAL_EVENTS[indexEvent];
    const { remainingPlays, preSelectedPowerUps } = useGameStore.getState();

    setIndexEvent((index) => index + 1);
    useGameStore.getState().play();

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
      setPoints: useGameStore.getState().setPoints,
      setMulti: useGameStore.getState().setMulti,
      addPoints: useGameStore.getState().addPoints,
      addMulti: useGameStore.getState().addMulti,
      setCurrentScore: useGameStore.getState().setCurrentScore,
      addCash: emptyFn,
      changeCardsSuit: emptyFn,
      changeCardsNeon: emptyFn,
      setPlayAnimation,
      setPreSelectionLocked:
        useCurrentHandStore.getState().setPreSelectionLocked,
      clearPreSelection: () => {
        useCurrentHandStore.getState().clearPreSelection();
        useGameStore.getState().unPreSelectAllPowerUps();
      },
      refetchPowerUps: () => {
        if (preSelectedPowerUps && indexEvent === 1) {
          useGameStore.setState({
            powerUps: [],
          });
        }
      },
      preSelectedPowerUps,
      navigate: emptyFn,
      gameId: 0,
      setRoundRewards: emptyFn,
      replaceCards: useCurrentHandStore.getState().replaceCards,
      remainingPlays: remainingPlays - 1,
      setAnimateSecondChanceCard: emptyFn,
      setCardTransformationLock: emptyFn,
      specialCards: [],
      setAnimateSpecialCardDefault: emptyFn,
      resetRage: emptyFn,
      unPreSelectAllPowerUps: useGameStore.getState().unPreSelectAllPowerUps,
    });
  };

  const contextValue: IGameContext = {
    ...gameProviderDefaults,
    play,
    discard,
    clearPreSelection: () => {
      useCurrentHandStore.getState().clearPreSelection();
      useGameStore.getState().unPreSelectAllPowerUps();
    },
    resetLevel,
  };

  return (
    <TutorialGameContext.Provider value={contextValue}>
      {children}
    </TutorialGameContext.Provider>
  );
};

export default TutorialGameProvider;

import React, { createContext, useEffect, useState } from "react";
import {
  acumSfx,
  discardSfx,
  multiSfx,
  pointsSfx,
  preselectedCardSfx,
} from "../constants/sfx";
import { GameStateEnum } from "../dojo/typescript/custom.ts";
import { useDojo } from "../dojo/useDojo";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { useAudio } from "../hooks/useAudio";
import { useAnimationStore } from "../state/useAnimationStore.ts";
import { useCurrentHandStore } from "../state/useCurrentHandStore";
import { useGameStore } from "../state/useGameStore";
import { LevelPokerHand } from "../types/LevelPokerHand.ts";
import { logEvent } from "../utils/analytics.ts";
import { H10, H8 } from "../utils/mocks/cardMocks.ts";
import {
  EVENT_FLUSH,
  EVENT_PAIR,
  EVENT_PAIR_POWER_UPS,
  HAND_1,
  HAND_2,
  MOCKED_PLAYS,
} from "../utils/mocks/tutorialMocks.ts";
import { animatePlayDiscard } from "../utils/playEvents/animatePlayDiscard.ts";
import { useCardAnimations } from "./CardAnimationsProvider";
import { IGameContext } from "./GameProvider";
import { gameProviderDefaults } from "./gameProviderDefaults.ts";
import { useSettings } from "./SettingsProvider";

export const TutorialGameContext =
  createContext<IGameContext>(gameProviderDefaults);

const emptyFn = () => {};
const TUTORIAL_EVENTS = [EVENT_PAIR, EVENT_PAIR_POWER_UPS, EVENT_FLUSH];

const TutorialGameProvider = ({ children }: { children: React.ReactNode }) => {
  const [indexEvent, setIndexEvent] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    logEvent("tutorial_step", { step })
  }, [step])

  const {
    setPlayIsNeon,
    setPreSelectionLocked,
    preSelectedModifiers,
    preSelectedCards,
  } = useCurrentHandStore();
  const {
    fetchGameStoreForTutorial,
    discard: stateDiscard,
    setPoints,
    setMulti,
    addPoints,
  } = useGameStore();
  const {
    setRoundRewards,
    showSpecials,
    resetPowerUps,
    resetSpecials,
    setState,
  } = useGameStore();
  const { setPlayAnimation, setDiscardAnimation } = useAnimationStore();
  const { setAnimatedCard, setAnimatedPowerUp } = useCardAnimations();
  const { sfxVolume } = useSettings();
  const { play: preselectCardSound } = useAudio(preselectedCardSfx, sfxVolume);
  const { play: discardSound } = useAudio(discardSfx, sfxVolume);
  const { play: pointsSound } = useAudio(pointsSfx, sfxVolume);
  const { play: multiSound } = useAudio(multiSfx, sfxVolume);
  const { play: acumSound } = useAudio(acumSfx, sfxVolume);

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

    fetchGameStoreForTutorial();
    useGameStore.setState({ plays: MOCKED_PLAYS as LevelPokerHand[] });
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
    stateDiscard();
    discardSound();

    setTimeout(() => {
      setDiscardAnimation(true);
    }, 200);

    setTimeout(() => {
      setPreSelectionLocked(false);
      setAnimatedCard(undefined);
      setDiscardAnimation(false);
      useCurrentHandStore.getState().replaceCards(HAND_2);
      useCurrentHandStore.getState().clearPreSelection();
    }, 200 + 300);
  };

  const play = () => {
    const event = TUTORIAL_EVENTS[indexEvent];
    const { remainingPlays, preSelectedPowerUps } = useGameStore.getState();

    setIndexEvent((index) => index + 1);
    useGameStore.getState().play();

    animatePlayDiscard({
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
      setPoints: setPoints,
      setMulti: setMulti,
      addPoints: addPoints,
      addMulti: useGameStore.getState().addMulti,
      setCurrentScore: useGameStore.getState().setCurrentScore,
      addCash: emptyFn,
      changeCardsSuit: emptyFn,
      changeCardsNeon: emptyFn,
      setAnimation: setPlayAnimation,
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
      address: '0x0',
      clearRoundSound: emptyFn,
      clearLevelSound: emptyFn,
    });
  };

  /* 
  Check to verify that in the step 31 the user has to select the H10 
  and the m5 power-up to complete the tutorial.
  */
  useEffect(() => {
    if (
      step === 31 &&
      (Object.keys(preSelectedModifiers).length === 0 ||
        !Object.keys(preSelectedModifiers).includes(H8.idx.toString()))
    ) {
      setStep(30);
    }
    H10.id;
  }, [step, preSelectedModifiers]);

  const contextValue: IGameContext = {
    ...gameProviderDefaults,
    play,
    discard,
    clearPreSelection: () => {
      useCurrentHandStore.getState().clearPreSelection();
      useGameStore.getState().unPreSelectAllPowerUps();
    },
    resetLevel,
    stepIndex: step,
    setStepIndex: () => setStep((s) => s + 1),
  };

  return (
    <TutorialGameContext.Provider value={contextValue}>
      {children}
    </TutorialGameContext.Provider>
  );
};

export default TutorialGameProvider;

import { createContext, ReactNode, useEffect, useRef } from "react";
import {
  acumSfx,
  clearLevel,
  clearRound,
  negativeMultiSfx,
} from "../constants/sfx";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useDojo } from "../dojo/useDojo";
import { Plays } from "../enums/plays";
import { useAudio } from "../hooks/useAudio";
import { usePitchedAudio } from "../hooks/usePitchedAudio";
import { useAnimationStore } from "../state/useAnimationStore";
import { useCurrentHandStore } from "../state/useCurrentHandStore";
import { useGameStore } from "../state/useGameStore";
import { usePracticeStore } from "../state/usePracticeStore";
import { PokerHand } from "../types/LevelPokerHand";
import { CardPlayEvent, PowerUpScore } from "../types/ScoreData";
import { getPlayAnimationDuration } from "../utils/getPlayAnimationDuration";
import {
  OptimisticAnimationController,
  animateOptimisticCardPlay,
} from "../utils/playEvents/animateOptimisticCardPlay";
import { animatePlayDiscard } from "../utils/playEvents/animatePlayDiscard";
import { buildOptimisticCardPlayEvents } from "../utils/playEvents/buildOptimisticCardPlayEvents";
import {
  buildOptimisticConverterCardPlayChangeEvents,
  canOptimisticallyBuildConverterEvents,
  getActiveConverterSpecialCards,
} from "../utils/playEvents/buildOptimisticConverterCardPlayChangeEvents";
import { buildOptimisticPowerUpEvents } from "../utils/playEvents/buildOptimisticPowerUpEvents";
import { filterOptimisticEventsFromPlayEvents } from "../utils/playEvents/filterOptimisticEventsFromPlayEvents";
import { filterSilentCardEventsFromPlayEvents } from "../utils/playEvents/filterSilentCardEventsFromPlayEvents";
import { getSilentCardIndexesForOptimisticPlay } from "../utils/playEvents/getSilentCardIndexesForOptimisticPlay";
import { getPlayEvents } from "../utils/playEvents/getPlayEvents";
import {
  failedTransactionToast,
  showTransactionToast,
  updateTransactionToast,
} from "../utils/transactionNotifications";
import { useCardAnimations } from "./CardAnimationsProvider";
import { IGameContext } from "./GameProvider";
import { gameProviderDefaults } from "./gameProviderDefaults";
import { useSettings } from "./SettingsProvider";

// Number of pitch variants for scoring sounds (points_0.mp3 to points_17.mp3)
const PITCH_VARIANTS = 18;

const noOp = () => {};
const noOpNavigate = (_: string) => {};
const noOpSetRoundRewards = (_: unknown) => {};

const POKER_HAND_TO_ENUM: Record<PokerHand, number> = {
  RoyalFlush: 1,
  StraightFlush: 2,
  FiveOfAKind: 3,
  FourOfAKind: 4,
  FullHouse: 5,
  Straight: 6,
  Flush: 7,
  ThreeOfAKind: 8,
  TwoPair: 9,
  OnePair: 10,
  HighCard: 11,
};

const toPokerHandLevels = (
  plays: ReturnType<typeof usePracticeStore.getState>["scenario"]["plays"],
) =>
  plays
    .map((play) => {
      const pokerHandEnum = POKER_HAND_TO_ENUM[play.poker_hand];
      if (!pokerHandEnum) {
        return null;
      }

      // Use object instead of array so starknet.js serializes as tuple (flat)
      // instead of as nested array (which adds a length prefix per element)
      return {
        0: pokerHandEnum,
        1: Number(play.multi),
        2: Number(play.points),
      };
    })
    .filter(
      (tuple): tuple is { 0: number; 1: number; 2: number } => tuple !== null,
    );

export const PracticeGameContext =
  createContext<IGameContext>(gameProviderDefaults);

export const PracticeGameProvider = ({ children }: { children: ReactNode }) => {
  const scenario = usePracticeStore((store) => store.scenario);
  const level = useGameStore((store) => store.level);

  const {
    setup: { client },
    account: { account },
  } = useDojo();

  const { sfxVolume, animationSpeed } = useSettings();
  const { setPlayAnimation, setLevelUpHand } = useAnimationStore();

  const {
    setAnimatedCard,
    setAnimatedPowerUp,
    setAnimateSecondChanceCard,
    setanimateSpecialCardDefault,
  } = useCardAnimations();

  const { play: pointsSound } = usePitchedAudio(
    "/music/sfx/points",
    PITCH_VARIANTS,
    sfxVolume,
  );
  const { play: acumSound } = useAudio(acumSfx, sfxVolume);
  const { play: negativeMultiSound } = useAudio(negativeMultiSfx, sfxVolume);
  const { play: clearRoundSound } = useAudio(clearRound, sfxVolume);
  const { play: clearLevelSound } = useAudio(clearLevel, sfxVolume);

  const gameStoreSnapshotRef = useRef<ReturnType<
    typeof useGameStore.getState
  > | null>(null);
  const handStoreSnapshotRef = useRef<ReturnType<
    typeof useCurrentHandStore.getState
  > | null>(null);

  const playAnimationDuration = getPlayAnimationDuration(
    level > 0 ? level : 1,
    animationSpeed,
  );

  useEffect(() => {
    gameStoreSnapshotRef.current = useGameStore.getState();
    handStoreSnapshotRef.current = useCurrentHandStore.getState();

    return () => {
      if (gameStoreSnapshotRef.current) {
        useGameStore.setState(gameStoreSnapshotRef.current);
      }
      if (handStoreSnapshotRef.current) {
        useCurrentHandStore.setState(handStoreSnapshotRef.current);
      }
    };
  }, []);

  useEffect(() => {
    useCurrentHandStore.setState({
      hand: scenario.handCards,
      preSelectedCards: [],
      preSelectedModifiers: {},
      preSelectionLocked: false,
      preSelectedPlay: Plays.NONE,
      playIsNeon: false,
      cardTransformationLock: false,
    });

    useGameStore.setState({
      gameLoading: false,
      gameError: false,
      state: GameStateEnum.Round,
      isRageRound: scenario.rageCards.length > 0,
      inBossRound: false,
      level: 1,
      round: 1,
      totalPlays: 5,
      remainingPlays: 5,
      totalDiscards: 0,
      remainingDiscards: 0,
      specialCards: scenario.specialCards,
      rageCards: scenario.rageCards,
      specialSwitcherOn: true,
      maxSpecialCards: 7,
      specialSlots: 7,
      powerUps: scenario.powerUps,
      preSelectedPowerUps: [],
      maxPowerUpSlots: Math.max(scenario.powerUps.length, 1),
      plays: scenario.plays,
      debuffedPlayerHands: [],
      points: 0,
      multi: 0,
      currentScore: 0,
      targetScore: 500,
      roundRewards: undefined,
    });
  }, [scenario]);

  const clearPreSelection = () => {
    useCurrentHandStore.getState().clearPreSelection();
    useGameStore.getState().unPreSelectAllPowerUps();
  };

  const play = async () => {
    const handStore = useCurrentHandStore.getState();
    const gameStore = useGameStore.getState();

    if (
      handStore.preSelectionLocked ||
      handStore.preSelectedCards.length === 0
    ) {
      return;
    }

    if (!client?.practice_system?.simulatePlay || !account) {
      console.error("practice_system.simulatePlay is not available.");
      failedTransactionToast();
      return;
    }

    const handCardIds = handStore.hand
      .map((card) => card.card_id ?? card.idx)
      .filter((cardId): cardId is number => typeof cardId === "number");

    const playedCardsIndex = handStore.preSelectedCards
      .map((selectedCardIdx) =>
        handStore.hand.findIndex((card) => card.idx === selectedCardIdx),
      )
      .filter((handIndex) => handIndex >= 0);

    const specialCardIds = gameStore.specialCards
      .map((card) => card.card_id ?? card.idx)
      .filter((cardId): cardId is number => typeof cardId === "number");

    const rageIds = gameStore.rageCards
      .map((card) => card.card_id ?? card.idx)
      .filter((cardId): cardId is number => typeof cardId === "number");

    const powerUpIds = gameStore.preSelectedPowerUps
      .map(
        (powerUpIdx) =>
          gameStore.powerUps.find((powerUp) => powerUp?.idx === powerUpIdx)
            ?.power_up_id,
      )
      .filter(
        (powerUpId): powerUpId is number => typeof powerUpId === "number",
      );

    const pokerHandLevels = toPokerHandLevels(scenario.plays);
    const activeConverterSpecialCards = getActiveConverterSpecialCards(
      gameStore.specialCards,
    );
    const shouldUseOptimisticPlay =
      activeConverterSpecialCards.length === 0 ||
      canOptimisticallyBuildConverterEvents(activeConverterSpecialCards);
    const playPitchState = { index: 0 };

    let optimisticCardPlayChangeEvents: CardPlayEvent[] = [];
    let optimisticCardPlayEvents: CardPlayEvent[] = [];
    let optimisticPowerUpEvents: PowerUpScore[] = [];
    let optimisticAnimation: OptimisticAnimationController | null = null;

    if (shouldUseOptimisticPlay) {
      optimisticCardPlayChangeEvents =
        buildOptimisticConverterCardPlayChangeEvents({
          hand: handStore.hand,
          preSelectedCards: handStore.preSelectedCards,
          specialCards: gameStore.specialCards,
          preSelectedModifiers: handStore.preSelectedModifiers,
        });
    }

    const nonAnimatedCardIndexes = getSilentCardIndexesForOptimisticPlay({
      hand: handStore.hand,
      preSelectedCards: handStore.preSelectedCards,
      rageCards: gameStore.rageCards,
      preSelectedModifiers: handStore.preSelectedModifiers,
      changeEvents: optimisticCardPlayChangeEvents,
    });

    if (gameStore.debuffedPlayerHands.includes(handStore.preSelectedPlay)) {
      handStore.preSelectedCards.forEach((cardIdx) => {
        nonAnimatedCardIndexes.add(cardIdx);
      });
    }

    if (shouldUseOptimisticPlay) {
      optimisticCardPlayEvents = buildOptimisticCardPlayEvents({
        hand: handStore.hand,
        preSelectedCards: handStore.preSelectedCards,
        specialCards: gameStore.specialCards,
        preSelectedModifiers: handStore.preSelectedModifiers,
        silentCardIndexes: nonAnimatedCardIndexes,
        changeEvents: optimisticCardPlayChangeEvents,
      });
      optimisticPowerUpEvents = buildOptimisticPowerUpEvents({
        preSelectedPowerUps: gameStore.preSelectedPowerUps,
        powerUps: gameStore.powerUps,
      });

      optimisticAnimation = animateOptimisticCardPlay({
        changeEvents: optimisticCardPlayChangeEvents,
        events: optimisticCardPlayEvents,
        powerUpEvents: optimisticPowerUpEvents,
        playAnimationDuration,
        pitchState: playPitchState,
        setAnimatedCard,
        setAnimatedPowerUp,
        pointsSound,
        negativeMultiSound,
        addPoints: gameStore.addPoints,
        addMulti: gameStore.addMulti,
        changeCardsSuit: handStore.changeCardsSuit,
        changeCardsNeon: handStore.changeCardsNeon,
        changeCardsRank: handStore.changeCardsRank,
        setCardTransformationLock: handStore.setCardTransformationLock,
      });
    }

    handStore.setPreSelectionLocked(true);
    gameStore.play();

    console.log("Simulating play with:", {
      handCardIds,
      playedCardsIndex,
      specialCardIds,
      rageIds,
      pokerHandLevels,
      powerUpIds,
    });

    try {
      showTransactionToast();
      const response = await client.practice_system.simulatePlay(
        account,
        handCardIds,
        playedCardsIndex,
        specialCardIds,
        rageIds,
        pokerHandLevels,
        powerUpIds,
      );

      const transactionHash = response?.transaction_hash ?? "";
      showTransactionToast(transactionHash, "Simulating play...");

      const tx = await account.waitForTransaction(transactionHash, {
        retryInterval: 100,
      });

      updateTransactionToast(transactionHash, tx.isSuccess());

      if (!tx.isSuccess()) {
        optimisticAnimation?.cancel();
        gameStore.rollbackPlay();
        handStore.setPreSelectionLocked(false);
        clearPreSelection();
        return;
      }

      const resolvedPlayEvents = getPlayEvents(tx.value.events);
      const dedupedResponse = shouldUseOptimisticPlay
        ? filterOptimisticEventsFromPlayEvents(
            resolvedPlayEvents,
            optimisticCardPlayEvents,
            optimisticPowerUpEvents,
            optimisticCardPlayChangeEvents,
          )
        : resolvedPlayEvents;
      const filteredResponse = filterSilentCardEventsFromPlayEvents(
        dedupedResponse,
        nonAnimatedCardIndexes,
      );

      if (optimisticAnimation) {
        await optimisticAnimation.done;
      }

      animatePlayDiscard({
        playEvents: filteredResponse,
        playAnimationDuration,
        pitchState: playPitchState,
        setPlayIsNeon: handStore.setPlayIsNeon,
        setAnimatedCard,
        setAnimatedPowerUp,
        setLevelUpHand,
        pointsSound,
        acumSound,
        negativeMultiSound,
        setPoints: gameStore.setPoints,
        setMulti: gameStore.setMulti,
        addPoints: gameStore.addPoints,
        addMulti: gameStore.addMulti,
        changeCardsSuit: handStore.changeCardsSuit,
        changeCardsNeon: handStore.changeCardsNeon,
        changeCardsRank: handStore.changeCardsRank,
        setAnimation: setPlayAnimation,
        setPreSelectionLocked: handStore.setPreSelectionLocked,
        clearPreSelection,
        refetchPowerUps: noOp,
        preSelectedPowerUps: gameStore.preSelectedPowerUps,
        navigate: noOpNavigate,
        setRoundRewards: noOpSetRoundRewards,
        replaceCards: handStore.replaceCards,
        remainingPlays: gameStore.remainingPlays,
        setAnimateSecondChanceCard,
        setCardTransformationLock: handStore.setCardTransformationLock,
        specialCards: gameStore.specialCards,
        setAnimateSpecialCardDefault: setanimateSpecialCardDefault,
        addCash: gameStore.addCash,
        setCurrentScore: gameStore.setCurrentScore,
        resetRage: gameStore.resetRage,
        unPreSelectAllPowerUps: gameStore.unPreSelectAllPowerUps,
        address: account.address,
        clearRoundSound,
        clearLevelSound,
      });
    } catch (error) {
      console.error("Error simulating play", error);
      optimisticAnimation?.cancel();
      failedTransactionToast();
      gameStore.rollbackPlay();
      handStore.setPreSelectionLocked(false);
      clearPreSelection();
    }
  };

  const contextValue: IGameContext = {
    ...gameProviderDefaults,
    play,
    clearPreSelection,
    changeModifierCard: () =>
      new Promise((resolve) => resolve({ success: false, cards: [] })),
  };

  return (
    <PracticeGameContext.Provider value={contextValue}>
      {children}
    </PracticeGameContext.Provider>
  );
};

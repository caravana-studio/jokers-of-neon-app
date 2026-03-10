import { ReactNode, useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  acumSfx,
  clearLevel,
  clearRound,
  discardSfx,
  negativeMultiSfx,
} from "../constants/sfx";
import { isMockGameApiMode } from "../config/gameMode";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useAudio } from "../hooks/useAudio";
import { usePitchedAudio } from "../hooks/usePitchedAudio";
import { useCardAnimations } from "./CardAnimationsProvider";
import { GameContext, IGameContext } from "./GameProvider";
import { gameProviderDefaults } from "./gameProviderDefaults";
import { useSettings } from "./SettingsProvider";
import { useAnimationStore } from "../state/useAnimationStore";
import { useCurrentHandStore } from "../state/useCurrentHandStore";
import { useGameStore } from "../state/useGameStore";
import { sortCards } from "../utils/sortCards";
import {
  ROGUELIKE_DEFAULT_PLAYS,
  useRoguelikeRuntimeStore,
} from "../state/roguelike/useRoguelikeRuntimeStore";
import { useRunStore } from "../state/roguelike/useRunStore";
import { CardPlayEvent, PlayEvents, PowerUpScore } from "../types/ScoreData";
import { getPlayAnimationDuration } from "../utils/getPlayAnimationDuration";
import { isCardSilent } from "../utils/isCardSilent";
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
import { sortCardPlayEvents } from "../utils/sortCardPlayEvents";

const PITCH_VARIANTS = 18;

const EMPTY_LOADOUT = {
  selectedUpgradeIds: [],
  selectedPactIds: [],
};

export const RoguelikeRoundProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeRun = useRunStore((state) => state.activeRun);
  const startRun = useRunStore((state) => state.startRun);
  const clearRun = useRunStore((state) => state.clearRun);

  const runtimeState = useRoguelikeRuntimeStore();

  const { sfxVolume, animationSpeed } = useSettings();

  const { setPlayAnimation, setDiscardAnimation, setLevelUpHand } = useAnimationStore();
  const {
    setAnimatedCard,
    setAnimatedPowerUp,
    setAnimateSecondChanceCard,
    setanimateSpecialCardDefault,
  } = useCardAnimations();

  const { play: discardSound } = useAudio(discardSfx, sfxVolume);
  const { play: pointsSound } = usePitchedAudio(
    "/music/sfx/points",
    PITCH_VARIANTS,
    sfxVolume
  );
  const { play: acumSound } = useAudio(acumSfx, sfxVolume);
  const { play: negativeMultiSound } = useAudio(negativeMultiSfx, sfxVolume);
  const { play: clearRoundSound } = useAudio(clearRound, sfxVolume);
  const { play: clearLevelSound } = useAudio(clearLevel, sfxVolume);

  const playAnimationQueueRef = useRef<Promise<void>>(Promise.resolve());
  const activeOptimisticAnimationRef =
    useRef<OptimisticAnimationController | null>(null);

  const syncHandStoreFromRuntime = useCallback((clearSelection = true) => {
    const runtime = useRoguelikeRuntimeStore.getState();

    useCurrentHandStore.setState((state) => ({
      ...state,
      hand: sortCards(
        runtime.getHandCards().filter((card) => card.card_id !== 9999),
        state.sortBy
      ),
      ...(clearSelection
        ? {
            preSelectedCards: [],
            preSelectedModifiers: {},
            preSelectionLocked: false,
            preSelectedPlay: 0,
            playIsNeon: false,
            cardTransformationLock: false,
          }
        : {}),
    }));
  }, []);

  const syncGameStoreFromRuntime = useCallback((options?: { keepCurrentScore?: boolean }) => {
    const runtime = useRoguelikeRuntimeStore.getState();

    const gameStateByPhase: Record<typeof runtime.phase, GameStateEnum> = {
      IDLE: GameStateEnum.NotSet,
      ROUND: GameStateEnum.Round,
      REWARDS: GameStateEnum.Reward,
      MAP: GameStateEnum.Map,
      SHOP: GameStateEnum.Store,
      GAME_OVER: GameStateEnum.GameOver,
    };

    useGameStore.setState((state) => ({
      ...state,
      id: activeRun?.runNumber ?? 900001,
      state: gameStateByPhase[runtime.phase] ?? GameStateEnum.NotSet,
      gameLoading: false,
      gameError: false,
      round: runtime.round,
      level: runtime.level,
      targetScore: runtime.targetScore,
      currentScore: options?.keepCurrentScore ? state.currentScore : runtime.currentScore,
      totalScore: runtime.totalScore,
      totalPlays: runtime.totalPlays,
      totalDiscards: runtime.totalDiscards,
      remainingPlays: runtime.remainingPlays,
      remainingDiscards: runtime.remainingDiscards,
      cash: runtime.cash,
      roundRewards: runtime.rewards ?? undefined,
      specialCards: [],
      rageCards: [],
      debuffedPlayerHands: [],
      isRageRound: runtime.round % 3 === 0,
      inBossRound: runtime.round % 3 === 0,
      availableRerolls: 1,
      maxSpecialCards: 7,
      specialSlots: 2,
      maxPowerUpSlots: 4,
      powerUps: [],
      preSelectedPowerUps: [],
      plays: ROGUELIKE_DEFAULT_PLAYS,
      shopId: runtime.currentShopId ?? 1,
      nodeRound: runtime.currentShopId ?? 1,
    }));
  }, [activeRun?.runNumber]);

  const syncStoresFromRuntime = useCallback(
    (options?: {
      syncHand?: boolean;
      clearSelection?: boolean;
      keepCurrentScore?: boolean;
    }) => {
      if (options?.syncHand !== false) {
        syncHandStoreFromRuntime(options?.clearSelection ?? true);
      }
      syncGameStoreFromRuntime({ keepCurrentScore: options?.keepCurrentScore });
    },
    [syncGameStoreFromRuntime, syncHandStoreFromRuntime]
  );

  useEffect(() => {
    if (!activeRun) {
      return;
    }

    runtimeState.bootstrapFromRun(activeRun);
    syncStoresFromRuntime();
  }, [activeRun?.runId, runtimeState.bootstrapFromRun, syncStoresFromRuntime]);

  useEffect(() => {
    if (!activeRun) {
      return;
    }

    const toSafeGold = (value: number): number => {
      if (!Number.isFinite(value)) {
        return 0;
      }

      return Math.max(0, Math.floor(value));
    };

    const runtime = useRoguelikeRuntimeStore.getState();
    const runGold = toSafeGold(activeRun.gold);
    const runtimeCash = toSafeGold(runtime.cash);
    const reconciledGold = Math.max(runGold, runtimeCash);

    if (runtimeCash !== reconciledGold) {
      runtimeState.updateCash(reconciledGold);
    }

    if (runGold !== reconciledGold) {
      void useRunStore.getState().syncRunGold(reconciledGold);
    }

    syncStoresFromRuntime();
  }, [activeRun?.gold, runtimeState.updateCash, syncStoresFromRuntime]);

  const clearPreSelection = () => {
    useCurrentHandStore.getState().clearPreSelection();
    useGameStore.getState().unPreSelectAllPowerUps();
  };

  const resetLevel = () => {
    useGameStore.setState({
      roundRewards: undefined,
      points: 0,
      multi: 0,
      currentScore: 0,
      state: GameStateEnum.NotSet,
    });
    clearPreSelection();
  };

  const prepareNewGame = () => {
    runtimeState.reset();
    clearRun();
    resetLevel();
  };

  const executeCreateGame = async () => {
    const currentRun = useRunStore.getState().activeRun;
    if (currentRun) {
      runtimeState.bootstrapFromRun(currentRun);
      syncStoresFromRuntime();
      navigate("/demo");
      return;
    }

    const newRun = await startRun({ loadout: EMPTY_LOADOUT });
    if (!newRun) {
      return;
    }

    runtimeState.bootstrapFromRun(newRun);
    syncStoresFromRuntime();
    navigate("/demo");
  };

  const checkOrCreateGame = async () => {
    const run = useRunStore.getState().activeRun;
    if (!run) {
      await executeCreateGame();
      return;
    }

    runtimeState.bootstrapFromRun(run);
    syncStoresFromRuntime();
  };

  useEffect(() => {
    if (location.pathname !== "/demo") {
      return;
    }

    if (activeRun) {
      return;
    }

    void executeCreateGame();
  }, [location.pathname, activeRun?.runId]);

  const normalizePlayEventsForAnimation = (playEvents: PlayEvents): PlayEvents => ({
    ...playEvents,
    cardPlayChangeEvents: playEvents.cardPlayChangeEvents
      ? [...playEvents.cardPlayChangeEvents].sort(sortCardPlayEvents)
      : playEvents.cardPlayChangeEvents,
    cardPlayEvents: playEvents.cardPlayEvents
      ? [...playEvents.cardPlayEvents].sort(sortCardPlayEvents)
      : playEvents.cardPlayEvents,
    acumulativeEvents: playEvents.acumulativeEvents
      ? [...playEvents.acumulativeEvents].sort(sortCardPlayEvents)
      : playEvents.acumulativeEvents,
  });

  const runResolvedPlayAnimation = (
    playEvents: PlayEvents,
    setAnimation: (playing: boolean) => void,
    pitchState?: { index: number }
  ): number => {
    const gameStore = useGameStore.getState();
    const handStore = useCurrentHandStore.getState();
    const addCashAndSync = (cashDelta: number) => {
      const latestCash = useGameStore.getState().cash;
      const nextCash = Math.max(0, latestCash + cashDelta);
      gameStore.setCash(nextCash);

      if (!isMockGameApiMode) {
        return;
      }

      void useRunStore.getState().syncRunGold(nextCash);
      useRoguelikeRuntimeStore.getState().updateCash(nextCash);
    };
    const playAnimationDuration = getPlayAnimationDuration(
      Math.max(1, gameStore.level),
      animationSpeed
    );

    return animatePlayDiscard({
      playEvents,
      playAnimationDuration,
      pitchState,
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
      setAnimation,
      setPreSelectionLocked: handStore.setPreSelectionLocked,
      clearPreSelection,
      refetchPowerUps: () => {},
      preSelectedPowerUps: gameStore.preSelectedPowerUps,
      navigate,
      setRoundRewards: gameStore.setRoundRewards,
      replaceCards: handStore.replaceCards,
      remainingPlays: gameStore.remainingPlays,
      setAnimateSecondChanceCard,
      setCardTransformationLock: handStore.setCardTransformationLock,
      specialCards: gameStore.specialCards,
      setAnimateSpecialCardDefault: setanimateSpecialCardDefault,
      addCash: addCashAndSync,
      setCurrentScore: gameStore.setCurrentScore,
      resetRage: gameStore.resetRage,
      unPreSelectAllPowerUps: gameStore.unPreSelectAllPowerUps,
      address: "0x0",
      clearRoundSound,
      clearLevelSound,
    });
  };

  const queueResolvedPlayAnimation = (
    playEvents: PlayEvents,
    setAnimation: (playing: boolean) => void,
    pitchState?: { index: number }
  ) => {
    playAnimationQueueRef.current = playAnimationQueueRef.current
      .catch(() => undefined)
      .then(() => {
        const animationDuration = runResolvedPlayAnimation(
          playEvents,
          setAnimation,
          pitchState
        );
        if (animationDuration <= 0) {
          return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          setTimeout(() => resolve(), animationDuration);
        });
      });
  };

  const play = () => {
    const handStore = useCurrentHandStore.getState();
    const gameStore = useGameStore.getState();

    if (
      handStore.preSelectionLocked ||
      handStore.preSelectedCards.length === 0 ||
      gameStore.remainingPlays <= 0
    ) {
      return;
    }

    const handByIdx = new Map(handStore.hand.map((card) => [card.idx, card]));
    const isDebuffedPlay = gameStore.debuffedPlayerHands.includes(
      handStore.preSelectedPlay
    );
    const nonAnimatedCardIndexes = new Set(
      handStore.preSelectedCards.filter((cardIdx) => {
        const card = handByIdx.get(cardIdx);
        if (!card) {
          return false;
        }

        return isCardSilent(card, gameStore.rageCards);
      })
    );
    if (isDebuffedPlay) {
      handStore.preSelectedCards.forEach((cardIdx) =>
        nonAnimatedCardIndexes.add(cardIdx)
      );
    }

    const playPitchState = { index: 0 };
    const activeConverterSpecialCards = getActiveConverterSpecialCards(
      gameStore.specialCards
    );
    const shouldUseOptimisticPlay =
      activeConverterSpecialCards.length === 0 ||
      canOptimisticallyBuildConverterEvents(activeConverterSpecialCards);

    let optimisticCardPlayChangeEvents: CardPlayEvent[] = [];
    let optimisticCardPlayEvents: CardPlayEvent[] = [];
    let optimisticPowerUpEvents: PowerUpScore[] = [];

    try {
      if (shouldUseOptimisticPlay) {
        optimisticCardPlayChangeEvents =
          buildOptimisticConverterCardPlayChangeEvents({
            hand: handStore.hand,
            preSelectedCards: handStore.preSelectedCards,
            specialCards: gameStore.specialCards,
            preSelectedModifiers: handStore.preSelectedModifiers,
          });
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

        const optimisticAnimation = animateOptimisticCardPlay({
          changeEvents: optimisticCardPlayChangeEvents,
          events: optimisticCardPlayEvents,
          powerUpEvents: optimisticPowerUpEvents,
          playAnimationDuration: getPlayAnimationDuration(
            Math.max(1, gameStore.level),
            animationSpeed
          ),
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

        activeOptimisticAnimationRef.current = optimisticAnimation;
        playAnimationQueueRef.current = optimisticAnimation.done;
        optimisticAnimation.done.finally(() => {
          if (activeOptimisticAnimationRef.current === optimisticAnimation) {
            activeOptimisticAnimationRef.current = null;
          }
        });
      }

      handStore.setPreSelectionLocked(true);
      gameStore.play();

      const { playEvents } = runtimeState.resolvePlay({
        hand: handStore.hand,
        selectedCardIdxs: handStore.preSelectedCards,
        preSelectedModifiers: handStore.preSelectedModifiers,
        specialCards: gameStore.specialCards,
      });

      syncStoresFromRuntime({ syncHand: false, keepCurrentScore: true });

      const dedupedResponse = shouldUseOptimisticPlay
        ? filterOptimisticEventsFromPlayEvents(
            playEvents,
            optimisticCardPlayEvents,
            optimisticPowerUpEvents,
            optimisticCardPlayChangeEvents
          )
        : playEvents;

      const filteredResponse = filterSilentCardEventsFromPlayEvents(
        dedupedResponse,
        nonAnimatedCardIndexes
      );

      const normalizedResponse = normalizePlayEventsForAnimation(filteredResponse);
      queueResolvedPlayAnimation(normalizedResponse, setPlayAnimation, playPitchState);
    } catch (error) {
      console.error("Roguelike play failed", error);
      activeOptimisticAnimationRef.current?.cancel();
      activeOptimisticAnimationRef.current = null;
      playAnimationQueueRef.current = Promise.resolve();
      gameStore.rollbackPlay();
      handStore.setPreSelectionLocked(false);
      clearPreSelection();
    }
  };

  const discard = () => {
    const handStore = useCurrentHandStore.getState();
    const gameStore = useGameStore.getState();

    if (
      handStore.preSelectionLocked ||
      handStore.preSelectedCards.length === 0 ||
      gameStore.remainingDiscards <= 0
    ) {
      return;
    }

    try {
      handStore.setPreSelectionLocked(true);
      gameStore.discard();
      discardSound();

      const playEvents = runtimeState.resolveDiscard({
        hand: handStore.hand,
        selectedCardIdxs: handStore.preSelectedCards,
      });

      syncStoresFromRuntime({ syncHand: false, keepCurrentScore: true });

      const normalizedResponse = normalizePlayEventsForAnimation(playEvents);
      queueResolvedPlayAnimation(normalizedResponse, setDiscardAnimation);
    } catch (error) {
      console.error("Roguelike discard failed", error);
      gameStore.rollbackDiscard();
      handStore.setPreSelectionLocked(false);
    }
  };

  const onShopSkip = () => {
    runtimeState.leaveShopToMap();
    useGameStore.setState({ state: GameStateEnum.Map });
    navigate("/map");
  };

  const contextValue: IGameContext = {
    ...gameProviderDefaults,
    executeCreateGame,
    play,
    discard,
    clearPreSelection,
    onShopSkip,
    checkOrCreateGame,
    resetLevel,
    prepareNewGame,
    changeModifierCard: () =>
      Promise.resolve({
        success: false,
        cards: [],
      }),
    sellPowerup: () => Promise.resolve(false),
    sellSpecialCard: () => Promise.resolve(false),
    initiateTransferFlow: () => {},
    surrenderGame: () => {},
  };

  if (location.pathname !== "/demo") {
    return <>{children}</>;
  }

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

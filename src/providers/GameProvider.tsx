import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AccountInterface } from "starknet";
import { createGame } from "../api/createGame.ts";
import { fetchUsernameByAddress } from "../api/usernames.ts";
import { useUsernameRequirement } from "../components/UsernameGate.tsx";
import { getSeasonNumber } from "../constants/season.ts";
import { createMiniAppGame } from "../miniapp/api/createMiniAppGame.ts";
import {
  acumSfx,
  clearLevel,
  clearRound,
  discardSfx,
  negativeMultiSfx,
  popSfx,
} from "../constants/sfx.ts";

// Number of pitch variants for scoring sounds (points_0.mp3 to points_17.mp3)
const PITCH_VARIANTS = 18;
import { GameStateEnum } from "../dojo/typescript/custom.ts";
import { useDojo } from "../dojo/useDojo.tsx";
import { useGameActions } from "../dojo/useGameActions.tsx";
import { useAudio } from "../hooks/useAudio.tsx";
import { usePitchedAudio } from "../hooks/usePitchedAudio.tsx";
import { useCustomToast } from "../hooks/useCustomToast.tsx";
import { useCardAnimations } from "../providers/CardAnimationsProvider";
import { getPlayerLives } from "../queries/getPlayerLives.ts";
import { AppType, useAppContext } from "./AppContextProvider";
import { useAnimationStore } from "../state/useAnimationStore.ts";
import { useCurrentHandStore } from "../state/useCurrentHandStore.ts";
import { useDeckStore } from "../state/useDeckStore.ts";
import { useGameStore } from "../state/useGameStore.ts";
import { useUnlockProgressStore } from "../state/useUnlockProgressStore.ts";
import { Card } from "../types/Card";
import { CardPlayEvent, PlayEvents, PowerUpScore } from "../types/ScoreData";
import { logEvent } from "../utils/analytics.ts";
import { getPlayAnimationDuration } from "../utils/getPlayAnimationDuration.ts";
import { isCardSilent } from "../utils/isCardSilent.ts";
import {
  OptimisticAnimationController,
  animateOptimisticCardPlay,
} from "../utils/playEvents/animateOptimisticCardPlay.ts";
import {
  GAME_OVER_REDIRECT_DELAY_MS,
  animatePlayDiscard,
} from "../utils/playEvents/animatePlayDiscard.ts";
import { buildOptimisticCardPlayEvents } from "../utils/playEvents/buildOptimisticCardPlayEvents.ts";
import {
  buildOptimisticConverterCardPlayChangeEvents,
  canOptimisticallyBuildConverterEvents,
  getActiveConverterSpecialCards,
} from "../utils/playEvents/buildOptimisticConverterCardPlayChangeEvents.ts";
import { buildOptimisticPowerUpEvents } from "../utils/playEvents/buildOptimisticPowerUpEvents.ts";
import { filterOptimisticEventsFromPlayEvents } from "../utils/playEvents/filterOptimisticEventsFromPlayEvents.ts";
import { filterSilentCardEventsFromPlayEvents } from "../utils/playEvents/filterSilentCardEventsFromPlayEvents.ts";
import {
  PROGRESSIVE_TUTORIAL_IDS,
} from "../utils/progressiveTutorialStorage";
import { resolvePostActionKind } from "../utils/playEvents/postAction.ts";
import type { PostActionKind } from "../utils/playEvents/postAction.ts";
import { useCardData } from "./CardDataProvider.tsx";
import { gameProviderDefaults } from "./gameProviderDefaults.ts";
import { PracticeGameContext } from "./PracticeGameProvider.tsx";
import { useSettings } from "./SettingsProvider.tsx";
import { useTutorialStore } from "../state/useTutorialStore.ts";

export interface IGameContext {
  executeCreateGame: (isTournament?: boolean) => Promise<boolean>;
  play: () => void;
  discard: () => void;
  changeModifierCard: (
    cardIdx: number
  ) => Promise<{ success: boolean; cards: Card[] }>;
  clearPreSelection: () => void;
  onShopSkip: () => void;
  sellPowerup: (powerupIdx: number) => Promise<boolean>;
  sellSpecialCard: (card: Card) => Promise<boolean>;
  checkOrCreateGame: () => void;
  remainingPlaysTutorial?: number;
  resetLevel: () => void;
  prepareNewGame: () => void;
  surrenderGame: (gameId: number) => void;
  initiateTransferFlow: () => void;
  stepIndex?: number;
  setStepIndex?: (index: number) => void;
}

const stringTournamentId = import.meta.env.VITE_TOURNAMENT_ID;
const tournamentId = stringTournamentId && Number(stringTournamentId);

const GameContext = createContext<IGameContext>(gameProviderDefaults);

export const useGameContext = () => {
  const location = useLocation();
  const inPractice = location.pathname === "/practice";
  const context = inPractice ? PracticeGameContext : GameContext;
  return useContext(context);
};

export const GameProvider = ({ children }: PropsWithChildren) => {
  const appType = useAppContext();
  const isMiniApp = appType === AppType.MINIAPP;
  const {
    refetchGameStore,
    addCash,
    setCurrentScore,
    setMulti,
    setPoints,
    addPoints,
    addMulti,
    remainingPlays,
    totalPlays,
    discard: stateDiscard,
    play: statePlay,
    rollbackPlay,
    rollbackDiscard,
    level,
    modId,
    state: gameState,
    isClassic,
    setGameId,
    specialCards,
    resetRage,
    removeSpecialCard,
    rageCards,
    debuffedPlayerHands,
    powerUps,
    resetPowerUps,
    preSelectedPowerUps,
    refetchPowerUps: doRefetchPowerUps,
    unPreSelectAllPowerUps,
    setRoundRewards,
    setGameLoading,
    setGameError,
    showSpecials,
    id: gameId,
    resetSpecials,
    setState,
    addRerolls,
    advanceLevel,
    targetScore,
    refetchDebuffedPlayerHands,
    refetchSpecialCards,
    refetchPlays,
    setIsTournament,
    setShopTierUnlockedEvents,
    clearShopTierUnlockedEvent,
    setPendingTutorialRewardsRedirect,
  } = useGameStore();

  const {
    hand,
    replaceCards,
    replaceCardsAfterModifierChange,
    refetchCurrentHandStore,
    preSelectedCards,
    preSelectedPlay,
    preSelectedModifiers,
    clearPreSelection,
    setPreSelectionLocked,
    syncMaxPreSelectedCards,
    changeCardsSuit,
    changeCardsNeon,
    changeCardsRank,
    setPlayIsNeon,
    setCardTransformationLock,
  } = useCurrentHandStore();

  const { fetchDeck } = useDeckStore();

  const {
    setPlayAnimation,
    setDiscardAnimation,
    setLevelUpHand,
    triggerPlayRollbackPulse,
    triggerDiscardRollbackPulse,
  } = useAnimationStore();

  const { getCardData } = useCardData();

  const { refetchSpecialCardsData } = useCardData();

  const navigate = useNavigate();
  const {
    switchToController,
    setup: { accountType, client },
    account: { account },
  } = useDojo();

  const {
    play,
    discard,
    changeModifierCard,
    sellSpecialCard,
    sellPowerup,
    surrenderGame,
    transferGame,
    claimLives,
  } = useGameActions();

  const { showErrorToast } = useCustomToast();
  const { ensureUsername, modal: usernameRequirementModal } = useUsernameRequirement();

  const { sfxVolume, animationSpeed, skipAllTutorials } = useSettings();
  const completedTutorials = useTutorialStore((state) => state.completed);
  const tutorialsLoaded = useTutorialStore((state) => state.loaded);

  const { play: discardSound } = useAudio(discardSfx, sfxVolume);
  // Use pitched audio for scoring sounds (points_0.mp3 to points_17.mp3)
  const { play: pointsSound } = usePitchedAudio("/music/sfx/points", PITCH_VARIANTS, sfxVolume);
  const { play: acumSound } = useAudio(acumSfx, sfxVolume);
  const { play: negativeMultiSound } = useAudio(negativeMultiSfx, sfxVolume);
  const { play: clearRoundSound } = useAudio(clearRound, sfxVolume);
  const { play: clearLevelSound } = useAudio(clearLevel, sfxVolume);
  const { play: popSound } = useAudio(popSfx, sfxVolume);

  const ensureGuestLivesReadyForCreateGame = async (seasonId: number) => {
    if (isMiniApp || accountType !== "burner") {
      return true;
    }

    const playerAddress = account?.address;
    if (!playerAddress) {
      return false;
    }

    const livesResponse = await getPlayerLives(client, {
      playerAddress,
      seasonId,
    });
    const availableLives = livesResponse.data?.available_lives ?? 0;

    if (availableLives > 0) {
      return true;
    }

    const nextLiveTimestamp =
      livesResponse.data?.next_live_timestamp?.getTime();
    const canAttemptClaim =
      !livesResponse.success ||
      !livesResponse.data ||
      livesResponse.data.max_lives === 0 ||
      !nextLiveTimestamp ||
      nextLiveTimestamp <= Date.now();

    if (!canAttemptClaim) {
      console.warn("[create_game] Guest has no lives available yet", {
        playerAddress,
        seasonId,
        nextLiveTimestamp,
      });
      return false;
    }

    console.log("[create_game] Waiting for guest claim_lives before create_game", {
      playerAddress,
      seasonId,
    });

    const claimResult = await claimLives(seasonId);
    if (claimResult.success) {
      return true;
    }

    const refreshedLives = await getPlayerLives(client, {
      playerAddress,
      seasonId,
    });

    if ((refreshedLives.data?.available_lives ?? 0) > 0) {
      return true;
    }

    console.warn("[create_game] Guest claim_lives did not make a live available", {
      playerAddress,
      seasonId,
    });
    return false;
  };

  const playAnimationDuration = getPlayAnimationDuration(level, animationSpeed);

  const {
    setAnimatedCard,
    setAnimateSecondChanceCard,
    setAnimatedPowerUp,
    setanimateSpecialCardDefault,
  } = useCardAnimations();
  const playAnimationQueueRef = useRef<Promise<void>>(Promise.resolve());
  const activeOptimisticAnimationRef =
    useRef<OptimisticAnimationController | null>(null);
  const latestPathRef = useRef(location.pathname);
  const unlockTierRefreshAtGameStartRef = useRef<number>(0);
  const unlockTierRefreshAtGameEndRef = useRef<number>(0);
  const refreshUnlockProgress = useUnlockProgressStore(
    (state) => state.refreshUnlockProgress
  );
  const clearUnlockProgress = useUnlockProgressStore(
    (state) => state.clearUnlockProgress
  );

  useEffect(() => {
    latestPathRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (account?.address) {
      return;
    }
    unlockTierRefreshAtGameStartRef.current = 0;
    unlockTierRefreshAtGameEndRef.current = 0;
    clearUnlockProgress();
  }, [account?.address, clearUnlockProgress]);

  useEffect(() => {
    if (!client || !account?.address || gameId <= 0) {
      return;
    }

    if (unlockTierRefreshAtGameStartRef.current === gameId) {
      return;
    }

    unlockTierRefreshAtGameStartRef.current = gameId;
    void refreshUnlockProgress(client, account.address);
  }, [account?.address, client, gameId, refreshUnlockProgress]);

  useEffect(() => {
    if (
      !client ||
      !account?.address ||
      gameId <= 0 ||
      gameState !== GameStateEnum.GameOver
    ) {
      return;
    }

    if (unlockTierRefreshAtGameEndRef.current === gameId) {
      return;
    }

    unlockTierRefreshAtGameEndRef.current = gameId;
    void refreshUnlockProgress(client, account.address);
  }, [account?.address, client, gameId, gameState, refreshUnlockProgress]);

  const resetLevel = () => {
    setRoundRewards(undefined);
    resetRage();
    setPreSelectionLocked(false);
    showSpecials();
    resetPowerUps();
    resetSpecials();
    clearShopTierUnlockedEvent();
    setPendingTutorialRewardsRedirect(false);
    refetchSpecialCardsData(modId, gameId, specialCards);
    setState(GameStateEnum.NotSet);
  };

  const prepareNewGame = () => {
    localStorage.removeItem("GAME_ID");
    resetLevel();
  };
  const initiateTransferFlow = () => {
    console.log("GameProvider: Initiating transfer flow...");
    // The callback now expects a payload object with all the fresh data.
    switchToController(async (payload) => {
      // We now call executeGameTransfer with the fresh data from the callback payload.
      await executeGameTransfer(payload.account, payload.username);
    });
  };

  const executeGameTransfer = async (
    account: AccountInterface,
    newUsername: string
  ) => {
    if (!gameId) {
      console.error("Guard failed: Attempted to transfer game with no gameId.");
      return;
    }

    console.log(
      `GameProvider: Executing transfer for game ${gameId} to user ${newUsername} with account ${account.address}`
    );
    console.log(account);

    try {
      const usernameRecord = await fetchUsernameByAddress(account.address).catch(
        () => null
      );
      const usernameForTransfer = usernameRecord?.username ?? newUsername ?? "";
      await transferGame(account, gameId, usernameForTransfer);
      console.log("Game transfer successful.");
    } catch (error) {
      console.error("Failed to transfer game:", error);
    }
  };

  const executeCreateGame = async (isTournament = false) => {
    const canContinue = await ensureUsername({ required: true });
    if (!canContinue) {
      return false;
    }

    setGameError(false);
    setIsTournament(isTournament);
    resetLevel();
    setGameLoading(true);
    logEvent("create_game");
    if (!account?.address) {
      console.error("No account address available to create game");
      showErrorToast("Error creating game");
      setGameError(true);
      navigate("/my-games");
      return false;
    }

    try {
      const seasonId = getSeasonNumber();
      const livesReady = await ensureGuestLivesReadyForCreateGame(seasonId);
      if (!livesReady) {
        showErrorToast("Error creating game");
        setGameError(true);
        setGameLoading(false);
        navigate("/my-games");
        return false;
      }

      console.log("Creating game...");
      const response = isMiniApp
        ? await createMiniAppGame({
            seasonId,
            isTournament,
          })
        : await createGame({
            userAddress: account.address,
            seasonId,
            isTournament,
          });
      const newGameId = response?.data?.slot?.game_id;
      console.log(`game ${newGameId} created`);

      if (!newGameId) {
        showErrorToast("Error creating game");
        console.error("Error creating game", response);
        setGameError(true);
        navigate("/my-games");
        return false;
      }

      setGameId(newGameId);
      replaceCards(hand);
      fetchDeck(client, newGameId, getCardData);
      clearPreSelection();
      setPreSelectionLocked(false);
      setRoundRewards(undefined);
      setState(GameStateEnum.NotSet);
      navigate("/round");
    } catch (error) {
      console.error("Error creating game", error);
      showErrorToast("Error creating game");
      setGameError(true);
      navigate("/my-games");
      return false;
    }

    return true;
  };

  const refetchPowerUps = () => {
    doRefetchPowerUps(client, gameId);
  };

  const handlePlaySideEffects = (response: PlayEvents) => {
    const shopTierUnlockedEvents =
      response.shopTierUnlockedEvents ??
      (response.shopTierUnlockedEvent ? [response.shopTierUnlockedEvent] : []);

    console.log("[unlock-debug] handlePlaySideEffects", {
      gameId,
      gameState: response.gameOver ? "GameOver" : "InProgress",
      shopTierUnlockedEventFromResponse: response.shopTierUnlockedEvent,
      shopTierUnlockedEventsFromResponse: shopTierUnlockedEvents,
    });

    if (shopTierUnlockedEvents.length > 0) {
      console.log("[unlock-debug] storing shop tier unlocked events", {
        gameId,
        unlockIds: shopTierUnlockedEvents.map((event) => event.unlock_id),
      });
      setShopTierUnlockedEvents(
        shopTierUnlockedEvents.map((event) => ({
          game_id: gameId,
          unlock_id: event.unlock_id,
        }))
      );
    }

    fetchDeck(client, gameId, getCardData);
    refetchDebuffedPlayerHands(client, gameId);
    refetchSpecialCardsData(modId, gameId, specialCards);
    if (response.levelUpPlayEvent) {
      refetchPlays(client, gameId);
    }
    if (response.levelPassed && response.detailEarned) {
      response.levelPassed.level_passed > 0 && advanceLevel();
      response.detailEarned.rerolls &&
        addRerolls(response.detailEarned.rerolls);
    }

    if (latestPathRef.current !== "/round") {
      refetchGameStore(client, gameId, account.address).catch((error) => {
        console.error("Error refetching game state after background action", error);
      });
    }
  };

  const applyPostActionRollback = (
    response: PlayEvents,
    fallbackActionType: PostActionKind
  ) => {
    if (!response.postActionEvent) {
      return;
    }

    const actionType = resolvePostActionKind(
      response.postActionEvent.action_type,
      fallbackActionType
    );

    if (actionType === "play") {
      rollbackPlay();
      return;
    }

    if (actionType === "discard") {
      rollbackDiscard();
    }
  };

  const triggerPostActionPulse = (
    actionType: PostActionKind,
    durationMs?: number
  ) => {
    if (actionType === "play") {
      triggerPlayRollbackPulse(durationMs);
      return;
    }

    triggerDiscardRollbackPulse(durationMs);
  };

  const handlePostActionAnimationStart = (
    response: PlayEvents,
    fallbackActionType: PostActionKind,
    pulseDurationMs: number
  ) => {
    applyPostActionRollback(response, fallbackActionType);
    triggerPostActionPulse(fallbackActionType, pulseDurationMs);
  };

  const runResolvedPlayAnimation = (
    response: PlayEvents,
    setAnimation: (playing: boolean) => void,
    pitchState?: { index: number },
    actionContext?: PostActionKind
  ): number => {
    const firstScoreTutorialPending =
      !skipAllTutorials &&
      tutorialsLoaded &&
      !completedTutorials[PROGRESSIVE_TUTORIAL_IDS.GAME_FIRST_SCORE];
    const levelPassedInfo = response.levelPassed;
    const detailEarned = response.detailEarned;
    const reachedRewardsFlow =
      Boolean(levelPassedInfo && detailEarned) &&
      Number(levelPassedInfo?.level_passed ?? 0) === 0;
    const clearedOnFirstPlay =
      typeof detailEarned?.hands_left === "number" &&
      totalPlays > 0 &&
      detailEarned.hands_left === totalPlays - 1;
    const deferRewardsNavigation =
      firstScoreTutorialPending &&
      reachedRewardsFlow &&
      clearedOnFirstPlay &&
      response.score >= targetScore;

    setPendingTutorialRewardsRedirect(deferRewardsNavigation);

    console.log("events", response);
    return animatePlayDiscard({
      playEvents: response,
      playAnimationDuration,
      pitchState,
      setPlayIsNeon,
      setAnimatedCard,
      setAnimatedPowerUp,
      setLevelUpHand,
      pointsSound,
      acumSound,
      negativeMultiSound,
      setPoints,
      setMulti,
      changeCardsSuit,
      changeCardsNeon,
      changeCardsRank,
      setAnimation,
      setPreSelectionLocked,
      clearPreSelection,
      refetchPowerUps,
      preSelectedPowerUps,
      navigate,
      setRoundRewards,
      replaceCards,
      remainingPlays,
      setAnimateSecondChanceCard,
      setCardTransformationLock,
      specialCards,
      setAnimateSpecialCardDefault: setanimateSpecialCardDefault,
      addCash,
      setCurrentScore,
      addPoints,
      addMulti,
      resetRage,
      unPreSelectAllPowerUps,
      address: account.address,
      clearRoundSound,
      clearLevelSound,
      popSound,
      deferRewardsNavigation,
      actionContext,
      onPostActionAnimationStart: (resolvedActionType, pulseDurationMs) => {
        handlePostActionAnimationStart(
          response,
          resolvedActionType,
          pulseDurationMs
        );
      },
    });
  };

  const queueResolvedPlayAnimation = (
    response: PlayEvents,
    setAnimation: (playing: boolean) => void,
    pitchState?: { index: number },
    actionContext?: PostActionKind
  ) => {
    playAnimationQueueRef.current = playAnimationQueueRef.current
      .catch(() => undefined)
      .then(() => {
        const animationDuration = runResolvedPlayAnimation(
          response,
          setAnimation,
          pitchState,
          actionContext
        );
        if (animationDuration <= 0) {
          return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          setTimeout(() => resolve(), animationDuration);
        });
      });
  };

  const handlePlayAction = ({
    action,
    setAnimation,
    onStateChange,
    rollback,
    actionType,
  }: {
    action: () => Promise<PlayEvents | undefined>;
    setAnimation: (playing: boolean) => void;
    onStateChange: () => void;
    rollback: () => void;
    actionType: PostActionKind;
  }) => {
    setPreSelectionLocked(true);
    onStateChange();
    action()
      .then((response) => {
        if (response) {
          runResolvedPlayAnimation(response, setAnimation, undefined, actionType);
          handlePlaySideEffects(response);
        } else {
          rollback();
          setPreSelectionLocked(false);
          clearPreSelection();
        }
      })
      .catch(() => {
        rollback();
        setPreSelectionLocked(false);
      });
  };

  const onPlayClick = () => {
    const handByIdx = new Map(hand.map((card) => [card.idx, card]));
    const isDebuffedPlay = debuffedPlayerHands.includes(preSelectedPlay);
    const silentCardIndexes = new Set(
      preSelectedCards.filter((cardIdx) => {
        const card = handByIdx.get(cardIdx);
        if (!card) {
          return false;
        }

        return isCardSilent(card, rageCards);
      })
    );
    if (isDebuffedPlay) {
      preSelectedCards.forEach((cardIdx) => silentCardIndexes.add(cardIdx));
    }

    const playPitchState = { index: 0 };
    const activeConverterSpecialCards = getActiveConverterSpecialCards(specialCards);
    const shouldUseOptimisticPlay =
      activeConverterSpecialCards.length === 0 ||
      canOptimisticallyBuildConverterEvents(activeConverterSpecialCards);

    let optimisticCardPlayChangeEvents: CardPlayEvent[] = [];
    let optimisticCardPlayEvents: CardPlayEvent[] = [];
    let optimisticPowerUpEvents: PowerUpScore[] = [];

    if (shouldUseOptimisticPlay) {
      optimisticCardPlayChangeEvents =
        buildOptimisticConverterCardPlayChangeEvents({
          hand,
          preSelectedCards,
          specialCards,
          preSelectedModifiers,
        });
      optimisticCardPlayEvents = buildOptimisticCardPlayEvents({
        hand,
        preSelectedCards,
        specialCards,
        preSelectedModifiers,
        rageCards,
        silentCardIndexes,
        changeEvents: optimisticCardPlayChangeEvents,
      });
      optimisticPowerUpEvents = buildOptimisticPowerUpEvents({
        preSelectedPowerUps,
        powerUps,
      });

      const optimisticAnimation = animateOptimisticCardPlay({
        changeEvents: optimisticCardPlayChangeEvents,
        events: optimisticCardPlayEvents,
        powerUpEvents: optimisticPowerUpEvents,
        playAnimationDuration,
        pitchState: playPitchState,
        setAnimatedCard,
        setAnimatedPowerUp,
        pointsSound,
        negativeMultiSound,
        addPoints,
        addMulti,
        changeCardsSuit,
        changeCardsNeon,
        changeCardsRank,
        setCardTransformationLock,
      });

      activeOptimisticAnimationRef.current = optimisticAnimation;
      playAnimationQueueRef.current = optimisticAnimation.done;
      optimisticAnimation.done.finally(() => {
        if (activeOptimisticAnimationRef.current === optimisticAnimation) {
          activeOptimisticAnimationRef.current = null;
        }
      });
    }

    setPreSelectionLocked(true);
    statePlay();

    play(gameId, preSelectedCards, preSelectedModifiers, preSelectedPowerUps)
      .then((response) => {
        if (response) {
          const dedupedResponse = shouldUseOptimisticPlay
            ? filterOptimisticEventsFromPlayEvents(
                response,
                optimisticCardPlayEvents,
                optimisticPowerUpEvents,
                optimisticCardPlayChangeEvents
              )
            : response;
          const filteredResponse = filterSilentCardEventsFromPlayEvents(
            dedupedResponse,
            silentCardIndexes
          );

          queueResolvedPlayAnimation(
            filteredResponse,
            setPlayAnimation,
            playPitchState,
            "play"
          );
          handlePlaySideEffects(response);
        } else {
          activeOptimisticAnimationRef.current?.cancel();
          activeOptimisticAnimationRef.current = null;
          playAnimationQueueRef.current = Promise.resolve();
          rollbackPlay();
          setPreSelectionLocked(false);
          clearPreSelection();
        }
      })
      .catch(() => {
        activeOptimisticAnimationRef.current?.cancel();
        activeOptimisticAnimationRef.current = null;
        playAnimationQueueRef.current = Promise.resolve();
        rollbackPlay();
        setPreSelectionLocked(false);
        clearPreSelection();
      });
  };

  const onDiscardClick = () => {
    handlePlayAction({
      action: () => discard(gameId, preSelectedCards, preSelectedModifiers),
      setAnimation: setDiscardAnimation,
      onStateChange: stateDiscard,
      rollback: rollbackDiscard,
      actionType: "discard",
    });
  };

  const onChangeModifierCard = (cardIdx: number) => {
    setPreSelectionLocked(true);
    const newHand = hand?.map((card) => {
      if (card.idx === cardIdx) {
        return {
          ...card,
          discarded: true,
        };
      }
      return card;
    });
    replaceCards(newHand);
    const rollback = () => {
      // rollback, remove discarded boolean from all cards
      const newHand = hand?.map((card) => {
        return {
          ...card,
          discarded: false,
        };
      });
      replaceCards(newHand);
    };
    const discardPromise = changeModifierCard(gameId, cardIdx);
    discardPromise
      .then((response): void => {
        if (response.success) {
          replaceCardsAfterModifierChange(response.cards, cardIdx);
          fetchDeck(client, gameId, getCardData);
        } else {
          rollback();
        }
      })
      .catch(() => {
        rollback();
      })
      .finally(() => {
        setPreSelectionLocked(false);
      });
    return discardPromise;
  };

  const onShopSkip = () => {
    resetLevel();
  };

  const onSellSpecialCard = (card: Card) => {
    setPreSelectionLocked(true);
    addCash(card.selling_price ?? 0);
    card.card_id && removeSpecialCard(card.card_id);
    const promise = sellSpecialCard(gameId, card.idx)
      .then(async ({ success }) => {
        if (success) {
          await refetchSpecialCards(client, gameId);
        }
        return success;
      })
      .catch(() => {
        refetchGameStore(client, gameId, account.address);
        return false;
      })
      .finally(() => {
        setPreSelectionLocked(false);
      });

    return promise;
  };

  const onSellPowerup = (powerupIdx: number) => {
    const promise = sellPowerup(gameId, powerupIdx)
      .then(async ({ success }) => {
        return success;
      })
      .catch(() => {
        return false;
      });

    return promise;
  };

  const checkOrCreateGame = async () => {
    console.log("checking game exists", gameId);

    clearPreSelection();
    if (!gameId || gameId === 0 /* || !gameExists(Game, gameId, modId) */) {
      executeCreateGame();
    } else {
      setGameLoading(false);
      console.log("Game found, no need to create a new one");
    }
  };

  useEffect(() => {
    if (location.pathname === "/practice") {
      return;
    }

    if (gameState === GameStateEnum.GameOver) {
      console.log("[unlock-debug] game state changed to GameOver", {
        pathname: location.pathname,
      });
      if (location.pathname === "/round") {
        let cancelled = false;
        let timeoutId: number | undefined;

        playAnimationQueueRef.current
          .catch(() => undefined)
          .then(() => {
            if (cancelled) return;

            timeoutId = window.setTimeout(() => {
              if (cancelled) return;
              navigate(`/loose`);
            }, GAME_OVER_REDIRECT_DELAY_MS);
          });

        return () => {
          cancelled = true;
          if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
          }
        };
      }

      if (location.pathname !== "/loose") {
        navigate(`/loose`);
      }
    } else if (
      gameState === GameStateEnum.Store &&
      location.pathname === "/round"
    ) {
      console.log("redirecting to store");
      navigate("/store");
    }
  }, [gameState, location.pathname, navigate]);

  useEffect(() => {
    refetchSpecialCardsData(modId, gameId, specialCards);
  }, []);

  useEffect(() => {
    syncMaxPreSelectedCards(rageCards);
  }, [rageCards]);

  const actions = {
    play: onPlayClick,
    discard: onDiscardClick,
    changeModifierCard: onChangeModifierCard,
    clearPreSelection,
    onShopSkip,
    sellSpecialCard: onSellSpecialCard,
    checkOrCreateGame,
    executeCreateGame,
    surrenderGame,
    sellPowerup: onSellPowerup,
    initiateTransferFlow,
  };

  return (
    <GameContext.Provider
      value={{
        ...actions,
        resetLevel,
        prepareNewGame,
      }}
    >
      {usernameRequirementModal}
      {children}
    </GameContext.Provider>
  );
};

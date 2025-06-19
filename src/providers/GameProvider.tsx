import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GAME_ID, SKIP_IN_GAME_TUTORIAL } from "../constants/localStorage";
import {
  cashSfx,
  discardSfx,
  multiSfx,
  negativeMultiSfx,
  pointsSfx,
  preselectedCardSfx,
} from "../constants/sfx.ts";
import { EventTypeEnum, GameStateEnum } from "../dojo/typescript/custom.ts";
import { useDojo } from "../dojo/useDojo.tsx";
import { useGameActions } from "../dojo/useGameActions.tsx";
import { useUsername } from "../dojo/utils/useUsername.tsx";
import { useFeatureFlagEnabled } from "../featureManagement/useFeatureFlagEnabled.ts";
import { useAudio } from "../hooks/useAudio.tsx";
import { useTournaments } from "../hooks/useTournaments.tsx";
import { useCardAnimations } from "../providers/CardAnimationsProvider";
import { useCurrentHandStore } from "../state/useCurrentHandStore.ts";
import { useGameState } from "../state/useGameState.tsx";
import { useGameStore } from "../state/useGameStore.ts";
import { Card } from "../types/Card";
import { PowerUp } from "../types/Powerup/PowerUp.ts";
import { RoundRewards } from "../types/RoundRewards.ts";
import { LevelUpPlayEvent } from "../utils/discardEvents/getLevelUpPlayEvent.ts";
import { getPlayAnimationDuration } from "../utils/getPlayAnimationDuration.ts";
import { animatePlay } from "../utils/playEvents/animatePlay.ts";
import { useCardData } from "./CardDataProvider.tsx";
import { gameProviderDefaults } from "./gameProviderDefaults.ts";
import { useSettings } from "./SettingsProvider.tsx";
import { mockTutorialGameContext } from "./TutorialGameProvider.tsx";

export interface IGameContext {
  gameId: number;
  executeCreateGame: (gameId?: number) => void;
  gameLoading: boolean;
  play: () => void;
  discardAnimation: boolean;
  playAnimation: boolean;
  discard: () => void;
  changeModifierCard: (
    cardIdx: number
  ) => Promise<{ success: boolean; cards: Card[] }>;
  error: boolean;
  clearPreSelection: () => void;
  addModifier: (cardIdx: number, modifierIdx: number) => void;
  roundRewards: RoundRewards | undefined;
  onShopSkip: () => void;
  sellSpecialCard: (cardIdx: number) => Promise<boolean>;
  checkOrCreateGame: () => void;
  restartGame: () => void;
  lockRedirection: boolean;
  specialCards: Card[];
  playIsNeon: boolean;
  destroyedSpecialCardId: number | undefined;
  setDestroyedSpecialCardId: (id: number | undefined) => void;
  levelUpHand: LevelUpPlayEvent | undefined;
  setLevelUpHand: (levelUpPlay: LevelUpPlayEvent | undefined) => void;
  specialSwitcherOn: boolean;
  toggleSpecialSwitcher: () => void;
  showRages: () => void;
  showSpecials: () => void;
  powerUps: (PowerUp | null)[];
  removePowerUp: (power_up_id: number) => void;
  preselectedPowerUps: number[];
  setPreselectedPowerUps: (powerUps: number[]) => void;
  togglePreselectedPowerUp: (powerUpId: number) => void;
  powerUpIsPreselected: (powerUpId: number) => boolean;
  setPowerUps: (powerUps: (PowerUp | null)[]) => void;
  addPowerUp: (powerUp: PowerUp) => void;
  remainingPlaysTutorial?: number;
  maxSpecialCards: number;
  maxPowerUpSlots: number;
  setGameId: (gameId: number) => void;
  resetLevel: () => void;
  cardTransformationLock: boolean;
  nodeRound: number;
  prepareNewGame: () => void;
  surrenderGame: (gameId: number) => void;
}

const stringTournamentId = import.meta.env.VITE_TOURNAMENT_ID;
const tournamentId = stringTournamentId && Number(stringTournamentId);

const GameContext = createContext<IGameContext>(gameProviderDefaults);

export const useGameContext = () => {
  const location = useLocation();
  const inTutorial = location.pathname === "/tutorial";
  const context = inTutorial ? mockTutorialGameContext : GameContext;
  return useContext(context);
};

export const GameProvider = ({ children }: PropsWithChildren) => {
  const state = useGameState();

  const {
    refetchGameStore,
    addCash,
    setCurrentScore,
    resetMultiPoints,
    setMulti,
    setPoints,
    addPoints,
    addMulti,
    remainingPlays,
    discard: stateDiscard,
    rollbackDiscard,
    level,
    modId,
    state: gameState,
    isClassic
  } = useGameStore();

  const {
    hand,
    replaceCards,
    refetchCurrentHandStore,
    preSelectedCards,
    preSelectedModifiers,
    clearPreSelection,
  } = useCurrentHandStore();

  const [lockRedirection, setLockRedirection] = useState(false);
  const hideTutorialFF = useFeatureFlagEnabled("global", "hideTutorial");

  const showTutorial =
    !localStorage.getItem(SKIP_IN_GAME_TUTORIAL) && !hideTutorialFF;

  const { refetchSpecialCardsData } = useCardData();

  const navigate = useNavigate();
  const {
    setup: { client },
    syncCall,
  } = useDojo();

  const {
    createGame,
    play,
    discard,
    changeModifierCard,
    sellSpecialCard,
    mintGame,
    surrenderGame,
  } = useGameActions();

  const { sfxVolume, animationSpeed } = useSettings();

  const { play: discardSound } = useAudio(discardSfx, sfxVolume);
  const { play: cashSound } = useAudio(cashSfx, sfxVolume);
  const { play: pointsSound } = useAudio(pointsSfx, sfxVolume);
  const { play: multiSound } = useAudio(multiSfx, sfxVolume);
  const { play: negativeMultiSound } = useAudio(negativeMultiSfx, sfxVolume);
  const { play: preselectCardSound } = useAudio(preselectedCardSfx, sfxVolume);

  const playAnimationDuration = getPlayAnimationDuration(level, animationSpeed);

  const {
    setAnimatedCard,
    setAnimateSecondChanceCard,
    setAnimatedPowerUp,
    setanimateSpecialCardDefault,
  } = useCardAnimations();

  const {
    gameId,
    setGameId,
    setRoundRewards,
    setPreSelectedModifiers,
    preSelectionLocked,
    setPreSelectionLocked,
    setGameLoading,
    setDiscardAnimation,
    setPlayAnimation,
    setError,
    setPlayIsNeon,
    setLockedSpecialCards,
    specialCards,
    showSpecials,
    showRages,
    preselectedPowerUps,
    powerUps,
    setPreselectedPowerUps,
    removePowerUp,
    resetPowerUps,
    cardTransformationLock,
    setCardTransformationLock,
  } = state;

  const resetLevel = () => {
    setRoundRewards(undefined);
    setPreSelectionLocked(false);
    showSpecials();
    resetPowerUps();
    refetchSpecialCardsData(modId, gameId);
  };

  const prepareNewGame = () => {
    localStorage.removeItem("GAME_ID");
    resetLevel();
  };

  const username = useUsername();

  const { enterTournament } = useTournaments();

  const executeCreateGame = async (providedGameId?: number) => {
    setError(false);
    setGameLoading(true);
    let gameId = providedGameId;
    if (username) {
      try {
        if (!providedGameId) {
          if (tournamentId) {
            console.log("Registering user in tournament ", tournamentId);
            gameId = await enterTournament(tournamentId, username);
          } else {
            console.log("No tournament ID provided, minting game directly");
            gameId = await mintGame(username);
          }
        }
        console.log("Creating game...");
        createGame(gameId!, username).then(async (response) => {
          const { gameId: newGameId, hand } = response;
          if (newGameId) {
            resetLevel();
            replaceCards(hand);
            setGameId(newGameId);
            clearPreSelection();
            localStorage.setItem(GAME_ID, newGameId.toString());
            console.log(`game ${newGameId} created`);

            await syncCall();
            setGameLoading(false);
            setPreSelectionLocked(false);
            setRoundRewards(undefined);

            navigate(isClassic && showTutorial ? "/tutorial" : "/demo");
          } else {
            setError(true);
          }
        });
      } catch (error) {
        console.error("Error registering user in tournament", error);
        setError(true);
      }
    } else {
      console.error("No username");
      setError(true);
    }
  };

  const onPlayClick = () => {
    setPreSelectionLocked(true);
    setLockRedirection(true);
    setLockedSpecialCards(specialCards);
    play(gameId, preSelectedCards, preSelectedModifiers, preselectedPowerUps)
      .then((response) => {
        if (response) {
          animatePlay({
            playEvents: response,
            playAnimationDuration,
            setPlayIsNeon,
            setAnimatedCard,
            setAnimatedPowerUp,
            pointsSound,
            multiSound,
            negativeMultiSound,
            cashSound,
            setPoints,
            setMulti,
            // TODO: remove this,
            setHand: () => {},
            setPlayAnimation,
            setPreSelectionLocked,
            setLockedSpecialCards,
            clearPreSelection,
            removePowerUp,
            preselectedPowerUps,
            navigate,
            gameId,
            setLockRedirection,
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
          });
          refetchSpecialCardsData(modId, gameId);
        } else {
          setPreSelectionLocked(false);
          clearPreSelection();
        }
      })
      .catch(() => {
        setLockRedirection(false);
        setPreSelectionLocked(false);
      });
  };

  const powerUpIsPreselected = (powerUpId: number) => {
    return preselectedPowerUps.filter((idx) => idx === powerUpId).length > 0;
  };

  const unPreSelectPowerUp = (powerUpIdx: number) => {
    setPreselectedPowerUps((prev) => {
      return prev.filter((idx) => powerUpIdx !== idx);
    });
  };

  const preSelectPowerUp = (powerUpIdx: number) => {
    if (!preselectedPowerUps.includes(powerUpIdx)) {
      setPreselectedPowerUps((prev) => {
        return [...prev, powerUpIdx];
      });
    }
  };

  const togglePreselectedPowerUp = (powerUpIdx: number) => {
    if (!preSelectionLocked && remainingPlays > 0) {
      if (powerUpIsPreselected(powerUpIdx)) {
        unPreSelectPowerUp(powerUpIdx);
        preselectCardSound();
      } else if (preselectedPowerUps.length < 5) {
        preSelectPowerUp(powerUpIdx);
        preselectCardSound();
      }
    }
  };

  const onDiscardClick = () => {
    setPreSelectionLocked(true);
    stateDiscard();
    discard(gameId, preSelectedCards, preSelectedModifiers).then((response) => {
      if (response) {
        const calculateDuration = (
          events?: any[],
          baseDuration = playAnimationDuration,
          multiplier = 1
        ) => (events?.length ?? 0) * baseDuration * multiplier;

        const durations = {
          cardPlayScore: calculateDuration(
            response.cardPlayScoreEvents?.map((item) => item.hand).flat() ?? []
          ),
          specialCardPlayScore: calculateDuration(
            response.specialCardPlayScoreEvents
          ),
        };

        const ALL_CARDS_DURATION = Object.values(durations).reduce(
          (a, b) => a + b,
          0
        );

        //  if (response.levelUpHandEvent) {
        //   state.setLevelUpHand(response.levelUpHandEvent);
        // }

        response.cardPlayScoreEvents?.forEach((event, index) => {
          const isCash = event.eventType === EventTypeEnum.Cash;
          const special_idx = event.specials[0]?.idx;

          setTimeout(() => {
            event.hand.forEach((card, innerIndex) => {
              const { idx, quantity } = card;
              setTimeout(() => {
                if (isCash) {
                  cashSound();
                  setAnimatedCard({
                    special_idx,
                    idx: [idx],
                    cash: quantity,
                    animationIndex: 400 + index,
                  });
                }
              }, playAnimationDuration * innerIndex);
            });
          }, playAnimationDuration * index);
        });

        if (response.gameOver) {
          setTimeout(() => {
            navigate(`/gameover/${gameId}`);
          }, 1000);
        }

        setTimeout(() => {
          discardSound();
          setDiscardAnimation(true);
        }, ALL_CARDS_DURATION);

        setTimeout(() => {
          setPreSelectionLocked(false);
          clearPreSelection();
          setAnimatedCard(undefined);
          setDiscardAnimation(false);
          replaceCards(response.cards);
          refetchSpecialCardsData(modId, gameId);
        }, ALL_CARDS_DURATION + 300);
      } else {
        rollbackDiscard();
      }
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
          replaceCards(response.cards);
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

  const addModifier = (cardIdx: number, modifierIdx: number) => {
    const modifiers = preSelectedModifiers[cardIdx] ?? [];
    if (modifiers.length < 1) {
      const newModifiers = [...modifiers, modifierIdx];
      setPreSelectedModifiers((prev) => {
        return {
          ...prev,
          [cardIdx]: newModifiers,
        };
      });
    }
  };

  const onShopSkip = () => {
    resetLevel();
  };

  const onSellSpecialCard = (cardIdx: number) => {
    setPreSelectionLocked(true);
    const promise = sellSpecialCard(gameId, cardIdx)
      .then(async ({ success }) => {
        return success;
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        setPreSelectionLocked(false);
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

  const cleanGameId = () => {
    setGameId(0);
  };

  useEffect(() => {
    if (!lockRedirection) {
      if (gameState === GameStateEnum.GameOver) {
        navigate(`/gameover/${gameId}`);
      } else if (
        gameState === GameStateEnum.Store &&
        location.pathname === "/demo"
      ) {
        console.log("redirecting to store");
        navigate("/store");
      }
    }
  }, [gameState, lockRedirection]);

  useEffect(() => {
    // start with redirection unlocked
    setLockRedirection(false);
    refetchSpecialCardsData(modId, gameId);
  }, []);

  useEffect(() => {
    if (client && gameId) {
      refetchGameStore(client, gameId);
      refetchCurrentHandStore(client, gameId);
    }
  }, [client, gameId]);

  const actions = {
    play: onPlayClick,
    discard: onDiscardClick,
    changeModifierCard: onChangeModifierCard,
    clearPreSelection,
    addModifier,
    onShopSkip,
    sellSpecialCard: onSellSpecialCard,
    checkOrCreateGame,
    restartGame: cleanGameId,
    executeCreateGame,
    togglePreselectedPowerUp,
    surrenderGame,
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        ...actions,
        lockRedirection,
        powerUpIsPreselected,
        resetLevel,
        prepareNewGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

import { PropsWithChildren, createContext, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SKIP_IN_GAME_TUTORIAL } from "../constants/localStorage";
import {
  acumSfx,
  cashSfx,
  discardSfx,
  multiSfx,
  negativeMultiSfx,
  pointsSfx,
} from "../constants/sfx.ts";
import { EventTypeEnum, GameStateEnum } from "../dojo/typescript/custom.ts";
import { useDojo } from "../dojo/useDojo.tsx";
import { useGameActions } from "../dojo/useGameActions.tsx";
import { useUsername } from "../dojo/utils/useUsername.tsx";
import { useFeatureFlagEnabled } from "../featureManagement/useFeatureFlagEnabled.ts";
import { useAudio } from "../hooks/useAudio.tsx";
import { useCustomNavigate } from "../hooks/useCustomNavigate.tsx";
import { useTournaments } from "../hooks/useTournaments.tsx";
import { useCardAnimations } from "../providers/CardAnimationsProvider";
import { useAnimationStore } from "../state/useAnimationStore.ts";
import { useCurrentHandStore } from "../state/useCurrentHandStore.ts";
import { useDeckStore } from "../state/useDeckStore.ts";
import { useGameStore } from "../state/useGameStore.ts";
import { Card } from "../types/Card";
import { getPlayAnimationDuration } from "../utils/getPlayAnimationDuration.ts";
import { animatePlay } from "../utils/playEvents/animatePlay.ts";
import { useCardData } from "./CardDataProvider.tsx";
import { gameProviderDefaults } from "./gameProviderDefaults.ts";
import { useSettings } from "./SettingsProvider.tsx";
import { AccountInterface } from "starknet";
import { TutorialGameContext } from "./TutorialGameProvider.tsx";

export interface IGameContext {
  executeCreateGame: (gameId?: number, username?: string) => void;
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
  const inTutorial = location.pathname === "/tutorial";
  const context = inTutorial ? TutorialGameContext : GameContext;
  return useContext(context);
};

export const GameProvider = ({ children }: PropsWithChildren) => {
  const {
    refetchGameStore,
    addCash,
    setCurrentScore,
    setMulti,
    setPoints,
    addPoints,
    addMulti,
    remainingPlays,
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
  } = useGameStore();

  const {
    hand,
    replaceCards,
    refetchCurrentHandStore,
    preSelectedCards,
    preSelectedModifiers,
    clearPreSelection,
    setPreSelectionLocked,
    syncMaxPreSelectedCards,
    changeCardsSuit,
    changeCardsNeon,
    setPlayIsNeon,
    setCardTransformationLock,
  } = useCurrentHandStore();

  const { fetchDeck } = useDeckStore();

  const { setPlayAnimation, setDiscardAnimation } = useAnimationStore();

  const { getCardData } = useCardData();

  const hideTutorialFF = useFeatureFlagEnabled("global", "hideTutorial");

  const showTutorial =
    !localStorage.getItem(SKIP_IN_GAME_TUTORIAL) && !hideTutorialFF;

  const { refetchSpecialCardsData } = useCardData();

  const navigate = useNavigate();
  const customNavigate = useCustomNavigate();
  const {
    setup: {
      clientComponents: { Game },
    },
    switchToController,
    accountType,
    setup: { client },
  } = useDojo();

  const {
    createGame,
    play,
    discard,
    changeModifierCard,
    sellSpecialCard,
    sellPowerup,
    mintGame,
    surrenderGame,
    transferGame,
    approve,
  } = useGameActions();

  const { sfxVolume, animationSpeed } = useSettings();

  const { play: discardSound } = useAudio(discardSfx, sfxVolume);
  const { play: cashSound } = useAudio(cashSfx, sfxVolume);
  const { play: pointsSound } = useAudio(pointsSfx, sfxVolume);
  const { play: multiSound } = useAudio(multiSfx, sfxVolume);
  const { play: acumSound } = useAudio(acumSfx, sfxVolume);
  const { play: negativeMultiSound } = useAudio(negativeMultiSfx, sfxVolume);

  const playAnimationDuration = getPlayAnimationDuration(level, animationSpeed);

  const {
    setAnimatedCard,
    setAnimateSecondChanceCard,
    setAnimatedPowerUp,
    setanimateSpecialCardDefault,
  } = useCardAnimations();

  const resetLevel = () => {
    setRoundRewards(undefined);
    resetRage();
    setPreSelectionLocked(false);
    showSpecials();
    resetPowerUps();
    resetSpecials();
    refetchSpecialCardsData(modId, gameId);
    setState(GameStateEnum.NotSet);
  };

  const prepareNewGame = () => {
    localStorage.removeItem("GAME_ID");
    resetLevel();
  };

  const usernameLS = useUsername();

  const { enterTournament } = useTournaments();

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
      await approve(gameId);
      await transferGame(account, gameId, newUsername ?? "");
      console.log("Game transfer successful.");
    } catch (error) {
      console.error("Failed to transfer game:", error);
    }
  };

  const executeCreateGame = async (
    providedGameId?: number,
    usernameParameter?: string
  ) => {
    const username = usernameParameter || usernameLS;
    setGameError(false);
    resetLevel();
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
        if (gameId) {
          console.log("Creating game...", gameId);
          createGame(gameId!, username)
            .then(async (response) => {
              const { gameId: newGameId, hand } = response;
              if (newGameId) {
                setGameId(newGameId);
                replaceCards(hand);
                fetchDeck(client, newGameId, getCardData);
                clearPreSelection();

                console.log(`game ${newGameId} created`);

                setPreSelectionLocked(false);
                setRoundRewards(undefined);
                setState(GameStateEnum.NotSet);

                console.log("navigating demo");
                navigate("/demo");
              } else {
                setGameError(true);
                navigate("/my-games");
              }
            })
            .catch((error) => {
              console.error("Error creating game", error);
              setGameError(true);
              navigate("/my-games");
            });
        } else {
          console.error("No gameId");
          setGameError(true);
          navigate("/my-games");
        }
      } catch (error) {
        console.error("Error registering user in tournament", error);
        setGameError(true);
        navigate("/my-games");
      }
    } else {
      console.error("No username");
      setGameError(true);
      navigate("/my-games");
    }
  };

  const refetchPowerUps = () => {
    doRefetchPowerUps(client, gameId);
  };

  const onPlayClick = () => {
    setPreSelectionLocked(true);
    statePlay();
    play(gameId, preSelectedCards, preSelectedModifiers, preSelectedPowerUps)
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
            acumSound,
            negativeMultiSound,
            cashSound,
            setPoints,
            setMulti,
            changeCardsSuit,
            changeCardsNeon,
            setPlayAnimation,
            setPreSelectionLocked,
            clearPreSelection,
            refetchPowerUps,
            preSelectedPowerUps,
            navigate,
            gameId,
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
          });
          fetchDeck(client, gameId, getCardData);
          refetchSpecialCardsData(modId, gameId);
          if (response.levelPassed && response.detailEarned) {
            response.levelPassed.level_passed > 0 && advanceLevel();
            addCash(response.detailEarned.total);
            response.detailEarned.rerolls &&
              addRerolls(response.detailEarned.rerolls);
          }
        } else {
          setPreSelectionLocked(false);
          clearPreSelection();
        }
      })
      .catch(() => {
        rollbackPlay();
        setPreSelectionLocked(false);
      });
  };

  const onDiscardClick = () => {
    setPreSelectionLocked(true);
    stateDiscard();
    discard(gameId, preSelectedCards, preSelectedModifiers)
      .then((response) => {
        if (response) {
          const calculateDuration = (
            events?: any[],
            baseDuration = playAnimationDuration,
            multiplier = 1
          ) => (events?.length ?? 0) * baseDuration * multiplier;

          const durations = {
            cardPlayScore: calculateDuration(
              response.cardPlayScoreEvents?.map((item) => item.hand).flat() ??
                []
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
                    addCash(quantity);
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
            fetchDeck(client, gameId, getCardData);
            refetchSpecialCardsData(modId, gameId);
          }, ALL_CARDS_DURATION + 300);
        } else {
          rollbackDiscard();
          setPreSelectionLocked(false);
        }
      })
      .catch(() => {
        rollbackDiscard();
        setPreSelectionLocked(false);
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
        return success;
      })
      .catch(() => {
        refetchGameStore(client, gameId);
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
    if (gameState === GameStateEnum.GameOver) {
      navigate(`/gameover/${gameId}`);
    } else if (
      gameState === GameStateEnum.Store &&
      location.pathname === "/demo"
    ) {
      console.log("redirecting to store");
      navigate("/store");
    }
  }, [gameState]);

  useEffect(() => {
    refetchSpecialCardsData(modId, gameId);
  }, []);

  /*   const refetchAll = async () => {
    await refetchCurrentHandStore(client, gameId);
    await refetchGameStore(client, gameId);
    syncMaxPreSelectedCards(rageCards);
  };

  useEffect(() => {
    if (client && gameId) {
      refetchAll();
    }
  }, [gameId]); */

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
      {children}
    </GameContext.Provider>
  );
};

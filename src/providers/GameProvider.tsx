import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GAME_ID,
  SKIP_IN_GAME_TUTORIAL,
  SORT_BY_SUIT,
} from "../constants/localStorage";
import { rageCardIds } from "../constants/rageCardIds.ts";
import {
  cashSfx,
  discardSfx,
  multiSfx,
  negativeMultiSfx,
  pointsSfx,
  preselectedCardSfx,
} from "../constants/sfx.ts";
import { useGame } from "../dojo/queries/useGame.tsx";
import { useRound } from "../dojo/queries/useRound.tsx";
import { EventTypeEnum } from "../dojo/typescript/models.gen.ts";
import { useDojo } from "../dojo/useDojo.tsx";
import { useGameActions } from "../dojo/useGameActions.tsx";
import { gameExists } from "../dojo/utils/getGame.tsx";
import { useUsername } from "../dojo/utils/useUsername.tsx";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy.ts";
import { useFeatureFlagEnabled } from "../featureManagement/useFeatureFlagEnabled.ts";
import { useAudio } from "../hooks/useAudio.tsx";
import { useTournaments } from "../hooks/useTournaments.tsx";
import { useCardAnimations } from "../providers/CardAnimationsProvider";
import { useDiscards } from "../state/useDiscards.tsx";
import { useGameState } from "../state/useGameState.tsx";
import { Card } from "../types/Card";
import { PowerUp } from "../types/PowerUp.ts";
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
  preSelectedPlay: Plays;
  points: number;
  multi: number;
  executeCreateGame: (gameId?: number) => void;
  gameLoading: boolean;
  preSelectedCards: number[];
  setPreSelectedCards: (cards: number[]) => void;
  play: () => void;
  hand: Card[];
  setHand: (cards: Card[]) => void;
  getModifiers: (preSelectedCardIndex: number) => Card[];
  togglePreselected: (cardIndex: number) => void;
  discardAnimation: boolean;
  playAnimation: boolean;
  discard: () => void;
  changeModifierCard: (
    cardIdx: number
  ) => Promise<{ success: boolean; cards: Card[] }>;
  error: boolean;
  clearPreSelection: () => void;
  preSelectedModifiers: { [key: number]: number[] };
  addModifier: (cardIdx: number, modifierIdx: number) => void;
  roundRewards: RoundRewards | undefined;
  sortBy: SortBy;
  toggleSortBy: () => void;
  onShopSkip: () => void;
  sellSpecialCard: (cardIdx: number) => Promise<boolean>;
  checkOrCreateGame: () => void;
  restartGame: () => void;
  preSelectionLocked: boolean;
  score: number;
  lockRedirection: boolean;
  specialCards: Card[];
  playIsNeon: boolean;
  isRageRound: boolean;
  setIsRageRound: (isRageRound: boolean) => void;
  cash: number;
  setLockedCash: (cash: number | undefined) => void;
  rageCards: Card[];
  setRageCards: (rageCards: Card[]) => void;
  discards: number;
  preSelectCard: (cardIndex: number) => void;
  unPreSelectCard: (cardIndex: number) => void;
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
  modId: string;
  setModId: (modId: string) => void;
  remainingPlaysTutorial?: number;
  maxSpecialCards: number;
  maxPowerUpSlots: number;
  isClassic: boolean;
  setGameId: (gameId: number) => void;
  resetLevel: () => void;
  playerScore: number;
  cardTransformationLock: boolean;
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
  const [lockRedirection, setLockRedirection] = useState(false);
  const hideTutorialFF = useFeatureFlagEnabled("global", "hideTutorial");

  const showTutorial =
    !localStorage.getItem(SKIP_IN_GAME_TUTORIAL) && !hideTutorialFF;

  const round = useRound();
  const handsLeft = round?.remaining_plays ?? 0;

  const { refetchSpecialCardsData } = useCardData();

  const navigate = useNavigate();
  const {
    setup: {
      clientComponents: { Game },
    },
    syncCall,
  } = useDojo();

  const {
    createGame,
    play,
    discard,
    changeModifierCard,
    sellSpecialCard,
    mintGame,
  } = useGameActions();

  const { discards, discard: stateDiscard, rollbackDiscard } = useDiscards();
  const { sfxVolume, animationSpeed } = useSettings();

  const game = useGame();
  const { play: preselectCardSound } = useAudio(preselectedCardSfx, sfxVolume);
  const { play: discardSound } = useAudio(discardSfx, sfxVolume);
  const { play: cashSound } = useAudio(cashSfx, sfxVolume);
  const { play: pointsSound } = useAudio(pointsSfx, sfxVolume);
  const { play: multiSound } = useAudio(multiSfx, sfxVolume);
  const { play: negativeMultiSound } = useAudio(negativeMultiSfx, sfxVolume);

  const playAnimationDuration = getPlayAnimationDuration(
    game?.level ?? 0,
    animationSpeed
  );

  const { setAnimatedCard, setAnimateSecondChanceCard, setAnimatedPowerUp } =
    useCardAnimations();

  const {
    gameId,
    setGameId,
    preSelectedCards,
    setPreSelectedCards,
    hand,
    setHand,
    points,
    setPoints,
    multi,
    setMulti,
    setRoundRewards,
    preSelectedModifiers,
    setPreSelectedModifiers,
    preSelectionLocked,
    setPreSelectionLocked,
    setGameLoading,
    setDiscardAnimation,
    setPlayAnimation,
    setError,
    sortBySuit,
    setSortBySuit,
    setPlayIsNeon,
    setLockedSpecialCards,
    specialCards,
    setLockedScore,
    score,
    playerScore,
    setLockedPlayerScore,
    cash,
    setLockedCash,
    isRageRound,
    setIsRageRound,
    rageCards,
    showSpecials,
    showRages,
    preselectedPowerUps,
    powerUps,
    setPreselectedPowerUps,
    removePowerUp,
    resetPowerUps,
    modId,
    isClassic,
    cardTransformationLock,
    setCardTransformationLock,
  } = state;

  const maxPreSelectedCards = rageCards?.find(
    (card) => card.card_id === rageCardIds.STRATEGIC_QUARTET
  )
    ? 4
    : 5;

  const resetLevel = () => {
    setRoundRewards(undefined);
    setPreSelectionLocked(false);
    setIsRageRound(false);
    showSpecials();
    resetPowerUps();
  };

  const toggleSortBy = () => {
    if (sortBySuit) {
      localStorage.removeItem(SORT_BY_SUIT);
      setSortBySuit(false);
    } else {
      setSortBySuit(true);
      localStorage.setItem(SORT_BY_SUIT, "true");
    }
  };

  const username = useUsername();

  const { enterTournament } = useTournaments();

  const executeCreateGame = async (providedGameId?: number) => {
    setError(false);
    setGameLoading(true);
    setIsRageRound(false);
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
            navigate(isClassic && showTutorial ? "/tutorial" : "/demo");
            setHand(hand);
            setGameId(newGameId);
            clearPreSelection();
            localStorage.setItem(GAME_ID, newGameId.toString());
            console.log(`game ${newGameId} created`);

            await syncCall();
            setGameLoading(false);
            setPreSelectionLocked(false);
            setRoundRewards(undefined);
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

  const replaceCards = (cards: Card[]) => {
    const newHand = hand
      ?.map((card) => {
        const newCard = cards.find((c) => c.idx === card.idx);
        if (newCard) {
          return newCard;
        } else {
          return card;
        }
      })
      // filter out null cards (represented by card_id 9999)
      .filter((card) => card.card_id !== 9999);
    setHand(newHand);
  };
  const onPlayClick = () => {
    setPreSelectionLocked(true);
    setLockRedirection(true);
    setLockedSpecialCards(specialCards);
    setLockedScore(score);
    setLockedPlayerScore(playerScore);
    setLockedCash(cash);
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
            setHand,
            setPlayAnimation,
            setPreSelectionLocked,
            setLockedScore,
            setLockedPlayerScore,
            setLockedSpecialCards,
            setLockedCash,
            clearPreSelection,
            removePowerUp,
            preselectedPowerUps,
            navigate,
            gameId,
            setLockRedirection,
            setRoundRewards,
            replaceCards,
            handsLeft,
            setAnimateSecondChanceCard,
            setCardTransformationLock,
            setIsRageRound,
            specialCards,
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

  const clearPreSelection = () => {
    if (!preSelectionLocked && handsLeft > 0) {
      resetMultiPoints();
      setPreSelectedCards([]);
      setPreSelectedModifiers({});
      setPreselectedPowerUps([]);
    }
  };

  const resetMultiPoints = () => {
    setPoints(0);
    setMulti(0);
  };

  const getModifiers = (preSelectedCardIndex: number) => {
    const modifierIndexes = preSelectedModifiers[preSelectedCardIndex];
    return (
      modifierIndexes?.map((modifierIdx) => {
        return hand.find((c) => c.idx === modifierIdx)!;
      }) ?? []
    );
  };

  const cardIsPreselected = (cardIndex: number) => {
    return preSelectedCards.filter((idx) => idx === cardIndex).length > 0;
  };

  const powerUpIsPreselected = (powerUpId: number) => {
    return preselectedPowerUps.filter((idx) => idx === powerUpId).length > 0;
  };

  const unPreSelectCard = (cardIndex: number) => {
    setPreSelectedModifiers((prev) => {
      return {
        ...prev,
        [cardIndex]: [],
      };
    });
    setPreSelectedCards((prev) => {
      return prev.filter((idx) => cardIndex !== idx);
    });
  };

  const unPreSelectPowerUp = (powerUpIdx: number) => {
    setPreselectedPowerUps((prev) => {
      return prev.filter((idx) => powerUpIdx !== idx);
    });
  };

  const preSelectCard = (cardIndex: number) => {
    if (
      !preSelectedCards.includes(cardIndex) &&
      preSelectedCards.length < maxPreSelectedCards
    ) {
      setPreSelectedCards((prev) => {
        return [...prev, cardIndex];
      });
    }
  };

  const preSelectPowerUp = (powerUpIdx: number) => {
    if (!preselectedPowerUps.includes(powerUpIdx)) {
      setPreselectedPowerUps((prev) => {
        return [...prev, powerUpIdx];
      });
    }
  };

  const togglePreselected = (cardIndex: number) => {
    if (!preSelectionLocked && handsLeft > 0) {
      if (cardIsPreselected(cardIndex)) {
        unPreSelectCard(cardIndex);
        preselectCardSound();
      } else if (preSelectedCards.length < 5) {
        preSelectCard(cardIndex);
        preselectCardSound();
      }
    }
  };

  const togglePreselectedPowerUp = (powerUpIdx: number) => {
    if (!preSelectionLocked && handsLeft > 0) {
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
    setHand(newHand);
    const rollback = () => {
      // rollback, remove discarded boolean from all cards
      const newHand = hand?.map((card) => {
        return {
          ...card,
          discarded: false,
        };
      });
      setHand(newHand);
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
    return sellSpecialCard(gameId, cardIdx).finally(() => {
      setPreSelectionLocked(false);
    });
  };

  const checkOrCreateGame = async () => {
    console.log("checking game exists", gameId);

    clearPreSelection();
    if (!gameId || gameId === 0 || !gameExists(Game, gameId, modId)) {
      setTimeout(() => {
        if (!gameExists(Game, gameId, modId)) {
          executeCreateGame();
        } else {
          setGameLoading(false);
          console.log("Game found (2), no need to create a new one");
        }
      }, 2000);
    } else {
      setGameLoading(false);
      console.log("Game found, no need to create a new one");
    }
  };

  const cleanGameId = () => {
    setGameId(0);
    setIsRageRound(false);
  };

  useEffect(() => {
    if (!lockRedirection) {
      if (game?.state === "FINISHED") {
        navigate(`/gameover/${gameId}`);
      } else if (game?.state === "AT_SHOP" && location.pathname === "/demo") {
        console.log("redirecting to store");
        navigate("/store");
      }
    }
  }, [game?.state, lockRedirection]);

  useEffect(() => {
    // start with redirection unlocked
    setLockRedirection(false);
    refetchSpecialCardsData(modId, gameId);
  }, []);

  const actions = {
    setPreSelectedCards,
    play: onPlayClick,
    setHand,
    getModifiers,
    togglePreselected,
    discard: onDiscardClick,
    changeModifierCard: onChangeModifierCard,
    clearPreSelection,
    addModifier,
    toggleSortBy,
    onShopSkip,
    sellSpecialCard: onSellSpecialCard,
    checkOrCreateGame,
    restartGame: cleanGameId,
    executeCreateGame,
    preSelectCard,
    unPreSelectCard,
    togglePreselectedPowerUp,
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        ...actions,
        lockRedirection,
        discards,
        powerUpIsPreselected,
        resetLevel,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

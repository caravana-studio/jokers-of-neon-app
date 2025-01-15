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
  SETTINGS_ANIMATION_SPEED,
  SETTINGS_SFX_VOLUME,
  SFX_ON,
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
import { useDojo } from "../dojo/useDojo.tsx";
import { useGameActions } from "../dojo/useGameActions.tsx";
import { gameExists } from "../dojo/utils/getGame.tsx";
import { EventType } from "../enums/eventType.ts";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy.ts";
import { Speed } from "../enums/speed.ts";
import { Suits } from "../enums/suits.ts";
import { useAudio } from "../hooks/useAudio.tsx";
import { useCardAnimations } from "../providers/CardAnimationsProvider";
import { useDiscards } from "../state/useDiscards.tsx";
import { useGameState } from "../state/useGameState.tsx";
import { Card } from "../types/Card";
import { PowerUp } from "../types/PowerUp.ts";
import { RoundRewards } from "../types/RoundRewards.ts";
import { PlayEvents } from "../types/ScoreData";
import { changeCardNeon } from "../utils/changeCardNeon.ts";
import { changeCardSuit } from "../utils/changeCardSuit";
import { LevelUpPlayEvent } from "../utils/discardEvents/getLevelUpPlayEvent.ts";
import { getPlayAnimationDuration } from "../utils/getPlayAnimationDuration.ts";
import { eventTypeToSuit } from "../utils/playEvents/eventTypeToSuit.ts";
import { gameProviderDefaults } from "./gameProviderDefaults.ts";
import { mockTutorialGameContext } from "./TutorialGameProvider.tsx";

export interface IGameContext {
  gameId: number;
  preSelectedPlay: Plays;
  points: number;
  multi: number;
  executeCreateGame: () => void;
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
  discardEffectCard: (
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
  discardSpecialCard: (cardIdx: number) => Promise<boolean>;
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
  sfxVolume: number;
  setSfxVolume: (vol: number) => void;
  animationSpeed: Speed;
  setAnimationSpeed: (speed: Speed) => void;
  sfxOn: boolean;
  setSfxOn: (sfxOn: boolean) => void;
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
}

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
  const showTutorial = !localStorage.getItem(SKIP_IN_GAME_TUTORIAL);
  const [sfxOn, setSfxOn] = useState(!localStorage.getItem(SFX_ON));
  const [sfxVolume, setSfxVolume] = useState(1);
  const [animationSpeed, setAnimationSpeed] = useState<Speed>(Speed.NORMAL);

  const round = useRound();
  const handsLeft = round?.hands ?? 0;

  const navigate = useNavigate();
  const {
    setup: {
      clientComponents: { Game },
    },
    account: { account },
    syncCall,
  } = useDojo();

  const { createGame, play, discard, discardEffectCard, discardSpecialCard } =
    useGameActions();

  const { discards, discard: stateDiscard, rollbackDiscard } = useDiscards();

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
    username,
    setPlayIsNeon,
    setLockedSpecialCards,
    specialCards,
    setLockedScore,
    score,
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

  const executeCreateGame = async () => {
    setError(false);
    setGameLoading(true);
    setIsRageRound(false);
    if (username) {
      console.log("Creating game...");
      createGame(username).then(async (response) => {
        const { gameId: newGameId, hand } = response;
        if (newGameId) {
          resetLevel();
          navigate(showTutorial ? "/tutorial" : "/demo");
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

  const animatePlay = (playEvents: PlayEvents) => {
    if (!playEvents) return;

    console.log(playEvents);

    // Calculate durations more concisely
    const calculateDuration = (
      events?: any[],
      baseDuration = playAnimationDuration,
      multiplier = 1
    ) => (events?.length ?? 0) * baseDuration * multiplier;

    const durations = {
      neonPlay: playEvents.neonPlayEvent ? playAnimationDuration : 0,

      powerUps: calculateDuration(playEvents.powerUpEvents),
      cardPlayChange: calculateDuration(playEvents.cardPlayChangeEvents),
      cardPlayScore: calculateDuration(
        playEvents.cardPlayScoreEvents?.map((item) => item.hand).flat() ?? []
      ),
      specialCardPlayScore: calculateDuration(
        playEvents.specialCardPlayScoreEvents
      ),
    };

    const ALL_CARDS_DURATION = Object.values(durations).reduce(
      (a, b) => a + b,
      500
    );

    // Separate concerns into smaller, focused functions
    const handleNeonPlay = () => {
      if (!playEvents.neonPlayEvent) return;

      setPlayIsNeon(true);
      setAnimatedCard({
        animationIndex: -1,
        suit: 5,
        idx: playEvents.neonPlayEvent.neon_cards_idx,
      });

      pointsSound();
      playEvents.neonPlayEvent.points &&
        setPoints(playEvents.neonPlayEvent.points);
      multiSound();
      playEvents.neonPlayEvent.multi &&
        setMulti(playEvents.neonPlayEvent.multi);
    };

    const handleCardPlayChangeEvents = () => {
      return new Promise<void>((resolve) => {
        playEvents.cardPlayChangeEvents?.forEach((event, index) => {
          setTimeout(() => {
            pointsSound();

            const suit = eventTypeToSuit(event.eventType);
            const handIndexes = event.hand.map((card) => card.idx);

            // we only support one special card at a time
            const special_idx = event.specials[0]?.idx;

            const isNeon = event.eventType === EventType.Neon;

            if (isNeon) {
              setAnimatedCard({
                isNeon: true,
                special_idx,
                idx: handIndexes,
                animationIndex: 200 + index,
              });
              setHand((prev) => {
                const updatedHand = prev?.map((card) =>
                  handIndexes.includes(card.idx)
                    ? {
                        ...card,
                        card_id: changeCardNeon(card.card_id!),
                        img: `${changeCardNeon(card.card_id!)}.png`,
                        isNeon: true,
                      }
                    : card
                );
                resolve();
                return updatedHand;
              });
            } else {
              setAnimatedCard({
                suit,
                special_idx,
                idx: handIndexes,
                animationIndex: 200 + index,
              });
              suit &&
                setHand((prev) => {
                  const updatedHand = prev?.map((card) =>
                    handIndexes.includes(card.idx) &&
                    card.suit !== Suits.WILDCARD
                      ? {
                          ...card,
                          card_id: changeCardSuit(card.card_id!, suit),
                          img: `${changeCardSuit(card.card_id!, suit)}.png`,
                          suit,
                        }
                      : card
                  );
                  resolve();

                  return updatedHand;
                });
            }
          }, playAnimationDuration * index);
        });
      });
    };

    const handleSpecialCardPlayScoreEvents = () => {
      playEvents.specialCardPlayScoreEvents?.forEach((event, index) => {
        const isPoints = event.eventType === EventType.Point;
        const isMulti = event.eventType === EventType.Multi;
        const isCash = event.eventType === EventType.Cash;
        // we only support one special card at a time
        const special_idx = event.specials[0]?.idx;
        const quantity = event.specials[0]?.quantity;

        setTimeout(() => {
          if (isPoints) {
            pointsSound();
            setAnimatedCard({
              special_idx,
              idx: [],
              points: quantity,
              animationIndex: 300 + index,
            });
            setPoints((prev) => prev + quantity);
          } else if (isMulti) {
            multiSound();
            setAnimatedCard({
              special_idx,
              idx: [],
              multi: quantity,
              animationIndex: 300 + index,
            });
            setMulti((prev) => prev + quantity);
          } else if (isCash) {
            cashSound();
            setAnimatedCard({
              special_idx,
              idx: [],
              cash: quantity,
              animationIndex: 300 + index,
            });
          }
        }, playAnimationDuration * index);
      });
    };

    const handleCardPlayScoreEvents = () => {
      playEvents.cardPlayScoreEvents?.forEach((event, index) => {
        const isPoints = event.eventType === EventType.Point;
        const isMulti = event.eventType === EventType.Multi;
        const isCash = event.eventType === EventType.Cash;
        // we only support one special card at a time
        const special_idx = event.specials[0]?.idx;

        event.hand.forEach((card, innerIndex) => {
          const { idx, quantity } = card;
          setTimeout(() => {
            if (isPoints) {
              pointsSound();
              setAnimatedCard({
                special_idx,
                idx: [idx],
                points: quantity,
                animationIndex: 400 + index,
              });
              setPoints((prev) => prev + quantity);
            } else if (isMulti) {
              multiSound();
              setAnimatedCard({
                special_idx,
                idx: [idx],
                multi: quantity,
                animationIndex: 400 + index,
              });
              setMulti((prev) => prev + quantity);
            } else if (isCash) {
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
      });
    };

    const handlePowerUps = () => {
      playEvents.powerUpEvents?.forEach((event, index) => {
        setTimeout(() => {
          const { idx, points, multi, special_idx } = event;

          setAnimatedPowerUp({
            idx,
            points,
            multi,
            animationIndex: 500 + index,
          });

          setAnimatedCard({
            special_idx,
            points,
            multi,
            animationIndex: 600 + index,
          });

          if (points) {
            pointsSound();
            setPoints((prev) => prev + points);
          }

          if (multi) {
            multiSound();
            setMulti((prev) => prev + multi);
          }
        }, playAnimationDuration * index);
      });
    };

    const handleGameEnd = () => {
      if (playEvents.gameOver) {
        setTimeout(() => {
          navigate(`/gameover/${gameId}`);
          setLockRedirection(false);
        }, 1000);
      } else if (playEvents.levelPassed && playEvents.detailEarned) {
        const { level } = playEvents.levelPassed;
        setTimeout(() => {
          setRoundRewards({
            ...playEvents.detailEarned!,
            level: level,
          });
          navigate("/rewards");
        }, 1000);
        setPreSelectionLocked(true);
      } else if (playEvents.secondChanceEvent) {
        setAnimateSecondChanceCard(true);
      } else {
        setLockedCash(undefined);
        playEvents.cards && replaceCards(playEvents.cards);
        setRoundRewards(undefined);
        setLockRedirection(false);
      }
    };

    // Main execution flow
    setPreSelectionLocked(true);

    // Chained timeouts with clear, sequential execution
    handleCardPlayChangeEvents().then(() => {
      setTimeout(() => {
        handleNeonPlay();
      }, durations.cardPlayChange);
    });

    setTimeout(
      () => handleSpecialCardPlayScoreEvents(),
      durations.neonPlay + durations.cardPlayChange
    );

    setTimeout(
      () => {
        handleCardPlayScoreEvents();
      },
      durations.neonPlay +
        durations.cardPlayChange +
        durations.specialCardPlayScore
    );

    setTimeout(
      () => {
        handlePowerUps();
      },
      durations.neonPlay +
        durations.cardPlayChange +
        durations.specialCardPlayScore +
        durations.cardPlayScore
    );

    setTimeout(() => {
      setPlayAnimation(true);
    }, ALL_CARDS_DURATION);

    setTimeout(() => {
      // Reset state
      setAnimatedCard(undefined);
      setAnimatedPowerUp(undefined);
      setLockedScore(undefined);
      setPlayAnimation(false);
      preselectedPowerUps.forEach((idx) => removePowerUp(idx));
      clearPreSelection();
      handsLeft > 0 && setPreSelectionLocked(false);
      setPlayIsNeon(false);
      setLockedSpecialCards([]);

      handleGameEnd();
    }, ALL_CARDS_DURATION + 500);
  };

  const onPlayClick = () => {
    setPreSelectionLocked(true);
    setLockRedirection(true);
    setLockedSpecialCards(specialCards);
    setLockedScore(score);
    setLockedCash(cash);
    play(gameId, preSelectedCards, preSelectedModifiers, preselectedPowerUps)
      .then((response) => {
        if (response) {
          animatePlay(response);
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
    discardSound();
    setPreSelectionLocked(true);
    setDiscardAnimation(true);
    stateDiscard();
    discard(gameId, preSelectedCards, preSelectedModifiers).then((response) => {
      if (response.success) {
        if (response.cashEvent) {
          // cash event
          response.cashEvent.forEach((event, index) => {
            setTimeout(() => {
              const { idx, special_idx, cash } = event;
              setAnimatedCard({
                idx: [idx],
                special_idx,
                cash,
                animationIndex: 900 + index,
              });
            }, playAnimationDuration * index); // Stagger animations for each event
          });
        }
        if (response.levelUpHandEvent) {
          state.setLevelUpHand(response.levelUpHandEvent);
        }
        if (response.gameOver) {
          setTimeout(() => {
            navigate(`/gameover/${gameId}`);
          }, 1000);
        } else {
          replaceCards(response.cards);
        }
      } else {
        rollbackDiscard();
      }
      setPreSelectionLocked(false);
      clearPreSelection();
      setDiscardAnimation(false);
    });
  };

  const onDiscardEffectCard = (cardIdx: number) => {
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
    const discardPromise = discardEffectCard(gameId, cardIdx);
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

  const onDiscardSpecialCard = (cardIdx: number) => {
    setPreSelectionLocked(true);
    return discardSpecialCard(gameId, cardIdx).finally(() => {
      setPreSelectionLocked(false);
    });
  };

  const checkOrCreateGame = () => {
    console.log("checking game exists", gameId);
    clearPreSelection();
    if (!gameId || gameId === 0 || !gameExists(Game, gameId)) {
      setTimeout(() => {
        if (!gameExists(Game, gameId)) {
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
  }, []);

  useEffect(() => {
    const savedVolume = localStorage.getItem(SETTINGS_SFX_VOLUME);
    if (savedVolume !== null) {
      setSfxVolume(JSON.parse(savedVolume));
    }

    const animationSpeed = localStorage.getItem(SETTINGS_ANIMATION_SPEED);
    if (animationSpeed !== null) {
      setAnimationSpeed(JSON.parse(animationSpeed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_SFX_VOLUME, JSON.stringify(sfxVolume));
  }, [sfxVolume]);

  useEffect(() => {
    if (!sfxOn) localStorage.removeItem(SFX_ON);
    else localStorage.setItem(SFX_ON, "true");
  }, [sfxOn]);

  useEffect(() => {
    localStorage.setItem(
      SETTINGS_ANIMATION_SPEED,
      JSON.stringify(animationSpeed)
    );
  }, [animationSpeed]);

  const actions = {
    setPreSelectedCards,
    play: onPlayClick,
    setHand,
    getModifiers,
    togglePreselected,
    discard: onDiscardClick,
    discardEffectCard: onDiscardEffectCard,
    clearPreSelection,
    addModifier,
    toggleSortBy,
    onShopSkip,
    discardSpecialCard: onDiscardSpecialCard,
    checkOrCreateGame,
    restartGame: cleanGameId,
    executeCreateGame,
    preSelectCard,
    unPreSelectCard,
    setSfxVolume,
    togglePreselectedPowerUp,
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        ...actions,
        lockRedirection,
        discards,
        sfxVolume,
        animationSpeed,
        setAnimationSpeed,
        sfxOn,
        setSfxOn,
        powerUpIsPreselected,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

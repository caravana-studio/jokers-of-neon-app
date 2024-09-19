import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { GAME_ID, SORT_BY_SUIT } from "../constants/localStorage";
import { useGame } from "../dojo/queries/useGame.tsx";
import { useRound } from "../dojo/queries/useRound.tsx";
import { useDojo } from "../dojo/useDojo.tsx";
import { useGameActions } from "../dojo/useGameActions.tsx";
import { gameExists } from "../dojo/utils/getGame.tsx";
import { getLSGameId } from "../dojo/utils/getLSGameId.tsx";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy.ts";
import { useCardAnimations } from "../providers/CardAnimationsProvider";
import { useGameState } from "../state/useGameState.tsx";
import { Card } from "../types/Card";
import { RoundRewards } from "../types/RoundRewards.ts";
import { PlayEvents } from "../types/ScoreData";
import { changeCardSuit } from "../utils/changeCardSuit";
import { useAudio } from "../hooks/useAudio.tsx";

const PLAY_ANIMATION_DURATION = 700;

interface IGameContext {
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
  discardEffectCard: (cardIdx: number) => void;
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
}

const GameContext = createContext<IGameContext>({
  gameId: getLSGameId(),
  preSelectedPlay: Plays.NONE,
  points: 0,
  multi: 0,
  executeCreateGame: () => {},
  gameLoading: false,
  preSelectedCards: [],
  setPreSelectedCards: (_) => {},
  play: () => {},
  hand: [],
  setHand: (_) => {},
  getModifiers: (_) => {
    return [];
  },
  togglePreselected: (_) => {},
  discardAnimation: false,
  playAnimation: false,
  discard: () => {},
  discardEffectCard: () => {},
  error: false,
  clearPreSelection: () => {},
  preSelectedModifiers: {},
  addModifier: (_, __) => {},
  roundRewards: undefined,
  sortBy: SortBy.RANK,
  toggleSortBy: () => {},
  onShopSkip: () => {},
  discardSpecialCard: () => new Promise((resolve) => resolve(false)),
  checkOrCreateGame: () => {},
  restartGame: () => {},
  preSelectionLocked: false,
  score: 0,
  lockRedirection: false,
  specialCards: [],
  playIsNeon: false,
});
export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }: PropsWithChildren) => {
  const state = useGameState();
  const [lockRedirection, setLockRedirection] = useState(false);

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

  const game = useGame();
  const preselectCardSound = useAudio('/music/Card_Selection_1.wav');
  const playSound = useAudio('/music/Play_Hand_1.wav');
  const discardSound = useAudio('/music/Discard_Cards_1.wav');

  const { setAnimatedCard } = useCardAnimations();

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
  } = state;

  const resetLevel = () => {
    setRoundRewards(undefined);
    setPreSelectionLocked(false);
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
    if (username) {
      console.log("Creating game...");
      createGame(username).then(async (response) => {
        const { gameId: newGameId, hand } = response;
        if (newGameId) {
          resetLevel();
          navigate("/demo");
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
    if (playEvents) {
      const NEON_PLAY_DURATION = playEvents.neonPlayEvent
        ? PLAY_ANIMATION_DURATION
        : 0;
      const MODIFIER_SUIT_CHANGE_DURATION =
        (playEvents.modifierSuitEvents?.length ?? 0) * PLAY_ANIMATION_DURATION;
      const SPECIAL_SUIT_CHANGE_DURATION =
        (playEvents.specialSuitEvents?.length ?? 0) * PLAY_ANIMATION_DURATION;
      const GLOBAL_BOOSTER_DURATION =
        (playEvents.globalEvents?.length ?? 0) * PLAY_ANIMATION_DURATION * 2;
      const LEVEL_BOOSTER_DURATION = playEvents.levelEvent
        ? PLAY_ANIMATION_DURATION * 2
        : 0;
      const COMMON_CARDS_DURATION =
        PLAY_ANIMATION_DURATION * playEvents.cardScore.length;
      const SPECIAL_CARDS_DURATION =
        PLAY_ANIMATION_DURATION * (playEvents.specialCards?.length ?? 0);
      const ALL_CARDS_DURATION =
        NEON_PLAY_DURATION +
        MODIFIER_SUIT_CHANGE_DURATION +
        SPECIAL_SUIT_CHANGE_DURATION +
        LEVEL_BOOSTER_DURATION +
        GLOBAL_BOOSTER_DURATION +
        COMMON_CARDS_DURATION +
        SPECIAL_CARDS_DURATION +
        500;

      setPreSelectionLocked(true);

      if (playEvents.neonPlayEvent) {
        setPlayIsNeon(true);
        setAnimatedCard({
          animationIndex: -1,
          suit: 5,
          idx: playEvents.neonPlayEvent.neon_cards_idx,
        });
        playEvents.neonPlayEvent.points &&
          setPoints(playEvents.neonPlayEvent.points);
        playEvents.neonPlayEvent.multi &&
          setMulti(playEvents.neonPlayEvent.multi);
      }

      if (playEvents.modifierSuitEvents) {
        playEvents.modifierSuitEvents.forEach((event, index) => {
          setTimeout(
            () => {
              setAnimatedCard({
                suit: event.suit,
                idx: [event.idx],
                animationIndex: index,
              });
              setHand((prev) => {
                const newHand = prev?.map((card) => {
                  if (event.idx === card.idx) {
                    return {
                      ...card,
                      img: `${changeCardSuit(card.card_id!, event.suit)}.png`,
                    };
                  }
                  return card;
                });
                return newHand;
              });
            },
            PLAY_ANIMATION_DURATION * index + NEON_PLAY_DURATION
          );
        });
      }
      setTimeout(() => {
        if (playEvents.specialSuitEvents) {
          playEvents.specialSuitEvents.forEach((event, index) => {
            setAnimatedCard({
              suit: event.suit,
              special_idx: event.special_idx,
              idx: event.idx,
              animationIndex: 10 + index,
            });
            setHand((prev) => {
              const newHand = prev?.map((card) => {
                if (event.idx.includes(card.idx)) {
                  return {
                    ...card,
                    img: `${changeCardSuit(card.card_id!, event.suit)}.png`,
                  };
                }
                return card;
              });
              return newHand;
            });
          });
        }

        setTimeout(() => {
          //global boosters
          if (playEvents.globalEvents) {
            playEvents.globalEvents.forEach((event, index) => {
              setTimeout(() => {
                const { special_idx, multi, points } = event;
                if (points) {
                  setAnimatedCard({
                    special_idx,
                    points,
                    animationIndex: 20 + index,
                  });
                  setPoints((prev) => prev + points);
                }
                if (multi) {
                  setTimeout(() => {
                    //animate multi
                    setAnimatedCard({
                      special_idx,
                      multi,
                      animationIndex: 31 + index,
                    });
                    setMulti((prev) => prev + multi);
                  }, PLAY_ANIMATION_DURATION);
                }
              }, PLAY_ANIMATION_DURATION * index);
            });
          }

          setTimeout(() => {
            //level boosters
            if (playEvents.levelEvent) {
              const {
                special_idx,
                multi: eventMulti,
                points: eventPoints,
              } = playEvents.levelEvent;
              //animate points
              if (eventPoints) {
                setAnimatedCard({
                  special_idx,
                  points: eventPoints - points,
                  animationIndex: 31,
                });
                setPoints(eventPoints);
              }
              if (eventMulti) {
                setTimeout(() => {
                  //animate multi
                  setAnimatedCard({
                    special_idx,
                    multi: eventMulti - multi,
                    animationIndex: 41,
                  });
                  setMulti(eventMulti);
                }, PLAY_ANIMATION_DURATION);
              }
            }

            setTimeout(() => {
              //traditional cards and modifiers
              playEvents.cardScore.forEach((card, index) => {
                setTimeout(() => {
                  const { idx, points, multi } = card;
                  setAnimatedCard({
                    idx: [idx],
                    points,
                    multi,
                    animationIndex: 50 + index,
                  });
                  points && setPoints((prev) => prev + points);
                  multi && setMulti((prev) => prev + multi);
                }, PLAY_ANIMATION_DURATION * index);
              });

              //special cards
              setTimeout(() => {
                playEvents.specialCards?.forEach((event, index) => {
                  setTimeout(() => {
                    const { idx, points, multi, special_idx } = event;
                    setAnimatedCard({
                      idx: [idx],
                      points,
                      multi,
                      special_idx,
                      animationIndex: 60 + index,
                    });
                    points && setPoints((prev) => prev + points);
                    multi && setMulti((prev) => prev + multi);
                  }, PLAY_ANIMATION_DURATION * index);
                });
              }, COMMON_CARDS_DURATION);
            }, LEVEL_BOOSTER_DURATION);
          }, GLOBAL_BOOSTER_DURATION);
        }, SPECIAL_SUIT_CHANGE_DURATION);
      }, MODIFIER_SUIT_CHANGE_DURATION + NEON_PLAY_DURATION);

      setTimeout(() => {
        setPlayAnimation(true);
      }, ALL_CARDS_DURATION);

      setTimeout(() => {
        setAnimatedCard(undefined);
        setLockedScore(undefined);

        setPlayAnimation(false);
        clearPreSelection();
        handsLeft > 0 && setPreSelectionLocked(false);
        setPlayIsNeon(false);
        setLockedSpecialCards([]);
        if (playEvents.gameOver) {
          console.log("GAME OVER");
          setTimeout(() => {
            navigate("/gameover");
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
        } else {
          playEvents.cards && replaceCards(playEvents.cards);
          setRoundRewards(undefined);
          setLockRedirection(false);
        }
      }, ALL_CARDS_DURATION + 500);
    }
  };

  const onPlayClick = () => {
    playSound();
    setPreSelectionLocked(true);
    setLockRedirection(true);
    setLockedSpecialCards(specialCards);
    setLockedScore(score);
    play(gameId, preSelectedCards, preSelectedModifiers)
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

  const preSelectCard = (cardIndex: number) => {
    setPreSelectedCards((prev) => {
      return [...prev, cardIndex];
    });
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

  const onDiscardClick = () => {
    discardSound();
    setPreSelectionLocked(true);
    setDiscardAnimation(true);
    discard(gameId, preSelectedCards, preSelectedModifiers).then((response) => {
      if (response.success) {
        if (response.gameOver) {
          setTimeout(() => {
            navigate("/gameover");
          }, 1000);
        } else {
          replaceCards(response.cards);
        }
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
    discardEffectCard(gameId, cardIdx)
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
  };

  const addModifier = (cardIdx: number, modifierIdx: number) => {
    const modifiers = preSelectedModifiers[cardIdx] ?? [];
    if (modifiers.length < 2) {
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
    return discardSpecialCard(account, gameId, cardIdx).finally(() => {
      setPreSelectionLocked(false);
    });
  };

  const checkOrCreateGame = () => {
    console.log("checking game exists", gameId);
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
  };

  useEffect(() => {
    if (!lockRedirection) {
      if (game?.state === "FINISHED") {
        navigate("/gameover");
      } else if (game?.state === "AT_SHOP") {
        console.log("redirecting to store");
        navigate("/store");
      }
    }
  }, [game?.state, lockRedirection]);

  useEffect(() => {
    // start with redirection unlocked
    setLockRedirection(false);
  }, []);

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
  };

  return (
    <GameContext.Provider value={{ ...state, ...actions, lockRedirection }}>
      {children}
    </GameContext.Provider>
  );
};

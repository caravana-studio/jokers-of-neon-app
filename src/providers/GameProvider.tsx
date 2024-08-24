import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { GAME_ID, SORT_BY_SUIT } from "../constants/localStorage";
import { useDojo } from "../dojo/useDojo";
import { gameExists } from "../dojo/utils/getGame";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy.ts";
import { useCardAnimations } from "../providers/CardAnimationsProvider";
import { useGameState } from "../state/useGameState.tsx";
import { Card } from "../types/Card";
import { RoundRewards } from "../types/RoundRewards.ts";
import { PlayEvents } from "../types/ScoreData";
import { changeCardSuit } from "../utils/changeCardSuit";
import { useGame } from "../dojo/queries/useGame.tsx";

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
  handsLeft: number;
  discardsLeft: number;
  lockRedirection: boolean;
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
  handsLeft: 4,
  discardsLeft: 4,
  lockRedirection: false
});
export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }: PropsWithChildren) => {
  const state = useGameState();
  const [lockRedirection, setLockRedirection] = useState(false);

  const navigate = useNavigate();
  const {
    setup: {
      masterAccount,
      systemCalls: {
        createGame,
        discard,
        discardEffectCard,
        discardSpecialCard,
        play,
      },
      clientComponents: { Game },
    },
    account,
  } = useDojo();

  const game = useGame();

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
    setScore,
    handsLeft,
    setHandsLeft,
    setDiscardsLeft,
    sortBySuit,
    setSortBySuit,
    username,
  } = state;

  const resetLevel = () => {
    setRoundRewards(undefined);
    setPreSelectionLocked(false);
    setScore(0);
    setHandsLeft(game?.max_hands ?? 1);
    setDiscardsLeft(game?.max_discard ?? 1);
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

  const executeCreateGame = () => {
    setError(false);
    setGameLoading(true);
    if (username) {
      console.log("Creating game...");
      createGame(account.account, username).then((response) => {
        const { gameId: newGameId, hand } = response;
        if (newGameId) {
          resetLevel();
          navigate("/demo");
          setHand(hand);
          setGameId(newGameId);
          clearPreSelection();
          localStorage.setItem(GAME_ID, newGameId.toString());
          console.log(`game ${newGameId} created`);
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
      const MODIFIER_SUIT_CHANGE_DURATION =
        (playEvents.modifierSuitEvents?.length ?? 0) * PLAY_ANIMATION_DURATION;
      const SPECIAL_SUIT_CHANGE_DURATION =
        (playEvents.specialSuitEvents?.length ?? 0) * PLAY_ANIMATION_DURATION;
      const LEVEL_BOOSTER_DURATION = playEvents.levelEvent
        ? PLAY_ANIMATION_DURATION * 2
        : 0;
      const COMMON_CARDS_DURATION =
        PLAY_ANIMATION_DURATION * playEvents.cardScore.length;
      const SPECIAL_CARDS_DURATION =
        PLAY_ANIMATION_DURATION * (playEvents.specialCards?.length ?? 0);
      const ALL_CARDS_DURATION =
        MODIFIER_SUIT_CHANGE_DURATION +
        SPECIAL_SUIT_CHANGE_DURATION +
        LEVEL_BOOSTER_DURATION +
        COMMON_CARDS_DURATION +
        SPECIAL_CARDS_DURATION +
        500;

      setPreSelectionLocked(true);

      if (playEvents.modifierSuitEvents) {
        playEvents.modifierSuitEvents.forEach((event, index) => {
          setTimeout(() => {
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
          }, PLAY_ANIMATION_DURATION * index);
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
                animationIndex: 21,
              });
              setPoints(eventPoints);
            }
            if (eventMulti) {
              setTimeout(() => {
                //animate multi
                setAnimatedCard({
                  special_idx,
                  multi: eventMulti - multi,
                  animationIndex: 31,
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
                  animationIndex: 40 + index,
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
                    animationIndex: 50 + index,
                  });
                  points && setPoints((prev) => prev + points);
                  multi && setMulti((prev) => prev + multi);
                }, PLAY_ANIMATION_DURATION * index);
              });
            }, COMMON_CARDS_DURATION);
          }, LEVEL_BOOSTER_DURATION);
        }, SPECIAL_SUIT_CHANGE_DURATION);
      }, MODIFIER_SUIT_CHANGE_DURATION);

      setTimeout(() => {
        setPlayAnimation(true);
        playEvents.score && setScore(playEvents.score);
      }, ALL_CARDS_DURATION);

      setTimeout(() => {
        setAnimatedCard(undefined);

        setPlayAnimation(false);
        clearPreSelection();
        handsLeft > 0 && setPreSelectionLocked(false);

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
    setPreSelectionLocked(true);
    setLockRedirection(true);
    play(account.account, gameId, preSelectedCards, preSelectedModifiers)
      .then((response) => {
        if (response) {
          animatePlay(response);
          setHandsLeft((prev) => prev - 1);
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
      } else if (preSelectedCards.length < 5) {
        preSelectCard(cardIndex);
      }
    }
  };

  const onDiscardClick = () => {
    setPreSelectionLocked(true);
    setDiscardAnimation(true);
    discard(
      account.account,
      gameId,
      preSelectedCards,
      preSelectedModifiers
    ).then((response) => {
      if (response.success) {
        if (response.gameOver) {
          setTimeout(() => {
            navigate("/gameover");
          }, 1000);
        } else {
          setDiscardsLeft((prev) => prev - 1);
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
    discardEffectCard(account.account, gameId, cardIdx)
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
    return discardSpecialCard(account.account, gameId, cardIdx).finally(() => {
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
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        //TODO: REMOVE THIS
        // navigate("/store");
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

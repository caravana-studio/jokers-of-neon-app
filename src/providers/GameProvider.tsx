import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER, SORT_BY_SUIT } from "../constants/localStorage";
import { useDojo } from "../dojo/useDojo";
import { gameExists } from "../dojo/utils/getGame";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy.ts";
import { useGetCurrentHand } from "../queries/useGetCurrentHand.ts";
import { useGetDeck } from "../queries/useGetDeck";
import { useGetRound } from "../queries/useGetRound.ts";
import { Card } from "../types/Card";
import { RoundRewards } from "../types/RoundRewards.ts";
import { PlayEvents } from "../types/ScoreData.ts";
import { changeCardSuit } from "../utils/changeCardSuit.ts";
import { sortCards } from "../utils/sortCards.ts";
import { useCardAnimations } from "./CardAnimationsProvider";

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
  loadingStates: boolean;
  preSelectedModifiers: { [key: number]: number[] };
  addModifier: (cardIdx: number, modifierIdx: number) => void;
  roundRewards: RoundRewards | undefined;
  sortBy: SortBy;
  toggleSortBy: () => void;
  onShopSkip: () => void;
  discardSpecialCard: (cardIdx: number) => Promise<boolean>;
  checkOrCreateGame: () => void;
  restartGame: () => void;
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
  loadingStates: false,
  preSelectedModifiers: {},
  addModifier: (_, __) => {},
  roundRewards: undefined,
  sortBy: SortBy.RANK,
  toggleSortBy: () => {},
  onShopSkip: () => {},
  discardSpecialCard: () => new Promise((resolve) => resolve(false)),
  checkOrCreateGame: () => {},
  restartGame: () => {},
});
export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }: PropsWithChildren) => {
  //state
  const [gameId, setGameId] = useState<number>(getLSGameId());
  const [preSelectedPlay, setPreSelectedPlay] = useState<Plays>(Plays.NONE);
  const [points, setPoints] = useState(0);
  const [multi, setMulti] = useState(0);
  const [gameLoading, setGameLoading] = useState(true);
  const [preSelectionLocked, setPreSelectionLocked] = useState(false);
  const [discardAnimation, setDiscardAnimation] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [error, setError] = useState(false);
  const [preSelectedCards, setPreSelectedCards] = useState<number[]>([]);
  const [preSelectedModifiers, setPreSelectedModifiers] = useState<{
    [key: number]: number[];
  }>({});
  const [hand, setHand] = useState<Card[]>([]);
  const [roundRewards, setRoundRewards] = useState<RoundRewards | undefined>(
    undefined
  );
  const [sortBySuit, setSortBySuit] = useState(
    !!localStorage.getItem(SORT_BY_SUIT)
  );
  const sortBy: SortBy = useMemo(
    () => (sortBySuit ? SortBy.SUIT : SortBy.RANK),
    [sortBySuit]
  );

  const sortedHand = useMemo(() => sortCards(hand, sortBy), [hand, sortBy]);

  //hooks
  const { data: round, refetch: refetchRound } = useGetRound(gameId);

  const { data: apiHand } = useGetCurrentHand(gameId, sortBy);

  const {
    setup: {
      masterAccount,
      systemCalls: {
        createGame,
        checkHand,
        discard,
        discardEffectCard,
        discardSpecialCard,
        play,
      },
      clientComponents: { Game },
    },
    account,
  } = useDojo();

  const { data: deck, refetch: refetchDeckData } = useGetDeck(gameId);

  const navigate = useNavigate();

  const { setAnimatedCard } = useCardAnimations();

  //variables
  const lsUser = localStorage.getItem(LOGGED_USER);
  const username = lsUser;
  const handsLeft = round?.hands;

  //functions
  const toggleSortBy = () => {
    if (sortBySuit) {
      localStorage.removeItem(SORT_BY_SUIT);
      setSortBySuit(false);
    } else {
      setSortBySuit(true);
      localStorage.setItem(SORT_BY_SUIT, "true");
    }
  };

  const resetLevel = () => {
    setRoundRewards(undefined);
    setPreSelectionLocked(false);
    refetchRound();
  };

  const onShopSkip = () => {
    resetLevel();
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

  const refetch = () => {
    refetchDeckData();
    refetchRound();
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

  const executeCreateGame = () => {
    setError(false);
    setGameLoading(true);
    if (username) {
      console.log("Creating game...");
      createGame(account.account, username).then((response) => {
        const { gameId: newGameId, hand } = response;
        if (newGameId) {
          navigate("/redirect/demo");
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
      }, ALL_CARDS_DURATION);

      setTimeout(() => {
        setAnimatedCard(undefined);

        setPlayAnimation(false);
        clearPreSelection();
        refetch();
        handsLeft > 0 && setPreSelectionLocked(false);

        if (playEvents.gameOver) {
          console.log("GAME OVER");
          setTimeout(() => {
            navigate("/gameover");
          }, 1000);
        } else if (playEvents.levelPassed && playEvents.detailEarned) {
          const { level } = playEvents.levelPassed;
          setRoundRewards({
            ...playEvents.detailEarned,
            level: level,
          });
          setPreSelectionLocked(true);
        } else {
          playEvents.cards && replaceCards(playEvents.cards);
          setRoundRewards(undefined);
        }
      }, ALL_CARDS_DURATION + 500);
    }
  };

  const onPlayClick = () => {
    play(account.account, gameId, preSelectedCards, preSelectedModifiers).then(
      (response) => {
        response && animatePlay(response);
      }
    );
  };

  const cardIsPreselected = (cardIndex: number) => {
    return preSelectedCards.filter((idx) => idx === cardIndex).length > 0;
  };

  const getModifiers = (preSelectedCardIndex: number): Card[] => {
    const modifierIndexes = preSelectedModifiers[preSelectedCardIndex];
    return (
      modifierIndexes?.map((modifierIdx) => {
        return hand.find((c) => c.idx === modifierIdx)!;
      }) ?? []
    );
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

  const replaceCards = (cards: Card[]) => {
    const newHand = hand?.map((card) => {
      const newCard = cards.find((c) => c.idx === card.idx);
      if (newCard) {
        return newCard;
      } else {
        return card;
      }
    });
    setHand(newHand);
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
        replaceCards(response.cards);
        setPreSelectionLocked(false);
        clearPreSelection();
        refetch();
        setDiscardAnimation(false);
      }
    });
  };

  const onDiscardEffectCard = (cardIdx: number) => {
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
    discardEffectCard(account.account, gameId, cardIdx)
      .then((response): void => {
        if (response.success) {
          refetch();
          replaceCards(response.cards);
        }
      })
      .catch(() => {
        // rollback, remove discarded boolean from all cards
        const newHand = hand?.map((card) => {
          return {
            ...card,
            discarded: false,
          };
        });
        setHand(newHand);
      });
  };

  const onDiscardSpecialCard = (cardIdx: number) => {
    return discardSpecialCard(account.account, gameId, cardIdx);
  };

  const cleanGameId = () => {
    setGameId(0);
  }

  const checkOrCreateGame = () => {
    console.log("checking game exists", gameId);
    if (!gameId || gameId === 0 || !gameExists(Game, gameId)) {
      executeCreateGame();
    } else {
      setGameLoading(false);
      refetch();
      console.log("Game found, no need to create a new one");
    }
  };

  //effects

  useEffect(() => {
    if (apiHand?.length > 0 && hand.length === 0) {
      setHand(apiHand);
    }
  }, [apiHand]);

  useEffect(() => {
    if (preSelectedCards.length > 0) {
      checkHand(
        account.account,
        gameId,
        preSelectedCards,
        preSelectedModifiers
      ).then((result) => {
        setPreSelectedPlay(result?.play ?? Plays.NONE);
        setMulti(result?.multi ?? 0);
        setPoints(result?.points ?? 0);
      });
    } else {
      setPreSelectedPlay(Plays.NONE);
      resetMultiPoints();
    }
  }, [preSelectedCards, preSelectedModifiers]);

  //make sure data is legit

  useEffect(() => {
    if (round.levelScore === 0) {
      setGameLoading(true);
      setTimeout(() => {
        refetchRound().then(() => {
          setGameLoading(false);
        });
      }, 500);
    }
  }, [round]);

  useEffect(() => {
    if (deck.size === 0) {
      setGameLoading(true);
      setTimeout(() => {
        refetchDeckData().then(() => {
          setGameLoading(false);
        });
      }, 500);
    }
  }, [deck]);

  const loadingStates = deck.size === 0 || round.levelScore === 0;

  return (
    <GameContext.Provider
      value={{
        gameId,
        preSelectedPlay,
        points,
        multi,
        executeCreateGame,
        gameLoading,
        preSelectedCards,
        setPreSelectedCards,
        play: onPlayClick,
        hand: sortedHand,
        setHand,
        getModifiers,
        togglePreselected,
        discardAnimation,
        playAnimation,
        discard: onDiscardClick,
        discardEffectCard: onDiscardEffectCard,
        error,
        clearPreSelection,
        loadingStates,
        preSelectedModifiers,
        addModifier,
        roundRewards,
        sortBy,
        toggleSortBy,
        onShopSkip,
        discardSpecialCard: onDiscardSpecialCard,
        checkOrCreateGame,
        restartGame: cleanGameId,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

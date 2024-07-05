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
import { gameExists } from "../dojo/utils/getGame.tsx";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy.ts";
import { useGetCurrentHand } from "../queries/useGetCurrentHand.ts";
import { useGetDeck } from "../queries/useGetDeck";
import { useGetGame } from "../queries/useGetGame.ts";
import { useGetPlaysLevelDetail } from "../queries/useGetPlaysLevelDetail";
import { useGetRound } from "../queries/useGetRound.ts";
import { Card } from "../types/Card";
import { RoundRewards } from "../types/RoundRewards.ts";
import { PlayEvents } from "../types/ScoreData.ts";
import { changeCardSuit } from "../utils/changeCardSuit.ts";
import { checkHand } from "../utils/checkHand";
import { sortCards } from "../utils/sortCards.ts";
import { useCardAnimations } from "./CardAnimationsProvider";
import { useGetSpecialCards } from "../queries/useGetSpecialCards.ts";

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
  preSelectionLocked: boolean;
  score: number;
  handsLeft: number;
  discardsLeft: number;
  specialCards: Card[];
  addBoughtSpecialCard: (card: Card) => void;
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
  preSelectionLocked: false,
  score: 0,
  handsLeft: 4,
  discardsLeft: 4,
  specialCards: [],
  addBoughtSpecialCard: (_) => {},
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
  const [score, setScore] = useState(0);
  const [handsLeft, setHandsLeft] = useState(4);
  const [discardsLeft, setDiscardsLeft] = useState(4);
  const { data: game } = useGetGame(gameId);

  const sortBy: SortBy = useMemo(
    () => (sortBySuit ? SortBy.SUIT : SortBy.RANK),
    [sortBySuit]
  );

  const sortedHand = useMemo(() => sortCards(hand, sortBy), [hand, sortBy]);

  //hooks
  const { data: round, refetch: refetchRound } = useGetRound(gameId);

  const { data: apiHand } = useGetCurrentHand(gameId, sortBy);

  const apiScore = round?.score ?? 0;
  const apiHandsLeft = round?.hands;
  const apiDiscardsLeft = round?.discards;

  const { data: plays, refetch: refetchPlays } = useGetPlaysLevelDetail();

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

  const { data: deck, refetch: refetchDeckData } = useGetDeck(gameId);

  const navigate = useNavigate();

  const { setAnimatedCard } = useCardAnimations();

  const { data: apiSpecialCards, refetch: refetchSpecialCards } = useGetSpecialCards(gameId);
  const [ specialCards, setSpecialCards ] = useState<Card[]>([]);

  const addBoughtSpecialCard = (card: Card) => {
    setSpecialCards([...specialCards, card]);
  }

  //variables
  const lsUser = localStorage.getItem(LOGGED_USER);
  const username = lsUser;

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
    setScore(0);
    setHandsLeft(game?.max_hands ?? 1);
    setDiscardsLeft(game?.max_discard ?? 1);
    setSpecialCards([]);
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
          resetLevel();
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
        playEvents.score && setScore(playEvents.score);
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
          setTimeout(() => {
            setRoundRewards({
              ...playEvents.detailEarned!,
              level: level,
            });
          }, 1000);
          setPreSelectionLocked(true);
        } else {
          playEvents.cards && replaceCards(playEvents.cards);
          setRoundRewards(undefined);
        }
      }, ALL_CARDS_DURATION + 500);
    }
  };

  const onPlayClick = () => {
    setPreSelectionLocked(true);
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
        setPreSelectionLocked(false);
      });
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
        setDiscardsLeft((prev) => prev - 1);
        replaceCards(response.cards);
        refetch();
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
          refetch();
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

  const onDiscardSpecialCard = (cardIdx: number) => {
    setPreSelectionLocked(true);
    return discardSpecialCard(account.account, gameId, cardIdx)
      .then((response) => {
        if (response) {
          setSpecialCards(specialCards.filter((special) => special.idx !== cardIdx));
        }
        return response;
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        setPreSelectionLocked(false);
      });
  };

  const cleanGameId = () => {
    setGameId(0);
  };

  const checkOrCreateGame = () => {
    console.log("checking game exists", gameId);
    if (!gameId || gameId === 0 || !gameExists(Game, gameId)) {
      executeCreateGame();
    } else {
      setGameLoading(false);
      console.log("Game found, no need to create a new one");
    }
  };

  //effects
  useEffect(() => {
    if(apiSpecialCards && JSON.stringify(specialCards) !== JSON.stringify(apiSpecialCards) && specialCards.length == 0) {
      setSpecialCards(apiSpecialCards);
    }
  },[apiSpecialCards]);

  useEffect(() => {
    if (apiHand?.length > 0 && hand.length === 0) {
      setHand(apiHand);
    }
  }, [apiHand]);

  useEffect(() => {
    if (!score && apiScore > 0) {
      setScore(apiScore);
    }
    if (apiHandsLeft > 0) {
      setHandsLeft(apiHandsLeft);
    }
    if (apiDiscardsLeft > 0) {
      setDiscardsLeft(apiDiscardsLeft);
    }
  }, [apiScore, apiHandsLeft, apiDiscardsLeft]);

  const setMultiAndPoints = (play: Plays) => {
    const playerPokerHand = plays?.find((p) => p.pokerHand.value == play);
        setMulti(playerPokerHand?.multi ?? 0);
        setPoints(playerPokerHand?.points ?? 0);
  }

  useEffect(() => {
    if (preSelectedCards.length > 0) {
      let play = checkHand(
        specialCards,
        hand,
        preSelectedCards,
        preSelectedModifiers
      );
      setPreSelectedPlay(play);
      if (plays?.length == 0) {
        refetchPlays().then(() => {
          setMultiAndPoints(play);
        })
      } else {
        setMultiAndPoints(play);
      }
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
        preSelectionLocked,
        score,
        handsLeft,
        discardsLeft,
        specialCards,
        addBoughtSpecialCard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

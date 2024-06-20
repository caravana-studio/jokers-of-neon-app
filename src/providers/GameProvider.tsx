import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER, SORT_BY_SUIT } from "../constants/localStorage";
import { useDojo } from "../dojo/useDojo";
import { gameExists } from "../dojo/utils/getGame";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy.ts";
import { useGetCurrentHand } from "../queries/useGetCurrentHand";
import { useGetDeck } from "../queries/useGetDeck";
import { useGetRound } from "../queries/useGetRound.ts";
import { Card } from "../types/Card";
import { RoundRewards } from "../types/RoundRewards.ts";
import { PlayEvents } from "../types/ScoreData.ts";
import { changeCardSuit } from "../utils/changeCardSuit.ts";
import { getEnvNumber } from "../utils/getEnvValue";
import { getHandId } from "../utils/getHandId.ts";
import { useCardAnimations } from "./CardAnimationsProvider";

const REFETCH_HAND_GAP = getEnvNumber("VITE_REFETCH_HAND_GAP") || 2000;
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
  getModifiers: (preSelectedCardIndex: number) => Card[];
  togglePreselected: (cardIndex: number) => void;
  discardAnimation: boolean;
  playAnimation: boolean;
  discard: () => void;
  discardEffectCard: (cardIdx: number) => void;
  error: boolean;
  clearPreSelection: () => void;
  loadingStates: boolean;
  refetchingHand: boolean;
  refetchHand: (times?: number) => void;
  preSelectedModifiers: { [key: number]: number[] };
  addModifier: (cardIdx: number, modifierIdx: number) => void;
  roundRewards: RoundRewards | undefined;
  sortBy: SortBy;
  toggleSortBy: () => void;
  onShopSkip: () => void;
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
  refetchingHand: false,
  refetchHand: (_) => {},
  preSelectedModifiers: {},
  addModifier: (_, __) => {},
  roundRewards: undefined,
  sortBy: SortBy.RANK,
  toggleSortBy: () => {},
  onShopSkip: () => {},
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
  const [frozenHand, setFrozenHand] = useState<Card[] | undefined>();
  const [previousLevelHandId, setPreviousLevelHandId] = useState<
    string | undefined
  >();
  const [refetchingHand, setRefetchingHand] = useState(false);
  const [roundRewards, setRoundRewards] = useState<RoundRewards | undefined>(
    undefined
  );
  const [sortBySuit, setSortBySuit] = useState(
    !!localStorage.getItem(SORT_BY_SUIT)
  );
  const sortBy: SortBy = sortBySuit ? SortBy.SUIT : SortBy.RANK;

  //hooks
  const { data: round, refetch: refetchRound } = useGetRound(gameId);

  const {
    setup: {
      systemCalls: { createGame, checkHand, discard, discardEffectCard, play },
      clientComponents: { Game },
    },
    account,
  } = useDojo();

  const { data: updatedHand } = useGetCurrentHand(
    gameId,
    refetchingHand,
    sortBy
  );
  const hand = frozenHand ? frozenHand : updatedHand;

  const { data: deck, refetch: refetchDeckData } = useGetDeck(gameId);

  const navigate = useNavigate();

  const { setAnimatedCard } = useCardAnimations();

  //variables
  const lsUser = localStorage.getItem(LOGGED_USER);
  const address = account?.account?.address;
  const username = lsUser ?? address ?? "0xtest";
  const handsLeft = round?.hands;
  const currentHandId = getHandId(hand);

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
    refetchHand();
    refetchRound();
  };

  const onShopSkip = () => {
    setPreviousLevelHandId(currentHandId);
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

  const refetchHand = (times: number = 1) => {
    console.log("refetching hand");
    setRefetchingHand(true);
    setTimeout(() => {
      console.log("refetching hand done");
      setRefetchingHand(false);
    }, REFETCH_HAND_GAP * times); // Will keep refetching hand for REFETCH_HAND_GAP ms
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
    console.log("Creating game...");
    setError(false);
    setGameLoading(true);
    createGame(account.account, username).then((newGameId) => {
      if (newGameId) {
        refetchHand();
        setGameId(newGameId);
        clearPreSelection();
        localStorage.setItem(GAME_ID, newGameId.toString());
        console.log(`game ${newGameId} created`);
        setGameLoading(false);
        setPreSelectionLocked(false);
      } else {
        setError(true);
      }
    });
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
        PLAY_ANIMATION_DURATION * playEvents.cards.length;
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
            setFrozenHand((prev) => {
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
            setFrozenHand((prev) => {
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
            playEvents.cards.forEach((card, index) => {
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
        refetchHand();
        handsLeft > 0 && setPreSelectionLocked(false);
        setFrozenHand(undefined);

        if (playEvents.gameOver) {
          console.log("GAME OVER");
          setTimeout(() => {
            navigate("/gameover");
          }, 1000);
        }

        if (playEvents.levelPassed && playEvents.detailEarned) {
          const { level } = playEvents.levelPassed;
          setRoundRewards({
            ...playEvents.detailEarned,
            level: level,
          });
          setPreSelectionLocked(true);
        } else {
          setRoundRewards(undefined);
        }
      }, ALL_CARDS_DURATION + 500);
    }
  };

  const onPlayClick = () => {
    setFrozenHand(hand);
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

  const onDiscardClick = () => {
    setPreSelectionLocked(true);
    setDiscardAnimation(true);
    discard(
      account.account,
      gameId,
      preSelectedCards,
      preSelectedModifiers
    ).then((response) => {
      refetchHand();
      if (response) {
        setTimeout(() => {
          setPreSelectionLocked(false);
          clearPreSelection();
          refetch();
          setDiscardAnimation(false);
        }, 1500);
      }
    });
  };

  const onDiscardEffectCard = (cardIdx: number) => {
    discardEffectCard(account.account, gameId, cardIdx).then(
      (response): void => {
        refetchHand();
        if (response) {
          setTimeout(() => {
            refetch();
          }, 1500);
        }
      }
    );
  };

  //effects
  useEffect(() => {
    console.log("checking game exists", gameId);
    if (!gameExists(Game, gameId)) {
      executeCreateGame();
    } else {
      setGameLoading(false);
      refetch();
      refetchHand();
      console.log("Game found, no need to create a new one");
    }
  }, []);

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

  useEffect(() => {
    if (hand.length < 8) {
      setGameLoading(true);
      setRefetchingHand(true);
    } else if (gameLoading) {
      setRefetchingHand(false);
      setGameLoading(false);
    }
  }, [hand]);

  const loadingStates =
    deck.size === 0 ||
    hand.length < 8 ||
    round.levelScore === 0 ||
    previousLevelHandId === currentHandId;

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
        hand,
        getModifiers,
        togglePreselected,
        discardAnimation,
        playAnimation,
        discard: onDiscardClick,
        discardEffectCard: onDiscardEffectCard,
        error,
        clearPreSelection,
        loadingStates,
        refetchingHand,
        refetchHand,
        preSelectedModifiers,
        addModifier,
        roundRewards,
        sortBy,
        toggleSortBy,
        onShopSkip,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

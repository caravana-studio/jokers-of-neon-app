import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { useDojo } from "../dojo/useDojo";
import { gameExists } from "../dojo/utils/getGame";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { useGame } from "../dojo/utils/useGame";
import { Plays } from "../enums/plays";
import { useCustomToast } from "../hooks/useCustomToast";
import { useGetCurrentHand } from "../queries/useGetCurrentHand";
import { useGetDeck } from "../queries/useGetDeck";
import { useGetRound } from "../queries/useGetRound";
import { Card } from "../types/Card";
import { Round } from "../types/Round";
import { getEnvNumber } from "../utils/getEnvValue";
import { useCardAnimations } from "./CardAnimationsProvider";

const REFETCH_HAND_GAP = getEnvNumber("VITE_REFETCH_HAND_GAP") || 2000;

interface IGameContext {
  gameId: number;
  round: Round;
  refetchRound: () => void;
  //TODO: type
  game: any;
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
  refetchHand: () => void;
}

const GameContext = createContext<IGameContext>({
  gameId: getLSGameId(),
  round: {
    score: 0,
    levelScore: 0,
    hands: 0,
    discards: 0,
  },
  game: {
    level: 0,
  },
  refetchRound: () => {},
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
  refetchHand: () => {},
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
  const [frozenHand, setFrozenHand] = useState<Card[] | undefined>();
  const [refetchingHand, setRefetchingHand] = useState(false);

  //hooks
  const { data: round, refetch: refetchRound } = useGetRound(gameId);

  const game = useGame();
  const {
    setup: {
      systemCalls: { createGame, checkHand, discard, discardEffectCard, play },
      clientComponents: { Game },
    },
    account,
  } = useDojo();

  const { data: updatedHand } = useGetCurrentHand(gameId, refetchingHand);
  const hand = frozenHand ? frozenHand : updatedHand;

  const { data: deck, refetch: refetchDeckData } = useGetDeck(gameId);

  const { showSuccessToast } = useCustomToast();

  const navigate = useNavigate();

  const {
    setAnimatedCardIdx,
    setPoints: setAnimatedPoints,
    setMulti: setAnimatedMulti,
  } = useCardAnimations();

  //variables
  const lsUser = localStorage.getItem(LOGGED_USER);
  const address = account?.account?.address;
  const username = lsUser ?? address ?? "0xtest";
  const handsLeft = round?.hands;

  const regularPreSelectedCards = preSelectedCards.filter((idx) => {
    const card = hand.find((c) => c.idx === idx);
    return !card?.isModifier;
  });

  //functions
  const refetchHand = () => {
    console.log("refetching hand");
    setRefetchingHand(true);
    setTimeout(() => {
      console.log("refetching hand done");
      setRefetchingHand(false);
    }, REFETCH_HAND_GAP); // Will keep refetching hand for REFETCH_HAND_GAP ms
  };

  const refetch = () => {
    refetchDeckData();
    refetchRound();
  };

  const clearPreSelection = () => {
    if (!preSelectionLocked && handsLeft > 0) {
      resetMultiPoints();
      setPreSelectedCards([]);
    }
  };

  const resetMultiPoints = () => {
    setPoints(0);
    setMulti(0);
  };

  const executeCreateGame = () => {
    console.log("Creating game...");
    setGameLoading(true);
    createGame(account.account, username).then((newGameId) => {
      if (newGameId) {
        refetchHand();
        setGameId(newGameId);
        clearPreSelection();
        localStorage.setItem(GAME_ID, newGameId.toString());
        console.log(`game ${newGameId} created`);
        setGameLoading(false);
      } else {
        setError(true);
      }
    });
  };

  const onPlayClick = () => {
    setFrozenHand(hand);
    play(account.account, gameId, preSelectedCards).then((response) => {
      console.log("response", response);
      if (response) {
        setPreSelectionLocked(true);
        response.cards.forEach((card, index) => {
          setTimeout(() => {
            const { idx, points, multi } = card;
            setAnimatedCardIdx(idx);
            setAnimatedPoints(points);
            multi && setAnimatedMulti(multi);
            setPoints((prev) => prev + points);
            multi && setMulti((prev) => prev + multi);
          }, 700 * index);
        });

        setTimeout(
          () => {
            setPlayAnimation(true);
          },
          700 * response.cards.length + 100
        );

        setTimeout(
          () => {
            setAnimatedCardIdx(undefined);
            setAnimatedPoints(0);
            setAnimatedMulti(0);

            setPlayAnimation(false);
            clearPreSelection();
            refetch();
            refetchHand();
            handsLeft > 0 && setPreSelectionLocked(false);
            setFrozenHand(undefined);

            if (response.gameOver) {
              console.log("GAME OVER");
              setTimeout(() => {
                navigate("/gameover");
              }, 1000);
            }

            if (response.levelPassed) {
              const { level, score } = response.levelPassed;
              setTimeout(() => {
                showSuccessToast(
                  `level ${level} passed with score ${score}`,
                  "CONGRATULATIONS!!!"
                );
              }, 200);
            }
          },
          700 * response.cards.length + 400
        );
      }
    });
  };

  const cardIsPreselected = (cardIndex: number) => {
    return preSelectedCards.filter((idx) => idx === cardIndex).length > 0;
  };

  const getModifiers = (preSelectedCardIndex: number): Card[] => {
    let modifiers: Card[] = [];
    const modifier1Idx = preSelectedCards[preSelectedCardIndex + 1];
    const modifier2Idx = preSelectedCards[preSelectedCardIndex + 2];
    const modifier1 = hand.find((c) => c.idx === modifier1Idx);
    const modifier2 = hand.find((c) => c.idx === modifier2Idx);
    if (modifier1?.isModifier) {
      if (modifier2?.isModifier) {
        modifiers = [modifier1, modifier2];
      } else {
        modifiers = [modifier1];
      }
    }
    return modifiers;
  };

  const unPreSelectCard = (cardIndex: number) => {
    const preSelectedIndex = preSelectedCards.findIndex(
      (idx) => idx === cardIndex
    );
    const modifiers = getModifiers(preSelectedIndex);
    const modifierIndexes = modifiers.map((modifier) => modifier.idx);
    const indexes = [...modifierIndexes, cardIndex];
    setPreSelectedCards((prev) => {
      return prev.filter((idx) => !indexes.includes(idx));
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
      } else if (regularPreSelectedCards.length < 5) {
        preSelectCard(cardIndex);
      }
    }
  };

  const onDiscardClick = () => {
    setPreSelectionLocked(true);
    setDiscardAnimation(true);
    discard(account.account, gameId, preSelectedCards).then((response) => {
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
      checkHand(account.account, gameId, preSelectedCards).then((result) => {
        setPreSelectedPlay(result?.play ?? Plays.NONE);
        setMulti(result?.multi ?? 0);
        setPoints(result?.points ?? 0);
      });
    } else {
      setPreSelectedPlay(Plays.NONE);
      resetMultiPoints();
    }
  }, [preSelectedCards]);

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
    deck.size === 0 || hand.length < 8 || round.levelScore === 0;

  return (
    <GameContext.Provider
      value={{
        gameId,
        round,
        game,
        refetchRound,
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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

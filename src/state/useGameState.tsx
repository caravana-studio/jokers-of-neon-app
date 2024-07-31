import { useMemo, useState } from "react";
import { LOGGED_USER, SORT_BY_SUIT } from "../constants/localStorage";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy";
import { useGetCurrentHand } from "../queries/useGetCurrentHand";
import { useGetDeck } from "../queries/useGetDeck";
import { useGetGame } from "../queries/useGetGame";
import { useGetPlaysLevelDetail } from "../queries/useGetPlaysLevelDetail";
import { useGetRound } from "../queries/useGetRound";
import { Card } from "../types/Card";
import { RoundRewards } from "../types/RoundRewards";
import { sortCards } from "../utils/sortCards";

export const useGameState = () => {
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

  const sortBy: SortBy = useMemo(
    () => (sortBySuit ? SortBy.SUIT : SortBy.RANK),
    [sortBySuit]
  );
  const sortedHand = useMemo(() => sortCards(hand, sortBy), [hand, sortBy]);

  const { data: game } = useGetGame(gameId);
  const { data: round, refetch: refetchRound } = useGetRound(gameId);
  const { data: apiHand } = useGetCurrentHand(gameId, sortBy);
  const { data: plays, refetch: refetchPlays } = useGetPlaysLevelDetail(gameId);
  const { data: deck, refetch: refetchDeckData } = useGetDeck(gameId);

  const lsUser = localStorage.getItem(LOGGED_USER);
  const username = lsUser;

  const loadingStates = deck.size === 0 || round.levelScore === 0;

  return {
    gameId,
    setGameId,
    preSelectedPlay,
    setPreSelectedPlay,
    points,
    setPoints,
    multi,
    setMulti,
    gameLoading,
    setGameLoading,
    preSelectionLocked,
    setPreSelectionLocked,
    discardAnimation,
    setDiscardAnimation,
    playAnimation,
    setPlayAnimation,
    error,
    setError,
    preSelectedCards,
    setPreSelectedCards,
    preSelectedModifiers,
    setPreSelectedModifiers,
    hand,
    setHand,
    roundRewards,
    setRoundRewards,
    sortBySuit,
    setSortBySuit,
    score,
    setScore,
    handsLeft,
    setHandsLeft,
    discardsLeft,
    setDiscardsLeft,
    game,
    round,
    refetchRound,
    apiHand,
    plays,
    refetchPlays,
    deck,
    refetchDeckData,
    sortBy,
    sortedHand,
    username,
    loadingStates,
  };
};

import { useEffect, useMemo, useState } from "react";
import { LOGGED_USER, SORT_BY_SUIT } from "../constants/localStorage";
import { useCurrentHand } from "../dojo/queries/useCurrentHand";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards";
import { useGame } from "../dojo/queries/useGame";
import { useRound } from "../dojo/queries/useRound";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy";
import { useGetDeck } from "../queries/useGetDeck";
import { useGetPlaysLevelDetail } from "../queries/useGetPlaysLevelDetail";
import { Card } from "../types/Card";
import { RoundRewards } from "../types/RoundRewards";
import { checkHand } from "../utils/checkHand";
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

  const game = useGame();
  const round = useRound();
  const dojoHand = useCurrentHand(sortBy);
  const { data: plays, refetch: refetchPlays } = useGetPlaysLevelDetail(gameId);
  const { data: deck, refetch: refetchDeckData } = useGetDeck(gameId);

  const { specialCards } = useCurrentSpecialCards();

  const lsUser = localStorage.getItem(LOGGED_USER);
  const username = lsUser;

  const dojoScore = round?.player_score ?? 0;
  const dojoHandsLeft = round?.hands;
  const dojoDiscardsLeft = round?.discard;

  const resetMultiPoints = () => {
    setPoints(0);
    setMulti(0);
  };

  //effects

  useEffect(() => {
    if (dojoHand?.length > 0 && hand.length === 0) {
      setHand(dojoHand);
    }
  }, [dojoHand]);

  useEffect(() => {
    if (!score && dojoScore > 0) {
      setScore(dojoScore);
    }
    if (dojoHandsLeft && dojoHandsLeft > 0) {
      setHandsLeft(dojoHandsLeft);
    }
    if (dojoDiscardsLeft && dojoDiscardsLeft > 0) {
      setDiscardsLeft(dojoDiscardsLeft);
    }
  }, [dojoScore, dojoHandsLeft, dojoDiscardsLeft]);

  const setMultiAndPoints = (play: Plays) => {
    const playerPokerHand = plays?.find((p) => p.pokerHand.value == play);
    setMulti(playerPokerHand?.multi ?? 0);
    setPoints(playerPokerHand?.points ?? 0);
  };

  useEffect(() => {
    if (preSelectedCards.length > 0) {
      let play = checkHand(
        hand,
        preSelectedCards,
        specialCards,
        preSelectedModifiers
      );
      setPreSelectedPlay(play);
      if (plays?.length == 0) {
        refetchPlays().then(() => {
          setMultiAndPoints(play);
        });
      } else {
        setMultiAndPoints(play);
      }
    } else {
      setPreSelectedPlay(Plays.NONE);
      resetMultiPoints();
    }
  }, [preSelectedCards, preSelectedModifiers]);

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
    apiHand: dojoHand,
    plays,
    refetchPlays,
    deck,
    refetchDeckData,
    sortBy,
    sortedHand,
    username,
  };
};

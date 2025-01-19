import { useEffect, useMemo, useState } from "react";
import { LOGGED_USER, SORT_BY_SUIT } from "../constants/localStorage";
import { getPlayerPokerHands } from "../dojo/getPlayerPokerHands";
import { getGameConfig } from "../dojo/queries/getGameConfig";
import { useCurrentHand } from "../dojo/queries/useCurrentHand";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards";
import { useGame } from "../dojo/queries/useGame";
import { useGamePowerUps } from "../dojo/queries/useGamePowerUps";
import { useRound } from "../dojo/queries/useRound";
import { useDojo } from "../dojo/useDojo";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy";
import { Card } from "../types/Card";
import { LevelPokerHand } from "../types/LevelPokerHand";
import { PowerUp } from "../types/PowerUp";
import { RoundRewards } from "../types/RoundRewards";
import { checkHand } from "../utils/checkHand";
import { LevelUpPlayEvent } from "../utils/discardEvents/getLevelUpPlayEvent";
import { sortCards } from "../utils/sortCards";
import { fetchAndMergeSpecialCardsData } from "../data/specialCards";
import { fetchModImages } from "../data/modImageCache";
import { preloadImages } from "../utils/preloadImages";
import { CLASSIC_MOD_ID } from "../constants/general";
import { decodeString } from "../dojo/utils/decodeString";

export const useGameState = () => {
  const {
    setup: {
      client,
      account: { account },
    },
  } = useDojo();

  const [gameId, setGameId] = useState<number>(getLSGameId());

  const [preSelectedPlay, setPreSelectedPlay] = useState<Plays>(Plays.NONE);
  const [playIsNeon, setPlayIsNeon] = useState(false);
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
  const [lockedScore, setLockedScore] = useState<number | undefined>(undefined);
  const [lockedCash, setLockedCash] = useState<number | undefined>(undefined);
  const [lockedSpecialCards, setLockedSpecialCards] = useState<Card[]>([]);
  const [isRageRound, setIsRageRound] = useState(false);
  const [rageCards, setRageCards] = useState<Card[]>([]);
  const [plays, setPlays] = useState<LevelPokerHand[]>([]);
  const [destroyedSpecialCardId, setDestroyedSpecialCardId] =
    useState<number>();
  const [levelUpHand, setLevelUpHand] = useState<LevelUpPlayEvent>();

  const [specialSwitcherOn, setSpecialSwitcherOn] = useState(true);

  const [powerUps, setPowerUps] = useState<(PowerUp | null)[]>([]);
  const [preselectedPowerUps, setPreselectedPowerUps] = useState<number[]>([]);
  const [maxSpecialCards, setMaxSpecialCards] = useState(0);
  const [maxPowerUpSlots, setMaxPowerUpSlots] = useState(0);

  const fetchGameConfig = async () => {
    const gameConfig = await getGameConfig(
      client,
      game?.mod_id ?? CLASSIC_MOD_ID
    );
    if (gameConfig) {
      setMaxSpecialCards(gameConfig.maxSpecialCards);
      setMaxPowerUpSlots(gameConfig.maxPowerUpSlots);
    }
  };

  useEffect(() => {
    fetchGameConfig();
  }, []);

  const sortBy: SortBy = useMemo(
    () => (sortBySuit ? SortBy.SUIT : SortBy.RANK),
    [sortBySuit]
  );
  const sortedHand = useMemo(() => sortCards(hand, sortBy), [hand, sortBy]);

  const round = useRound();
  const game = useGame();

  const [modId, setModId] = useState<string>(
    game?.mod_id ? decodeString(game?.mod_id ?? "") : CLASSIC_MOD_ID
  );

  const dojoHand = useCurrentHand(sortBy);

  const dojoPowerUps = useGamePowerUps();

  const removePowerUp = (idx: number) => {
    setPowerUps((prev) => {
      const newPowerUps = [
        ...prev.filter((powerUp: PowerUp | null) => powerUp?.idx !== idx),
        null,
      ];

      return newPowerUps;
    });
  };

  const addPowerUp = (powerUp: PowerUp) => {
    setPowerUps((prev) => {
      const newPowerUps = [...prev, powerUp];
      return newPowerUps;
    });
  };

  useEffect(() => {
    if (client && account) {
      getPlayerPokerHands(client, gameId).then((plays: any) => {
        if (plays != undefined) setPlays(plays);
      });
    }
  }, [client, account, gameId, game?.level]);

  useEffect(() => {
    console.log(decodeString(game?.mod_id ?? ""));
    fetchModImages(decodeString(game?.mod_id ?? "")).then(
      (externalImageUrls) => {
        preloadImages(externalImageUrls);
      }
    );
    fetchAndMergeSpecialCardsData(String(game?.mod_id));
  }, [game?.mod_id]);

  const dojoSpecialCards = useCurrentSpecialCards();

  const specialCards =
    lockedSpecialCards.length > 0 ? lockedSpecialCards : dojoSpecialCards;

  const lsUser = localStorage.getItem(LOGGED_USER);
  const username = lsUser;

  const dojoScore = round?.player_score ?? 0;
  const dojoCash = game?.cash ?? 0;

  const score = lockedScore ?? dojoScore;
  const cash = lockedCash || lockedCash === 0 ? lockedCash : dojoCash;

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
    if (dojoPowerUps?.length > 0 && powerUps.length === 0) {
      setPowerUps(dojoPowerUps);
    }
  }, [dojoPowerUps]);

  const setMultiAndPoints = (play: Plays) => {
    const playerPokerHand = plays[play - 1];
    const multi =
      typeof playerPokerHand.multi === "number" ? playerPokerHand.multi : 0;
    const points =
      typeof playerPokerHand.points === "number" ? playerPokerHand.points : 0;
    setMulti(multi);
    setPoints(points);
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
      if (plays?.length != 0) {
        setMultiAndPoints(play);
      }
    } else {
      setPreSelectedPlay(Plays.NONE);
      resetMultiPoints();
    }
  }, [preSelectedCards, preSelectedModifiers]);

  const toggleSpecialSwitcher = () => {
    setSpecialSwitcherOn(!specialSwitcherOn);
  };
  const showRages = () => {
    setSpecialSwitcherOn(false);
  };
  const showSpecials = () => {
    setSpecialSwitcherOn(true);
  };

  const resetPowerUps = () => {
    setPowerUps([null, null, null, null]);
    setPreselectedPowerUps([]);
  };

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
    apiHand: dojoHand,
    plays,
    sortBy,
    sortedHand,
    username,
    playIsNeon,
    setPlayIsNeon,
    specialCards,
    setLockedSpecialCards,
    setLockedScore,
    isRageRound,
    setIsRageRound,
    cash,
    setLockedCash,
    rageCards,
    setRageCards,
    destroyedSpecialCardId,
    setDestroyedSpecialCardId,
    levelUpHand,
    setLevelUpHand,
    specialSwitcherOn,
    toggleSpecialSwitcher,
    showRages,
    showSpecials,
    powerUps,
    removePowerUp,
    preselectedPowerUps,
    setPreselectedPowerUps,
    resetPowerUps,
    setPowerUps,
    addPowerUp,
    modId,
    setModId,
    maxSpecialCards,
    maxPowerUpSlots,
  };
};

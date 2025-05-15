import { useEffect, useMemo, useState } from "react";
import { CLASSIC_MOD_ID } from "../constants/general";
import { GAME_ID, LOGGED_USER, SORT_BY_SUIT } from "../constants/localStorage";
import { getPlayerPokerHands } from "../dojo/getPlayerPokerHands";
import { getGameConfig } from "../dojo/queries/getGameConfig";
import { getNode } from "../dojo/queries/getNode";
import { useCurrentHand } from "../dojo/queries/useCurrentHand";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards";
import { useGame } from "../dojo/queries/useGame";
import { useGamePowerUps } from "../dojo/queries/useGamePowerUps";
import {
  getModRageCardsId,
  getModSpecialCardsId,
} from "../dojo/queries/useModCardsId";
import { useRound } from "../dojo/queries/useRound";
import { useDojo } from "../dojo/useDojo";
import { decodeString } from "../dojo/utils/decodeString";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy";
import { Card } from "../types/Card";
import { LevelPokerHand } from "../types/LevelPokerHand";
import { ModCardsConfig } from "../types/ModConfig";
import { PowerUp } from "../types/Powerup/PowerUp";
import { RoundRewards } from "../types/RoundRewards";
import { checkHand } from "../utils/checkHand";
import { LevelUpPlayEvent } from "../utils/discardEvents/getLevelUpPlayEvent";
import { sortCards } from "../utils/sortCards";
import { getRageNodeData } from "../utils/getRageNodeData";

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
  const [lockedPlayerScore, setLockedPlayerScore] = useState<
    number | undefined
  >(undefined);
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
  const [modCardsConfig, setModCardsConfig] = useState<ModCardsConfig>();

  const [cardTransformationLock, setCardTransformationLock] = useState(false);

  const fetchGameConfig = async () => {
    if (game?.mod_id) {
      const gameConfig = await getGameConfig(client, game.mod_id);
      if (gameConfig) {
        setMaxSpecialCards(gameConfig.maxSpecialCards);
        setMaxPowerUpSlots(gameConfig.maxPowerUpSlots);
      }
    }
  };

  const fetchCardsConfig = async () => {
    if (game?.mod_id) {
      const modSpecialCards = await getModSpecialCardsId(client, game.mod_id);
      const modRageCards = await getModRageCardsId(client, game.mod_id);

      if (modSpecialCards) {
        const modCardsConfig: ModCardsConfig = {
          specialCardsIds: modSpecialCards,
          rageCardsIds: modRageCards,
        };
        setModCardsConfig(modCardsConfig);
      }
    }
  };

  const game = useGame();
  const round = useRound();

  const [nodeRound, setNodeRound] = useState<number>(0);

  useEffect(() => {
    getNode(client, game?.id ?? 0, game?.current_node_id ?? 0).then((data) => {
      if ((round?.rages?.length ?? 0) > 0) {
        const rageRoundData = getRageNodeData(data);
        setNodeRound(rageRoundData.round);
      } else {
        setNodeRound(data);
      }
    });
  }, [game?.id, game?.current_node_id, round?.rages]);

  useEffect(() => {
    fetchGameConfig();
    fetchCardsConfig();
  }, [game?.mod_id]);

  const sortBy: SortBy = useMemo(
    () => (sortBySuit ? SortBy.SUIT : SortBy.RANK),
    [sortBySuit]
  );
  const sortedHand = useMemo(() => sortCards(hand, sortBy), [hand, sortBy]);

  const [modId, setModId] = useState<string>(
    game?.mod_id ? decodeString(game?.mod_id ?? "") : CLASSIC_MOD_ID
  );

  const isClassic = modId === CLASSIC_MOD_ID;

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
  }, [client, account, gameId, game?.level, game?.current_node_id]);

  const dojoSpecialCards = useCurrentSpecialCards();

  const specialCards =
    lockedSpecialCards.length > 0 ? lockedSpecialCards : dojoSpecialCards;

  const lsUser = localStorage.getItem(LOGGED_USER);

  const dojoScore = round?.current_score ?? 0;
  const dojoCash = game?.cash ?? 0;

  const score = lockedScore ?? dojoScore;
  const playerScore = lockedPlayerScore ?? game?.player_score ?? 0;
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

  const lsSetGameId = (gameId: number) => {
    localStorage.setItem(GAME_ID, gameId.toString());
    setGameId(gameId);
  };

  return {
    gameId,
    setGameId: lsSetGameId,
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
    playerScore,
    apiHand: dojoHand,
    plays,
    sortBy,
    sortedHand,
    playIsNeon,
    setPlayIsNeon,
    specialCards,
    setLockedSpecialCards,
    setLockedScore,
    setLockedPlayerScore,
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
    isClassic,
    modCardsConfig,
    cardTransformationLock,
    setCardTransformationLock,
    nodeRound,
  };
};

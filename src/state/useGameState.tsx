import { useEffect, useState } from "react";
import { CLASSIC_MOD_ID } from "../constants/general";
import { GAME_ID } from "../constants/localStorage";
import { getPlayerPokerHands } from "../dojo/getPlayerPokerHands";
import { getGameConfig } from "../dojo/queries/getGameConfig";
import { getNode } from "../dojo/queries/getNode";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards";
import { useGamePowerUps } from "../dojo/queries/useGamePowerUps";
import {
  getModRageCardsId,
  getModSpecialCardsId,
} from "../dojo/queries/useModCardsId";
import { useDojo } from "../dojo/useDojo";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { Plays } from "../enums/plays";
import { Card } from "../types/Card";
import { LevelPokerHand } from "../types/LevelPokerHand";
import { ModCardsConfig } from "../types/ModConfig";
import { PowerUp } from "../types/Powerup/PowerUp";
import { RoundRewards } from "../types/RoundRewards";
import { checkHand } from "../utils/checkHand";
import { LevelUpPlayEvent } from "../utils/discardEvents/getLevelUpPlayEvent";
import { getRageNodeData } from "../utils/getRageNodeData";
import { useCurrentHandStore } from "./useCurrentHandStore";
import { useGameStore } from "./useGameStore";

export const useGameState = () => {
  const {
    setup: {
      client,
      account: { account },
    },
  } = useDojo();

  const [gameId, setGameId] = useState<number>(getLSGameId());

  const {
    setPoints,
    setMulti,
    resetMultiPoints,
    round: currentNodeId,
    rageCards,
  } = useGameStore();

  const { setPreSelectedPlay, preSelectedCards } = useCurrentHandStore();
  const [playIsNeon, setPlayIsNeon] = useState(false);
  const [gameLoading, setGameLoading] = useState(true);
  const [preSelectionLocked, setPreSelectionLocked] = useState(false);
  const [discardAnimation, setDiscardAnimation] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [error, setError] = useState(false);
  const [preSelectedModifiers, setPreSelectedModifiers] = useState<{
    [key: number]: number[];
  }>({});
  const [hand, setHand] = useState<Card[]>([]);
  const [roundRewards, setRoundRewards] = useState<RoundRewards | undefined>(
    undefined
  );

  const [lockedSpecialCards, setLockedSpecialCards] = useState<Card[]>([]);
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

  const { modId, level } = useGameStore();

  const fetchGameConfig = async () => {
    if (modId) {
      const gameConfig = await getGameConfig(client, modId);
      if (gameConfig) {
        setMaxSpecialCards(gameConfig.maxSpecialCards);
        setMaxPowerUpSlots(gameConfig.maxPowerUpSlots);
      }
    }
  };

  const fetchCardsConfig = async () => {
    if (modId) {
      const modSpecialCards = await getModSpecialCardsId(client, modId);
      const modRageCards = await getModRageCardsId(client, modId);

      if (modSpecialCards) {
        const modCardsConfig: ModCardsConfig = {
          specialCardsIds: modSpecialCards,
          rageCardsIds: modRageCards,
        };
        setModCardsConfig(modCardsConfig);
      }
    }
  };

  const [nodeRound, setNodeRound] = useState<number>(0);

  useEffect(() => {
    getNode(client, gameId ?? 0, currentNodeId ?? 0).then((data) => {
      if ((rageCards.length ?? 0) > 0) {
        const rageRoundData = getRageNodeData(data);
        setNodeRound(rageRoundData.round);
      } else {
        setNodeRound(data);
      }
    });
  }, [gameId, currentNodeId, rageCards]);

  useEffect(() => {
    fetchGameConfig();
    fetchCardsConfig();
  }, [modId]);


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
  }, [client, account, gameId, level, currentNodeId]);

  const dojoSpecialCards = useCurrentSpecialCards();

  const specialCards =
    lockedSpecialCards.length > 0 ? lockedSpecialCards : dojoSpecialCards;

  //effects
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
    preSelectedModifiers,
    setPreSelectedModifiers,
    roundRewards,
    setRoundRewards,
    plays,
    playIsNeon,
    setPlayIsNeon,
    specialCards,
    setLockedSpecialCards,
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
    maxSpecialCards,
    maxPowerUpSlots,
    modCardsConfig,
    cardTransformationLock,
    setCardTransformationLock,
    nodeRound,
  };
};

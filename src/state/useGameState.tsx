import { useEffect, useState } from "react";
import { getPlayerPokerHands } from "../dojo/getPlayerPokerHands";
import { getNode } from "../dojo/queries/getNode";
import {
  getModRageCardsId,
  getModSpecialCardsId,
} from "../dojo/queries/useModCardsId";
import { useDojo } from "../dojo/useDojo";
import { Plays } from "../enums/plays";
import { LevelPokerHand } from "../types/LevelPokerHand";
import { ModCardsConfig } from "../types/ModConfig";
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

  const {
    id: gameId,
    setPoints,
    setMulti,
    resetMultiPoints,
    round: currentNodeId,
    rageCards,
  } = useGameStore();

  const { setPreSelectedPlay, preSelectedCards, hand } = useCurrentHandStore();
  const [playIsNeon, setPlayIsNeon] = useState(false);
  const [gameLoading, setGameLoading] = useState(true);
  const [discardAnimation, setDiscardAnimation] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [error, setError] = useState(false);
  const [preSelectedModifiers, setPreSelectedModifiers] = useState<{
    [key: number]: number[];
  }>({});
  const [roundRewards, setRoundRewards] = useState<RoundRewards | undefined>(
    undefined
  );

  const [plays, setPlays] = useState<LevelPokerHand[]>([]);
  const [destroyedSpecialCardId, setDestroyedSpecialCardId] =
    useState<number>();
  const [levelUpHand, setLevelUpHand] = useState<LevelUpPlayEvent>();

  const [specialSwitcherOn, setSpecialSwitcherOn] = useState(true);

  const [modCardsConfig, setModCardsConfig] = useState<ModCardsConfig>();

  const [cardTransformationLock, setCardTransformationLock] = useState(false);

  const { modId, level, specialCards } = useGameStore();

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
    fetchCardsConfig();
  }, [modId]);

  useEffect(() => {
    if (client && account) {
      getPlayerPokerHands(client, gameId).then((plays: any) => {
        if (plays != undefined) setPlays(plays);
      });
    }
  }, [client, account, gameId, level, currentNodeId]);

  //effects
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
      console.log("preselectedCards", preSelectedCards);
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

  return {
    gameId,
    gameLoading,
    setGameLoading,
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
    destroyedSpecialCardId,
    setDestroyedSpecialCardId,
    levelUpHand,
    setLevelUpHand,
    specialSwitcherOn,
    toggleSpecialSwitcher,
    showRages,
    showSpecials,
    modCardsConfig,
    cardTransformationLock,
    setCardTransformationLock,
    nodeRound,
  };
};

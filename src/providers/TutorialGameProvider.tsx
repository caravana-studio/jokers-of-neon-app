import React, { createContext, useContext, useEffect, useState } from "react";
import { IGameContext } from "./GameProvider"; // existing imports
import { Plays } from "../enums/plays";
import { Card } from "../types/Card";
import { SortBy } from "../enums/sortBy";
import {
  C10,
  C2,
  CA,
  CJ,
  CK,
  CQ,
  JOKER1,
  JOKER2,
} from "../utils/mocks/cardMocks";
import { useAudio } from "../hooks/useAudio";
import { preselectedCardSfx } from "../constants/sfx";
import { checkHand } from "../utils/checkHand";
import { useDojo } from "../dojo/useDojo";
import { getPlayerPokerHands } from "../dojo/getPlayerPokerHands";
import { LevelPokerHand } from "../dojo/typescript/models.gen";
import { getLSGameId } from "../dojo/utils/getLSGameId";

// Define your mock data specifically for the tutorial
const mockTutorialGameContext = createContext<IGameContext>({
  gameId: 1,
  preSelectedPlay: Plays.NONE,
  points: 0,
  multi: 0,
  executeCreateGame: () => console.log("Game created in tutorial"),
  gameLoading: false,
  preSelectedCards: [],
  setPreSelectedCards: (cards: number[]) => console.log("Set cards", cards),
  play: () => console.log("Played card"),
  hand: [C10, C2, JOKER1, JOKER2, CJ, CQ, CK, CA],
  setHand: (cards: Card[]) => console.log("Hand set", cards),
  getModifiers: (preSelectedCardIndex: number) => [],
  togglePreselected: (_) => {},
  discardAnimation: false,
  playAnimation: false,
  discard: () => console.log("Discarded"),
  discardEffectCard: () =>
    new Promise((resolve) => resolve({ success: false, cards: [] })),
  error: false,
  clearPreSelection: () => console.log("Cleared pre-selection"),
  preSelectedModifiers: {},
  addModifier: (cardIdx: number, modifierIdx: number) =>
    console.log("Modifier added", cardIdx, modifierIdx),
  roundRewards: undefined,
  sortBy: SortBy.RANK,
  toggleSortBy: () => console.log("Toggled sort"),
  onShopSkip: () => console.log("Skipped shop"),
  discardSpecialCard: async () => false,
  checkOrCreateGame: () => console.log("Game checked or created"),
  restartGame: () => console.log("Game restarted"),
  preSelectionLocked: false,
  score: 0,
  lockRedirection: false,
  specialCards: [],
  playIsNeon: false,
  isRageRound: false,
  setIsRageRound: () => console.log("Set rage round"),
  cash: 1000,
  setLockedCash: (_) => {},
  rageCards: [],
  setRageCards: (cards: Card[]) => console.log("Set rage cards", cards),
  discards: 1,
});

export let handsLeftTutorial = 1;
let context: IGameContext;

export const useTutorialGameContext = () => useContext(mockTutorialGameContext);

const TutorialGameProvider = ({ children }: { children: React.ReactNode }) => {
  const [plays, setPlays] = useState<LevelPokerHand[]>([]);
  const gameID = getLSGameId();

  const {
    setup: {
      client,
      account: { account },
    },
  } = useDojo();

  if (client && account && plays.length == 0) {
    getPlayerPokerHands(client, gameID).then((plays: any) => {
      if (plays != undefined) setPlays(plays);
    });
  }

  handsLeftTutorial = 1;
  const [preSelectionLocked, setPreSelectionLocked] = useState(false);
  const [preSelectedCards, setPreSelectedCards] = useState<number[]>([]);
  const [preSelectedPlay, setPreSelectedPlay] = useState<Plays>(Plays.NONE);
  const { play: preselectCardSound } = useAudio(preselectedCardSfx);
  const [points, setPoints] = useState(0);
  const [multi, setMulti] = useState(0);

  context = useTutorialGameContext();

  useEffect(() => {
    if (preSelectedCards.length > 0) {
      let play = checkHand(context.hand, preSelectedCards, [], []);
      setPreSelectedPlay(play);
      if (plays?.length != 0) {
        setMultiAndPoints(play);
      }
    } else {
      setPreSelectedPlay(Plays.NONE);
      resetMultiPoints();
    }
  }, [preSelectedCards]);

  const resetMultiPoints = () => {
    setPoints(0);
    setMulti(0);
  };

  const setMultiAndPoints = (play: Plays) => {
    const playerPokerHand = plays[play - 1];
    const multi =
      typeof playerPokerHand.multi === "number" ? playerPokerHand.multi : 0;
    const points =
      typeof playerPokerHand.points === "number" ? playerPokerHand.points : 0;
    setMulti(multi);
    setPoints(points);
  };

  const cardIsPreselected = (cardIndex: number) => {
    return preSelectedCards.filter((idx) => idx === cardIndex).length > 0;
  };

  const preSelectCard = (cardIndex: number) => {
    setPreSelectedCards((prev) => {
      return [...prev, cardIndex];
    });
  };

  const unPreSelectCard = (cardIndex: number) => {
    // setPreSelectedModifiers((prev) => {
    //   return {
    //     ...prev,
    //     [cardIndex]: [],
    //   };
    // });
    setPreSelectedCards((prev) => {
      return prev.filter((idx) => cardIndex !== idx);
    });
  };

  const togglePreselected = (cardIndex: number) => {
    if (!preSelectionLocked && handsLeftTutorial > 0) {
      if (cardIsPreselected(cardIndex)) {
        unPreSelectCard(cardIndex);
        preselectCardSound();
      } else if (preSelectedCards.length < 5) {
        preSelectCard(cardIndex);
        preselectCardSound();
      }
    }
  };

  context.preSelectedCards = preSelectedCards;
  context.preSelectedPlay = preSelectedPlay;
  context.points = points;
  context.multi = multi;

  const actions = { togglePreselected };

  return (
    <mockTutorialGameContext.Provider value={{ ...context, ...actions }}>
      {children}
    </mockTutorialGameContext.Provider>
  );
};

export default TutorialGameProvider;

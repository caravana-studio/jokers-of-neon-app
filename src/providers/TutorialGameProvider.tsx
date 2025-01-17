import React, { createContext, useEffect, useState } from "react";
import {
  discardSfx,
  multiSfx,
  pointsSfx,
  preselectedCardSfx,
} from "../constants/sfx";
import { getPlayerPokerHands } from "../dojo/getPlayerPokerHands";
import { useDojo } from "../dojo/useDojo";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy";
import { useAudio } from "../hooks/useAudio";
import { useGameState } from "../state/useGameState";
import { Card } from "../types/Card";
import { LevelPokerHand } from "../types/LevelPokerHand.ts";
import { checkHand } from "../utils/checkHand";
import {
  C5,
  C7,
  CA,
  CJ,
  CK,
  CQ,
  D10,
  D2,
  D4,
  D5,
  H10,
  H3,
  H7,
} from "../utils/mocks/cardMocks";
import { ClubModifier } from "../utils/mocks/modifierMocks";
import { m5, p25 } from "../utils/mocks/powerUpMocks.ts";
import { MultipliedClubs } from "../utils/mocks/specialCardMocks";
import { animatePlay } from "../utils/playEvents/animatePlay.ts";
import { sortCards } from "../utils/sortCards.ts";
import { useCardAnimations } from "./CardAnimationsProvider";
import { IGameContext, useGameContext } from "./GameProvider"; // existing imports
import { gameProviderDefaults } from "./gameProviderDefaults.ts";

export const mockTutorialGameContext = createContext<IGameContext>({
  ...gameProviderDefaults,
  gameId: 1,
  hand: [D2, H3, D5, H7, H10, CJ, CK, CA],
  score: 300,
  cash: 1000,
  discards: 1,
  sfxVolume: 100,
  powerUps: [m5, p25],
});

const emptyFn = () => {};

export let handsLeftTutorial = 3;
let context: IGameContext;

const TutorialGameProvider = ({ children }: { children: React.ReactNode }) => {
  const [plays, setPlays] = useState<LevelPokerHand[]>([]);
  const gameID = getLSGameId();
  const [hand, setHand] = useState<Card[]>([]);
  const [score, setScore] = useState<number>(0);
  const [indexEvent, setIndexEvent] = useState<number>(0);
  const [preSelectedModifiers, setPreSelectedModifiers] = useState<{
    [key: number]: number[];
  }>({});
  const state = useGameState();
  const [preselectedPowerUps, setPreselectedPowerUps] = useState<number[]>([]);

  const { setPlayIsNeon, setPlayAnimation } = state;

  const { setAnimatedCard, setAnimatedPowerUp } = useCardAnimations();

  const playAnimationDuration = Math.max(700 - 1 - 1 * 50, 400);
  const { play: preselectCardSound } = useAudio(preselectedCardSfx);
  const { play: discardSound } = useAudio(discardSfx, 4);
  const { play: pointsSound } = useAudio(pointsSfx);
  const { play: multiSound } = useAudio(multiSfx);

  const c7 = C7;
  c7.idx = D2.idx;
  c7.id = D2.id;

  const c5 = C5;
  c5.idx = H3.idx;
  c5.id = H3.id;

  const cq = CQ;
  cq.id = c7.id;
  cq.idx = c7.idx;

  const cm = ClubModifier;
  cm.id = H7.id;
  cm.idx = H7.idx;

  const d4 = D4;
  d4.id = c5.id;
  d4.idx = c5.idx;

  const d10 = D10;
  d10.id = D5.id;
  d10.idx = D5.idx;

  const cards: Card[] = [c7, c5];

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

  const [preSelectionLocked, setPreSelectionLocked] = useState(false);
  const [preSelectedCards, setPreSelectedCards] = useState<number[]>([]);
  const [preSelectedPlay, setPreSelectedPlay] = useState<Plays>(Plays.NONE);
  const [points, setPoints] = useState(0);
  const [multi, setMulti] = useState(0);
  const [discards, setDiscards] = useState(1);

  context = useGameContext();

  useEffect(() => {
    if (preSelectedCards.length > 0) {
      let play = checkHand(
        context.hand,
        preSelectedCards,
        [],
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
  }, [preSelectedCards, [preSelectedModifiers]]);

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

  const getModifiers = (preSelectedCardIndex: number) => {
    const modifierIndexes = preSelectedModifiers[preSelectedCardIndex];

    return (
      modifierIndexes?.map((modifierIdx) => {
        return hand.find((c) => c.idx === modifierIdx)!;
      }) ?? []
    );
  };

  const cardIsPreselected = (cardIndex: number) => {
    return preSelectedCards.filter((idx) => idx === cardIndex).length > 0;
  };

  const preSelectCard = (cardIndex: number) => {
    if (!preSelectedCards.includes(cardIndex) && preSelectedCards.length < 7) {
      setPreSelectedCards((prev) => {
        return [...prev, cardIndex];
      });
    }
  };

  const unPreSelectPowerUp = (powerUpIdx: number) => {
    setPreselectedPowerUps((prev) => {
      return prev.filter((idx) => powerUpIdx !== idx);
    });
  };

  const powerUpIsPreselected = (powerUpId: number) => {
    return preselectedPowerUps.filter((idx) => idx === powerUpId).length > 0;
  };

  const preSelectPowerUp = (powerUpIdx: number) => {
    if (!preselectedPowerUps.includes(powerUpIdx)) {
      setPreselectedPowerUps((prev) => {
        return [...prev, powerUpIdx];
      });
    }
  };

  const togglePreselectedPowerUp = (powerUpIdx: number) => {
    if (!preSelectionLocked) {
      if (powerUpIsPreselected(powerUpIdx)) {
        unPreSelectPowerUp(powerUpIdx);
        preselectCardSound();
      } else if (preselectedPowerUps.length < 5) {
        preSelectPowerUp(powerUpIdx);
        preselectCardSound();
      }
    }
  };

  const addModifier = (cardIdx: number, modifierIdx: number) => {
    const modifiers = preSelectedModifiers[cardIdx] ?? [];

    if (modifiers.length < 1) {
      const newModifiers = [...modifiers, modifierIdx];
      setPreSelectedModifiers((prev) => {
        return {
          ...prev,
          [cardIdx]: newModifiers,
        };
      });
    }
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

  const discard = () => {
    discardSound();
    replaceCards(cards);
    clearPreSelection();
    setDiscards(discards - 1);
  };

  const eventFlush = {
    play: {
      multi: 1,
      points: 0,
    },
    cardScore: [
      {
        idx: 34,
        multi: 0,
        points: 10,
      },
      {
        idx: 9,
        multi: 0,
        points: 10,
      },
      {
        idx: c7.idx,
        multi: 0,
        points: 10,
      },
      {
        idx: 11,
        multi: 0,
        points: 10,
      },
      {
        idx: 12,
        multi: 0,
        points: 11,
      },
    ],
    specialCards: [
      {
        special_idx: 301,
        idx: 34,
        multi: 2,
      },
      {
        special_idx: 301,
        idx: 9,
        multi: 2,
      },
      {
        special_idx: 301,
        idx: c7.idx,
        multi: 2,
      },
      {
        special_idx: 301,
        idx: 11,
        multi: 2,
      },
      {
        special_idx: 301,
        idx: 12,
        multi: 2,
      },
    ],
    gameOver: false,
    specialSuitEvents: [],
    globalEvents: [],
    modifierSuitEvents: [{ idx: 34, suit: 1 }],
    cards: [],
    score: 5200,
    cashEvents: [],
    powerUpEvents: [],
  };

  const eventPair = {
    play: {
      multi: 1,
      points: 0,
    },
    cardScore: [
      { idx: c7.idx, multi: 0, points: 7 },
      { idx: 31, multi: 0, points: 7 },
    ],
    specialCards: [
      {
        special_idx: 301,
        idx: c7.idx,
        multi: 2,
      },
    ],
    gameOver: false,
    specialSuitEvents: [],
    globalEvents: [],
    modifierSuitEvents: [],
    cards: [cq, cm],
    score: 96,
    cashEvents: [],
  };

  const eventPairPowerUps = {
    play: {
      multi: 1,
      points: 0,
    },
    cardScore: [
      { idx: c5.idx, multi: 0, points: 5 },
      { idx: D5.idx, multi: 0, points: 5 },
    ],
    specialCards: [
      {
        special_idx: 301,
        idx: c5.idx,
        multi: 2,
      },
    ],
    gameOver: false,
    specialSuitEvents: [],
    globalEvents: [],
    modifierSuitEvents: [],
    cards: [d4, d10],
    score: 96,
    cashEvents: [],
    powerUpEvents: [
      {
        idx: 0,
        points: 0,
        multi: 5,
      },
      {
        idx: 1,
        points: 25,
        multi: 0,
      },
    ],
  };

  const events = [eventPair, eventPairPowerUps, eventFlush];

  const play = () => {
    animatePlay({
      playEvents: events[indexEvent],
      playAnimationDuration,
      setPlayIsNeon,
      setAnimatedCard,
      setAnimatedPowerUp,
      pointsSound,
      multiSound,
      negativeMultiSound: emptyFn,
      cashSound: emptyFn,
      setPoints,
      setMulti,
      setHand,
      setPlayAnimation,
      setPreSelectionLocked,
      setLockedScore: emptyFn,
      setLockedSpecialCards: emptyFn,
      setLockedCash: emptyFn,
      clearPreSelection,
      removePowerUp: emptyFn,
      preselectedPowerUps,
      navigate: emptyFn,
      gameId: 0,
      setLockRedirection: emptyFn,
      setRoundRewards: emptyFn,
      replaceCards,
      handsLeft: 1,
      setAnimateSecondChanceCard: emptyFn,
    });
    setIndexEvent(indexEvent + 1);
    handsLeftTutorial -= 1;
  };

  const clearPreSelection = () => {
    resetMultiPoints();
    setPreSelectedCards([]);
    let powerUpLeft = context.powerUps;
    powerUpLeft = powerUpLeft.filter(
      (powerUp) => !preselectedPowerUps.includes(powerUp?.idx ?? 0)
    );
    context.powerUps = powerUpLeft;
  };

  const replaceCards = (cards: Card[]) => {
    const newHand = context.hand
      ?.map((card) => {
        const newCard = cards.find((c) => c.idx === card.idx);
        if (newCard) {
          return newCard;
        } else {
          return card;
        }
      })
      .filter((card) => card.card_id !== 9999);

    setHand(sortCards(newHand, SortBy.RANK));
  };

  context.preSelectedCards = preSelectedCards;
  context.preSelectedPlay = preSelectedPlay;
  context.points = points;
  context.multi = multi;
  context.score = score;
  context.specialCards = [MultipliedClubs];
  context.preSelectedModifiers = preSelectedModifiers;
  context.discards = discards;

  if (hand.length > 0) context.hand = hand;

  const actions = {
    togglePreselected,
    discard,
    play,
    preSelectCard,
    unPreSelectCard,
    addModifier,
    getModifiers,
    powerUpIsPreselected,
    togglePreselectedPowerUp,
  };

  return (
    <mockTutorialGameContext.Provider value={{ ...context, ...actions }}>
      {children}
    </mockTutorialGameContext.Provider>
  );
};

export default TutorialGameProvider;

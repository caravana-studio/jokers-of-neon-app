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
import { PlayEvents } from "../types/ScoreData";
import { changeCardSuit } from "../utils/changeCardSuit";
import { checkHand } from "../utils/checkHand";
import {
  C5,
  C7,
  CA,
  CJ,
  CK,
  CQ,
  D2,
  D5,
  H10,
  H3,
  H7,
} from "../utils/mocks/cardMocks";
import { ClubModifier } from "../utils/mocks/modifierMocks";
import { MultipliedClubs } from "../utils/mocks/specialCardMocks";
import { sortCards } from "../utils/sortCards.ts";
import { useCardAnimations } from "./CardAnimationsProvider";
import { IGameContext, useGameContext } from "./GameProvider"; // existing imports
import { gameProviderDefaults } from "./gameProviderDefaults.ts";
import { LevelPokerHand } from "../types/LevelPokerHand.ts";
import { m5, p25 } from "../utils/mocks/powerUpMocks.ts";

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

export let handsLeftTutorial = 1;
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
  c7.idx = D5.idx;
  c7.id = D5.id;

  const c5 = C5;
  c5.idx = H3.idx;
  c5.id = H3.id;

  const cq = CQ;
  cq.id = c7.id;
  cq.idx = c7.idx;

  const cm = ClubModifier;
  cm.id = H7.id;
  cm.idx = H7.idx;

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

  handsLeftTutorial = 1;
  const [preSelectionLocked, setPreSelectionLocked] = useState(false);
  const [preSelectedCards, setPreSelectedCards] = useState<number[]>([]);
  const [preSelectedPlay, setPreSelectedPlay] = useState<Plays>(Plays.NONE);
  const [points, setPoints] = useState(0);
  const [multi, setMulti] = useState(0);

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

  const animatePlay = (playEvents: PlayEvents) => {
    const calculateDuration = (
      events?: any[],
      baseDuration = playAnimationDuration,
      multiplier = 1
    ) => (events?.length ?? 0) * baseDuration * multiplier;

    if (playEvents) {
      const NEON_PLAY_DURATION = playEvents.neonPlayEvent
        ? playAnimationDuration
        : 0;
      const MODIFIER_SUIT_CHANGE_DURATION =
        (playEvents.modifierSuitEvents?.length ?? 0) * playAnimationDuration;
      const SPECIAL_SUIT_CHANGE_DURATION =
        (playEvents.specialSuitEvents?.length ?? 0) * playAnimationDuration;
      const GLOBAL_BOOSTER_DURATION =
        (playEvents.globalEvents?.length ?? 0) * playAnimationDuration * 2;
      const LEVEL_BOOSTER_DURATION = playEvents.levelEvent
        ? playAnimationDuration * 2
        : 0;
      const COMMON_CARDS_DURATION =
        playAnimationDuration * playEvents.cardScore.length;
      const CASH_DURATION =
        playAnimationDuration * (playEvents.cashEvents?.length ?? 0);
      const SPECIAL_CARDS_DURATION =
        playAnimationDuration * (playEvents.specialCards?.length ?? 0);

      const POWER_UP_DURATION = calculateDuration(playEvents.powerUpEvents);

      const ALL_CARDS_DURATION =
        NEON_PLAY_DURATION +
        MODIFIER_SUIT_CHANGE_DURATION +
        SPECIAL_SUIT_CHANGE_DURATION +
        LEVEL_BOOSTER_DURATION +
        GLOBAL_BOOSTER_DURATION +
        COMMON_CARDS_DURATION +
        SPECIAL_CARDS_DURATION +
        CASH_DURATION +
        POWER_UP_DURATION +
        500;

      const handlePowerUps = () => {
        playEvents.powerUpEvents?.forEach((event, index) => {
          setTimeout(() => {
            const { idx, points, multi } = event;
            console.log(event);

            setAnimatedPowerUp({
              idx,
              points,
              multi,
              animationIndex: 250 + index,
            });

            if (points) {
              pointsSound();
              setPoints((prev) => prev + points);
            }

            if (multi) {
              multiSound();
              setMulti((prev) => prev + multi);
            }
          }, playAnimationDuration * index);
        });
      };

      setPreSelectionLocked(true);

      if (playEvents.powerUpEvents) {
        handlePowerUps();
      }

      if (playEvents.neonPlayEvent) {
        setPlayIsNeon(true);

        setAnimatedCard({
          animationIndex: -1,
          suit: 5,
          idx: playEvents.neonPlayEvent.neon_cards_idx,
        });
        pointsSound();
        playEvents.neonPlayEvent.points &&
          setPoints(playEvents.neonPlayEvent.points);
        multiSound();
        playEvents.neonPlayEvent.multi &&
          setMulti(playEvents.neonPlayEvent.multi);
      }

      if (playEvents.modifierSuitEvents) {
        playEvents.modifierSuitEvents.forEach((event, index) => {
          setTimeout(
            () => {
              pointsSound();
              setAnimatedCard({
                suit: event.suit,
                idx: [event.idx],
                animationIndex: index,
              });
              setHand((prev) => {
                const newHand = prev?.map((card) => {
                  if (event.idx === card.idx) {
                    return {
                      ...card,
                      suit: event.suit,
                      img: `${changeCardSuit(card.card_id!, event.suit)}.png`,
                    };
                  }
                  return card;
                });
                return newHand;
              });
            },
            playAnimationDuration * index + NEON_PLAY_DURATION
          );
        });
      }

      setTimeout(() => {
        if (playEvents.specialSuitEvents) {
          playEvents.specialSuitEvents.forEach((event, index) => {
            pointsSound();
            setAnimatedCard({
              suit: event.suit,
              special_idx: event.special_idx,
              idx: event.idx,
              animationIndex: 10 + index,
            });
            setHand((prev) => {
              const newHand = prev?.map((card) => {
                if (event.idx.includes(card.idx)) {
                  return {
                    ...card,
                    // img: `${changeCardSuit(card.card_id!, event.suit)}.png`,
                  };
                }
                return card;
              });
              return newHand;
            });
          });
        }

        setTimeout(() => {
          //global boosters
          if (playEvents.globalEvents) {
            playEvents.globalEvents.forEach((event, index) => {
              setTimeout(() => {
                const { special_idx, multi, points } = event;
                if (points) {
                  pointsSound();
                  setAnimatedCard({
                    special_idx,
                    points,
                    animationIndex: 20 + index,
                  });
                  setPoints((prev) => prev + points);
                }
                if (multi) {
                  setTimeout(() => {
                    multiSound();
                    //animate multi
                    setAnimatedCard({
                      special_idx,
                      multi,
                      animationIndex: 31 + index,
                    });
                    setMulti((prev) => prev + multi);
                  }, playAnimationDuration);
                }
              }, playAnimationDuration * index);
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
                pointsSound();
                setAnimatedCard({
                  special_idx,
                  points: eventPoints - points,
                  animationIndex: 31,
                });
                setPoints(eventPoints);
              }
              if (eventMulti) {
                multiSound();
                setTimeout(() => {
                  //animate multi
                  setAnimatedCard({
                    special_idx,
                    multi: eventMulti - multi,
                    animationIndex: 41,
                  });
                  setMulti(eventMulti);
                }, playAnimationDuration);
              }
            }

            setTimeout(() => {
              //traditional cards and modifiers
              playEvents.cardScore.forEach((card, index) => {
                setTimeout(() => {
                  const { idx, points, multi } = card;

                  setAnimatedCard({
                    idx: [idx],
                    points,
                    multi,
                    animationIndex: 50 + index,
                  });
                  if (points) pointsSound();
                  points && setPoints((prev) => prev + points);
                  if (multi) multiSound();
                  multi && setMulti((prev) => prev + multi);
                }, playAnimationDuration * index);
              });

              // cash events
              setTimeout(() => {
                playEvents.cashEvents?.forEach((event, index) => {
                  setTimeout(() => {
                    const { idx, special_idx, cash } = event;
                    setAnimatedCard({
                      idx: [idx],
                      special_idx,
                      cash,
                      animationIndex: 60 + index,
                    });
                  }, playAnimationDuration * index);
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
                        animationIndex: 70 + index,
                      });
                      if (points) pointsSound();
                      points && setPoints((prev) => prev + points);
                      if (multi) multiSound();
                      multi && setMulti((prev) => prev + multi);
                    }, playAnimationDuration * index);
                  });
                }, CASH_DURATION);
              }, COMMON_CARDS_DURATION);
            }, LEVEL_BOOSTER_DURATION);
          }, GLOBAL_BOOSTER_DURATION);
        }, SPECIAL_SUIT_CHANGE_DURATION);
      }, MODIFIER_SUIT_CHANGE_DURATION + NEON_PLAY_DURATION);

      setTimeout(() => {
        setPlayAnimation(true);
      }, ALL_CARDS_DURATION);

      setTimeout(() => {
        setAnimatedCard(undefined);
        // setLockedScore(undefined);

        setPlayAnimation(false);
        clearPreSelection();
        setPreSelectionLocked(false);
        setPlayIsNeon(false);
        playEvents.cards && replaceCards(playEvents.cards);
        setScore(playEvents.score);
      }, ALL_CARDS_DURATION + 500);
    }
  };

  const discard = () => {
    discardSound();
    replaceCards(cards);
    clearPreSelection();
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
        idx: 16,
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
        idx: 16,
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

  const eventPair = {
    play: {
      multi: 1,
      points: 0,
    },
    cardScore: [
      { idx: 16, multi: 0, points: 7 },
      { idx: 31, multi: 0, points: 7 },
    ],
    specialCards: [
      {
        special_idx: 301,
        idx: 16,
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

  const events = [eventPair, eventFlush];

  const play = () => {
    animatePlay(events[indexEvent]);
    setIndexEvent(indexEvent + 1);
  };

  const clearPreSelection = () => {
    resetMultiPoints();
    setPreSelectedCards([]);
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

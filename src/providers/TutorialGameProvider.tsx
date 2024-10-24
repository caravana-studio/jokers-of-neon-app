import React, { createContext, useContext, useEffect, useState } from "react";
import { IGameContext } from "./GameProvider"; // existing imports
import { Plays } from "../enums/plays";
import { Card } from "../types/Card";
import { SortBy } from "../enums/sortBy";
import {
  CA,
  CJ,
  CK,
  CQ,
  D2,
  D5,
  H10,
  H3,
  H7,
  JOKER1,
} from "../utils/mocks/cardMocks";
import { useAudio } from "../hooks/useAudio";
import {
  discardSfx,
  multiSfx,
  pointsSfx,
  preselectedCardSfx,
} from "../constants/sfx";
import { checkHand } from "../utils/checkHand";
import { useDojo } from "../dojo/useDojo";
import { getPlayerPokerHands } from "../dojo/getPlayerPokerHands";
import { LevelPokerHand } from "../dojo/typescript/models.gen";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { PlayEvents } from "../types/ScoreData";
import { useGameState } from "../state/useGameState";
import { useCardAnimations } from "./CardAnimationsProvider";

// Define your mock data specifically for the tutorial
const mockTutorialGameContext = createContext<IGameContext>({
  gameId: 1,
  preSelectedPlay: Plays.NONE,
  points: 0,
  multi: 0,
  executeCreateGame: () => {},
  gameLoading: false,
  preSelectedCards: [],
  setPreSelectedCards: (cards: number[]) => {},
  play: () => {},
  hand: [H10, D2, H7, D5, CJ, H3, CK, CA],
  setHand: (cards: Card[]) => console.log("Hand set", cards),
  getModifiers: (preSelectedCardIndex: number) => [],
  togglePreselected: (_) => {},
  discardAnimation: false,
  playAnimation: false,
  discard: () => {},
  discardEffectCard: () =>
    new Promise((resolve) => resolve({ success: false, cards: [] })),
  error: false,
  clearPreSelection: () => {},
  preSelectedModifiers: {},
  addModifier: (cardIdx: number, modifierIdx: number) => {},
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
  preSelectCard: () => {},
  unPreSelectCard: () => {},
});

export let handsLeftTutorial = 1;
let context: IGameContext;

export const useTutorialGameContext = () => useContext(mockTutorialGameContext);

const TutorialGameProvider = ({ children }: { children: React.ReactNode }) => {
  const [plays, setPlays] = useState<LevelPokerHand[]>([]);
  const gameID = getLSGameId();
  const [hand, setHand] = useState<Card[]>([]);
  const state = useGameState();

  const { setPlayIsNeon, setPlayAnimation } = state;

  const { setAnimatedCard } = useCardAnimations();

  const playAnimationDuration = Math.max(700 - 1 - 1 * 50, 400);
  const { play: preselectCardSound } = useAudio(preselectedCardSfx);
  const { play: discardSound } = useAudio(discardSfx, 4);
  const { play: pointsSound } = useAudio(pointsSfx);
  const { play: multiSound } = useAudio(multiSfx);

  const cq = CQ;
  cq.idx = D2.idx;
  cq.id = D2.id;

  const joker = JOKER1;
  joker.idx = H10.idx;
  joker.id = H10.id;

  const cards: Card[] = [cq, joker];

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

  const animatePlay = (playEvents: PlayEvents) => {
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
      const ALL_CARDS_DURATION =
        NEON_PLAY_DURATION +
        MODIFIER_SUIT_CHANGE_DURATION +
        SPECIAL_SUIT_CHANGE_DURATION +
        LEVEL_BOOSTER_DURATION +
        GLOBAL_BOOSTER_DURATION +
        COMMON_CARDS_DURATION +
        SPECIAL_CARDS_DURATION +
        CASH_DURATION +
        500;

      setPreSelectionLocked(true);

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
                      // img: `${changeCardSuit(card.card_id!, event.suit)}.png`,
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
        // handsLeft > 0 && setPreSelectionLocked(false);
        setPlayIsNeon(false);
        // setLockedSpecialCards([]);
        // if (playEvents.gameOver) {
        //   console.log("GAME OVER");
        //   setTimeout(() => {
        //     navigate(`/gameover/${gameId}`);
        //     setLockRedirection(false);
        //   }, 1000);
        // } else if (playEvents.levelPassed && playEvents.detailEarned) {
        //   const { level } = playEvents.levelPassed;
        //   setTimeout(() => {
        //     setRoundRewards({
        //       ...playEvents.detailEarned!,
        //       level: level,
        //     });
        //     navigate("/rewards");
        //   }, 1000);
        //   setPreSelectionLocked(true);
        // } else {
        //   setLockedCash(undefined);
        //   playEvents.cards && replaceCards(playEvents.cards);
        //   setRoundRewards(undefined);
        //   setLockRedirection(false);
        // }
      }, ALL_CARDS_DURATION + 500);
    }
  };

  const discard = () => {
    replaceCards(cards);
    clearPreSelection();
  };

  const event = {
    play: {
      multi: 1,
      points: 0,
    },
    cardScore: [
      {
        idx: 9,
        multi: 0,
        points: 10,
      },
      {
        idx: 13,
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
      {
        idx: 34,
        multi: 0,
        points: 100,
      },
      {
        idx: 1,
        multi: 1,
        points: 0,
      },
    ],
    specialCards: [],
    gameOver: false,
    specialSuitEvents: [],
    globalEvents: [],
    modifierSuitEvents: [],
    cards: [],
    score: 3630,
    cashEvents: [],
  };

  const play = () => {
    animatePlay(event);
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

    setHand(newHand);
  };

  context.preSelectedCards = preSelectedCards;
  context.preSelectedPlay = preSelectedPlay;
  context.points = points;
  context.multi = multi;
  if (hand.length > 0) context.hand = hand;

  const actions = {
    togglePreselected,
    discard,
    play,
    preSelectCard,
    unPreSelectCard,
  };

  return (
    <mockTutorialGameContext.Provider value={{ ...context, ...actions }}>
      {children}
    </mockTutorialGameContext.Provider>
  );
};

export default TutorialGameProvider;

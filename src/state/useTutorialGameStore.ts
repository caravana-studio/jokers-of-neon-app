// import { create } from "zustand";
// import { Card } from "../types/Card";
// import { LevelPokerHand } from "../types/LevelPokerHand.ts";
// import { Plays } from "../enums/plays";
// import {
//   HAND_1,
//   HAND_2,
//   EVENT_PAIR,
//   EVENT_PAIR_POWER_UPS,
//   EVENT_FLUSH,
// } from "../utils/mocks/tutorialMocks.ts";
// import { m5, p25 } from "../utils/mocks/powerUpMocks.ts";
// import { checkHand } from "../utils/checkHand";
// import { MultipliedClubs } from "../utils/mocks/specialCardMocks.ts";
// import { sortCards } from "../utils/sortCards.ts";
// import { SortBy } from "../enums/sortBy.ts";
// import { PowerUp } from "../types/Powerup/PowerUp.ts";

// const TUTORIAL_EVENTS = [EVENT_PAIR, EVENT_PAIR_POWER_UPS, EVENT_FLUSH];
// const MAX_PRESELECTED_CARDS = 5;

// interface TutorialGameState {
//   hand: Card[];
//   discards: number;
//   powerUps: PowerUp[];
//   specialCards: Card[];
//   score: number;
//   plays: LevelPokerHand[];
//   remainingPlaysTutorial: number;
//   indexEvent: number;
//   preSelectedCards: number[];
//   preSelectedModifiers: { [key: number]: number[] };
//   preSelectedPowerUps: number[];
//   preSelectionLocked: boolean;
//   preSelectedPlay: Plays;
//   points: number;
//   multi: number;
// }

// interface TutorialGameActions {
//   setHand: (hand: Card[]) => void;
//   setScore: (score: number) => void;
//   setPlays: (plays: LevelPokerHand[]) => void;
//   togglePreselected: (cardIndex: number) => boolean;
//   preSelectCard: (cardIndex: number) => void; // Added
//   unPreSelectCard: (cardIndex: number) => void; // Added
//   togglePreselectedPowerUp: (powerUpIdx: number) => void;
//   addModifier: (cardIdx: number, modifierIdx: number) => void;
//   clearPreSelection: () => void;
//   getModifiers: (preSelectedCardIndex: number) => Card[];
//   cardIsPreselected: (cardIndex: number) => boolean;
//   powerUpIsPreselected: (powerUpId: number) => boolean;
//   discard: () => void;
//   play: () => { event: any; newScore: number };
//   _updatePreSelectedPlay: () => void;
// }

// export const useTutorialGameStore = create<
//   TutorialGameState & TutorialGameActions
// >((set, get) => ({
//   hand: HAND_1,
//   discards: 1,
//   powerUps: [m5, p25],
//   specialCards: [MultipliedClubs],
//   score: 0,
//   plays: [],
//   remainingPlaysTutorial: 3,
//   indexEvent: 0,
//   preSelectedCards: [],
//   preSelectedModifiers: {},
//   preSelectedPowerUps: [],
//   preSelectionLocked: false,
//   preSelectedPlay: Plays.NONE,
//   points: 0,
//   multi: 0,

//   setHand: (hand) => set({ hand: sortCards(hand, SortBy.RANK) }),
//   setScore: (score) => set({ score }),
//   setPlays: (plays) => set({ plays }),

//   _updatePreSelectedPlay: () => {
//     const { hand, preSelectedCards, preSelectedModifiers, plays } = get();
//     if (preSelectedCards.length > 0) {
//       const play = checkHand(hand, preSelectedCards, [], preSelectedModifiers);
//       set({ preSelectedPlay: play });

//       if (plays?.length > 0 && play !== Plays.NONE) {
//         const playerPokerHand = plays[play - 1];
//         const multi =
//           typeof playerPokerHand?.multi === "number"
//             ? playerPokerHand.multi
//             : 0;
//         const points =
//           typeof playerPokerHand?.points === "number"
//             ? playerPokerHand.points
//             : 0;
//         set({ multi, points });
//       } else {
//         set({ points: 0, multi: 0 });
//       }
//     } else {
//       set({ preSelectedPlay: Plays.NONE, points: 0, multi: 0 });
//     }
//   },

//   cardIsPreselected: (cardIndex) => get().preSelectedCards.includes(cardIndex),

//   powerUpIsPreselected: (powerUpId) =>
//     get().preSelectedPowerUps.includes(powerUpId),

//   unPreSelectCard: (cardIndex: number) => {
//     set((state) => ({
//       preSelectedCards: state.preSelectedCards.filter(
//         (idx) => idx !== cardIndex
//       ),
//       preSelectedModifiers: { ...state.preSelectedModifiers, [cardIndex]: [] },
//     }));
//     get()._updatePreSelectedPlay();
//   },

//   preSelectCard: (cardIndex: number) => {
//     const { preSelectedCards } = get();
//     if (
//       !preSelectedCards.includes(cardIndex) &&
//       preSelectedCards.length < MAX_PRESELECTED_CARDS
//     ) {
//       set({
//         preSelectedCards: [...preSelectedCards, cardIndex],
//       });
//       get()._updatePreSelectedPlay();
//     }
//   },

//   togglePreselected: (cardIndex) => {
//     const {
//       preSelectionLocked,
//       remainingPlaysTutorial,
//       cardIsPreselected,
//       preSelectedCards,
//     } = get();
//     if (preSelectionLocked || remainingPlaysTutorial <= 0) return false;

//     let selectionChanged = false;
//     if (cardIsPreselected(cardIndex)) {
//       get().unPreSelectCard(cardIndex);
//       selectionChanged = true;
//     } else if (preSelectedCards.length < MAX_PRESELECTED_CARDS) {
//       get().preSelectCard(cardIndex);
//       selectionChanged = true;
//     }

//     return selectionChanged;
//   },

//   togglePreselectedPowerUp: (powerUpIdx) => {
//     const { preSelectionLocked, powerUpIsPreselected, preSelectedPowerUps } =
//       get();
//     if (preSelectionLocked) return;

//     if (powerUpIsPreselected(powerUpIdx)) {
//       set((state) => ({
//         preSelectedPowerUps: state.preSelectedPowerUps.filter(
//           (idx) => idx !== powerUpIdx
//         ),
//       }));
//     } else if (preSelectedPowerUps.length < 5) {
//       set((state) => ({
//         preSelectedPowerUps: [...state.preSelectedPowerUps, powerUpIdx],
//       }));
//     }
//   },

//   addModifier: (cardIdx, modifierIdx) => {
//     set((state) => {
//       const modifiers = state.preSelectedModifiers[cardIdx] ?? [];
//       if (modifiers.length < 1) {
//         return {
//           preSelectedModifiers: {
//             ...state.preSelectedModifiers,
//             [cardIdx]: [...modifiers, modifierIdx],
//           },
//         };
//       }
//       return {};
//     });
//     get()._updatePreSelectedPlay();
//   },

//   getModifiers: (preSelectedCardIndex) => {
//     const { preSelectedModifiers, hand } = get();
//     const modifierIndexes = preSelectedModifiers[preSelectedCardIndex];
//     return (
//       modifierIndexes?.map(
//         (modifierIdx) => hand.find((c) => c.idx === modifierIdx)!
//       ) ?? []
//     );
//   },

//   clearPreSelection: () => {
//     const { preSelectedPowerUps, powerUps } = get();
//     const powerUpsLeft = powerUps.filter(
//       (powerUp) => !preSelectedPowerUps.includes(powerUp?.idx ?? 0)
//     );

//     set({
//       preSelectedCards: [],
//       preSelectedModifiers: {},
//       preSelectedPowerUps: [],
//       preSelectedPlay: Plays.NONE,
//       points: 0,
//       multi: 0,
//       powerUps: powerUpsLeft,
//     });
//   },

//   discard: () => {
//     const { discards } = get();
//     if (discards > 0) {
//       set({
//         hand: HAND_2,
//         discards: discards - 1,
//       });
//       get().clearPreSelection();
//     }
//   },

//   play: () => {
//     const { indexEvent, remainingPlaysTutorial } = get();
//     const event = TUTORIAL_EVENTS[indexEvent];
//     const newScore = event.score;

//     set({
//       score: newScore,
//       indexEvent: indexEvent + 1,
//       remainingPlaysTutorial: remainingPlaysTutorial - 1,
//     });

//     return { event, newScore };
//   },
// }));

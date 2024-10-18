import React, { createContext, useContext } from "react";
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

// Define your mock data specifically for the tutorial
const mockTutorialGameContext = createContext<IGameContext>({
  gameId: 1,
  preSelectedPlay: Plays.NONE,
  points: 50,
  multi: 2,
  executeCreateGame: () => console.log("Game created in tutorial"),
  gameLoading: false,
  preSelectedCards: [],
  setPreSelectedCards: (cards: number[]) => console.log("Set cards", cards),
  play: () => console.log("Played card"),
  hand: [C10, C2, JOKER1, JOKER2, CJ, CQ, CK, CA],
  setHand: (cards: Card[]) => console.log("Hand set", cards),
  getModifiers: (preSelectedCardIndex: number) => [],
  togglePreselected: (cardIndex: number) =>
    console.log("Toggled card", cardIndex),
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
  score: 150,
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

export const useTutorialGameContext = () => useContext(mockTutorialGameContext);

// Create a provider for the tutorial mock
const TutorialGameProvider = ({ children }: { children: React.ReactNode }) => {
  const handsLeft = 1;
  const discardLetf = 1;
  return (
    <mockTutorialGameContext.Provider value={useTutorialGameContext()}>
      {children}
    </mockTutorialGameContext.Provider>
  );
};

export default TutorialGameProvider;

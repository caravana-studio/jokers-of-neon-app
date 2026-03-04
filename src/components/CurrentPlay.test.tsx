/* @vitest-environment jsdom */

import { ChakraProvider } from "@chakra-ui/react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { Plays } from "../enums/plays";
import { PokerHandEnum } from "../types/LevelPokerHand";
import { useCurrentHandStore } from "../state/useCurrentHandStore";
import { useGameStore } from "../state/useGameStore";
import { C9, D7, H7 } from "../utils/mocks/cardMocks";
import { CurrentPlay } from "./CurrentPlay";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../theme/responsiveSettings", () => ({
  useResponsiveValues: () => ({
    isSmallScreen: false,
  }),
}));

const createPlays = () => [
  { poker_hand: PokerHandEnum.RoyalFlush, level: 1, points: 300, multi: 12 },
  { poker_hand: PokerHandEnum.StraightFlush, level: 1, points: 250, multi: 10 },
  { poker_hand: PokerHandEnum.FiveOfAKind, level: 1, points: 220, multi: 9 },
  { poker_hand: PokerHandEnum.FourOfAKind, level: 1, points: 180, multi: 8 },
  { poker_hand: PokerHandEnum.FullHouse, level: 1, points: 140, multi: 7 },
  { poker_hand: PokerHandEnum.Straight, level: 1, points: 120, multi: 6 },
  { poker_hand: PokerHandEnum.Flush, level: 1, points: 110, multi: 5 },
  { poker_hand: PokerHandEnum.ThreeOfAKind, level: 1, points: 100, multi: 4 },
  { poker_hand: PokerHandEnum.TwoPair, level: 1, points: 90, multi: 3 },
  { poker_hand: PokerHandEnum.OnePair, level: 1, points: 80, multi: 2 },
  { poker_hand: PokerHandEnum.HighCard, level: 1, points: 50, multi: 1 },
];

const gameStoreSnapshot = useGameStore.getState();
const currentHandStoreSnapshot = useCurrentHandStore.getState();

afterEach(() => {
  cleanup();
  useGameStore.setState(gameStoreSnapshot);
  useCurrentHandStore.setState(currentHandStoreSnapshot);
});

const renderCurrentPlay = async () => {
  await act(async () => {
    render(
      <ChakraProvider>
        <CurrentPlay />
      </ChakraProvider>
    );
  });
};

test("CurrentPlay does not reset counters while a play is locked", async () => {
  useGameStore.setState({
    points: 0,
    multi: 0,
    plays: createPlays(),
    specialCards: [],
    debuffedPlayerHands: [],
  });
  useCurrentHandStore.setState({
    hand: [H7, D7, C9],
    preSelectedCards: [H7.idx, D7.idx, C9.idx],
    preSelectedModifiers: {},
    preSelectionLocked: false,
    preSelectedPlay: Plays.NONE,
    playIsNeon: false,
  });

  await renderCurrentPlay();

  expect(useGameStore.getState().points).toBe(80);
  expect(useGameStore.getState().multi).toBe(2);

  act(() => {
    useGameStore.getState().addPoints(25);
    useGameStore.getState().addMulti(3);
    useCurrentHandStore.getState().setPreSelectionLocked(true);
    useCurrentHandStore.getState().changeCardsNeon([H7.idx, D7.idx]);
  });

  expect(useGameStore.getState().points).toBe(105);
  expect(useGameStore.getState().multi).toBe(5);
});

test("CurrentPlay keeps recalculating counters when the play is not locked", async () => {
  useGameStore.setState({
    points: 0,
    multi: 0,
    plays: createPlays(),
    specialCards: [],
    debuffedPlayerHands: [],
  });
  useCurrentHandStore.setState({
    hand: [H7, D7, C9],
    preSelectedCards: [H7.idx, C9.idx],
    preSelectedModifiers: {},
    preSelectionLocked: false,
    preSelectedPlay: Plays.NONE,
    playIsNeon: false,
  });

  await renderCurrentPlay();

  expect(useGameStore.getState().points).toBe(50);
  expect(useGameStore.getState().multi).toBe(1);

  act(() => {
    useCurrentHandStore.setState({
      preSelectedCards: [H7.idx, D7.idx],
    });
  });

  expect(useGameStore.getState().points).toBe(80);
  expect(useGameStore.getState().multi).toBe(2);
});

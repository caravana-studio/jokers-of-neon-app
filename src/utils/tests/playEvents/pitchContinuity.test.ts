import { afterEach, expect, test, vi } from "vitest";
import { CHANGE_LEVEL_ANIMATION_DURATION_MS } from "../../../constants/animationDurations";
import { EventTypeEnum } from "../../../dojo/typescript/custom";
import { PlayEvents } from "../../../types/ScoreData";
import { animateOptimisticCardPlay } from "../../playEvents/animateOptimisticCardPlay";
import { animatePlayDiscard } from "../../playEvents/animatePlayDiscard";

afterEach(() => {
  vi.useRealTimers();
});

test("pitch continues from optimistic animation into resolved play animation", async () => {
  vi.useFakeTimers();

  const pointsSound = vi.fn();
  const pitchState = { index: 0 };

  const optimistic = animateOptimisticCardPlay({
    events: [
      {
        hand: [{ idx: 0, quantity: 7 }],
        specials: [],
        eventType: EventTypeEnum.Point,
      },
      {
        hand: [{ idx: 1, quantity: 1 }],
        specials: [],
        eventType: EventTypeEnum.Multi,
      },
    ],
    playAnimationDuration: 100,
    pitchState,
    setAnimatedCard: () => undefined,
    pointsSound,
    negativeMultiSound: () => undefined,
    addPoints: () => undefined,
    addMulti: () => undefined,
  });

  vi.advanceTimersByTime(1000);
  await optimistic.done;

  const playEvents: PlayEvents = {
    play: { points: 0, multi: 1 },
    gameOver: false,
    cards: [],
    score: 10,
    cardPlayEvents: [
      {
        hand: [{ idx: 2, quantity: 5 }],
        specials: [],
        eventType: EventTypeEnum.Point,
      },
    ],
  };

  const totalDuration = animatePlayDiscard({
    playEvents,
    playAnimationDuration: 100,
    pitchState,
    setPlayIsNeon: () => undefined,
    setAnimatedCard: () => undefined,
    setAnimatedPowerUp: () => undefined,
    pointsSound,
    acumSound: () => undefined,
    negativeMultiSound: () => undefined,
    setPoints: () => undefined,
    setMulti: () => undefined,
    addPoints: () => undefined,
    addMulti: () => undefined,
    changeCardsSuit: () => undefined,
    changeCardsNeon: () => undefined,
    setAnimation: () => undefined,
    setPreSelectionLocked: () => undefined,
    clearPreSelection: () => undefined,
    refetchPowerUps: () => undefined,
    preSelectedPowerUps: [],
    navigate: () => undefined,
    setRoundRewards: () => undefined,
    replaceCards: () => undefined,
    remainingPlays: 1,
    setAnimateSecondChanceCard: () => undefined,
    setCardTransformationLock: () => undefined,
    specialCards: [],
    setAnimateSpecialCardDefault: () => undefined,
    addCash: () => undefined,
    setCurrentScore: () => undefined,
    resetRage: () => undefined,
    unPreSelectAllPowerUps: () => undefined,
    address: "0x0",
    clearRoundSound: () => undefined,
    clearLevelSound: () => undefined,
  });

  vi.advanceTimersByTime(totalDuration + 10);

  expect(pointsSound.mock.calls.map((call) => call[0])).toEqual([0, 1, 2]);
});

test("optimistic completion keeps last payload and waits full event spacing", async () => {
  vi.useFakeTimers();

  const setAnimatedCard = vi.fn();
  const doneSpy = vi.fn();

  const optimistic = animateOptimisticCardPlay({
    events: [
      {
        hand: [{ idx: 0, quantity: 7 }],
        specials: [],
        eventType: EventTypeEnum.Point,
      },
      {
        hand: [{ idx: 1, quantity: 1 }],
        specials: [],
        eventType: EventTypeEnum.Multi,
      },
    ],
    playAnimationDuration: 100,
    setAnimatedCard,
    pointsSound: () => undefined,
    negativeMultiSound: () => undefined,
    addPoints: () => undefined,
    addMulti: () => undefined,
  });

  optimistic.done.then(doneSpy);

  expect(optimistic.totalDuration).toBe(200);

  vi.advanceTimersByTime(199);
  await Promise.resolve();
  expect(doneSpy).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1);
  await optimistic.done;

  expect(setAnimatedCard).not.toHaveBeenCalledWith(undefined);
  expect(setAnimatedCard.mock.calls.at(-1)?.[0]).toEqual({
    idx: [1],
    multi: 1,
    animationIndex: 1001,
  });
});

test("cancelling optimistic animation clears animated state", async () => {
  vi.useFakeTimers();

  const setAnimatedCard = vi.fn();
  const setAnimatedPowerUp = vi.fn();

  const optimistic = animateOptimisticCardPlay({
    events: [
      {
        hand: [{ idx: 0, quantity: 7 }],
        specials: [],
        eventType: EventTypeEnum.Point,
      },
    ],
    powerUpEvents: [{ idx: 0, points: 25, multi: 0 }],
    playAnimationDuration: 100,
    setAnimatedCard,
    setAnimatedPowerUp,
    pointsSound: () => undefined,
    negativeMultiSound: () => undefined,
    addPoints: () => undefined,
    addMulti: () => undefined,
  });

  optimistic.cancel();
  await optimistic.done;

  expect(setAnimatedCard).toHaveBeenCalledWith(undefined);
  expect(setAnimatedPowerUp).toHaveBeenCalledWith(undefined);
});

test("level-up animation finishes before rewards navigation", () => {
  vi.useFakeTimers();

  const setLevelUpHand = vi.fn();
  const setRoundRewards = vi.fn();
  const navigate = vi.fn();

  const playEvents: PlayEvents = {
    play: { points: 10, multi: 2 },
    gameOver: false,
    cards: [],
    score: 250,
    levelUpPlayEvent: {
      hand: 1,
      old_level: 1,
      old_points: 50,
      old_multi: 1,
      level: 2,
      points: 80,
      multi: 2,
    },
    levelPassed: {
      level: 2,
      player_score: 250,
      round: 1,
      level_passed: 1,
    },
    detailEarned: {
      round_defeat: 0,
      level_bonus: 0,
      hands_left: 0,
      hands_left_cash: 0,
      discard_left: 0,
      discard_left_cash: 0,
      rage_card_defeated: 0,
      rage_card_defeated_cash: 0,
      rerolls: 0,
      rewards_special_card: 0,
      total: 100,
    },
  };

  const totalDuration = animatePlayDiscard({
    playEvents,
    playAnimationDuration: 100,
    setPlayIsNeon: () => undefined,
    setAnimatedCard: () => undefined,
    setAnimatedPowerUp: () => undefined,
    setLevelUpHand,
    pointsSound: () => undefined,
    acumSound: () => undefined,
    negativeMultiSound: () => undefined,
    setPoints: () => undefined,
    setMulti: () => undefined,
    addPoints: () => undefined,
    addMulti: () => undefined,
    changeCardsSuit: () => undefined,
    changeCardsNeon: () => undefined,
    setAnimation: () => undefined,
    setPreSelectionLocked: () => undefined,
    clearPreSelection: () => undefined,
    refetchPowerUps: () => undefined,
    preSelectedPowerUps: [],
    navigate,
    setRoundRewards,
    replaceCards: () => undefined,
    remainingPlays: 1,
    setAnimateSecondChanceCard: () => undefined,
    setCardTransformationLock: () => undefined,
    specialCards: [],
    setAnimateSpecialCardDefault: () => undefined,
    addCash: () => undefined,
    setCurrentScore: () => undefined,
    resetRage: () => undefined,
    unPreSelectAllPowerUps: () => undefined,
    address: "0x0",
    clearRoundSound: () => undefined,
    clearLevelSound: () => undefined,
  });

  expect(totalDuration).toBe(1000 + CHANGE_LEVEL_ANIMATION_DURATION_MS);

  vi.advanceTimersByTime(1000);
  expect(setLevelUpHand).toHaveBeenCalledTimes(1);
  expect(navigate).not.toHaveBeenCalled();
  expect(setRoundRewards).not.toHaveBeenCalled();

  vi.advanceTimersByTime(CHANGE_LEVEL_ANIMATION_DURATION_MS);
  expect(navigate).not.toHaveBeenCalled();
  expect(setRoundRewards).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1000);
  expect(setRoundRewards).toHaveBeenCalledTimes(1);
  expect(navigate).toHaveBeenCalledWith("/rewards");
});

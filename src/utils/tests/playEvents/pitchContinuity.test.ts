import { afterEach, expect, test, vi } from "vitest";
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

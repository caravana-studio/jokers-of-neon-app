import { describe, expect, it, vi } from "vitest";
import type { StreakPresentationClaimApiData } from "../api/profile";
import {
  getConfirmedPresentationFallback,
  pollForStreakPresentation,
} from "./streakPresentationPolling";

const notReady: StreakPresentationClaimApiData = {
  show: false,
  streak: null,
  periodId: null,
  reward: null,
};

const ready: StreakPresentationClaimApiData = {
  show: true,
  streak: 1,
  periodId: 20_654,
  reward: null,
};

describe("pollForStreakPresentation", () => {
  it("keeps retrying in the background until presentation is ready", async () => {
    const controller = new AbortController();
    const claim = vi
      .fn<(signal: AbortSignal) => Promise<StreakPresentationClaimApiData>>()
      .mockResolvedValueOnce(notReady)
      .mockResolvedValueOnce(notReady)
      .mockResolvedValueOnce(ready);
    const delay = vi.fn(async () => undefined);
    const onAttempt = vi.fn();

    const result = await pollForStreakPresentation({
      signal: controller.signal,
      claim,
      delay,
      onAttempt,
      retryDelaysMs: [2, 3, 5],
    });

    expect(result).toEqual(ready);
    expect(claim).toHaveBeenCalledTimes(3);
    expect(delay).toHaveBeenNthCalledWith(1, 2, controller.signal);
    expect(delay).toHaveBeenNthCalledWith(2, 3, controller.signal);
    expect(onAttempt).toHaveBeenCalledTimes(3);
  });

  it("stops cleanly when the app-level request is cancelled", async () => {
    const controller = new AbortController();
    const claim = vi.fn(async () => notReady);
    const delay = vi.fn(async () => {
      controller.abort();
    });

    const result = await pollForStreakPresentation({
      signal: controller.signal,
      claim,
      delay,
    });

    expect(result).toBeNull();
    expect(claim).toHaveBeenCalledTimes(1);
  });

  it("recovers from a request failure without rejecting the game flow", async () => {
    const controller = new AbortController();
    const claim = vi
      .fn<(signal: AbortSignal) => Promise<StreakPresentationClaimApiData>>()
      .mockRejectedValueOnce(new Error("timeout"))
      .mockResolvedValueOnce(ready);
    const delay = vi.fn(async () => undefined);
    const onError = vi.fn();

    const result = await pollForStreakPresentation({
      signal: controller.signal,
      claim,
      delay,
      onError,
    });

    expect(result).toEqual(ready);
    expect(onError).toHaveBeenCalledTimes(1);
  });
});

describe("getConfirmedPresentationFallback", () => {
  const confirmedStatus = {
    player: "0x1",
    currentStreak: 1,
    effectiveStreak: 1,
    longestStreak: 1,
    lastCompletedDay: 20_654,
    protectorsAvailable: 0,
    protectorsNeeded: 0,
    daysMissed: 0,
    isProtected: false,
    isBroken: false,
    syncStatus: "confirmed" as const,
    pendingPeriodId: null,
    source: "cache" as const,
    updatedAt: null,
  };

  it("recovers the presentation after a lost claim response", () => {
    expect(
      getConfirmedPresentationFallback(confirmedStatus, 20_654)
    ).toEqual(ready);
  });

  it("does not synthesize a presentation for another or pending period", () => {
    expect(
      getConfirmedPresentationFallback(confirmedStatus, 20_653)
    ).toBeNull();
    expect(
      getConfirmedPresentationFallback(
        { ...confirmedStatus, syncStatus: "pending" },
        20_654
      )
    ).toBeNull();
  });
});

import { describe, expect, it, vi } from "vitest";
import type { StreakPresentationClaimApiData } from "../api/profile";
import {
  getCurrentDailyPeriodId,
  getPresentationFallback,
  pollForStreakPresentation,
  recoverAlreadyClaimedPresentation,
} from "./streakPresentationPolling";

describe("getCurrentDailyPeriodId", () => {
  it("uses the same 06:00 UTC boundary as daily missions", () => {
    expect(getCurrentDailyPeriodId(Date.parse("2026-07-20T05:59:59Z"))).toBe(
      20_653
    );
    expect(getCurrentDailyPeriodId(Date.parse("2026-07-20T06:00:00Z"))).toBe(
      20_654
    );
  });
});

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

describe("getPresentationFallback", () => {
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
    expect(getPresentationFallback(confirmedStatus, 20_654)).toEqual(ready);
  });

  it("does not synthesize a presentation for another or failed period", () => {
    expect(
      getPresentationFallback(confirmedStatus, 20_653)
    ).toBeNull();
    expect(
      getPresentationFallback(
        { ...confirmedStatus, syncStatus: "failed" },
        20_654
      )
    ).toBeNull();
  });

  it("allows the worker projection before mainnet confirmation", () => {
    expect(
      getPresentationFallback(
        {
          ...confirmedStatus,
          syncStatus: "pending",
          pendingPeriodId: 20_654,
        },
        20_654
      )
    ).toEqual(ready);
  });

  it("recovers a claim whose successful response was lost", () => {
    expect(
      recoverAlreadyClaimedPresentation(
        {
          show: false,
          streak: 1,
          periodId: 20_654,
          reason: "already_claimed",
          reward: null,
        },
        confirmedStatus,
        20_654
      )
    ).toEqual(ready);
  });

  it("does not recover a claim rejected for another reason", () => {
    const rejected: StreakPresentationClaimApiData = {
      show: false,
      streak: 1,
      periodId: 20_654,
      reason: "missing_username",
      reward: null,
    };

    expect(
      recoverAlreadyClaimedPresentation(
        rejected,
        confirmedStatus,
        20_654
      )
    ).toBe(rejected);
  });
});

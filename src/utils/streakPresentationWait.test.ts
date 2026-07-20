import { describe, expect, it, vi } from "vitest";
import type {
  StreakPresentationWaitApiData,
  StreakStatusApiData,
} from "../api/profile";
import {
  resumePendingStreakPresentation,
  waitForStreakPresentationPeriod,
} from "./streakPresentationWait";

function streakStatus(
  overrides: Partial<StreakStatusApiData> = {}
): StreakStatusApiData {
  return {
    player: "0x1",
    currentStreak: 4,
    effectiveStreak: 4,
    longestStreak: 4,
    lastCompletedDay: 99,
    protectorsAvailable: 0,
    protectorsNeeded: 0,
    daysMissed: 0,
    isProtected: false,
    isBroken: false,
    syncStatus: "confirmed",
    pendingPeriodId: null,
    pendingIntentId: null,
    source: "cache",
    updatedAt: null,
    currentPeriodId: 100,
    completedToday: false,
    completionState: "idle",
    projectedStreak: 4,
    ...overrides,
  };
}

function waitResult(
  overrides: Partial<StreakPresentationWaitApiData>
): StreakPresentationWaitApiData {
  return {
    state: "timeout",
    status: null,
    presentation: null,
    intentId: null,
    ...overrides,
  };
}

describe("streak presentation wait", () => {
  it("waits directly for the confirmed daily period", async () => {
    const confirmed = streakStatus({
      currentStreak: 5,
      effectiveStreak: 5,
      longestStreak: 5,
      lastCompletedDay: 100,
      completedToday: true,
      completionState: "confirmed",
      projectedStreak: 5,
    });
    const request = vi.fn().mockResolvedValue(
      waitResult({
        state: "confirmed",
        status: confirmed,
        presentation: {
          show: true,
          streak: 5,
          periodId: 100,
          reward: null,
          reason: null,
          acknowledged: false,
        },
        intentId: "intent-100",
      })
    );
    const onStatus = vi.fn();

    const result = await waitForStreakPresentationPeriod({
      address: "0x1",
      expectedPeriodId: 100,
      request,
      onStatus,
    });

    expect(result.state).toBe("confirmed");
    expect(result.presentation?.show).toBe(true);
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith("0x1", 100, {
      until: "confirmed",
      timeoutMs: 8_000,
    });
    expect(onStatus).toHaveBeenCalledWith(confirmed);
  });

  it("uses a single request when the period is already confirmed", async () => {
    const request = vi.fn().mockResolvedValue(
      waitResult({
        state: "confirmed",
        status: streakStatus({
          lastCompletedDay: 100,
          completedToday: true,
          completionState: "confirmed",
        }),
      })
    );

    const result = await waitForStreakPresentationPeriod({
      address: "0x1",
      expectedPeriodId: 100,
      request,
    });

    expect(result.state).toBe("confirmed");
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith("0x1", 100, {
      until: "confirmed",
      timeoutMs: 8_000,
    });
  });

  it("resumes a Supabase-backed pending period after reopening the app", async () => {
    const pending = streakStatus({
      syncStatus: "pending",
      pendingPeriodId: 100,
      pendingIntentId: "intent-100",
      completionState: "pending",
    });
    const request = vi.fn().mockResolvedValue(
      waitResult({
        state: "confirmed",
        status: streakStatus({
          lastCompletedDay: 100,
          completedToday: true,
          completionState: "confirmed",
        }),
      })
    );

    const result = await resumePendingStreakPresentation({
      address: "0x1",
      status: pending,
      request,
    });

    expect(result?.state).toBe("confirmed");
    expect(request).toHaveBeenCalledWith("0x1", 100, {
      until: "confirmed",
      intentId: "intent-100",
      timeoutMs: 8_000,
    });
  });

  it("returns a bounded timeout without asking for a presentation", async () => {
    const request = vi.fn().mockResolvedValue(
      waitResult({
        state: "timeout",
        status: streakStatus(),
      })
    );

    const result = await waitForStreakPresentationPeriod({
      address: "0x1",
      expectedPeriodId: 100,
      request,
    });

    expect(result.state).toBe("timeout");
    expect(result.presentation).toBeNull();
    expect(request).toHaveBeenCalledTimes(1);
  });
});

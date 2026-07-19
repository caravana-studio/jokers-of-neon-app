import { describe, expect, it, vi } from "vitest";
import type { StreakStatusApiData } from "../api/profile";
import {
  isConfirmedStreakPeriod,
  waitForConfirmedStreakPeriod,
} from "./streakPresentationPolling";

function streakStatus(
  overrides: Partial<StreakStatusApiData> = {}
): StreakStatusApiData {
  return {
    player: "0x1",
    currentStreak: 4,
    effectiveStreak: 4,
    longestStreak: 4,
    lastCompletedDay: 100,
    protectorsAvailable: 0,
    protectorsNeeded: 0,
    daysMissed: 0,
    isProtected: false,
    isBroken: false,
    syncStatus: "confirmed",
    pendingPeriodId: null,
    source: "cache",
    updatedAt: null,
    currentPeriodId: 100,
    completedToday: true,
    ...overrides,
  };
}

describe("streak presentation polling", () => {
  it("waits through optimistic cache state until the expected period is confirmed", async () => {
    const fetchStatus = vi
      .fn<() => Promise<StreakStatusApiData>>()
      .mockResolvedValueOnce(
        streakStatus({
          syncStatus: "pending",
          pendingPeriodId: 100,
          completedToday: false,
        })
      )
      .mockResolvedValueOnce(
        streakStatus({ lastCompletedDay: 99, completedToday: false })
      )
      .mockResolvedValueOnce(streakStatus());
    const delay = vi.fn(async () => undefined);
    const onStatus = vi.fn();

    const result = await waitForConfirmedStreakPeriod({
      expectedPeriodId: 100,
      fetchStatus,
      maxAttempts: 5,
      delay,
      onStatus,
    });

    expect(result?.completedToday).toBe(true);
    expect(fetchStatus).toHaveBeenCalledTimes(3);
    expect(delay).toHaveBeenCalledTimes(2);
    expect(onStatus).toHaveBeenCalledTimes(3);
    expect(onStatus.mock.calls[0][0].syncStatus).toBe("pending");
    expect(onStatus.mock.calls[2][0].completedToday).toBe(true);
  });

  it("stops after the bounded number of attempts", async () => {
    const fetchStatus = vi.fn(async () =>
      streakStatus({
        syncStatus: "pending",
        completedToday: false,
      })
    );
    const delay = vi.fn(async () => undefined);

    const result = await waitForConfirmedStreakPeriod({
      expectedPeriodId: 100,
      fetchStatus,
      maxAttempts: 3,
      delay,
    });

    expect(result).toBeNull();
    expect(fetchStatus).toHaveBeenCalledTimes(3);
    expect(delay).toHaveBeenCalledTimes(2);
  });

  it("does not accept a confirmed completion from a different period", () => {
    expect(isConfirmedStreakPeriod(streakStatus(), 101)).toBe(false);
  });
});

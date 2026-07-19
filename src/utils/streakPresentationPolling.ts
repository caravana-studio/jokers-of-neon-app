import type { StreakStatusApiData } from "../api/profile";

export function isConfirmedStreakPeriod(
  status: StreakStatusApiData,
  expectedPeriodId: number
): boolean {
  return (
    status.syncStatus === "confirmed" &&
    status.completedToday &&
    status.currentPeriodId === expectedPeriodId &&
    status.lastCompletedDay === expectedPeriodId
  );
}

export async function waitForConfirmedStreakPeriod(options: {
  expectedPeriodId: number;
  fetchStatus: () => Promise<StreakStatusApiData>;
  maxAttempts?: number;
  intervalMs?: number;
  delay?: (milliseconds: number) => Promise<void>;
  onStatus?: (status: StreakStatusApiData) => void;
}): Promise<StreakStatusApiData | null> {
  const {
    expectedPeriodId,
    fetchStatus,
    maxAttempts = 31,
    intervalMs = 1_000,
    delay = (milliseconds) =>
      new Promise((resolve) => window.setTimeout(resolve, milliseconds)),
  } = options;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const status = await fetchStatus();
      options.onStatus?.(status);
      if (isConfirmedStreakPeriod(status, expectedPeriodId)) {
        return status;
      }
    } catch (error) {
      console.warn("Streak presentation: status poll failed", error);
    }

    if (attempt < maxAttempts - 1) {
      await delay(intervalMs);
    }
  }

  return null;
}

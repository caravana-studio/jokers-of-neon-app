import type {
  StreakPresentationClaimApiData,
  StreakStatusApiData,
} from "../api/profile";

const DEFAULT_RETRY_DELAYS_MS = [2_000, 3_000, 5_000, 10_000] as const;

type PollForStreakPresentationOptions = {
  signal: AbortSignal;
  claim: (signal: AbortSignal) => Promise<StreakPresentationClaimApiData>;
  onAttempt?: (attempt: number) => void;
  onError?: (error: unknown, attempt: number) => void;
  retryDelaysMs?: readonly number[];
  delay?: (milliseconds: number, signal: AbortSignal) => Promise<void>;
};

export function getConfirmedPresentationFallback(
  status: StreakStatusApiData,
  expectedPeriodId: number | null
): StreakPresentationClaimApiData | null {
  if (
    expectedPeriodId === null ||
    status.syncStatus !== "confirmed" ||
    status.lastCompletedDay !== expectedPeriodId ||
    status.isBroken ||
    status.effectiveStreak <= 0
  ) {
    return null;
  }

  return {
    show: true,
    streak: status.effectiveStreak,
    periodId: expectedPeriodId,
    reward: null,
  };
}

const delayWithAbort = (
  milliseconds: number,
  signal: AbortSignal
): Promise<void> =>
  new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    const timeoutId = window.setTimeout(finish, milliseconds);
    signal.addEventListener("abort", finish, { once: true });
  });

export async function pollForStreakPresentation({
  signal,
  claim,
  onAttempt,
  onError,
  retryDelaysMs = DEFAULT_RETRY_DELAYS_MS,
  delay = delayWithAbort,
}: PollForStreakPresentationOptions): Promise<StreakPresentationClaimApiData | null> {
  let attempt = 0;

  while (!signal.aborted) {
    attempt += 1;
    onAttempt?.(attempt);

    try {
      const presentation = await claim(signal);
      if (
        presentation.show &&
        presentation.streak !== null &&
        presentation.periodId !== null
      ) {
        return presentation;
      }
    } catch (error) {
      if (signal.aborted) return null;
      onError?.(error, attempt);
    }

    const delayIndex = Math.min(attempt - 1, retryDelaysMs.length - 1);
    await delay(retryDelaysMs[delayIndex] ?? 10_000, signal);
  }

  return null;
}

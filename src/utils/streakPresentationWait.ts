import {
  waitForStreakPresentation,
  type StreakPresentationWaitApiData,
  type StreakStatusApiData,
} from "../api/profile";

type WaitRequest = typeof waitForStreakPresentation;

export const STREAK_PRESENTATION_WAIT_TIMEOUT_MS = 8_000;

async function waitForConfirmedPeriod(options: {
  address: string;
  expectedPeriodId: number;
  intentId?: string | null;
  retryOnTimeout?: boolean;
  request: WaitRequest;
  onStatus?: (status: StreakStatusApiData) => void;
}): Promise<StreakPresentationWaitApiData> {
  while (true) {
    const result = await options.request(
      options.address,
      options.expectedPeriodId,
      {
        until: "confirmed",
        ...(options.intentId ? { intentId: options.intentId } : {}),
        timeoutMs: STREAK_PRESENTATION_WAIT_TIMEOUT_MS,
      }
    );

    if (result.status) {
      options.onStatus?.(result.status);
    }

    if (result.state !== "timeout" || !options.retryOnTimeout) {
      return result;
    }

    console.info("[streak-presentation] retrying timed out period", {
      periodId: options.expectedPeriodId,
      completionState: result.status?.completionState ?? null,
    });
  }
}

export async function waitForStreakPresentationPeriod(options: {
  address: string;
  expectedPeriodId: number;
  request?: WaitRequest;
  onStatus?: (status: StreakStatusApiData) => void;
  retryOnTimeout?: boolean;
}): Promise<StreakPresentationWaitApiData> {
  return waitForConfirmedPeriod({
    ...options,
    request: options.request ?? waitForStreakPresentation,
  });
}

export async function resumePendingStreakPresentation(options: {
  address: string;
  status: StreakStatusApiData;
  request?: WaitRequest;
  onStatus?: (status: StreakStatusApiData) => void;
  retryOnTimeout?: boolean;
}): Promise<StreakPresentationWaitApiData | null> {
  const { status } = options;
  if (
    status.completionState !== "pending" ||
    status.pendingPeriodId === null ||
    status.pendingPeriodId !== status.currentPeriodId
  ) {
    return null;
  }

  return waitForConfirmedPeriod({
    address: options.address,
    expectedPeriodId: status.pendingPeriodId,
    intentId: status.pendingIntentId,
    retryOnTimeout: options.retryOnTimeout,
    request: options.request ?? waitForStreakPresentation,
    onStatus: options.onStatus,
  });
}

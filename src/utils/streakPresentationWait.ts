import {
  waitForStreakPresentation,
  type StreakPresentationWaitApiData,
  type StreakStatusApiData,
} from "../api/profile";

type WaitRequest = typeof waitForStreakPresentation;

export const STREAK_PRESENTATION_WAIT_TIMEOUT_MS = 8_000;

export async function waitForStreakPresentationPeriod(options: {
  address: string;
  expectedPeriodId: number;
  request?: WaitRequest;
  onStatus?: (status: StreakStatusApiData) => void;
}): Promise<StreakPresentationWaitApiData> {
  const request = options.request ?? waitForStreakPresentation;
  const result = await request(options.address, options.expectedPeriodId, {
    until: "confirmed",
    timeoutMs: STREAK_PRESENTATION_WAIT_TIMEOUT_MS,
  });

  if (result.status) {
    options.onStatus?.(result.status);
  }

  return result;
}

export async function resumePendingStreakPresentation(options: {
  address: string;
  status: StreakStatusApiData;
  request?: WaitRequest;
  onStatus?: (status: StreakStatusApiData) => void;
}): Promise<StreakPresentationWaitApiData | null> {
  const { status } = options;
  if (
    status.completionState !== "pending" ||
    status.pendingPeriodId === null ||
    status.pendingPeriodId !== status.currentPeriodId
  ) {
    return null;
  }

  const request = options.request ?? waitForStreakPresentation;
  const result = await request(options.address, status.pendingPeriodId, {
    until: "confirmed",
    intentId: status.pendingIntentId,
    timeoutMs: STREAK_PRESENTATION_WAIT_TIMEOUT_MS,
  });

  if (result.status) {
    options.onStatus?.(result.status);
  }

  return result;
}

import {
  claimStreakRewards,
  fetchStreakRewardClaimStatus,
  type ClaimStreakRewardsResult,
} from "../api/profile";

type ClaimRequest = typeof claimStreakRewards;
type StatusRequest = typeof fetchStreakRewardClaimStatus;

const DEFAULT_POLL_INTERVAL_MS = 1_500;
const DEFAULT_MAX_POLL_ATTEMPTS = 80;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function assertClaimDidNotFail(
  result: ClaimStreakRewardsResult
): ClaimStreakRewardsResult {
  if (result.state === "failed") {
    throw new Error("A streak reward transaction failed");
  }
  return result;
}

export async function waitForStreakRewardClaim(options: {
  address: string;
  claimIds: string[];
  request?: StatusRequest;
  sleep?: (ms: number) => Promise<void>;
  pollIntervalMs?: number;
  maxAttempts?: number;
}): Promise<ClaimStreakRewardsResult> {
  const request = options.request ?? fetchStreakRewardClaimStatus;
  const sleep = options.sleep ?? delay;
  const pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_POLL_ATTEMPTS;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const result = assertClaimDidNotFail(
        await request(options.address, options.claimIds)
      );
      if (result.state === "confirmed") {
        return result;
      }
      if (result.state === "available") {
        throw new Error("Streak reward claim was not submitted");
      }
    } catch (error) {
      lastError = error;
      if (
        error instanceof Error &&
        (error.message === "A streak reward transaction failed" ||
          error.message === "Streak reward claim was not submitted")
      ) {
        throw error;
      }
    }

    if (attempt + 1 < maxAttempts) {
      await sleep(pollIntervalMs);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Timed out waiting for the streak reward confirmation");
}

export async function claimStreakRewardsReliably(options: {
  address: string;
  claimIds: string[];
  claimRequest?: ClaimRequest;
  statusRequest?: StatusRequest;
  sleep?: (ms: number) => Promise<void>;
  pollIntervalMs?: number;
  maxAttempts?: number;
}): Promise<ClaimStreakRewardsResult> {
  const claimRequest = options.claimRequest ?? claimStreakRewards;
  const statusRequest = options.statusRequest ?? fetchStreakRewardClaimStatus;
  const sleep = options.sleep ?? delay;
  let result: ClaimStreakRewardsResult | null = null;
  let lastError: unknown;

  // Retrying the POST is safe: claim IDs are durable idempotency keys. The
  // status read disambiguates a lost response from a request that never arrived.
  for (let attempt = 0; attempt < 2 && !result; attempt++) {
    try {
      result = await claimRequest(options.address, options.claimIds);
    } catch (error) {
      lastError = error;
      try {
        const current = await statusRequest(options.address, options.claimIds);
        if (current.state !== "available") {
          result = current;
          break;
        }
      } catch {
        // The retry below is still safe when both the POST response and the
        // immediate status check fail.
      }

      if (attempt === 0) {
        await sleep(500);
      }
    }
  }

  if (!result) {
    throw lastError instanceof Error
      ? lastError
      : new Error("Streak reward claim failed");
  }

  assertClaimDidNotFail(result);
  if (result.state === "confirmed") {
    return result;
  }
  if (result.state === "available") {
    throw new Error("Streak reward claim was not submitted");
  }

  return waitForStreakRewardClaim({
    address: options.address,
    claimIds: options.claimIds,
    request: statusRequest,
    sleep,
    pollIntervalMs: options.pollIntervalMs,
    maxAttempts: options.maxAttempts,
  });
}

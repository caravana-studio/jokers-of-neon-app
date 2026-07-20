import { describe, expect, it, vi } from "vitest";
import type { ClaimStreakRewardsResult } from "../api/profile";
import {
  claimStreakRewardsReliably,
  waitForStreakRewardClaim,
} from "./streakRewardClaim";

function claimResult(
  state: ClaimStreakRewardsResult["state"]
): ClaimStreakRewardsResult {
  return {
    state,
    packs: [],
    xp: { requested: 50, queued: 50 },
    streakProtectors: { requested: 0, queued: 0, skipped: 0 },
    transactionIds: ["tx-1"],
    alreadyClaimed: state === "confirmed",
  };
}

describe("reliable streak reward claims", () => {
  it("waits until the queued reward is confirmed", async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(claimResult("submitted"))
      .mockResolvedValueOnce(claimResult("confirmed"));

    const result = await waitForStreakRewardClaim({
      address: "0x1",
      claimIds: ["claim-1"],
      request,
      sleep: async () => undefined,
      maxAttempts: 2,
    });

    expect(result.state).toBe("confirmed");
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("recovers when the POST response is lost after submission", async () => {
    const claimRequest = vi.fn().mockRejectedValue(new Error("network timeout"));
    const statusRequest = vi
      .fn()
      .mockResolvedValueOnce(claimResult("submitted"))
      .mockResolvedValueOnce(claimResult("confirmed"));

    const result = await claimStreakRewardsReliably({
      address: "0x1",
      claimIds: ["claim-1"],
      claimRequest,
      statusRequest,
      sleep: async () => undefined,
      maxAttempts: 2,
    });

    expect(result.state).toBe("confirmed");
    expect(claimRequest).toHaveBeenCalledTimes(1);
    expect(statusRequest).toHaveBeenCalledTimes(2);
  });

  it("does not present a permanently failed reward", async () => {
    await expect(
      waitForStreakRewardClaim({
        address: "0x1",
        claimIds: ["claim-1"],
        request: vi.fn().mockResolvedValue(claimResult("failed")),
        sleep: async () => undefined,
        maxAttempts: 1,
      })
    ).rejects.toThrow("transaction failed");
  });
});

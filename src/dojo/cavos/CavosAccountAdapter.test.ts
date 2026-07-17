import { afterEach, describe, expect, it, vi } from "vitest";
import type { Call } from "starknet";
import { CavosAccountAdapter } from "./CavosAccountAdapter";

const calls: Call[] = [
  {
    contractAddress: "0xworld",
    entrypoint: "play",
    calldata: [],
  },
];

const activeSessionStatus = () => ({
  registered: true,
  active: true,
  expired: false,
  canRenew: false,
  validUntil: BigInt(Math.floor(Date.now() / 1_000) + 3_600),
});

describe("CavosAccountAdapter Slot fast path", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reuses the active session status and direct Cairo 1 account", async () => {
    const executeDirect = vi
      .fn()
      .mockResolvedValueOnce({ transaction_hash: "0x1" })
      .mockResolvedValueOnce({ transaction_hash: "0x2" });
    const directAccount = { execute: executeDirect, cairoVersion: undefined };
    const slotTransactionManager = {
      getSessionStatus: vi.fn().mockResolvedValue(activeSessionStatus()),
      createDirectAccount: vi.fn().mockReturnValue(directAccount),
      getNoFeeResourceBounds: vi.fn().mockReturnValue({
        l1_gas: { max_amount: 0n, max_price_per_unit: 0n },
        l2_gas: { max_amount: 0n, max_price_per_unit: 0n },
        l1_data_gas: { max_amount: 0n, max_price_per_unit: 0n },
      }),
    };
    const executeOnSlot = vi.fn();
    const adapter = new CavosAccountAdapter(
      "0xcavos",
      executeOnSlot,
      () => null,
      () => true,
      () => ({ slotTransactionManager }),
    );

    await expect(adapter.execute(calls)).resolves.toEqual({
      transaction_hash: "0x1",
    });
    await expect(adapter.execute(calls)).resolves.toEqual({
      transaction_hash: "0x2",
    });

    expect(slotTransactionManager.getSessionStatus).toHaveBeenCalledTimes(1);
    expect(slotTransactionManager.createDirectAccount).toHaveBeenCalledTimes(1);
    expect(directAccount.cairoVersion).toBe("1");
    expect(executeDirect).toHaveBeenCalledTimes(2);
    expect(executeOnSlot).not.toHaveBeenCalled();
  });

  it("invalidates both caches and falls back to the SDK after a direct failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const failingAccount = {
      execute: vi.fn().mockRejectedValue(new Error("stale session")),
      cairoVersion: undefined,
    };
    const recoveredAccount = {
      execute: vi.fn().mockResolvedValue({ transaction_hash: "0xdirect" }),
      cairoVersion: undefined,
    };
    const slotTransactionManager = {
      getSessionStatus: vi.fn().mockImplementation(activeSessionStatus),
      createDirectAccount: vi
        .fn()
        .mockReturnValueOnce(failingAccount)
        .mockReturnValueOnce(recoveredAccount),
      getNoFeeResourceBounds: vi.fn().mockReturnValue({}),
    };
    const executeOnSlot = vi.fn().mockResolvedValue("0xfallback");
    const adapter = new CavosAccountAdapter(
      "0xcavos",
      executeOnSlot,
      () => null,
      () => true,
      () => ({ slotTransactionManager }),
    );

    await expect(adapter.execute(calls)).resolves.toEqual({
      transaction_hash: "0xfallback",
    });
    await expect(adapter.execute(calls)).resolves.toEqual({
      transaction_hash: "0xdirect",
    });

    expect(executeOnSlot).toHaveBeenCalledTimes(1);
    expect(slotTransactionManager.getSessionStatus).toHaveBeenCalledTimes(2);
    expect(slotTransactionManager.createDirectAccount).toHaveBeenCalledTimes(2);
    expect(recoveredAccount.cairoVersion).toBe("1");
  });
});

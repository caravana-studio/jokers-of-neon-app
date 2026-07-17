import { describe, expect, it, vi } from "vitest";
import type { Account, Call } from "starknet";
import {
  withSlotNoFeeResourceBounds,
  withSlotNoFeeResourceBoundsAccount,
} from "./slotNoFeeExecuteOptions";

const ZERO_RESOURCE_BOUNDS = {
  l1_gas: { max_amount: 0n, max_price_per_unit: 0n },
  l2_gas: { max_amount: 0n, max_price_per_unit: 0n },
  l1_data_gas: { max_amount: 0n, max_price_per_unit: 0n },
};

describe("Slot no-fee execute options", () => {
  it("preserves transaction details and adds explicit zero resource bounds", () => {
    expect(withSlotNoFeeResourceBounds({ nonce: 7 })).toEqual({
      nonce: 7,
      tip: 0n,
      resourceBounds: ZERO_RESOURCE_BOUNDS,
    });
  });

  it("adds no-fee bounds when the wrapped account executes", async () => {
    const execute = vi.fn().mockResolvedValue({ transaction_hash: "0x123" });
    const account = {
      address: "0xburner",
      execute,
    } as unknown as Account;
    const wrapped = withSlotNoFeeResourceBoundsAccount(account);
    const calls: Call[] = [
      {
        contractAddress: "0xworld",
        entrypoint: "play",
        calldata: [],
      },
    ];

    await wrapped.execute(calls, { nonce: 9 });

    expect(execute).toHaveBeenCalledWith(calls, {
      nonce: 9,
      tip: 0n,
      resourceBounds: ZERO_RESOURCE_BOUNDS,
    });
  });
});

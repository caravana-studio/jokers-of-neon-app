import type {
  Account,
  AccountInterface,
  Call,
  InvokeFunctionResponse,
  UniversalDetails,
} from "starknet";

const getSlotNoFeeResourceBounds = () => ({
  l1_gas: { max_amount: 0n, max_price_per_unit: 0n },
  l2_gas: { max_amount: 0n, max_price_per_unit: 0n },
  l1_data_gas: { max_amount: 0n, max_price_per_unit: 0n },
});

/**
 * Slot/Katana gameplay transactions are no-fee, so forcing tip=0 avoids
 * Starknet.js scanning recent blocks to estimate a recommended V3 tip.
 */
export function withSlotNoFeeExecuteOptions(
  details: UniversalDetails = {}
): UniversalDetails {
  return {
    ...details,
    tip: 0n,
  };
}

/**
 * Resource bounds are optional in starknet.js. Omitting them makes Account.execute
 * estimate the fee before submitting. Burner transactions on Slot/Katana are
 * no-fee, so explicit zero bounds skip that extra RPC round trip.
 */
export function withSlotNoFeeResourceBounds(
  details: UniversalDetails = {},
): UniversalDetails {
  return {
    ...withSlotNoFeeExecuteOptions(details),
    resourceBounds: getSlotNoFeeResourceBounds(),
  };
}

type ExecutableAccount = Account | AccountInterface;

/**
 * Applies zero resource bounds to one account without changing controller or
 * Cavos execution semantics. The returned proxy preserves the original account
 * as the `this` value for all methods.
 */
export const withSlotNoFeeResourceBoundsAccount = <T extends ExecutableAccount>(
  account: T,
): T =>
  new Proxy(account, {
    get(target, property) {
      if (property === "execute") {
        return async (
          calls: Call | Call[],
          details: UniversalDetails = {},
        ): Promise<InvokeFunctionResponse> =>
          (target.execute as any)(calls, withSlotNoFeeResourceBounds(details));
      }

      const value = Reflect.get(target, property, target);
      return typeof value === "function" ? value.bind(target) : value;
    },
  }) as T;

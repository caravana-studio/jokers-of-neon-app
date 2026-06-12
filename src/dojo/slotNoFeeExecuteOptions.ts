import type { AccountInterface, UniversalDetails } from "starknet";

const NO_FEE_CONTROLLER_PATCH_FLAG = "__jokersNoFeeControllerPatch";

type ControllerKeychainLike = {
  execute?: (...args: any[]) => Promise<any>;
  [NO_FEE_CONTROLLER_PATCH_FLAG]?: true;
};

/**
 * Slot/Katana gameplay transactions are no-fee, so forcing tip=0 avoids
 * Starknet.js scanning recent blocks to estimate a recommended V3 tip.
 */
export function withSlotNoFeeExecuteOptions(
  details: UniversalDetails = {}
): UniversalDetails {
  return {
    ...details,
    tip: details.tip ?? 0,
  };
}

export function patchControllerNoFeeExecute<T extends AccountInterface | null | undefined>(
  account: T
): T {
  const keychain = (account as any)?.keychain as
    | ControllerKeychainLike
    | undefined;

  if (
    !keychain ||
    typeof keychain.execute !== "function" ||
    keychain[NO_FEE_CONTROLLER_PATCH_FLAG]
  ) {
    return account;
  }

  const execute = keychain.execute.bind(keychain);
  keychain.execute = (calls, abis, transactionDetails, ...rest) => {
    const noFeeTransactionDetails =
      transactionDetails && typeof transactionDetails === "object"
        ? {
            ...transactionDetails,
            tip: transactionDetails.tip ?? 0,
          }
        : { tip: 0 };

    return execute(calls, abis, noFeeTransactionDetails, ...rest);
  };

  Object.defineProperty(keychain, NO_FEE_CONTROLLER_PATCH_FLAG, {
    value: true,
  });

  return account;
}

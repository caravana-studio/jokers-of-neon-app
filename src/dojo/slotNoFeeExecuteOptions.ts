import type { AccountInterface, UniversalDetails } from "starknet";

const NO_FEE_CONTROLLER_PATCH_FLAG = "__jokersNoFeeControllerPatch";

type ControllerKeychainLike = {
  execute?: (...args: any[]) => Promise<any>;
  [NO_FEE_CONTROLLER_PATCH_FLAG]?: true;
};

const summarizeCall = (call: any) => ({
  contractAddress: call?.contractAddress ?? null,
  entrypoint: call?.entrypoint ?? null,
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
    const normalizedCalls = Array.isArray(calls) ? calls : [calls];
    const noFeeTransactionDetails =
      transactionDetails && typeof transactionDetails === "object"
        ? {
            ...transactionDetails,
            tip: transactionDetails.tip ?? 0,
          }
        : { tip: 0 };

    console.info("[CONTROLLER-DEBUG] keychain.execute", {
      callCount: normalizedCalls.length,
      calls: normalizedCalls.map(summarizeCall),
      incomingTip: transactionDetails?.tip ?? null,
      outgoingTip: noFeeTransactionDetails.tip,
      restArgsCount: rest.length,
    });

    return execute(calls, abis, noFeeTransactionDetails, ...rest);
  };

  Object.defineProperty(keychain, NO_FEE_CONTROLLER_PATCH_FLAG, {
    value: true,
  });

  return account;
}

import type { AccountInterface, UniversalDetails } from "starknet";

const NO_FEE_CONTROLLER_PATCH_FLAG = "__jokersNoFeeControllerPatch";
const NO_FEE_ACCOUNT_EXECUTE_PATCH_FLAG = "__jokersNoFeeAccountExecutePatch";

type ControllerKeychainLike = {
  execute?: (...args: any[]) => Promise<any>;
  [NO_FEE_CONTROLLER_PATCH_FLAG]?: true;
};

type ControllerAccountLike = AccountInterface & {
  execute?: (...args: any[]) => Promise<any>;
  keychain?: ControllerKeychainLike;
  [NO_FEE_ACCOUNT_EXECUTE_PATCH_FLAG]?: true;
};

const summarizeCall = (call: any) => ({
  contractAddress: call?.contractAddress ?? null,
  entrypoint: call?.entrypoint ?? null,
});

const summarizeExecuteResult = (result: any) => ({
  code: result?.code ?? null,
  transactionHash: result?.transaction_hash ?? null,
  error: result?.error ?? null,
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

const inspectAccount = (account: unknown) => {
  const accountLike = account as ControllerAccountLike | null | undefined;

  return {
    address: accountLike?.address ?? null,
    constructorName: accountLike?.constructor?.name ?? null,
    hasExecute: typeof accountLike?.execute === "function",
    hasKeychainExecute: typeof accountLike?.keychain?.execute === "function",
    ownKeys: accountLike ? Object.keys(accountLike).slice(0, 12) : [],
  };
};

const findPatchTarget = (
  account: AccountInterface | null | undefined,
  fallbackAccount?: AccountInterface | null
) => {
  const accounts = [account, fallbackAccount].filter(Boolean) as AccountInterface[];
  return (
    accounts.find(
      (candidate) =>
        typeof (candidate as ControllerAccountLike).keychain?.execute ===
        "function"
    ) ?? account
  );
};

function patchAccountExecute(account: ControllerAccountLike) {
  if (
    typeof account.execute !== "function" ||
    account[NO_FEE_ACCOUNT_EXECUTE_PATCH_FLAG]
  ) {
    return;
  }

  const execute = account.execute.bind(account);
  account.execute = (calls, transactionDetails, ...rest) => {
    const normalizedCalls = Array.isArray(calls) ? calls : [calls];
    const hasTransactionDetails =
      !!transactionDetails && typeof transactionDetails === "object";
    const noFeeTransactionDetails =
      hasTransactionDetails
        ? withSlotNoFeeExecuteOptions(transactionDetails)
        : transactionDetails;

    console.info("[CONTROLLER-DEBUG] account.execute", {
      account: account.address,
      callCount: normalizedCalls.length,
      calls: normalizedCalls.map(summarizeCall),
      incomingTip: transactionDetails?.tip ?? null,
      outgoingTip: noFeeTransactionDetails?.tip ?? null,
      transactionDetailsType:
        transactionDetails === undefined ? "undefined" : typeof transactionDetails,
      restArgsCount: rest.length,
      hasKeychainExecute: typeof account.keychain?.execute === "function",
    });

    const executePromise =
      transactionDetails === undefined && rest.length === 0
        ? execute(calls)
        : execute(calls, noFeeTransactionDetails, ...rest);

    return executePromise
      .then((result: any) => {
        console.info(
          "[CONTROLLER-DEBUG] account.execute:result",
          summarizeExecuteResult(result)
        );
        return result;
      })
      .catch((error: unknown) => {
        console.error("[CONTROLLER-DEBUG] account.execute:error", error);
        throw error;
      });
  };

  Object.defineProperty(account, NO_FEE_ACCOUNT_EXECUTE_PATCH_FLAG, {
    value: true,
  });
}

export function patchControllerNoFeeExecute<T extends AccountInterface | null | undefined>(
  account: T,
  fallbackAccount?: AccountInterface | null
): T {
  const patchTarget = findPatchTarget(account, fallbackAccount) as
    | ControllerAccountLike
    | null
    | undefined;
  const keychain = patchTarget?.keychain as
    | ControllerKeychainLike
    | undefined;

  console.info("[CONTROLLER-DEBUG] patchControllerNoFeeExecute", {
    requestedAccount: inspectAccount(account),
    fallbackAccount: inspectAccount(fallbackAccount),
    patchTarget: inspectAccount(patchTarget),
  });

  if (patchTarget) {
    patchAccountExecute(patchTarget);
  }

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
    const hasTransactionDetails =
      !!transactionDetails && typeof transactionDetails === "object";
    const noFeeTransactionDetails =
      hasTransactionDetails
        ? {
            ...transactionDetails,
            tip: transactionDetails.tip ?? 0,
          }
        : transactionDetails;

    console.info("[CONTROLLER-DEBUG] keychain.execute", {
      callCount: normalizedCalls.length,
      calls: normalizedCalls.map(summarizeCall),
      incomingTip: transactionDetails?.tip ?? null,
      outgoingTip: noFeeTransactionDetails?.tip ?? null,
      transactionDetailsType:
        transactionDetails === undefined ? "undefined" : typeof transactionDetails,
      manual: rest[0] ?? null,
      hasFeeSource: rest.length > 1 && rest[1] != null,
      restArgsCount: rest.length,
    });

    return execute(calls, abis, noFeeTransactionDetails, ...rest)
      .then((result: any) => {
        console.info(
          "[CONTROLLER-DEBUG] keychain.execute:result",
          summarizeExecuteResult(result)
        );
        return result;
      })
      .catch((error: unknown) => {
        console.error("[CONTROLLER-DEBUG] keychain.execute:error", error);
        throw error;
      });
  };

  Object.defineProperty(keychain, NO_FEE_CONTROLLER_PATCH_FLAG, {
    value: true,
  });

  return (patchTarget ?? account) as T;
}

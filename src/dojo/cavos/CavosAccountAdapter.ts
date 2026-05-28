import {
  Call,
  InvokeFunctionResponse,
  RpcProvider,
  Signature,
  TypedData,
} from "starknet";
import {
  logFailedTransactionReceipt,
  logTransactionError,
} from "../../utils/logTransactionError";
import { withSlotNoFeeExecuteOptions } from "../slotNoFeeExecuteOptions";

/**
 * Adapts the Cavos SDK's executeOnSlot function to look like a starknet Account.
 * This allows all existing DojoProvider/game actions to work without modification.
 *
 * The key insight is that DojoProvider.execute() resolves contractName -> address,
 * then calls account.execute(calls). So we just need to wrap executeOnSlot().
 *
 * The adapter is created as soon as the user authenticates. If the Slot wallet
 * isn't deployed yet, execute() polls until it is (up to 120s).
 */
export class CavosAccountAdapter {
  public address: string;
  private _executeOnSlot: (calls: Call | Call[]) => Promise<string>;
  private _getSlotProvider: () => RpcProvider | null;
  private _isSlotDeployed: () => boolean;
  private _getCavosSdk: () => any;

  constructor(
    address: string,
    executeOnSlot: (calls: Call | Call[]) => Promise<string>,
    getSlotProvider: () => RpcProvider | null,
    isSlotDeployed: () => boolean,
    getCavosSdk: () => any = () => null
  ) {
    this.address = address;
    this._executeOnSlot = executeOnSlot;
    this._getSlotProvider = getSlotProvider;
    this._isSlotDeployed = isSlotDeployed;
    this._getCavosSdk = getCavosSdk;
  }

  private _getProvider(): RpcProvider {
    const provider = this._getSlotProvider();
    if (!provider) {
      throw new Error("Slot provider not available");
    }
    return provider as RpcProvider;
  }

  /**
   * Wait for the Slot wallet to be deployed before executing.
   * Polls every 2s for up to 120s.
   */
  private async _waitForSlotDeploy(): Promise<void> {
    if (this._isSlotDeployed()) return;

    const maxWait = 120_000;
    const interval = 2_000;
    let elapsed = 0;

    while (elapsed < maxWait) {
      await new Promise((r) => setTimeout(r, interval));
      elapsed += interval;
      if (this._isSlotDeployed()) {
        return;
      }
    }

    logTransactionError(
      "Cavos Slot deployment timed out",
      new Error("Slot wallet deployment timed out"),
      {
        address: this.address,
        maxWait,
        interval,
      }
    );
    throw new Error(
      "Slot wallet deployment timed out. Please refresh and try again."
    );
  }

  private async _tryExecuteOnSlotFastPath(
    calls: Call[],
    details?: any
  ): Promise<string | null> {
    const sdk = this._getCavosSdk();
    const slotTransactionManager = sdk?.slotTransactionManager;

    if (
      !slotTransactionManager?.getSessionStatus ||
      !slotTransactionManager?.createDirectAccount ||
      !slotTransactionManager?.getNoFeeResourceBounds
    ) {
      return null;
    }

    try {
      const status = await slotTransactionManager.getSessionStatus();
      if (!status.registered || status.expired || !status.active) {
        return null;
      }

      const account = slotTransactionManager.createDirectAccount(false);
      const result = await account.execute(
        calls,
        withSlotNoFeeExecuteOptions({
          ...details,
          resourceBounds: slotTransactionManager.getNoFeeResourceBounds(),
        })
      );

      return result.transaction_hash;
    } catch (error) {
      logTransactionError("Cavos fast Slot execute path unavailable", error, {
        address: this.address,
        calls: calls.map((call) => ({
          contractAddress: call.contractAddress,
          entrypoint: call.entrypoint,
          calldataLength: call.calldata?.length ?? 0,
        })),
      });
      return null;
    }
  }

  async execute(
    calls: Call | Call[],
    details?: any
  ): Promise<InvokeFunctionResponse> {
    const callsArray = Array.isArray(calls) ? calls : [calls];

    await this._waitForSlotDeploy();

    try {
      const fastTxHash = await this._tryExecuteOnSlotFastPath(callsArray, details);
      if (fastTxHash) {
        return { transaction_hash: fastTxHash };
      }

      const txHash = await this._executeOnSlot(calls);
      return { transaction_hash: txHash };
    } catch (error) {
      logTransactionError("Cavos executeOnSlot failed", error, {
        address: this.address,
        calls: callsArray.map((call) => ({
          contractAddress: call.contractAddress,
          entrypoint: call.entrypoint,
          calldata: call.calldata,
        })),
        details,
      });
      throw error;
    }
  }

  async waitForTransaction(
    txHash: string,
    options?: { retryInterval?: number }
  ): Promise<any> {
    const retryInterval = options?.retryInterval ?? 1000;
    const maxAttempts = 120;
    let attempts = 0;
    let lastProviderError: unknown = null;

    while (attempts < maxAttempts) {
      try {
        const receipt = await this._getProvider().getTransactionReceipt(txHash);
        if (receipt) {
          const executionStatus = (receipt as any).execution_status;
          const isSuccess = executionStatus === "SUCCEEDED";
          if (!isSuccess) {
            logFailedTransactionReceipt(
              "Cavos waitForTransaction received non-success receipt",
              receipt,
              {
                address: this.address,
                txHash,
                attempts: attempts + 1,
              }
            );
          }
          return {
            ...receipt,
            isSuccess: () => isSuccess,
            match: (callbacks: any) =>
              isSuccess
                ? callbacks.success?.(receipt)
                : callbacks.rejected?.(receipt),
            value: receipt,
          };
        }
      } catch (error) {
        lastProviderError = error;
        if (
          !isExpectedReceiptPendingError(error) &&
          (attempts === 0 || (attempts + 1) % 10 === 0)
        ) {
          logTransactionError(
            "Cavos waitForTransaction provider error while polling receipt",
            error,
            {
              address: this.address,
              txHash,
              attempts: attempts + 1,
              retryInterval,
            }
          );
        }
      }
      await new Promise((r) => setTimeout(r, retryInterval));
      attempts++;
    }

    logTransactionError(
      "Cavos waitForTransaction timed out",
      new Error(`Transaction ${txHash} timed out after ${maxAttempts} attempts`),
      {
        address: this.address,
        txHash,
        maxAttempts,
        retryInterval,
        lastProviderError: serializeForTimeout(lastProviderError),
      }
    );
    throw new Error(`Transaction ${txHash} timed out after ${maxAttempts} attempts`);
  }

  async signMessage(_typedData: TypedData): Promise<Signature> {
    throw new Error("CavosAccountAdapter does not support signMessage directly");
  }

  async getChainId(): Promise<any> {
    return this._getProvider().getChainId();
  }

  async getNonce(): Promise<string> {
    return this._getProvider().getNonceForAddress(this.address);
  }
}

const serializeForTimeout = (error: unknown) => {
  if (!error) {
    return null;
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return error;
};

const isExpectedReceiptPendingError = (error: unknown) => {
  const errorWithExtras = error as Error & {
    code?: unknown;
    shortMessage?: unknown;
    details?: unknown;
  };
  const message = [
    errorWithExtras?.message,
    errorWithExtras?.shortMessage,
    errorWithExtras?.details,
    String(errorWithExtras?.code ?? ""),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    message.includes("transaction not found") ||
    message.includes("transaction hash not found") ||
    message.includes("not found")
  );
};

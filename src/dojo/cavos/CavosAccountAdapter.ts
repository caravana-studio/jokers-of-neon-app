import {
  Call,
  InvokeFunctionResponse,
  RpcProvider,
  Signature,
  TypedData,
} from "starknet";

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

  constructor(
    address: string,
    executeOnSlot: (calls: Call | Call[]) => Promise<string>,
    getSlotProvider: () => RpcProvider | null,
    isSlotDeployed: () => boolean
  ) {
    this.address = address;
    this._executeOnSlot = executeOnSlot;
    this._getSlotProvider = getSlotProvider;
    this._isSlotDeployed = isSlotDeployed;
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

    console.log("[CavosAdapter] Waiting for Slot deployment...");
    const maxWait = 120_000;
    const interval = 2_000;
    let elapsed = 0;

    while (elapsed < maxWait) {
      await new Promise((r) => setTimeout(r, interval));
      elapsed += interval;
      if (this._isSlotDeployed()) {
        console.log("[CavosAdapter] Slot deployed, proceeding.");
        return;
      }
    }

    throw new Error(
      "Slot wallet deployment timed out. Please refresh and try again."
    );
  }

  async execute(
    calls: Call | Call[],
    _details?: any
  ): Promise<InvokeFunctionResponse> {
    await this._waitForSlotDeploy();
    const txHash = await this._executeOnSlot(calls);
    return { transaction_hash: txHash };
  }

  async waitForTransaction(
    txHash: string,
    options?: { retryInterval?: number }
  ): Promise<any> {
    const retryInterval = options?.retryInterval ?? 1000;
    const maxAttempts = 120;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const receipt = await this._getProvider().getTransactionReceipt(txHash);
        if (receipt) {
          const executionStatus = (receipt as any).execution_status;
          const isSuccess = executionStatus === "SUCCEEDED";
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
      } catch {
        // tx not yet available, retry
      }
      await new Promise((r) => setTimeout(r, retryInterval));
      attempts++;
    }

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

import { useContext, useState } from "react";
import { CallData, uint256, shortString } from "starknet";
import {
  USDC_ADDRESS,
  SHOP_CONTRACT_ADDRESS,
  SHOP_TREASURY_ADDRESS,
  getApiUrl,
  MARKETPLACE_API_KEY,
} from "../config/contracts";
import { DojoContext } from "../../dojo/DojoContext";

export type CryptoStatus =
  | "idle"
  | "transferring"
  | "confirming"
  | "submitting"
  | "done"
  | "error";

export interface MintedCard {
  card_id: number;
  rarity: number;
  skin_id: number;
  marketable: boolean;
}

export interface CryptoPurchaseResult {
  txHash: string;
  mintedCards?: MintedCard[];
  deliveryPending?: boolean;
  apiError?: string;
}

export function useCryptoPurchase() {
  const dojoCtx = useContext(DojoContext);
  const account = dojoCtx?.account.account ?? null;
  const address = account?.address || null;
  const [status, setStatus] = useState<CryptoStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStatus("idle");
    setError(null);
  };

  // productId: numeric pack ID (e.g. 42) or string season pass ID (e.g. "season_pass_s4")
  // priceAtoms: price in USDC atoms (6 decimals), from useShopPrice
  // apiProductId: string ID sent to the game API (e.g. "pack_advanced_s4"); defaults to productId.toString()
  const buy = async (productId: number | string, priceAtoms: bigint, apiProductId?: string): Promise<CryptoPurchaseResult> => {
    if (!account || !address) {
      throw new Error("Wallet not connected");
    }

    try {
      const amount = uint256.bnToUint256(priceAtoms);
      const productIdFelt =
        typeof productId === "number"
          ? "0x" + productId.toString(16)
          : shortString.encodeShortString(productId);
      const entrypoint =
        typeof productId === "string" && productId.startsWith("season_pass")
          ? "buy_season_pass"
          : "buy_pack";

      setStatus("transferring");
      let txHash: string;

      if (SHOP_CONTRACT_ADDRESS) {
        // Shop contract deployed: multicall approve + buy_pack / buy_season_pass
        const { transaction_hash } = await account.execute([
          {
            contractAddress: USDC_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({ spender: SHOP_CONTRACT_ADDRESS, amount }),
          },
          {
            contractAddress: SHOP_CONTRACT_ADDRESS,
            entrypoint,
            calldata: CallData.compile({ product_id: productIdFelt }),
          },
        ]);
        txHash = transaction_hash;
      } else {
        // Fallback: direct USDC transfer to treasury
        const { transaction_hash } = await account.execute([
          {
            contractAddress: USDC_ADDRESS,
            entrypoint: "transfer",
            calldata: CallData.compile({ recipient: SHOP_TREASURY_ADDRESS, amount }),
          },
        ]);
        txHash = transaction_hash;
      }

      // Wait for transaction confirmation
      setStatus("confirming");
      await account.waitForTransaction(txHash);

      // Notify API to deliver purchased item
      setStatus("submitting");
      const apiPayload = {
        tx_hash: txHash,
        product_id: apiProductId ?? productId.toString(),
        address,
      };
      const requestUrl = `${getApiUrl()}/api/purchase/crypto`;
      console.log("[useCryptoPurchase] calling API:", requestUrl, apiPayload);

      let mintedCards: MintedCard[] | undefined;
      let deliveryPending = false;
      let apiError: string | undefined;

      try {
        const response = await fetch(requestUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": MARKETPLACE_API_KEY,
          },
          body: JSON.stringify(apiPayload),
        });

        const responseData = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(
            (responseData as any).error || `API error: ${response.status}`
          );
        }

        mintedCards = (responseData as any).minted_cards;
      } catch (apiErr: any) {
        deliveryPending = true;
        apiError = apiErr?.message || "Post-purchase processing failed";
        console.error(
          "[useCryptoPurchase] confirmed on-chain purchase but API post-processing failed:",
          apiErr
        );
      }

      setStatus("done");
      return { txHash, mintedCards, deliveryPending, apiError };
    } catch (err: any) {
      console.error("[useCryptoPurchase] error:", err);
      setStatus("error");
      setError(err?.message || "Purchase failed");
      throw err;
    }
  };

  return { buy, status, error, reset };
}

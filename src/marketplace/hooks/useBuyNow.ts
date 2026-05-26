import { useCallback, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { CallData, uint256 } from "starknet";
import {
  MARKETPLACE_CONTRACT_ADDRESS,
  getPaymentToken,
} from "../config/contracts";
import { parseStarknetError } from "../utils/parseStarknetError";
import { reportListingFilled } from "../api/marketplace";
import type { Listing } from "../types/marketplace";
import {
  convertAtomicAmountToNumber,
  trackApprovedPurchase,
} from "../../utils/purchaseAnalytics";

type BuyStatus = "idle" | "approving" | "buying" | "confirming" | "done" | "error";

export function useBuyNow() {
  const { account, address } = useAccount();
  const [status, setStatus] = useState<BuyStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buy = useCallback(
    async (listing: Listing) => {
      if (!account || !address) {
        setError("Wallet not connected");
        return;
      }

      setStatus("approving");
      setError(null);
      setTxHash(null);

      console.log("[useBuyNow] Starting purchase", {
        listingId: listing.id,
        seller: listing.seller_address,
        nonce: listing.nonce,
        tokenId: listing.token_id,
        price: listing.price,
        paymentToken: listing.payment_token,
        buyer: address,
      });

      try {
        const price = BigInt(listing.price);

        // Approve ERC20 spending to marketplace
        console.log("[useBuyNow] Approving ERC20...");
        const approveTx = await account.execute([
          {
            contractAddress: listing.payment_token,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: MARKETPLACE_CONTRACT_ADDRESS,
              amount: uint256.bnToUint256(price),
            }),
          },
        ]);
        console.log("[useBuyNow] Approve tx submitted:", approveTx.transaction_hash);
        await account.waitForTransaction(approveTx.transaction_hash);
        console.log("[useBuyNow] Approve confirmed");

        // Build order struct for fill_order
        setStatus("buying");
        const order = {
          seller: listing.seller_address,
          nft_contract: listing.nft_contract,
          token_id: uint256.bnToUint256(BigInt(listing.token_id)),
          payment_token: listing.payment_token,
          price: uint256.bnToUint256(BigInt(listing.price)),
          nonce: listing.nonce,
          expiration: listing.expiration,
          marketplace_address: listing.marketplace_address,
        };

        console.log("[useBuyNow] Submitting fill_order...", order);
        const fillTx = await account.execute([
          {
            contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
            entrypoint: "fill_order",
            calldata: CallData.compile({
              order,
              signature: listing.signature,
            }),
          },
        ]);
        console.log("[useBuyNow] fill_order tx submitted:", fillTx.transaction_hash);

        setStatus("confirming");
        await account.waitForTransaction(fillTx.transaction_hash);
        console.log("[useBuyNow] fill_order confirmed. tx:", fillTx.transaction_hash);
        setTxHash(fillTx.transaction_hash);

        const paymentToken = getPaymentToken(listing.payment_token);
        const tokenAmount = paymentToken
          ? convertAtomicAmountToNumber(listing.price, paymentToken.decimals)
          : Number.NaN;
        const isUsdcPurchase = paymentToken?.symbol === "USDC";

        trackApprovedPurchase({
          transactionId: fillTx.transaction_hash,
          purchaseChannel: "crypto",
          purchaseKind: "marketplace_listing",
          purchaseSurface: "marketplace",
          paymentProvider: "starknet_marketplace",
          productId: listing.id,
          productName: listing.card_name || `Token #${listing.token_id}`,
          value:
            isUsdcPurchase && Number.isFinite(tokenAmount) ? tokenAmount : null,
          currency: isUsdcPurchase ? "USD" : null,
          tokenSymbol: paymentToken?.symbol ?? null,
          tokenAmount: Number.isFinite(tokenAmount) ? tokenAmount : null,
          extraParams: {
            listing_id: listing.id,
            nft_contract: listing.nft_contract,
            nft_token_id: listing.token_id,
            payment_token: listing.payment_token,
          },
        });

        // Immediately update the listing status in the DB — don't wait for indexer
        console.log("[useBuyNow] Reporting fill to API...");
        await reportListingFilled(listing.id, fillTx.transaction_hash, address);
        console.log("[useBuyNow] Listing marked as filled in API");

        setStatus("done");
      } catch (err) {
        console.error("[useBuyNow] Error:", err);
        setError(parseStarknetError(err));
        setStatus("error");
      }
    },
    [account, address]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setTxHash(null);
    setError(null);
  }, []);

  return { buy, status, txHash, error, reset };
}

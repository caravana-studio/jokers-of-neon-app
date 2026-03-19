import { useCallback, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { CallData, uint256 } from "starknet";
import { MARKETPLACE_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from "../config/contracts";
import { computeOrderHash, signOrder, type OrderData } from "../utils/signOrder";
import { cardImageUrl } from "../utils/formatPrice";
import { getNextNonce, createListing } from "../api/marketplace";
import { parseStarknetError } from "../utils/parseStarknetError";
import type { UserCard, CreateListingPayload } from "../types/marketplace";

type CreateStatus = "idle" | "approving" | "signing" | "submitting" | "done" | "error";

export function useCreateListing() {
  const { account, address } = useAccount();
  const [status, setStatus] = useState<CreateStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (
      card: UserCard,
      paymentToken: string,
      priceWei: string,
      expirationDays: number
    ) => {
      if (!account || !address) {
        setError("Wallet not connected");
        return;
      }

      setStatus("approving");
      setError(null);

      try {
        // 1. Approve NFT to marketplace
        const approveTx = await account.execute([
          {
            contractAddress: NFT_CONTRACT_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              to: MARKETPLACE_CONTRACT_ADDRESS,
              token_id: uint256.bnToUint256(BigInt(card.tokenId)),
            }),
          },
        ]);
        await account.waitForTransaction(approveTx.transaction_hash);

        // 2. Get next nonce
        const { nonce } = await getNextNonce(address);

        // 3. Build order data
        const expiration = Math.floor(Date.now() / 1000) + expirationDays * 86400;

        const orderData: OrderData = {
          seller: address,
          nft_contract: NFT_CONTRACT_ADDRESS,
          token_id: card.tokenId,
          payment_token: paymentToken,
          price: priceWei,
          nonce,
          expiration,
          marketplace_address: MARKETPLACE_CONTRACT_ADDRESS,
        };

        // 4. Sign order
        setStatus("signing");
        const signature = await signOrder(account, orderData);

        // 5. Submit to backend
        setStatus("submitting");
        const imageUrl = cardImageUrl(card.cardId, card.skinId);

        const payload: CreateListingPayload = {
          seller_address: address,
          nft_contract: NFT_CONTRACT_ADDRESS,
          token_id: card.tokenId,
          payment_token: paymentToken,
          price: priceWei,
          nonce,
          expiration,
          marketplace_address: MARKETPLACE_CONTRACT_ADDRESS,
          signature,
          card_id: card.cardId,
          card_name: card.cardName ?? `Card #${card.cardId}`,
          rarity: card.rarity,
          season: card.season,
          skin_id: card.skinId,
          quality: card.quality,
          image_url: imageUrl,
        };

        await createListing(payload);
        setStatus("done");
      } catch (err) {
        setError(parseStarknetError(err));
        setStatus("error");
      }
    },
    [account, address]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { create, status, error, reset };
}

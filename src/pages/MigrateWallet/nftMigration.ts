import { CallData, RpcProvider, uint256, type Call } from "starknet";
import { NFT_CONTRACT_ADDRESS } from "../../marketplace/config/contracts";
import { migrateMainnetRpcUrl } from "../../utils/migrateMainnet";

const CARD_STATS_SERIALIZED_SIZE = 10;
const TRANSFERS_PER_TRANSACTION = 10;

type MigrationProgress = {
  completedBatches: number;
  totalBatches: number;
  processedCards: number;
  totalCards: number;
};

const getTokenIds = (response: string[]): string[] => {
  const cardsCount = Number(BigInt(response[0] ?? "0x0"));
  const expectedLength = 1 + cardsCount * CARD_STATS_SERIALIZED_SIZE;

  if (response.length !== expectedLength) {
    throw new Error("Unexpected get_user_cards response");
  }

  return Array.from({ length: cardsCount }, (_, index) => {
    const tokenOffset = 1 + index * CARD_STATS_SERIALIZED_SIZE;
    const low = BigInt(response[tokenOffset]);
    const high = BigInt(response[tokenOffset + 1]);

    return (low + (high << 128n)).toString();
  });
};

export const migrateNfts = async (
  controllerAccount: {
    execute: (calls: Call[]) => Promise<{ transaction_hash: string }>;
    waitForTransaction: (transactionHash: string) => Promise<unknown>;
  },
  controllerAddress: string,
  cavosAddress: string,
  onProgress?: (progress: MigrationProgress) => void,
) => {
  if (!NFT_CONTRACT_ADDRESS) {
    throw new Error("NFT contract address is not configured");
  }

  const provider = new RpcProvider({ nodeUrl: migrateMainnetRpcUrl });
  const response = await provider.callContract({
    contractAddress: NFT_CONTRACT_ADDRESS,
    entrypoint: "get_user_cards",
    calldata: [controllerAddress],
  });
  const allTokenIds = getTokenIds(response);
  console.info("[MIGRATE] NFT count", allTokenIds.length);
  const tokenIds = allTokenIds;
  const totalCards = tokenIds.length;
  const totalBatches = Math.ceil(totalCards / TRANSFERS_PER_TRANSACTION);

  if (tokenIds.length === 0) {
    return null;
  }

  onProgress?.({
    completedBatches: 0,
    totalBatches,
    processedCards: 0,
    totalCards,
  });

  const transactionHashes: string[] = [];

  for (
    let offset = 0;
    offset < tokenIds.length;
    offset += TRANSFERS_PER_TRANSACTION
  ) {
    const tokenIdsBatch = tokenIds.slice(
      offset,
      offset + TRANSFERS_PER_TRANSACTION,
    );
    const transaction = await controllerAccount.execute(
      tokenIdsBatch.map((tokenId) => ({
        contractAddress: NFT_CONTRACT_ADDRESS,
        entrypoint: "transfer_from",
        calldata: CallData.compile({
          from: controllerAddress,
          to: cavosAddress,
          token_id: uint256.bnToUint256(BigInt(tokenId)),
        }),
      })),
    );

    console.info("[MIGRATE] NFT transfer transaction hash", {
      batch: Math.floor(offset / TRANSFERS_PER_TRANSACTION) + 1,
      transactionHash: transaction.transaction_hash,
    });
    await controllerAccount.waitForTransaction(transaction.transaction_hash);
    transactionHashes.push(transaction.transaction_hash);
    onProgress?.({
      completedBatches: transactionHashes.length,
      totalBatches,
      processedCards: Math.min(offset + tokenIdsBatch.length, totalCards),
      totalCards,
    });
  }

  return transactionHashes;
};

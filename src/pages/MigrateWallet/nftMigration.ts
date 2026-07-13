import { CallData, RpcProvider, uint256, type Call } from "starknet";
import { NFT_CONTRACT_ADDRESS } from "../../marketplace/config/contracts";
import { migrateMainnetRpcUrl } from "../../utils/migrateMainnet";

const CARD_STATS_SERIALIZED_SIZE = 10;

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
  },
  controllerAddress: string,
  cavosAddress: string,
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
  const tokenIds = getTokenIds(response);
  console.info("[MIGRATE] NFT count", tokenIds.length);

  // TODO: Remove this limit after validating the migration flow in production.
  const tokenIdsToMigrate = tokenIds.slice(0, 10);

  if (tokenIdsToMigrate.length === 0) {
    return null;
  }

  const transaction = await controllerAccount.execute(
    tokenIdsToMigrate.map((tokenId) => ({
      contractAddress: NFT_CONTRACT_ADDRESS,
      entrypoint: "transfer_from",
      calldata: CallData.compile({
        from: controllerAddress,
        to: cavosAddress,
        token_id: uint256.bnToUint256(BigInt(tokenId)),
      }),
    })),
  );

  console.info("[MIGRATE] NFT transfer transaction hash", transaction.transaction_hash);
  return transaction;
};

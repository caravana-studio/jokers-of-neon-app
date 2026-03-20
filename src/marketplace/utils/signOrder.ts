import { hash, AccountInterface, constants } from "starknet";
import { CHAIN } from "../config/contracts";

const CHAIN_ID =
  CHAIN === "mainnet"
    ? constants.StarknetChainId.SN_MAIN
    : constants.StarknetChainId.SN_SEPOLIA;

export interface OrderData {
  seller: string;
  nft_contract: string;
  token_id: string;
  payment_token: string;
  price: string;
  nonce: number;
  expiration: number;
  marketplace_address: string;
}

function splitU256(value: bigint): { low: bigint; high: bigint } {
  const mask = (1n << 128n) - 1n;
  return {
    low: value & mask,
    high: value >> 128n,
  };
}

export function computeOrderHash(order: OrderData): string {
  const tokenId = splitU256(BigInt(order.token_id));
  const price = splitU256(BigInt(order.price));

  return hash.computePedersenHashOnElements([
    order.seller,
    order.nft_contract,
    tokenId.low.toString(),
    tokenId.high.toString(),
    order.payment_token,
    price.low.toString(),
    price.high.toString(),
    order.nonce.toString(),
    order.expiration.toString(),
    order.marketplace_address,
  ]);
}

export async function signOrder(
  account: AccountInterface,
  order: OrderData
): Promise<string[]> {
  const orderHash = computeOrderHash(order);
  // SNIP-12 Rev1: StarknetDomain (lowercase 'n') with shortstring fields + revision.
  // Cartridge Controller's is_valid_session_typed_data_signature uses Poseidon (Rev1),
  // and toWasmPolicies always computes scope_hash using Rev1. Both must match.
  const signature = await account.signMessage({
    types: {
      StarknetDomain: [
        { name: "name", type: "shortstring" },
        { name: "version", type: "shortstring" },
        { name: "chainId", type: "shortstring" },
        { name: "revision", type: "shortstring" },
      ],
      Order: [{ name: "orderHash", type: "felt" }],
    },
    primaryType: "Order",
    domain: {
      name: "JokersOfNeonMarketplace",
      version: "1",
      chainId: CHAIN_ID,
      revision: "1",
    },
    message: {
      orderHash,
    },
  });

  // The signature returned is an array of felt strings
  if (Array.isArray(signature)) {
    return signature.map(String);
  }

  // Handle non-array signatures
  return [String(signature)];
}

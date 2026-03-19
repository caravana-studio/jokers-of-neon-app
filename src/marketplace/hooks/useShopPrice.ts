import { useReadContract } from "@starknet-react/core";
import { shortString } from "starknet";
import { SHOP_CONTRACT_ADDRESS } from "../config/contracts";

const SHOP_ABI = [
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      { name: "low", type: "core::integer::u128" },
      { name: "high", type: "core::integer::u128" },
    ],
  },
  {
    type: "function",
    name: "get_price",
    inputs: [{ name: "product_id", type: "core::felt252" }],
    outputs: [{ type: "core::integer::u256" }],
    state_mutability: "view",
  },
] as const;

export function useShopPrice(productId: number | string) {
  const felt =
    typeof productId === "number"
      ? "0x" + productId.toString(16)
      : shortString.encodeShortString(productId);

  const { data, isLoading } = useReadContract({
    address: SHOP_CONTRACT_ADDRESS as `0x${string}`,
    abi: SHOP_ABI,
    functionName: "get_price",
    args: [felt],
    enabled: !!SHOP_CONTRACT_ADDRESS,
  });

  // starknet-react may return u256 as bigint or as { low: bigint, high: bigint }
  let priceAtoms: bigint | undefined;
  if (data != null) {
    if (typeof data === "bigint") {
      priceAtoms = data;
    } else if (typeof (data as any)?.low !== "undefined") {
      priceAtoms = (data as any).low as bigint; // high is always 0 for prices
    }
  }

  const priceUsdc =
    priceAtoms !== undefined && priceAtoms > 0n
      ? (Number(priceAtoms) / 1_000_000).toFixed(2)
      : undefined;

  return { priceAtoms, priceUsdc, isLoading };
}

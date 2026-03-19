import { useBalance } from "@starknet-react/core";
import { useAccount } from "@starknet-react/core";
import { USDC_ADDRESS } from "../config/contracts";

export function useUSDCBalance() {
  const { address } = useAccount();

  const { data, isLoading } = useBalance({
    token: USDC_ADDRESS as `0x${string}`,
    address,
    watch: false,
    enabled: !!address,
  });

  const balanceRaw: bigint | undefined = data?.value;
  const balanceUsdc: number | undefined =
    data != null ? Number(data.value) / 10 ** data.decimals : undefined;

  return { balanceRaw, balanceUsdc, isLoading };
}

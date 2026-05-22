import { useAccount, useBalance } from "@starknet-react/core";
import { useContext } from "react";
import { USDC_ADDRESS } from "../config/contracts";
import { DojoContext } from "../../dojo/DojoContext";

export function useUSDCBalance() {
  const dojoCtx = useContext(DojoContext);
  const { address: starknetAddress } = useAccount();
  const dojoAddress = dojoCtx?.account.account?.address || undefined;
  const address = (dojoAddress || starknetAddress) as
    | `0x${string}`
    | undefined;

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

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useContract } from "@starknet-react/core";
import { MARKETPLACE_CONTRACT_ADDRESS, PAYMENT_TOKENS } from "../config/contracts";

type PaymentToken = {
  address: string;
  symbol: string;
  decimals: number;
};

type MarketplaceContextValue = {
  contractAddress: string;
  feeBps: number;
  paymentTokens: readonly PaymentToken[];
  isPaused: boolean;
};

const MarketplaceContext = createContext<MarketplaceContextValue>({
  contractAddress: "",
  feeBps: 300,
  paymentTokens: PAYMENT_TOKENS,
  isPaused: false,
});

export const MarketplaceProvider = ({ children }: PropsWithChildren) => {
  const [feeBps, setFeeBps] = useState(300);
  const [isPaused, setIsPaused] = useState(false);

  const { contract } = useContract({
    address: MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`,
    abi: [
      {
        name: "get_fee_bps",
        type: "function",
        inputs: [],
        outputs: [{ type: "core::integer::u16" }],
        state_mutability: "view",
      },
      {
        name: "is_paused",
        type: "function",
        inputs: [],
        outputs: [{ type: "core::bool" }],
        state_mutability: "view",
      },
    ] as const,
  });

  useEffect(() => {
    if (!contract || !MARKETPLACE_CONTRACT_ADDRESS) return;

    const fetchConfig = async () => {
      try {
        const fee = await contract.call("get_fee_bps");
        setFeeBps(Number(fee));
        const paused = await contract.call("is_paused");
        setIsPaused(Boolean(paused));
      } catch (err) {
        console.error("Failed to fetch marketplace config:", err);
      }
    };

    fetchConfig();
  }, [contract]);

  const value = useMemo<MarketplaceContextValue>(
    () => ({
      contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
      feeBps,
      paymentTokens: PAYMENT_TOKENS,
      isPaused,
    }),
    [feeBps, isPaused]
  );

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => useContext(MarketplaceContext);

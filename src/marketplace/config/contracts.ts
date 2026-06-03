import { rpcUrl } from "../../config/cartridgeUrls";
import { getGameApiBaseUrl } from "../../config/gameApiUrl";
import { getConfiguredMainnetRpcUrl } from "../../config/starknetRpc";

export const MARKETPLACE_CONTRACT_ADDRESS =
  import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS || "";

export const SHOP_CONTRACT_ADDRESS =
  import.meta.env.VITE_SHOP_CONTRACT_ADDRESS || "";

export const NFT_CONTRACT_ADDRESS =
  import.meta.env.VITE_NFT_CONTRACT_ADDRESS || "";

const standaloneMainnetRpc = getConfiguredMainnetRpcUrl();
const isStandaloneShopMode = import.meta.env.MODE === "standalone-shop";

export const STARKNET_RPC_URL =
  isStandaloneShopMode && standaloneMainnetRpc
    ? standaloneMainnetRpc
    : rpcUrl;

export const CHAIN = import.meta.env.VITE_CHAIN || "mainnet";

export const getApiUrl = () => getGameApiBaseUrl();

export const GAME_API_KEY = import.meta.env.VITE_GAME_API_KEY || "";

export const MARKETPLACE_API_KEY = import.meta.env.VITE_GAME_API_KEY || "";

export const REVENUECAT_API_KEY =
  import.meta.env.VITE_REVENUECAT_API_KEY || "";

// Mainnet: 0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
// Sepolia: 0x033068f6539f8e6e6b131e6b2b814e6c34a5224bc66947c47dab9dfee93b35fb
export const USDC_ADDRESS =
  import.meta.env.VITE_USDC_ADDRESS ||
  "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";

export const SHOP_TREASURY_ADDRESS =
  "0x003994B69Ee4aA73756bE7c9bB5609237C28b6F180fEfC3251698d0F38a10B88";

// Well-known Starknet token addresses (same on mainnet & sepolia)
export const STRK_ADDRESS =
  "0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D";
export const ETH_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

export const PAYMENT_TOKENS = [
  { address: STRK_ADDRESS, symbol: "STRK", decimals: 18 },
  { address: ETH_ADDRESS, symbol: "ETH", decimals: 18 },
  { address: USDC_ADDRESS, symbol: "USDC", decimals: 6 },
] as const;

export type PaymentToken = (typeof PAYMENT_TOKENS)[number];

export function getPaymentToken(address: string): PaymentToken | undefined {
  return PAYMENT_TOKENS.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  );
}

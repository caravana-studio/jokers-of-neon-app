/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MARKETPLACE_CONTRACT_ADDRESS: string;
  readonly VITE_SHOP_CONTRACT_ADDRESS: string;
  readonly VITE_NFT_CONTRACT_ADDRESS: string;
  readonly VITE_USDC_ADDRESS: string;
  readonly VITE_DEDICATED_STARKNET_RPC_URL?: string;
  readonly VITE_STARKNET_RPC_URL: string;
  readonly VITE_CHAIN: string;
  readonly VITE_REVENUECAT_API_KEY: string;
  readonly VITE_GAME_API_URL: string;
  readonly VITE_GAME_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

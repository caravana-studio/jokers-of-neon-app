/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BLOCKCHAIN?: string;
  readonly VITE_ETH_TEST_ADDRESS?: string;
  readonly VITE_HIDE_STREAK?: string;
  readonly VITE_MIGRATE_STARKNET_RPC_URL?: string;
}

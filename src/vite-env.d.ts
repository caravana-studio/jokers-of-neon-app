/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BLOCKCHAIN?: string;
  readonly VITE_ETH_TEST_ADDRESS?: string;
  readonly VITE_DEDICATED_STARKNET_RPC_URL?: string;
  readonly VITE_STARKNET_RPC_URL?: string;
}

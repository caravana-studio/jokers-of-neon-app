const DEFAULT_MIGRATE_MAINNET_RPC_URL =
  "https://api.cartridge.gg/x/starknet/mainnet";

export const migrateMainnetRpcUrl =
  import.meta.env.VITE_MIGRATE_STARKNET_RPC_URL?.trim() ||
  DEFAULT_MIGRATE_MAINNET_RPC_URL;

export const isMigrateContext = (() => {
  if (import.meta.env.MODE === "migrate") {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  return window.location.pathname === "/migrate";
})();

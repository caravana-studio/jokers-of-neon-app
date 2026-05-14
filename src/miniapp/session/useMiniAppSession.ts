import { useMemo } from "react";
import { useGameLoopBurnerSession } from "../../hooks/useGameLoopBurnerSession";
import {
  ensureGameLoopBurnerSession,
  getGameLoopBlockchain,
  hasMiniPayWalletOrFallbackAddress,
} from "../../utils/gameLoopBurner";

export const ensureMiniAppSession = ensureGameLoopBurnerSession;
export const getMiniAppBlockchain = getGameLoopBlockchain;
export const hasMiniAppWalletOrFallbackAddress = hasMiniPayWalletOrFallbackAddress;

export const useMiniAppBurnerSession = () => useGameLoopBurnerSession();

export const useMiniAppIdentity = () => {
  const session = useMiniAppBurnerSession();

  return useMemo(
    () => ({
      session,
      blockchain: session?.blockchain ?? getMiniAppBlockchain(),
      userAddress: session?.userAddress ?? "",
      burnerAddress: session?.burnerAddress ?? "",
      hasSession: Boolean(session?.userAddress && session?.burnerAddress),
    }),
    [session]
  );
};

import type { ReactNode } from "react";
import { CavosWalletConnect } from "../pages/CavosWalletConnect/CavosWalletConnect";
import { useWallet } from "./WalletContext";

interface WalletGateProps {
  children: ReactNode;
}

export const WalletGate = ({ children }: WalletGateProps) => {
  const { shouldBlockWithWalletScreen } = useWallet();

  if (shouldBlockWithWalletScreen) {
    return <CavosWalletConnect />;
  }

  return <>{children}</>;
};

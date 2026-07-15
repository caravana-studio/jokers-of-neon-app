import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { CavosWalletConnect } from "../pages/CavosWalletConnect/CavosWalletConnect";
import { useWallet } from "./WalletContext";

interface WalletGateProps {
  children: ReactNode;
}

export const WalletGate = ({ children }: WalletGateProps) => {
  const { shouldBlockWithWalletScreen } = useWallet();
  const location = useLocation();
  const shouldBypassWalletGate =
    location.pathname === "/login" || location.pathname === "/migrate";

  if (shouldBlockWithWalletScreen && !shouldBypassWalletGate) {
    return <CavosWalletConnect />;
  }

  return <>{children}</>;
};

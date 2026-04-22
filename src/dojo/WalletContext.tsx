import { useBurnerManager } from "@dojoengine/create-burner";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import {
  createContext,
  type MutableRefObject,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Account, type AccountInterface } from "starknet";
import { SignInWithApple } from "@capacitor-community/apple-sign-in";
import { checkEarlyAccess } from "../api/earlyAccess";
import {
  ACCOUNT_TYPE,
  APPLE_GUEST_SESSION,
  GAME_ID,
  LOGGED_USER,
} from "../constants/localStorage";
import { APP_VERSION } from "../constants/version";
import { AppType, useAppContext } from "../providers/AppContextProvider";
import { fetchVersion } from "../queries/fetchVersion";
import { useGetLastGameId } from "../queries/useGetLastGameId";
import { logEvent } from "../utils/analytics";
import { isNativeIOS } from "../utils/capacitorUtils";
import { controller } from "./controller/controller";
import type { SetupResult } from "./setup";

const CHAIN = import.meta.env.VITE_CHAIN;
const EARLY_ACCESS_VERSION = !!import.meta.env.VITE_EARLY_ACCESS_VERSION;

type ConnectionStatus =
  | "selecting"
  | "connecting_burner"
  | "connecting_controller";

interface SwitchSuccessPayload {
  username: string;
  account: AccountInterface;
}

interface WalletContextType {
  finalAccount: Account | AccountInterface | null;
  accountType: "burner" | "controller" | null;
  switchToController: (
    onSuccess?: (payload: SwitchSuccessPayload) => void
  ) => void;
  continueAsGuest: () => Promise<boolean>;
  logout: () => void;
  isLoadingWallet: boolean;
  burnerAccount: Account | AccountInterface | null;
  controllerAccount: AccountInterface | null | undefined;
  isControllerConnected: boolean | undefined;
  isControllerConnecting: boolean | undefined;
  isAppleGuestSession: boolean;
  isSigningInWithApple: boolean;
  isLoadingLastGameId: boolean;
  allowGuest: boolean;
  shouldUseAppleLoginForGuest: boolean;
  shouldBlockWithWalletScreen: boolean;
  onSuccessCallback: MutableRefObject<
    ((payload: SwitchSuccessPayload) => void) | null
  >;
}

export const WalletContext = createContext<WalletContextType | null>(null);

type WalletProviderProps = {
  children: ReactNode;
  value: SetupResult;
};

export const WalletProvider = ({ children, value }: WalletProviderProps) => {
  const { connect, connectors } = useConnect();
  const {
    lastGameId,
    isLoading: isLoadingLastGameId,
    error: lastGameIdError,
  } = useGetLastGameId();
  const {
    account: controllerAccount,
    isConnected: isControllerConnected,
    isConnecting: isControllerConnecting,
  } = useAccount();

  const [isUserAllowed, setIsUserAllowed] =
    useState<boolean>(!EARLY_ACCESS_VERSION);
  const [allowedLoading, setAllowedLoading] = useState<boolean>(false);
  const [isAppleLoginEnabled, setIsAppleLoginEnabled] = useState(false);
  const [isSigningInWithApple, setIsSigningInWithApple] = useState(false);
  const [isAppleGuestSession, setIsAppleGuestSession] = useState<boolean>(
    () => window.localStorage.getItem(APPLE_GUEST_SESSION) === "true"
  );

  const appType = useAppContext();

  const allowGuest =
    CHAIN !== "mainnet" &&
    CHAIN !== "sepolia" &&
    appType !== AppType.SHOP &&
    !EARLY_ACCESS_VERSION;

  const { disconnect } = useDisconnect();

  const { account: burnerAccount, isDeploying } = useBurnerManager({
    burnerManager: value.burnerManager,
  });

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("selecting");
  const [isControllerConnectAttemptActive, setIsControllerConnectAttemptActive] =
    useState(false);
  const [finalAccount, setFinalAccount] = useState<
    Account | AccountInterface | null
  >(null);

  const lsAccountType = (localStorage.getItem(ACCOUNT_TYPE) ?? null) as
    | "burner"
    | "controller"
    | null;
  const [accountType, setAccountType] = useState<
    "burner" | "controller" | null
  >(lsAccountType);

  const onSuccessCallback = useRef<
    ((payload: SwitchSuccessPayload) => void) | null
  >(null);
  const fallbackGuestIdRef = useRef<number>(
    Math.floor(Math.random() * (100000 - 50000 + 1)) + 50000
  );

  useEffect(() => {
    logEvent("open_wallet_page");
  }, []);

  useEffect(() => {
    let mounted = true;

    fetchVersion()
      .then((versionData) => {
        if (!mounted) {
          return;
        }
        setIsAppleLoginEnabled(versionData.applelogin === APP_VERSION);
      })
      .catch((error) => {
        console.warn("Failed to read applelogin from version settings", error);
        if (mounted) {
          setIsAppleLoginEnabled(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (connectors[0]) {
        await connect({ connector: connectors[0] });
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  useEffect(() => {
    if (
      connectionStatus === "connecting_controller" &&
      isControllerConnected === true &&
      controllerAccount
    ) {
      setIsControllerConnectAttemptActive(false);
      setAccountType("controller");
      localStorage.setItem(ACCOUNT_TYPE, "controller");
      setFinalAccount(controllerAccount);
    } else if (connectionStatus === "connecting_burner" && burnerAccount) {
      setAccountType("burner");
      localStorage.setItem(ACCOUNT_TYPE, "burner");
      setFinalAccount(burnerAccount);
    }
  }, [
    connectionStatus,
    isControllerConnected,
    controllerAccount,
    burnerAccount,
  ]);

  useEffect(() => {
    if (!isControllerConnectAttemptActive) {
      return;
    }

    if (isControllerConnected === true && controllerAccount) {
      setIsControllerConnectAttemptActive(false);
      return;
    }

    if (isControllerConnecting) {
      return;
    }

    setIsControllerConnectAttemptActive(false);
    setConnectionStatus("selecting");
  }, [
    isControllerConnectAttemptActive,
    isControllerConnected,
    isControllerConnecting,
    controllerAccount,
  ]);

  useEffect(() => {
    if (accountType && !finalAccount) {
      if (accountType === "burner") {
        setFinalAccount(burnerAccount);
      } else {
        connectWallet();
        if (controllerAccount) {
          setFinalAccount(controllerAccount);
        }
      }
    }
  }, [accountType, finalAccount, burnerAccount, controllerAccount]);

  useEffect(() => {
    if (EARLY_ACCESS_VERSION && finalAccount) {
      setAllowedLoading(true);
      checkEarlyAccess(finalAccount.address)
        .then((registered) => {
          setIsUserAllowed(registered);
          setAllowedLoading(false);
          if (!registered) {
            setAccountType(null);
            setFinalAccount(null);
            disconnect();
          }
        })
        .catch(() => {
          setIsUserAllowed(false);
          setAllowedLoading(false);
          setAccountType(null);
          setFinalAccount(null);
          disconnect();
        });
    }
  }, [finalAccount, disconnect]);

  const logout = () => {
    disconnect();
    setAccountType(null);
    setFinalAccount(null);
    setIsControllerConnectAttemptActive(false);
    setIsAppleGuestSession(false);
    localStorage.removeItem(ACCOUNT_TYPE);
    localStorage.removeItem(APPLE_GUEST_SESSION);
    setConnectionStatus("selecting");
  };

  const switchToController = (
    onSuccess?: (payload: SwitchSuccessPayload) => void
  ): void => {
    logEvent("switch_to_controller");
    if (accountType === "controller" && finalAccount) {
      if (controller) {
        controller.username()?.then((username) => {
          if (username) {
            onSuccess?.({
              username,
              account: finalAccount,
            });
          }
        });
      }
      return;
    }

    if (onSuccess) {
      onSuccessCallback.current = onSuccess;
    }

    setConnectionStatus("connecting_controller");
    setIsControllerConnectAttemptActive(true);
    if (isControllerConnected === false && isControllerConnecting === false) {
      connectWallet();
    }
  };

  const shouldUseAppleLoginForGuest =
    allowGuest && isNativeIOS && isAppleLoginEnabled;

  const startGuestFlow = (fromAppleLogin = false) => {
    logEvent("play_as_guest");
    setConnectionStatus("connecting_burner");
    const guestId = lastGameIdError ? fallbackGuestIdRef.current : lastGameId + 1;
    const username = `joker_guest_${guestId}`;
    setIsAppleGuestSession(fromAppleLogin);
    localStorage.setItem(
      APPLE_GUEST_SESSION,
      fromAppleLogin ? "true" : "false"
    );

    localStorage.removeItem(GAME_ID);
    localStorage.setItem(LOGGED_USER, username);
  };

  const continueAsGuest = async (): Promise<boolean> => {
    if (isLoadingLastGameId || isSigningInWithApple) {
      return false;
    }

    if (!shouldUseAppleLoginForGuest) {
      startGuestFlow();
      return true;
    }

    setIsSigningInWithApple(true);
    try {
      const result = await SignInWithApple.authorize();
      logEvent("apple_login_success", {
        has_email: String(Boolean(result?.response?.email)),
        has_name: String(
          Boolean(result?.response?.givenName || result?.response?.familyName)
        ),
      });
      startGuestFlow(true);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error ?? "unknown_error");
      const cancelled = message.toLowerCase().includes("canceled");
      logEvent(cancelled ? "apple_login_cancelled" : "apple_login_error", {
        message,
      });
      if (!cancelled) {
        console.error("Apple Sign In failed", error);
      }
      return false;
    } finally {
      setIsSigningInWithApple(false);
    }
  };

  const shouldBlockWithWalletScreen =
    appType !== AppType.SHOP &&
    (!finalAccount || (EARLY_ACCESS_VERSION && (!isUserAllowed || allowedLoading)));

  const isLoadingWallet =
    (connectionStatus === "connecting_controller" &&
      (isControllerConnected === false || controllerAccount === undefined)) ||
    (connectionStatus === "connecting_burner" &&
      (!burnerAccount || isDeploying));

  return (
    <WalletContext.Provider
      value={{
        finalAccount,
        accountType,
        switchToController,
        continueAsGuest,
        isLoadingWallet,
        burnerAccount,
        controllerAccount,
        isControllerConnected,
        isControllerConnecting,
        isAppleGuestSession,
        isSigningInWithApple,
        isLoadingLastGameId,
        allowGuest,
        shouldUseAppleLoginForGuest,
        shouldBlockWithWalletScreen,
        onSuccessCallback,
        logout,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

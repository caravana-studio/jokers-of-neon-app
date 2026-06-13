import { Browser } from "@capacitor/browser";
import { useBurnerManager } from "@dojoengine/create-burner";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import {
  createContext,
  type MutableRefObject,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Account, type AccountInterface, RpcProvider } from "starknet";
import { checkEarlyAccess } from "../api/earlyAccess";
import { ACCOUNT_TYPE, GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { rpcUrl, usesCustomKatanaEndpoint } from "../config/cartridgeUrls";
import { AppType, useAppContext } from "../providers/AppContextProvider";
import { useGetLastGameId } from "../queries/useGetLastGameId";
import { logEvent } from "../utils/analytics";
import { isNative } from "../utils/capacitorUtils";
import { ensureGuestUsernameRecord } from "../utils/guestUsername";
import {
  clearGameLoopBurnerSession,
  createGameLoopBurnerAccount,
  ensureGameLoopBurnerSession,
  isGameLoopBurnerEnabled,
} from "../utils/gameLoopBurner";
import { useAccountStore } from "./accountStore";
import { controller } from "./controller/controller";
import { CavosAccountAdapter } from "./cavos/CavosAccountAdapter";
import { useCavosSafe } from "./cavos/CavosBridgeContext";
import { useGameLoopBurnerSession } from "../hooks/useGameLoopBurnerSession";
import { patchControllerNoFeeExecute } from "./slotNoFeeExecuteOptions";
import type { SetupResult } from "./setup";

const CHAIN = import.meta.env.VITE_CHAIN;
const EARLY_ACCESS_VERSION = !!import.meta.env.VITE_EARLY_ACCESS_VERSION;
const CAVOS_ENABLED =
  !!import.meta.env.VITE_CAVOS_APP_ID && !usesCustomKatanaEndpoint;
const CAVOS_NATIVE_REDIRECT_URI =
  import.meta.env.VITE_CAVOS_NATIVE_REDIRECT_URI ||
  "jokers://open";

type ConnectionStatus =
  | "selecting"
  | "connecting_burner"
  | "connecting_controller"
  | "connecting_cavos";

type CavosOAuthProvider = "google" | "apple";

interface SwitchSuccessPayload {
  username: string;
  account: AccountInterface;
}

interface WalletContextType {
  finalAccount: Account | AccountInterface | null;
  accountType: "burner" | "controller" | "cavos" | null;
  switchToController: (
    onSuccess?: (payload: SwitchSuccessPayload) => void
  ) => void;
  continueAsGuest: () => Promise<boolean>;
  continueWithCavosOAuth: (provider: CavosOAuthProvider) => Promise<boolean>;
  sendCavosEmailOtp: (email: string) => Promise<boolean>;
  verifyCavosEmailOtp: (email: string, code: string) => Promise<boolean>;
  resetCavosAuthState: () => void;
  logout: () => Promise<void>;
  isLoadingWallet: boolean;
  burnerAccount: Account | AccountInterface | null;
  controllerAccount: AccountInterface | null | undefined;
  isControllerConnected: boolean | undefined;
  isControllerConnecting: boolean | undefined;
  isControllerEnabled: boolean;
  isLoadingLastGameId: boolean;
  allowGuest: boolean;
  shouldBlockWithWalletScreen: boolean;
  isCavosEnabled: boolean;
  isCavosEmailOtpSent: boolean;
  cavosEmailOtpEmail: string;
  cavosError: string;
  cavosOAuthProvider: CavosOAuthProvider | null;
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
  const controllerProviderAccount = (controller as any)?.controller
    ?.account as AccountInterface | null | undefined;
  const effectiveControllerAccount = useMemo(
    () =>
      usesCustomKatanaEndpoint
        ? patchControllerNoFeeExecute(
            controllerAccount,
            controllerProviderAccount
          )
        : controllerAccount,
    [controllerAccount, controllerProviderAccount]
  );

  // Cavos SDK hook (safe — returns null when CavosProvider is not in tree)
  const cavos = useCavosSafe();

  const [isUserAllowed, setIsUserAllowed] =
    useState<boolean>(!EARLY_ACCESS_VERSION);
  const [allowedLoading, setAllowedLoading] = useState<boolean>(false);

  // Cavos email login state
  const [cavosEmail, setCavosEmail] = useState("");
  const [cavosEmailOtpSent, setCavosEmailOtpSent] = useState(false);
  const [cavosError, setCavosError] = useState("");
  const [cavosOAuthProvider, setCavosOAuthProvider] =
    useState<CavosOAuthProvider | null>(null);

  const appType = useAppContext();
  const isControllerEnabled = appType !== AppType.MINIAPP;

  const allowGuest =
    CHAIN !== "mainnet" &&
    CHAIN !== "sepolia" &&
    appType !== AppType.SHOP &&
    !EARLY_ACCESS_VERSION;

  const { disconnect } = useDisconnect();
  const gameLoopEnabled = isGameLoopBurnerEnabled();
  const rpcProvider = useMemo(
    () =>
      new RpcProvider({
        nodeUrl: rpcUrl,
      }),
    []
  );

  const {
    account: burnerAccount,
    isDeploying,
    create: createBurnerAccount,
    list: listBurnerAccounts,
    select: selectBurnerAccount,
  } = useBurnerManager({
    burnerManager: value.burnerManager,
  });
  const gameLoopBurnerSession = useGameLoopBurnerSession();
  const gameLoopBurnerAccount = useMemo(
    () =>
      gameLoopEnabled && gameLoopBurnerSession
        ? createGameLoopBurnerAccount(gameLoopBurnerSession, rpcProvider)
        : null,
    [gameLoopEnabled, gameLoopBurnerSession, rpcProvider]
  );

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("selecting");
  const [isControllerConnectAttemptActive, setIsControllerConnectAttemptActive] =
    useState(false);
  const [finalAccount, setFinalAccount] = useState<
    Account | AccountInterface | null
  >(null);

  const storedAccountType =
    appType === AppType.MINIAPP
      ? null
      : (localStorage.getItem(ACCOUNT_TYPE) ?? null);
  const lsAccountType = (!isControllerEnabled && storedAccountType === "controller"
    ? null
    : storedAccountType) as
    | "burner"
    | "controller"
    | "cavos"
    | null;
  const [accountType, setAccountType] = useState<
    "burner" | "controller" | "cavos" | null
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

  const connectWallet = async (): Promise<boolean> => {
    if (!isControllerEnabled) {
      console.warn("Controller connector disabled for this environment");
      return false;
    }

    try {
      if (connectors[0]) {
        await connect({ connector: connectors[0] });
        return true;
      }

      console.warn("No controller connector available");
      return false;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return false;
    }
  };

  // Refs to avoid stale closures in CavosAccountAdapter callbacks.
  // The adapter is created once via useMemo, but these refs always point to current values.
  const cavosRef = useRef(cavos);
  cavosRef.current = cavos;
  const isCavosReadyForSlotTransactions =
    cavos?.isAuthenticated === true &&
    cavos?.isLoading === false &&
    cavos?.walletStatus?.isDeployed === true &&
    cavos?.walletStatus?.isSlotDeployed === true &&
    cavos?.walletStatus?.isDeploying !== true &&
    cavos?.walletStatus?.isRegistering !== true &&
    cavos?.walletStatus?.isSlotDeploying !== true;
  const isCavosSetupInProgress =
    cavos?.isAuthenticated === true &&
    !isCavosReadyForSlotTransactions &&
    (cavos.isLoading === true ||
      cavos.walletStatus?.isDeploying === true ||
      cavos.walletStatus?.isRegistering === true ||
      cavos.walletStatus?.isSlotDeploying === true);

  // Build Cavos account adapter as soon as authenticated.
  // The adapter's execute() will wait for Slot deployment internally.
  const cavosAccountAdapter = useMemo(() => {
    if (!cavos?.isAuthenticated || !cavos?.address || !cavos?.executeOnSlot) {
      return null;
    }
    return new CavosAccountAdapter(
      cavos.address,
      cavos.executeOnSlot,
      () => cavosRef.current?.getSlotProvider?.() as any,
      () => !!cavosRef.current?.walletStatus?.isSlotDeployed,
      () => (cavosRef.current as any)?.cavos
    );
  }, [cavos?.isAuthenticated, cavos?.address, cavos?.executeOnSlot]);

  // Handle Cavos authentication state changes
  useEffect(() => {
    if (
      connectionStatus === "connecting_cavos" &&
      isCavosReadyForSlotTransactions &&
      cavosAccountAdapter
    ) {
      setAccountType("cavos");
      localStorage.setItem(ACCOUNT_TYPE, "cavos");
      setFinalAccount(cavosAccountAdapter as unknown as AccountInterface);
      setCavosEmailOtpSent(false);
      setCavosEmail("");
      setCavosOAuthProvider(null);
    }
  }, [connectionStatus, isCavosReadyForSlotTransactions, cavosAccountAdapter]);

  // Auto-reconnect Cavos on page reload or auth callback.
  // Covers two cases:
  // 1. Page reload with accountType=cavos in localStorage
  // 2. OAuth callback opens the app fresh — SDK auto-authenticates but connectionStatus is "selecting"
  useEffect(() => {
    if (
      !finalAccount &&
      isCavosReadyForSlotTransactions &&
      cavosAccountAdapter &&
      (accountType === "cavos" || connectionStatus === "selecting")
    ) {
      setAccountType("cavos");
      localStorage.setItem(ACCOUNT_TYPE, "cavos");
      setFinalAccount(cavosAccountAdapter as unknown as AccountInterface);
      setCavosEmailOtpSent(false);
      setCavosEmail("");
      setCavosOAuthProvider(null);
    }
  }, [accountType, finalAccount, isCavosReadyForSlotTransactions, cavosAccountAdapter, connectionStatus]);

  useEffect(() => {
    const didSlotSetupFail =
      !finalAccount &&
      cavos?.isAuthenticated === true &&
      cavos.walletStatus?.isDeployed === true &&
      cavos.walletStatus?.isSlotDeployed !== true &&
      cavos.walletStatus?.isDeploying !== true &&
      cavos.walletStatus?.isRegistering !== true &&
      cavos.walletStatus?.isSlotDeploying !== true &&
      (connectionStatus === "connecting_cavos" || accountType === "cavos");

    if (!didSlotSetupFail) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setConnectionStatus("selecting");
      setCavosOAuthProvider(null);
      setCavosError(
        "Wallet connected, but Slot setup failed. Check the Slot relayer configuration and try again."
      );
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    accountType,
    connectionStatus,
    finalAccount,
    cavos?.isAuthenticated,
    cavos?.walletStatus?.isDeployed,
    cavos?.walletStatus?.isSlotDeployed,
    cavos?.walletStatus?.isDeploying,
    cavos?.walletStatus?.isRegistering,
    cavos?.walletStatus?.isSlotDeploying,
  ]);

  useEffect(() => {
    if (
      isControllerEnabled &&
      (connectionStatus === "connecting_controller" ||
        isControllerConnectAttemptActive ||
        accountType === "controller") &&
      isControllerConnected === true &&
      effectiveControllerAccount
    ) {
      setIsControllerConnectAttemptActive(false);
      setAccountType("controller");
      localStorage.setItem(ACCOUNT_TYPE, "controller");
      setFinalAccount(effectiveControllerAccount);
    } else if (
      connectionStatus === "connecting_burner" &&
      gameLoopEnabled &&
      gameLoopBurnerAccount
    ) {
      setAccountType("burner");
      localStorage.setItem(ACCOUNT_TYPE, "burner");
      setFinalAccount(gameLoopBurnerAccount);
    } else if (
      connectionStatus === "connecting_burner" &&
      !gameLoopEnabled &&
      burnerAccount
    ) {
      setAccountType("burner");
      localStorage.setItem(ACCOUNT_TYPE, "burner");
      setFinalAccount(burnerAccount);
    }
  }, [
    connectionStatus,
    isControllerEnabled,
    isControllerConnectAttemptActive,
    accountType,
    finalAccount,
    isControllerConnected,
    effectiveControllerAccount,
    gameLoopEnabled,
    gameLoopBurnerAccount,
    burnerAccount,
  ]);

  useEffect(() => {
    if (accountType && !finalAccount) {
      if (accountType === "burner") {
        if (gameLoopEnabled) {
          if (gameLoopBurnerAccount) {
            setFinalAccount(gameLoopBurnerAccount);
          }
        } else {
          setFinalAccount(burnerAccount);
        }
      } else if (accountType === "controller" && isControllerEnabled) {
        connectWallet();
        if (effectiveControllerAccount) {
          setFinalAccount(effectiveControllerAccount);
        }
      } else if (accountType === "controller") {
        localStorage.removeItem(ACCOUNT_TYPE);
        setAccountType(null);
        setConnectionStatus("selecting");
      }
      // cavos auto-reconnect handled by the effect above
    }
  }, [
    accountType,
    finalAccount,
    burnerAccount,
    effectiveControllerAccount,
    isControllerEnabled,
    gameLoopEnabled,
    gameLoopBurnerAccount,
  ]);

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

  const clearCavosStorage = () => {
    localStorage.removeItem("cavos_auth_result");
    localStorage.removeItem("cavos_magic_link_pre_auth");
    localStorage.removeItem("cavos_pending_verification");
    localStorage.removeItem("cavos_pending_deploy_tx");
    localStorage.removeItem("cavos_pending_slot_deploy_tx");
    sessionStorage.removeItem("cavos_oauth_session");
    sessionStorage.removeItem("cavos_oauth_pre_auth");
    sessionStorage.removeItem("cavos_session_data");
    sessionStorage.removeItem("cavos_fallback_redirect");
    sessionStorage.removeItem("cavos_native_auth_redirect_received");
  };

  const logout = async () => {
    const logoutAccountType = accountType;
    const shouldDisconnectController = logoutAccountType === "controller";
    const shouldLogoutCavos = logoutAccountType === "cavos";

    await Promise.allSettled([
      shouldDisconnectController
        ? Promise.resolve(disconnect())
        : Promise.resolve(),
      shouldLogoutCavos && cavos?.logout
        ? cavos.logout()
        : Promise.resolve(),
    ]);

    clearCavosStorage();
    useAccountStore.getState().clearAccount();
    setAccountType(null);
    setFinalAccount(null);
    setIsControllerConnectAttemptActive(false);
    localStorage.removeItem(ACCOUNT_TYPE);
    localStorage.removeItem(GAME_ID);
    localStorage.removeItem(LOGGED_USER);
    clearGameLoopBurnerSession();
    setConnectionStatus("selecting");
    setCavosEmailOtpSent(false);
    setCavosEmail("");
    setCavosError("");
    setCavosOAuthProvider(null);
    onSuccessCallback.current = null;
    logEvent("logout", { account_type: logoutAccountType ?? "unknown" });
  };

  const switchToController = (
    onSuccess?: (payload: SwitchSuccessPayload) => void
  ): void => {
    if (!isControllerEnabled) {
      console.warn("Controller connector disabled for this environment");
      setConnectionStatus("selecting");
      setIsControllerConnectAttemptActive(false);
      return;
    }

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
    if (isControllerConnected !== true && isControllerConnecting !== true) {
      connectWallet().then((connected) => {
        if (!connected) {
          setIsControllerConnectAttemptActive(false);
          setConnectionStatus("selecting");
        }
      });
    }
  };

  const startGuestFlow = async (): Promise<boolean> => {
    logEvent("play_as_guest");

    if (isGameLoopBurnerEnabled()) {
      try {
        const burnerSession = await ensureGameLoopBurnerSession();
        const username = await ensureGuestUsernameRecord(
          burnerSession.burnerAddress
        );

        localStorage.removeItem(GAME_ID);
        localStorage.setItem(LOGGED_USER, username);
        setConnectionStatus("connecting_burner");
        return true;
      } catch (error) {
        console.error("Failed to start guest flow with API burner", error);
        return false;
      }
    }

    try {
      if (!burnerAccount) {
        const existingBurner = listBurnerAccounts()[0];
        if (existingBurner?.address) {
          selectBurnerAccount(existingBurner.address);
        } else {
          await createBurnerAccount();
        }
      }
    } catch (error) {
      console.error("Failed to start guest flow with frontend burner", error);
      setConnectionStatus("selecting");
      return false;
    }

    setConnectionStatus("connecting_burner");
    const guestId = lastGameIdError ? fallbackGuestIdRef.current : lastGameId + 1;
    const username = `guest${String(guestId).slice(-8)}`;

    localStorage.removeItem(GAME_ID);
    localStorage.setItem(LOGGED_USER, username);
    return true;
  };

  const continueAsGuest = async (): Promise<boolean> => {
    if (!gameLoopEnabled && isLoadingLastGameId) {
      return false;
    }

    return startGuestFlow();
  };

  useEffect(() => {
    if (appType !== AppType.MINIAPP) {
      return;
    }

    if (
      finalAccount ||
      accountType ||
      connectionStatus !== "selecting" ||
      (!gameLoopEnabled && isLoadingLastGameId)
    ) {
      return;
    }

    void startGuestFlow();
  }, [
    appType,
    finalAccount,
    accountType,
    connectionStatus,
    isLoadingLastGameId,
    lastGameId,
    lastGameIdError,
  ]);

  const resetCavosAuthState = () => {
    setCavosError("");
    setCavosEmailOtpSent(false);
    setCavosEmail("");
    setCavosOAuthProvider(null);
  };

  const sendCavosEmailOtp = async (email: string): Promise<boolean> => {
    const normalizedEmail = email.trim();
    if (!cavos?.sendOtp || !normalizedEmail) {
      console.warn("[CAVOS] sendOtp not available or email empty");
      return false;
    }

    setCavosError("");
    setCavosEmail(normalizedEmail);
    setCavosOAuthProvider(null);
    setConnectionStatus("connecting_cavos");

    try {
      await cavos.sendOtp(normalizedEmail);
      setCavosEmailOtpSent(true);
      setConnectionStatus("selecting");
      logEvent("cavos_email_otp_sent");
      return true;
    } catch (err: any) {
      console.error("[CAVOS] Error sending email OTP:", err);
      setCavosError(err?.message || "Error sending verification code");
      setConnectionStatus("selecting");
      return false;
    }
  };

  const verifyCavosEmailOtp = async (
    email: string,
    code: string
  ): Promise<boolean> => {
    const normalizedEmail = email.trim();
    const normalizedCode = code.trim();
    if (!cavos?.verifyOtp || !normalizedEmail || !normalizedCode) {
      console.warn("[CAVOS] verifyOtp not available or email/code empty");
      return false;
    }

    setCavosError("");
    setCavosEmail(normalizedEmail);
    setCavosOAuthProvider(null);
    setConnectionStatus("connecting_cavos");

    try {
      await cavos.verifyOtp(normalizedEmail, normalizedCode);
      logEvent("cavos_email_otp_verified");
      return true;
    } catch (err: any) {
      console.error("[CAVOS] Error verifying email OTP:", err);
      setCavosError(err?.message || "Error verifying code");
      setConnectionStatus("selecting");
      return false;
    }
  };

  const runCavosOAuthLogin = async (provider: CavosOAuthProvider) => {
    if (!cavos?.login) {
      throw new Error("Cavos login not available");
    }

    if (!isNative) {
      await cavos.login(provider);
      return;
    }

    const sdk = cavos.cavos as any;
    const oauthWalletManager = sdk?.oauthWalletManager;
    const originalWindowOpen = window.open;
    const originalGetGoogleOAuthUrl =
      oauthWalletManager?.getGoogleOAuthUrl?.bind(oauthWalletManager);
    const originalGetAppleOAuthUrl =
      oauthWalletManager?.getAppleOAuthUrl?.bind(oauthWalletManager);
    let isNativeOAuthFinished = false;
    let rejectNativeBrowserLogin: (error: Error) => void = () => {};
    const nativeBrowserCancelledPromise = new Promise<never>((_resolve, reject) => {
      rejectNativeBrowserLogin = reject;
    });
    const browserFinishedHandle = await Browser.addListener(
      "browserFinished",
      () => {
        window.setTimeout(() => {
          if (isNativeOAuthFinished) {
            return;
          }

          const didReceiveRedirect =
            sessionStorage.getItem("cavos_native_auth_redirect_received") ===
            "true";
          if (didReceiveRedirect) {
            return;
          }

          authWindow.closed = true;
          rejectNativeBrowserLogin(
            new Error("Login cancelled. Please try again.")
          );
        }, 250);
      }
    );

    const authWindow = {
      closed: false,
      document: {
        write: () => {},
      },
      close: () => {
        authWindow.closed = true;
        Browser.close().catch(() => {});
      },
      location: {
        get href() {
          return "";
        },
        set href(url: string) {
          if (!url) {
            return;
          }
          Browser.open({ url }).catch((error) => {
            console.error("[CAVOS] Failed to open OAuth URL", error);
            authWindow.closed = true;
          });
        },
      },
    };

    try {
      sessionStorage.removeItem("cavos_native_auth_redirect_received");

      if (originalGetGoogleOAuthUrl) {
        oauthWalletManager.getGoogleOAuthUrl = () =>
          originalGetGoogleOAuthUrl(CAVOS_NATIVE_REDIRECT_URI);
      }
      if (originalGetAppleOAuthUrl) {
        oauthWalletManager.getAppleOAuthUrl = () =>
          originalGetAppleOAuthUrl(CAVOS_NATIVE_REDIRECT_URI);
      }

      window.open = ((url?: string | URL) => {
        const urlString = url?.toString() ?? "";
        if (!urlString) {
          return authWindow as unknown as Window;
        }
        Browser.open({ url: urlString }).catch((error) => {
          console.error("[CAVOS] Failed to open OAuth URL", error);
          authWindow.closed = true;
        });
        return authWindow as unknown as Window;
      }) as typeof window.open;

      await Promise.race([cavos.login(provider), nativeBrowserCancelledPromise]);
    } finally {
      isNativeOAuthFinished = true;
      void browserFinishedHandle.remove();
      window.open = originalWindowOpen;
      if (originalGetGoogleOAuthUrl) {
        oauthWalletManager.getGoogleOAuthUrl = originalGetGoogleOAuthUrl;
      }
      if (originalGetAppleOAuthUrl) {
        oauthWalletManager.getAppleOAuthUrl = originalGetAppleOAuthUrl;
      }
    }
  };

  const continueWithCavosOAuth = async (
    provider: CavosOAuthProvider
  ): Promise<boolean> => {
    if (!cavos?.login) {
      console.warn("[CAVOS] login not available");
      return false;
    }

    setCavosError("");
    setCavosEmailOtpSent(false);
    setCavosOAuthProvider(provider);
    setConnectionStatus("connecting_cavos");
    logEvent("cavos_oauth_click", { provider });

    try {
      await runCavosOAuthLogin(provider);
      logEvent("cavos_oauth_started", { provider });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error ?? "unknown_error");
      const cancelled = message.toLowerCase().includes("cancel");
      logEvent(cancelled ? "cavos_oauth_cancelled" : "cavos_oauth_error", {
        provider,
        message,
      });
      if (!cancelled) {
        console.error(`[CAVOS] OAuth ${provider} login failed`, error);
      }
      setCavosError(message || "Error during social login");
      setCavosOAuthProvider(null);
      setConnectionStatus("selecting");
      return false;
    }
  };
  const isCavosAutoConnecting =
    !!cavos &&
    cavos.isAuthenticated &&
    !finalAccount &&
    (accountType === "cavos" || connectionStatus === "selecting") &&
    isCavosSetupInProgress;

  const shouldBlockWithWalletScreen =
    appType !== AppType.SHOP &&
    (!finalAccount || (EARLY_ACCESS_VERSION && (!isUserAllowed || allowedLoading)));

  const isLoadingWallet =
    (connectionStatus === "connecting_burner" &&
      (gameLoopEnabled
        ? !gameLoopBurnerAccount
        : !burnerAccount || isDeploying)) ||
    (connectionStatus === "connecting_cavos" &&
      !!cavos &&
      isCavosSetupInProgress) ||
    isCavosAutoConnecting;

  return (
    <WalletContext.Provider
      value={{
        finalAccount,
        accountType,
        switchToController,
        continueAsGuest,
        continueWithCavosOAuth,
        sendCavosEmailOtp,
        verifyCavosEmailOtp,
        resetCavosAuthState,
        isLoadingWallet,
        burnerAccount: gameLoopBurnerAccount ?? burnerAccount,
        controllerAccount: effectiveControllerAccount,
        isControllerConnected,
        isControllerConnecting,
        isControllerEnabled,
        isLoadingLastGameId,
        allowGuest,
        shouldBlockWithWalletScreen,
        isCavosEnabled: CAVOS_ENABLED,
        isCavosEmailOtpSent: cavosEmailOtpSent,
        cavosEmailOtpEmail: cavosEmail,
        cavosError,
        cavosOAuthProvider,
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

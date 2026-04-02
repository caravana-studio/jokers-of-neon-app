import { Flex, Heading, Input, Link, Spinner, Text } from "@chakra-ui/react";
import { useBurnerManager } from "@dojoengine/create-burner";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { Account, AccountInterface } from "starknet";
import { checkEarlyAccess } from "../api/earlyAccess";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { MobileDecoration } from "../components/MobileDecoration";
import { PositionedVersion } from "../components/version/PositionedVersion";
import { ACCOUNT_TYPE, GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { PreThemeLoadingPage } from "../pages/PreThemeLoadingPage";
import { AppType, useAppContext } from "../providers/AppContextProvider";
import { useGetLastGameId } from "../queries/useGetLastGameId";
import { logEvent } from "../utils/analytics";
import { isNative, nativePaddingTop } from "../utils/capacitorUtils";
import { controller } from "./controller/controller";
import { SetupResult } from "./setup";
import { CavosAccountAdapter } from "./cavos/CavosAccountAdapter";
import { useCavosSafe } from "./cavos/CavosConfig";

const CHAIN = import.meta.env.VITE_CHAIN;
const EARLY_ACCESS_VERSION = !!import.meta.env.VITE_EARLY_ACCESS_VERSION;
const CAVOS_ENABLED = !!import.meta.env.VITE_CAVOS_APP_ID;

type ConnectionStatus =
  | "selecting"
  | "connecting_burner"
  | "connecting_controller"
  | "connecting_cavos";

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
  logout: () => void;
  isLoadingWallet: boolean;
  burnerAccount: Account | AccountInterface | null;
  controllerAccount: AccountInterface | null | undefined;
  isControllerConnected: boolean | undefined;
  isControllerConnecting: boolean | undefined;
  onSuccessCallback: React.MutableRefObject<
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
  const { lastGameId, isLoading, error: lastGameIdError } = useGetLastGameId();
  const {
    account: controllerAccount,
    isConnected: isControllerConnected,
    isConnecting: isControllerConnecting,
  } = useAccount();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "wallet-provider",
  });

  // Cavos SDK hook (safe — returns null when CavosProvider is not in tree)
  const cavos = useCavosSafe();

  const [isUserAllowed, setIsUserAllowed] =
    useState<boolean>(!EARLY_ACCESS_VERSION);
  const [allowedLoading, setAllowedLoading] = useState<boolean>(false);
  const [showNotAllowed, setShowNotAllowed] = useState<boolean>(false);

  // Cavos email login state
  const [cavosEmail, setCavosEmail] = useState("");
  const [cavosMagicLinkSent, setCavosMagicLinkSent] = useState(false);
  const [cavosError, setCavosError] = useState("");

  const appType = useAppContext();

  const allowGuest =
    CHAIN !== "mainnet" &&
    CHAIN !== "sepolia" &&
    appType !== AppType.SHOP &&
    !EARLY_ACCESS_VERSION;

  const { disconnect } = useDisconnect();

  const {
    create,
    list,
    get,
    select,
    account: burnerAccount,
    isDeploying,
    clear,
  } = useBurnerManager({
    burnerManager: value.burnerManager,
  });

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("selecting");
  const [finalAccount, setFinalAccount] = useState<
    Account | AccountInterface | null
  >(null);

  const lsAccountType = (localStorage.getItem(ACCOUNT_TYPE) ?? null) as
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

  const connectWallet = async () => {
    try {
      await connect({ connector: connectors[0] });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Log Cavos state changes for debugging
  useEffect(() => {
    if (cavos) {
      console.log("[CAVOS] State update:", {
        isAuthenticated: cavos.isAuthenticated,
        isLoading: cavos.isLoading,
        address: cavos.address,
        user: cavos.user,
        walletStatus: cavos.walletStatus,
        hasActiveSession: cavos.hasActiveSession,
        hasExecuteOnSlot: !!cavos.executeOnSlot,
        isSlotDeploying: cavos.walletStatus?.isSlotDeploying,
        isSlotDeployed: cavos.walletStatus?.isSlotDeployed,
        hasSlotProvider: !!cavos.getSlotProvider?.(),
      });
    }
  }, [
    cavos?.isAuthenticated,
    cavos?.isLoading,
    cavos?.address,
    cavos?.walletStatus?.isReady,
    cavos?.walletStatus?.isDeployed,
    cavos?.walletStatus?.isDeploying,
    cavos?.walletStatus?.isRegistering,
    cavos?.walletStatus?.isSessionActive,
    cavos?.walletStatus?.isSlotDeploying,
    cavos?.walletStatus?.isSlotDeployed,
    cavos?.hasActiveSession,
  ]);

  // Refs to avoid stale closures in CavosAccountAdapter callbacks.
  // The adapter is created once via useMemo, but these refs always point to current values.
  const cavosRef = useRef(cavos);
  cavosRef.current = cavos;

  // Build Cavos account adapter as soon as authenticated.
  // The adapter's execute() will wait for Slot deployment internally.
  const cavosAccountAdapter = useMemo(() => {
    if (!cavos?.isAuthenticated || !cavos?.address || !cavos?.executeOnSlot) {
      console.log("[CAVOS] Adapter not ready:", {
        isAuthenticated: cavos?.isAuthenticated,
        address: cavos?.address,
        hasExecuteOnSlot: !!cavos?.executeOnSlot,
      });
      return null;
    }
    console.log("[CAVOS] Creating CavosAccountAdapter for address:", cavos.address);
    return new CavosAccountAdapter(
      cavos.address,
      cavos.executeOnSlot,
      () => cavosRef.current?.getSlotProvider?.() as any,
      () => !!cavosRef.current?.walletStatus?.isSlotDeployed
    );
  }, [cavos?.isAuthenticated, cavos?.address, cavos?.executeOnSlot]);

  // Handle Cavos authentication state changes
  useEffect(() => {
    console.log("[CAVOS] Auth effect check:", {
      connectionStatus,
      isAuthenticated: cavos?.isAuthenticated,
      hasAdapter: !!cavosAccountAdapter,
      walletReady: cavos?.walletStatus?.isReady,
    });

    if (
      connectionStatus === "connecting_cavos" &&
      cavos?.isAuthenticated &&
      cavosAccountAdapter
    ) {
      console.log("[CAVOS] Setting finalAccount with Cavos adapter");
      setAccountType("cavos");
      localStorage.setItem(ACCOUNT_TYPE, "cavos");
      setFinalAccount(cavosAccountAdapter as unknown as AccountInterface);
      setCavosMagicLinkSent(false);
      setCavosEmail("");
    }
  }, [connectionStatus, cavos?.isAuthenticated, cavosAccountAdapter]);

  // Auto-reconnect Cavos on page reload or magic link callback.
  // Covers two cases:
  // 1. Page reload with accountType=cavos in localStorage
  // 2. Magic link opens the app fresh — SDK auto-authenticates but connectionStatus is "selecting"
  useEffect(() => {
    if (
      !finalAccount &&
      cavos?.isAuthenticated &&
      cavosAccountAdapter &&
      (accountType === "cavos" || connectionStatus === "selecting")
    ) {
      console.log("[CAVOS] Auto-connecting Cavos account (reload or magic link)");
      setAccountType("cavos");
      localStorage.setItem(ACCOUNT_TYPE, "cavos");
      setFinalAccount(cavosAccountAdapter as unknown as AccountInterface);
      setCavosMagicLinkSent(false);
      setCavosEmail("");
    }
  }, [accountType, finalAccount, cavos?.isAuthenticated, cavosAccountAdapter, connectionStatus]);

  useEffect(() => {
    if (
      connectionStatus === "connecting_controller" &&
      isControllerConnected === true &&
      controllerAccount
    ) {
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
    if (accountType && !finalAccount) {
      if (accountType === "burner") {
        setFinalAccount(burnerAccount);
      } else if (accountType === "controller") {
        connectWallet();
        controllerAccount && setFinalAccount(controllerAccount);
      }
      // cavos auto-reconnect handled by the effect above
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
            setShowNotAllowed(true);
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
  }, [finalAccount]);

  const logout = () => {
    disconnect();
    if (cavos?.logout) {
      cavos.logout();
    }
    setAccountType(null);
    setFinalAccount(null);
    localStorage.removeItem(ACCOUNT_TYPE);
    setConnectionStatus("selecting");
    setCavosMagicLinkSent(false);
    setCavosEmail("");
    setCavosError("");
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
    if (isControllerConnected === false && isControllerConnecting === false) {
      connectWallet();
    }
  };

  const handleCavosEmailLogin = async () => {
    console.log("[CAVOS] handleCavosEmailLogin called", {
      hasSendMagicLink: !!cavos?.sendMagicLink,
      email: cavosEmail.trim(),
    });

    if (!cavos?.sendMagicLink || !cavosEmail.trim()) {
      console.warn("[CAVOS] sendMagicLink not available or email empty");
      return;
    }

    setCavosError("");
    setConnectionStatus("connecting_cavos");

    try {
      console.log("[CAVOS] Sending magic link to:", cavosEmail.trim());
      await cavos.sendMagicLink(cavosEmail.trim());
      console.log("[CAVOS] Magic link sent successfully");
      setCavosMagicLinkSent(true);
      logEvent("cavos_magic_link_sent");
    } catch (err: any) {
      console.error("[CAVOS] Error sending magic link:", err);
      setCavosError(err?.message || "Error sending magic link");
      setConnectionStatus("selecting");
    }
  };

  const buttonStyles = {
    color: "white",
    height: isMobile ? "40px" : "50px",
    width: allowGuest
      ? isMobile
        ? "110px"
        : "230px"
      : isMobile
        ? "180px"
        : "300px",
  };

  const shouldBlockWithWalletScreen =
    appType !== AppType.SHOP &&
    (!finalAccount || (EARLY_ACCESS_VERSION && (!isUserAllowed || allowedLoading)));

  if (shouldBlockWithWalletScreen) {
    return (
      <PreThemeLoadingPage>
        <PositionedVersion />
        <MobileDecoration
          top={nativePaddingTop}
          bottom={isNative ? "30px" : "0px"}
        />
        <Flex
          flexDirection={"column"}
          gap={0}
          w="100%"
          justifyContent={"center"}
          alignItems={"center"}
        >
          <img
            width={isMobile ? "90%" : "60%"}
            src="logos/logo.png"
            alt="logo"
          />
          {EARLY_ACCESS_VERSION && (
            <Flex flexDir="column" mb={isMobile ? 3 : "50px"}>
              {showNotAllowed ? (
                <Flex flexDir="column" gap={1}>
                  <Heading
                    textAlign={"center"}
                    lineHeight={1}
                    letterSpacing={1}
                    fontSize={isMobile ? 17 : 25}
                  >
                    {t("not-allowed")}
                  </Heading>
                  <Heading
                    textAlign={"center"}
                    lineHeight={1}
                    letterSpacing={1}
                    fontSize={isMobile ? 12 : 17}
                    textTransform={"lowercase"}
                  >
                    {t("register-at")}{" "}
                    <a
                      href="https://register.caravana.studio"
                      target="_blank"
                      rel="noreferrer"
                    >
                      https://register.caravana.studio
                    </a>
                  </Heading>
                </Flex>
              ) : (
                <>
                  <Heading
                    textAlign={"center"}
                    lineHeight={1}
                    variant={"italic"}
                    letterSpacing={1}
                    fontSize={isMobile ? 20 : 30}
                  >
                    {t("season-1")}
                  </Heading>
                  <Heading
                    textAlign={"center"}
                    lineHeight={1}
                    letterSpacing={1}
                    fontSize={15}
                  >
                    {t("early-access")}
                  </Heading>
                </>
              )}
            </Flex>
          )}
        </Flex>
        <Flex flexDirection={"column"} gap={"15px"} alignItems={"center"}>
          {/* Main login buttons row */}
          <Flex flexDirection={"row"} gap={"30px"}>
            {allowedLoading ? (
              <Spinner color="white" size="sm" />
            ) : (
              <button
                style={buttonStyles}
                className="login-button"
                onClick={() => {
                  logEvent("connect_controller_click");
                  setConnectionStatus("connecting_controller");
                  if (
                    isControllerConnected === false &&
                    isControllerConnecting === false
                  ) {
                    connectWallet();
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {t("login")}
                </div>
              </button>
            )}
            {allowGuest && (
              <button
                style={buttonStyles}
                className="login-button secondary"
                disabled={isLoading}
                onClick={() => {
                  logEvent("play_as_guest");
                  setConnectionStatus("connecting_burner");
                  const guestId = lastGameIdError
                    ? fallbackGuestIdRef.current
                    : lastGameId + 1;
                  const username = `joker_guest_${guestId}`;
                  console.log("setting username: ", username);

                  localStorage.removeItem(GAME_ID);
                  localStorage.setItem(LOGGED_USER, username);
                }}
              >
                {t("guest")}
              </button>
            )}
          </Flex>

          {/* Cavos email login section */}
          {CAVOS_ENABLED && !allowedLoading && (
            <Flex
              flexDirection="column"
              alignItems="center"
              gap="10px"
              w={isMobile ? "90%" : "400px"}
            >
              <Text
                color="white"
                fontSize={isMobile ? 12 : 14}
                letterSpacing={1}
                opacity={0.7}
              >
                {t("or-login-email", "or login with email")}
              </Text>

              {cavosMagicLinkSent ? (
                <Flex
                  flexDirection="column"
                  alignItems="center"
                  gap="8px"
                  p="15px"
                  borderRadius="8px"
                  bg="rgba(255,255,255,0.1)"
                  w="100%"
                >
                  <Text
                    color="white"
                    fontSize={isMobile ? 13 : 15}
                    textAlign="center"
                  >
                    {t(
                      "magic-link-sent",
                      "We sent a link to your email. Click it to log in."
                    )}
                  </Text>
                  <Text
                    color="whiteAlpha.700"
                    fontSize={isMobile ? 11 : 13}
                    textAlign="center"
                  >
                    {cavosEmail}
                  </Text>
                  {(cavos?.walletStatus?.isDeploying || cavos?.walletStatus?.isSlotDeploying) && (
                    <Flex alignItems="center" gap="8px" mt="5px">
                      <Spinner color="white" size="xs" />
                      <Text color="white" fontSize={12}>
                        {t("preparing-wallet", "Preparing your wallet...")}
                      </Text>
                    </Flex>
                  )}
                  <button
                    style={{
                      color: "white",
                      fontSize: isMobile ? "11px" : "13px",
                      opacity: 0.6,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                      marginTop: "5px",
                    }}
                    onClick={() => {
                      setCavosMagicLinkSent(false);
                      setConnectionStatus("selecting");
                    }}
                  >
                    {t("back", "Back")}
                  </button>
                </Flex>
              ) : (
                <Flex gap="10px" w="100%">
                  <Input
                    placeholder="email@example.com"
                    type="email"
                    value={cavosEmail}
                    onChange={(e) => setCavosEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCavosEmailLogin();
                    }}
                    color="white"
                    bg="rgba(255,255,255,0.1)"
                    border="1px solid rgba(255,255,255,0.2)"
                    _placeholder={{ color: "whiteAlpha.500" }}
                    size={isMobile ? "sm" : "md"}
                    flex={1}
                  />
                  <button
                    style={{
                      color: "white",
                      height: isMobile ? "32px" : "40px",
                      width: isMobile ? "80px" : "120px",
                    }}
                    className="login-button"
                    onClick={handleCavosEmailLogin}
                    disabled={
                      !cavosEmail.trim() ||
                      connectionStatus === "connecting_cavos"
                    }
                  >
                    {connectionStatus === "connecting_cavos" ? (
                      <Spinner size="xs" color="white" />
                    ) : (
                      t("send", "Send")
                    )}
                  </button>
                </Flex>
              )}
              {cavosError && (
                <Text color="red.300" fontSize={12}>
                  {cavosError}
                </Text>
              )}
            </Flex>
          )}
        </Flex>
        <LanguageSwitcher />
        <Flex
          position="absolute"
          bottom={"50px"}
          width="100%"
          justifyContent="center"
        >
          <Text
            w="70%"
            textAlign={"center"}
            color="white"
            letterSpacing={1}
            mt={"20px"}
            fontSize={isMobile ? 12 : 17}
          >
            {t("terms.agreement")}{" "}
            <Link
              href="https://jokersofneon.com/terms-and-conditions"
              isExternal
              color="white"
              textDecoration="underline"
            >
              {t("terms.link")}
            </Link>
          </Text>
        </Flex>
      </PreThemeLoadingPage>
    );
  }

  const isLoadingWallet =
    (connectionStatus === "connecting_controller" &&
      (isControllerConnected === false || controllerAccount === undefined)) ||
    (connectionStatus === "connecting_burner" &&
      (!burnerAccount || isDeploying)) ||
    (connectionStatus === "connecting_cavos" &&
      !!cavos &&
      !cavos.isAuthenticated);

  return (
    <WalletContext.Provider
      value={{
        finalAccount,
        accountType,
        switchToController,
        isLoadingWallet,
        burnerAccount,
        controllerAccount,
        isControllerConnected,
        isControllerConnecting,
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

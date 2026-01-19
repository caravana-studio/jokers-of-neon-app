import { Flex, Heading, Link, Spinner, Text } from "@chakra-ui/react";
import { useBurnerManager } from "@dojoengine/create-burner";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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
  const { lastGameId, isLoading } = useGetLastGameId();
  const {
    account: controllerAccount,
    isConnected: isControllerConnected,
    isConnecting: isControllerConnecting,
  } = useAccount();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "wallet-provider",
  });

  const [isUserAllowed, setIsUserAllowed] =
    useState<boolean>(!EARLY_ACCESS_VERSION);
  const [allowedLoading, setAllowedLoading] = useState<boolean>(false);
  const [showNotAllowed, setShowNotAllowed] = useState<boolean>(false);

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
    | null;
  const [accountType, setAccountType] = useState<
    "burner" | "controller" | null
  >(lsAccountType);

  const onSuccessCallback = useRef<
    ((payload: SwitchSuccessPayload) => void) | null
  >(null);

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
      } else {
        connectWallet();
        controllerAccount && setFinalAccount(controllerAccount);
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
    setAccountType(null);
    setFinalAccount(null);
    localStorage.removeItem(ACCOUNT_TYPE);
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
    if (isControllerConnected === false && isControllerConnecting === false) {
      connectWallet();
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

  if (
    !finalAccount ||
    (EARLY_ACCESS_VERSION && (!isUserAllowed || allowedLoading))
  ) {
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
          {appType === AppType.SHOP && (
            <Heading
              lineHeight={1}
              variant={"italic"}
              mb={isMobile ? 3 : "50px"}
              letterSpacing={1}
              fontSize={isMobile ? 20 : 30}
            >
              SHOP
            </Heading>
          )}
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
                {/* <img src={Icons.CARTRIDGE} width={isMobile ? "16px" : "22px"} /> */}
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
                const username = `joker_guest_${lastGameId + 1}`;
                console.log("setting username: ", username);

                localStorage.removeItem(GAME_ID);
                localStorage.setItem(LOGGED_USER, username);
              }}
            >
              {t("guest")}
            </button>
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
      (!burnerAccount || isDeploying));

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

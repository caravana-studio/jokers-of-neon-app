import { Flex } from "@chakra-ui/react";
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
import { Account, AccountInterface } from "starknet";
import { Icons } from "../constants/icons";
import { ACCOUNT_TYPE, GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { LoadingScreen } from "../pages/LoadingScreen/LoadingScreen";
import { PreThemeLoadingPage } from "../pages/PreThemeLoadingPage";
import { useGetLastGameId } from "../queries/useGetLastGameId";
import { controller } from "./controller/controller";
import { SetupResult } from "./setup";

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
  console.log("last game id", lastGameId);
  const {
    account: controllerAccount,
    isConnected: isControllerConnected,
    isConnecting: isControllerConnecting,
  } = useAccount();

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

  console.log("burner account", burnerAccount);
  console.log("is burner deploying", isDeploying);
  console.log("controller account", controllerAccount);
  console.log("is controller connected", isControllerConnected);
  console.log("is controller connecting", isControllerConnecting);

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

  const connectWallet = async () => {
    try {
      console.log("Attempting to connect wallet...");
      await connect({ connector: connectors[0] });
      console.log("Wallet connected successfully.");
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
    console.log("account type", accountType, "final account", finalAccount);
    if (accountType && !finalAccount) {
      console.log("setting final account");
      if (accountType === "burner") {
        console.log("setting burner account");
        setFinalAccount(burnerAccount);
      } else {
        connectWallet();
        controllerAccount && setFinalAccount(controllerAccount);
      }
    }
  }, [accountType, finalAccount, burnerAccount, controllerAccount]);

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
    if (accountType === "controller" && finalAccount) {
      console.log("Already connected with controller.");
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

    console.log("Switching to controller requested...");

    if (onSuccess) {
      onSuccessCallback.current = onSuccess;
    }

    setConnectionStatus("connecting_controller");
    if (isControllerConnected === false && isControllerConnecting === false) {
      connectWallet();
    }
  };

  console.log("account type", accountType);

  if (accountType === null) {
    return (
      <PreThemeLoadingPage>
        <img width="60%" src="logos/logo.png" alt="logo" />
        <Flex flexDirection={"row"} gap={"30px"}>
          <button
            style={{ color: "white" }}
            className="login-button"
            onClick={() => {
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
                flexGrow: 0,
              }}
            >
              <div>LOGIN </div>
              <img
                src={Icons.CARTRIDGE}
                width={"24px"}
                style={{ marginLeft: "8px" }}
              />
            </div>
          </button>
          <button
            style={{ color: "white" }}
            className="login-button secondary"
            disabled={isLoading}
            onClick={() => {
              setConnectionStatus("connecting_burner");
              const username = `joker_guest_${lastGameId + 1}`;
              console.log("setting username: ", username);

              localStorage.removeItem(GAME_ID);
              localStorage.setItem(LOGGED_USER, username);
            }}
          >
            PLAY AS GUEST
          </button>
        </Flex>
      </PreThemeLoadingPage>
    );
  } else if (!finalAccount && accountType !== null) {
    return <LoadingScreen />;
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

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Account, AccountInterface } from "starknet";
import { useConnect, useAccount } from "@starknet-react/core";
import { useBurnerManager } from "@dojoengine/create-burner";
import { Flex } from "@chakra-ui/react";
import { SetupResult } from "./setup";
import { controller } from "./controller/controller";
import { PreThemeLoadingPage } from "../pages/PreThemeLoadingPage";
import { Icons } from "../constants/icons";
import { LoadingScreen } from "../pages/LoadingScreen/LoadingScreen";

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
  const {
    account: controllerAccount,
    isConnected: isControllerConnected,
    isConnecting: isControllerConnecting,
  } = useAccount();

  const { account: burnerAccount } = useBurnerManager({
    burnerManager: value.burnerManager,
  });

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("selecting");
  const [finalAccount, setFinalAccount] = useState<
    Account | AccountInterface | null
  >(null);
  const [accountType, setAccountType] = useState<
    "burner" | "controller" | null
  >(null);

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
      setFinalAccount(controllerAccount);
    } else if (connectionStatus === "connecting_burner" && burnerAccount) {
      setAccountType("burner");
      setFinalAccount(burnerAccount);
    }
  }, [
    connectionStatus,
    isControllerConnected,
    controllerAccount,
    burnerAccount,
  ]);

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

  if (accountType === null) {
    return (
      <PreThemeLoadingPage>
        <img width="60%" src="logos/logo.png" alt="logo" />
        <Flex flexDirection={"column"} gap={16}>
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
            className="login-button"
            onClick={() => setConnectionStatus("connecting_burner")}
          >
            PLAY AS GUEST
          </button>
        </Flex>
      </PreThemeLoadingPage>
    );
  } else if (!finalAccount && accountType !== null) {
    console.log("loading screen from wallet context");
    return <LoadingScreen />;
  }

  const isLoadingWallet =
    (connectionStatus === "connecting_controller" &&
      (isControllerConnected === false || controllerAccount === undefined)) ||
    (connectionStatus === "connecting_burner" && !burnerAccount);

  console.log("isloadingwallet passed.: ", isLoadingWallet);

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

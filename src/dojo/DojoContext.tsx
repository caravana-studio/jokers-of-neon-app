import ControllerConnector from "@cartridge/connector/controller";
import { BurnerProvider, useBurnerManager } from "@dojoengine/create-burner";
import { useAccount, useConnect } from "@starknet-react/core";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Account, AccountInterface, RpcProvider } from "starknet";
import { LoadingScreen } from "../pages/LoadingScreen/LoadingScreen";
import { PreThemeLoadingPage } from "../pages/PreThemeLoadingPage";
import { useAccountStore } from "./accountStore";
import { SetupResult } from "./setup";
import { Flex } from "@chakra-ui/react";
import { Icons } from "../constants/icons";

interface DojoAccount {
  create: () => void;
  list: () => any[];
  get: (id: string) => any;
  select: (id: string) => void;
  account: Account | AccountInterface;
  isDeploying: boolean;
  clear: () => void;
  accountDisplay: string;
}

interface DojoContextType extends SetupResult {
  masterAccount: Account | AccountInterface;
  account: DojoAccount;
  useBurnerAcc: boolean;
  switchToController: () => void;
  accountType: "burner" | "controller" | null;
}

export interface DojoResult {
  setup: DojoContextType;
  account: DojoAccount;
  masterAccount: Account | AccountInterface;
}

export function displayAddress(string: string) {
  if (string === undefined) return "unknown";
  return string.substring(0, 6) + "..." + string.substring(string.length - 4);
}

export const DojoContext = createContext<DojoContextType | null>(null);

const useMasterAccount = (rpcProvider: RpcProvider) => {
  const masterAddress = import.meta.env.VITE_MASTER_ADDRESS;
  const privateKey = import.meta.env.VITE_MASTER_PRIVATE_KEY;
  return useMemo(
    () => new Account(rpcProvider, masterAddress, privateKey),
    [rpcProvider, masterAddress, privateKey]
  );
};

const useRpcProvider = () => {
  return useMemo(
    () =>
      new RpcProvider({
        nodeUrl: import.meta.env.VITE_RPC_URL || "http://localhost:5050",
      }),
    []
  );
};

type DojoProviderProps = {
  children: ReactNode;
  value: SetupResult;
};

export const DojoProvider = ({ children, value }: DojoProviderProps) => {
  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error("DojoProvider can only be used once");

  const rpcProvider = useRpcProvider();
  const masterAccount = useMasterAccount(rpcProvider);

  return (
    <BurnerProvider
      initOptions={{
        masterAccount,
        accountClassHash:
          import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH ||
          "0x079d9ce84b97bcc2a631996c3100d57966fc2f5b061fb1ec4dfd0040976bcac6",
        rpcProvider,
        feeTokenAddress:
          import.meta.env.VITE_NETWORK_FEE_TOKEN ||
          "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      }}
    >
      <DojoContextProvider value={value} masterAccount={masterAccount}>
        {children}
      </DojoContextProvider>
    </BurnerProvider>
  );
};

export const useDojo = (): DojoResult => {
  const contextValue = useContext(DojoContext);
  if (!contextValue)
    throw new Error("The `useDojo` hook must be used within a `DojoProvider`");

  return {
    setup: contextValue,
    account: contextValue.account,
    masterAccount: contextValue.masterAccount,
  };
};

type ConnectionStatus =
  | "selecting"
  | "connecting_burner"
  | "connecting_controller";

const DojoContextProvider = ({
  children,
  value,
  masterAccount,
}: Omit<DojoProviderProps, "controllerAccount"> & {
  masterAccount: Account;
}) => {
  const { connect, connectors } = useConnect();
  const {
    account: controllerAccount,
    isConnected,
    isConnecting,
  } = useAccount();

  const {
    create,
    list,
    get,
    account: burnerAccount,
    select,
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

  const [accountType, setAccountType] = useState<
    "burner" | "controller" | null
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
      !isConnected &&
      !isConnecting
    ) {
      console.log("Initiating controller connection...");
      connectWallet();
    }
  }, [connectionStatus, isConnected, isConnecting, connect, connectors]);

  useEffect(() => {
    if (finalAccount === controllerAccount) return;

    if (
      connectionStatus === "connecting_controller" &&
      isConnected &&
      controllerAccount
    ) {
      console.log("Controller is connected. Finalizing state...");
      useAccountStore.getState().setAccount(controllerAccount);
      setAccountType("controller");
      setFinalAccount(controllerAccount);
    } else if (
      connectionStatus === "connecting_burner" &&
      burnerAccount &&
      !finalAccount
    ) {
      console.log("Burner is ready. Finalizing state...");
      useAccountStore.getState().setAccount(burnerAccount);
      setAccountType("burner");
      setFinalAccount(burnerAccount);
    }
  }, [
    connectionStatus,
    isConnected,
    controllerAccount,
    burnerAccount,
    finalAccount,
  ]);

  const switchToController = (): void => {
    if (accountType === "controller") {
      console.log("Already connected with controller.");
      return;
    }

    console.log("Switching to controller requested...");

    setConnectionStatus("connecting_controller");
  };

  if (connectionStatus === "selecting") {
    return (
      <PreThemeLoadingPage>
        <img width="60%" src="logos/logo.png" alt="logo" />
        <Flex flexDirection={"column"} gap={16}>
          <button
            style={{ color: "white" }}
            className="login-button"
            onClick={() => setConnectionStatus("connecting_controller")}
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
  }

  if (!finalAccount) {
    return <LoadingScreen />;
  }

  return (
    <DojoContext.Provider
      value={{
        ...value,
        masterAccount,
        useBurnerAcc: accountType === "burner",
        switchToController: switchToController,
        accountType: accountType,
        account: {
          create,
          list,
          get,
          select,
          clear,
          account: finalAccount as Account,
          isDeploying,
          accountDisplay: displayAddress(
            (finalAccount as Account | AccountInterface)?.address || ""
          ),
        },
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};

import { BurnerProvider, useBurnerManager } from "@dojoengine/create-burner";
import { useAccount, useConnect } from "@starknet-react/core";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Account, AccountInterface, RpcProvider } from "starknet";
import { LoadingScreen } from "../pages/LoadingScreen";
import { useAccountStore } from "./accountStore";
import { SetupResult } from "./setup";

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

/* const requiredEnvs = ["VITE_MASTER_ADDRESS", "VITE_MASTER_PRIVATE_KEY", "VITE_PUBLIC_ACCOUNT_CLASS_HASH"];

for (const env of requiredEnvs) {
  if (!import.meta.env[env]) {
    throw new Error(`Environment variable ${env} is not set!`);
  }
} */

type DojoProviderProps = {
  children: ReactNode;
  value: SetupResult;
};

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
        nodeUrl:
          import.meta.env.VITE_PUBLIC_NODE_URL || "http://localhost:5050",
      }),
    []
  );
};

const useControllerAccount = () => {
  const { account, connector, isConnected } = useAccount();

  useEffect(() => {
    if (account) {
      useAccountStore.getState().setAccount(account);
    }
  }, [account, isConnected]);

  /*   useEffect(() => {
    if (connector) {
      useAccountStore.getState().setConnector(connector as ControllerConnector);
    }
  }, [connector, isConnected]); */

  return account;
};

export const DojoProvider = ({ children, value }: DojoProviderProps) => {
  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error("DojoProvider can only be used once");

  const rpcProvider = useRpcProvider();
  const masterAccount = useMasterAccount(rpcProvider);
  const controllerAccount = useControllerAccount();

  return (
    <BurnerProvider
      initOptions={{
        masterAccount,
        accountClassHash: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH,
        rpcProvider,
        feeTokenAddress: import.meta.env.VITE_NETWORK_FEE_TOKEN,
      }}
    >
      <DojoContextProvider
        value={value}
        masterAccount={masterAccount}
        controllerAccount={controllerAccount!}
      >
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
    // network: contextValue.network,
    masterAccount: contextValue.masterAccount,
  };
};

const DojoContextProvider = ({
  children,
  value,
  masterAccount,
  controllerAccount,
}: DojoProviderProps & {
  masterAccount: Account;
  controllerAccount: AccountInterface | null;
}) => {
  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error("DojoProvider can only be used once");

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

  const { connect, connectors } = useConnect();
  const { isConnected, isConnecting } = useAccount();

  const [accountsInitialized, setAccountsInitialized] = useState(false);

  const connectWallet = async () => {
    try {
      console.log("Attempting to connect wallet...");
      await connect({ connector: connectors[0] });
      console.log("Wallet connected successfully.");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Determine which account to use based on environment
  const isDev = true; //import.meta.env.VITE_PUBLIC_DEV === "true";
  const accountToUse = isDev ? burnerAccount : controllerAccount;

  useEffect(() => {
    if (isDev) {
      if (burnerAccount) {
        console.log("Setting account from burner hook:", burnerAccount);
        useAccountStore.getState().setAccount(burnerAccount);
        setAccountsInitialized(true);
      } else {
        console.log("Burner account is null in development.");
      }
    } else {
      if (controllerAccount) {
        console.log(
          "Setting account from controllerAccount:",
          controllerAccount
        );
        useAccountStore.getState().setAccount(controllerAccount);
        setAccountsInitialized(true);
      } else {
        console.log(
          "ControllerAccount is null in production or not connected."
        );
        setAccountsInitialized(true);
      }
    }
  }, [isDev, controllerAccount, burnerAccount]);

  if (!accountsInitialized) {
    return <LoadingScreen />;
  }

  // Handle Loading Screen
  if (isDev) {
    if (!burnerAccount) {
      return <LoadingScreen />;
    }
  } else {
    if (isConnecting) {
      return <LoadingScreen />;
    }
    if (!isConnected && !isConnecting && !controllerAccount) {
      return (
        <div className="flex space-x-2 mt-8 justify-center">
          {!isConnected && (
            <button
              className="px-4 py-2 bg-[#ffc52a] border-2 border-[#ffc52a] text-black flex font-bold rounded text-lg fill-black uppercase leading-6 shadow-md hover:shadow-lg active:shadow-inner hover:scale-105 transition-all duration-300 hover:-translate-y-1"
              onClick={connectWallet}
            >
              {/* <CartridgeSmall className="w-6 mr-2 fill-current self-center" /> */}{" "}
              Login
            </button>
          )}
        </div>
      );
    }

    if (!controllerAccount && isConnected) {
      // Connected but controllerAccount is not set yet
      return <LoadingScreen />;
    }
  }

  // Once account is set, render the children
  return (
    <DojoContext.Provider
      value={{
        ...value,
        masterAccount,
        account: {
          create,
          list,
          get,
          select,
          clear,
          account: accountToUse as Account | AccountInterface,
          isDeploying,
          accountDisplay: displayAddress(
            (accountToUse as Account | AccountInterface)?.address || ""
          ),
        },
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};

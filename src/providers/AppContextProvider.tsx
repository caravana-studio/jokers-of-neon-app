import { createContext, useContext } from "react";

export enum AppType {
  FULL_GAME = "full-game",
  SHOP = "shop",
}

interface IAppContextProviderProps {
  children?: React.ReactNode;
  appType: AppType;
}

const AppContext = createContext<IAppContextProviderProps["appType"]>(
  AppType.FULL_GAME
);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({
  children,
  appType,
}: IAppContextProviderProps) => {
  return <AppContext.Provider value={appType}>{children}</AppContext.Provider>;
};
